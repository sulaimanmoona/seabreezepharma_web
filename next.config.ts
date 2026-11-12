import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // ปิดไว้: บน Cloudflare (OpenNext) ถ้าเปิด cacheComponents ทุกหน้าค้างจน error 500
  // เว็บนี้ไม่ได้ใช้ "use cache" จึงไม่เสียอะไร หน้าต่างๆ ยังเป็น static เหมือนเดิม
  cacheComponents: false,
  partialPrefetching: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

// ให้ `next dev` ใช้ D1 และ binding อื่นๆ จาก wrangler.jsonc ได้ (ข้อมูลจำลองในเครื่อง)
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
