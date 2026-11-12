import "server-only";
import { getDb } from "./db";

type ProductRow = {
  product_id: string;
  product_bname: string | null;
  product_unit_name: string | null;
  product_barcode: string | null;
  product_sale_price: number | null;
};

export type Product = {
  id: string;
  name: string;
  unit: string;
  barcode: string;
  price: number | null;
};

export type ProductSearchResult = {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
};

export const PAGE_SIZE = 20;

/** Escape LIKE wildcards so user input is matched literally. */
function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}

export async function searchProducts(
  rawQuery: string,
  page: number,
): Promise<ProductSearchResult> {
  const q = rawQuery.trim().slice(0, 100);
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const offset = (safePage - 1) * PAGE_SIZE;

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (q) {
    const like = escapeLike(q);
    // SQLite has no default LIKE escape character, so declare it.
    conditions.push("product_bname LIKE ? ESCAPE '\\'", "product_id = ?");
    params.push(`%${like}%`, q);
    if (/^\d+$/.test(q)) {
      conditions.push("product_barcode LIKE ? ESCAPE '\\'");
      params.push(`${like}%`);
    }
  }

  const where = conditions.length ? `WHERE ${conditions.join(" OR ")}` : "";
  const db = getDb();

  // Exact barcode matches first, then alphabetical by name.
  const orderBy = q
    ? "ORDER BY (product_barcode = ?) DESC, product_bname ASC"
    : "ORDER BY product_bname ASC";
  const orderParams = q ? [q] : [];

  // One round trip for both queries.
  const [countResult, rowsResult] = await db.batch([
    db.prepare(`SELECT COUNT(*) AS total FROM tb_product ${where}`).bind(...params),
    db
      .prepare(
        `SELECT product_id, product_bname, product_unit_name, product_barcode, product_sale_price
           FROM tb_product ${where} ${orderBy}
           LIMIT ? OFFSET ?`,
      )
      .bind(...params, ...orderParams, PAGE_SIZE, offset),
  ]);
  const countRows = countResult.results as { total: number }[];
  const rows = rowsResult.results as ProductRow[];

  return {
    items: rows.map((r) => ({
      id: String(r.product_id),
      name: r.product_bname ?? "",
      unit: r.product_unit_name ?? "",
      barcode: r.product_barcode ?? "",
      price: r.product_sale_price == null ? null : Number(r.product_sale_price),
    })),
    total: Number(countRows[0]?.total ?? 0),
    page: safePage,
    pageSize: PAGE_SIZE,
  };
}
