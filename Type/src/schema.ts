import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const uf = sqliteTable("uf", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
  sigla: text("sigla").notNull()
});

export const cidade = sqliteTable("cidade", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
  ufId: integer("uf_id").references(() => uf.id)
});

export const noticia = sqliteTable("noticia", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  titulo: text("titulo").notNull(),
  texto: text("texto").notNull(),
  cidadeId: integer("cidade_id").references(() => cidade.id),
  dataCriacao: text("data_criacao").default(
    new Date().toISOString()
  )
});

export const tag = sqliteTable("tag", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
});

export const noticiaTag = sqliteTable("noticia_tag", {
  noticiaId: integer("noticia_id").references(() => noticia.id),
  tagId: integer("tag_id").references(() => tag.id),
});