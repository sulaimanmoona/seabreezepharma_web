# Seabreeze Pharma

เว็บไซต์ร้านยา Seabreeze Pharma สร้างด้วย Next.js 16, Tailwind CSS 4 และ MySQL

| หน้า | URL | รายละเอียด |
|---|---|---|
| หน้าหลัก | `/` | แนะนำร้าน และบทความเรื่องการใช้ยา |
| บทความ | `/articles/[slug]` | เนื้อหาบทความแต่ละเรื่อง |
| ราคายา | `/prices` | ค้นหาชื่อยาหรือบาร์โค้ดจากตาราง `tb_product` (รองรับเครื่องสแกนบาร์โค้ด) |
| ติดต่อเรา | `/contact` | ที่อยู่ เบอร์โทร LINE Facebook อีเมล และแผนที่ |
| API | `/api/products?q=...&page=1` | ส่งผลค้นหายากลับเป็น JSON |

## เริ่มต้นใช้งาน

1. ติดตั้ง Node.js LTS
2. คัดลอก `.env.example` เป็น `.env.local` แล้วกรอกข้อมูลการเชื่อมต่อ MySQL

   ```
   DB_HOST=127.0.0.1
   DB_PORT=3308
   DB_USER=root
   DB_PASSWORD=...
   DB_NAME=seabreezepharma
   ```

3. ติดตั้งแพ็กเกจแล้วเปิดเซิร์ฟเวอร์

   ```bash
   npm install
   npm run dev          # โหมดพัฒนา http://localhost:3000
   npm run build        # build สำหรับใช้งานจริง
   npm start            # รันเวอร์ชันที่ build แล้ว
   ```

## ฐานข้อมูล

ระบบอ่านข้อมูลจากตาราง `tb_product` เท่านั้น ไม่มีการแก้ไขข้อมูล:

| คอลัมน์ | ใช้แสดงเป็น |
|---|---|
| `product_id` | รหัสสินค้า (ค้นหาแบบตรงตัวได้) |
| `product_bname` | ชื่อยา |
| `product_unit_name` | หน่วย |
| `product_barcode` | บาร์โค้ด |
| `product_sale_price` | ราคาขาย |

**ข้อมูลตัวอย่าง:** `db/seed.sql` เพิ่มยาตัวอย่าง 30 รายการ (รหัสขึ้นต้นด้วย `DEMO-`) เมื่อใส่ข้อมูลจริงแล้วให้ลบออกด้วยคำสั่ง:

```sql
DELETE FROM tb_product WHERE product_id LIKE 'DEMO-%';
```

## แก้ไขเนื้อหา

- **ข้อมูลร้าน / ช่องทางติดต่อ / เวลาทำการ / แผนที่**: แก้ที่ `src/lib/site.ts` ไฟล์เดียว ทุกหน้าจะอัปเดตตาม
  สำหรับแผนที่ ให้เปิด Google Maps → แชร์ → ฝังแผนที่ แล้วคัดลอกค่า `src` มาใส่ใน `mapEmbedUrl`
- **บทความ**: เพิ่มหรือแก้ไขใน `src/data/articles.ts` (`slug` ต้องไม่ซ้ำกัน)
- **โลโก้**: `public/logo.png` และ favicon ที่ `src/app/icon.png`
- **สีธีม**: `src/app/globals.css` (โทนสี `sea-*`, `ocean`, `mint`)

## โครงสร้างไฟล์หลัก

```
src/
  app/
    page.tsx                 หน้าหลัก
    articles/[slug]/page.tsx หน้าบทความ
    prices/page.tsx          หน้าราคายา
    contact/page.tsx         หน้าติดต่อเรา
    api/products/route.ts    API ค้นหายา
  components/                Navbar, Footer, Wave, ArticleCard, PriceSearch
  lib/db.ts                  connection pool ของ MySQL
  lib/products.ts            query ค้นหายา (ใช้ parameterized query)
  lib/site.ts                ข้อมูลร้าน
  data/articles.ts           บทความ
db/seed.sql                  ข้อมูลยาตัวอย่าง
```
