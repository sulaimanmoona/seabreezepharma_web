import type { NextRequest } from "next/server";
import { searchProducts } from "@/lib/products";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? 1);

  try {
    const result = await searchProducts(q, page);
    return Response.json(result);
  } catch (error) {
    console.error("[api/products]", error);
    return Response.json(
      { error: "ไม่สามารถเชื่อมต่อฐานข้อมูลได้ กรุณาลองใหม่อีกครั้ง" },
      { status: 500 },
    );
  }
}
