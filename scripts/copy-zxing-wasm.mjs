// คัดลอกตัวอ่านบาร์โค้ด (zxing .wasm) ไปไว้ใน public/ เพื่อให้เว็บเสิร์ฟเอง ไม่ต้องพึ่ง CDN
// รันอัตโนมัติก่อน `npm run dev` และ `npm run build` (ไฟล์ปลายทางไม่ต้อง commit)
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const src = require.resolve("zxing-wasm/reader/zxing_reader.wasm");
const destDir = path.join(process.cwd(), "public", "zxing");

mkdirSync(destDir, { recursive: true });
copyFileSync(src, path.join(destDir, "zxing_reader.wasm"));
console.log("copied zxing_reader.wasm → public/zxing/");
