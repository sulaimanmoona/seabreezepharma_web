import "server-only";
import mysql, { type Pool } from "mysql2/promise";

const globalForDb = globalThis as unknown as { mysqlPool?: Pool };

export function getPool(): Pool {
  if (!globalForDb.mysqlPool) {
    globalForDb.mysqlPool = mysql.createPool({
      host: process.env.DB_HOST ?? "127.0.0.1",
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: "utf8",
      connectionLimit: 10,
      waitForConnections: true,
    });
  }
  return globalForDb.mysqlPool;
}
