import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "sqlite", // Use 'dialect' em vez de 'driver'
  dbCredentials: {
    url: "./database.sqlite", // Para SQLite, basta a URL do arquivo
  },
} satisfies Config;