-- โครงสร้างตารางสินค้าสำหรับ Cloudflare D1 (SQLite)
-- สร้างตาราง:  npx wrangler d1 execute seabreezepharma --local  --file=db/schema.sql
--   (บน Cloudflare จริงใช้ --remote แทน --local)
CREATE TABLE IF NOT EXISTS tb_product (
  product_id          TEXT PRIMARY KEY NOT NULL,
  product_bname       TEXT,
  product_unit_name   TEXT,
  product_barcode     TEXT,
  product_sale_price  REAL
);

CREATE INDEX IF NOT EXISTS idx_tb_product_bname   ON tb_product (product_bname);
CREATE INDEX IF NOT EXISTS idx_tb_product_barcode ON tb_product (product_barcode);
