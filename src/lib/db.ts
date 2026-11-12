import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * ฐานข้อมูล D1 ของคำขอปัจจุบัน
 * ห้ามเก็บไว้ในตัวแปร global: บน Workers ใช้การเชื่อมต่อข้ามคำขอไม่ได้
 */
export function getDb(): D1Database {
  return getCloudflareContext().env.DB;
}
