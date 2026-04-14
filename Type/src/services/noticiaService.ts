import { db } from "../db.js";
import { noticia } from "../schema.js";
import { desc, asc } from "drizzle-orm";

export async function cadastrarNoticia(titulo: string, texto: string, cidadeId: number) {
  await db.insert(noticia).values({
    titulo,
    texto,
    cidadeId,
    dataCriacao: new Date().toISOString()
  });
  console.log("Notícia cadastrada!");
}

export async function listarNoticias(ordem: "asc" | "desc") {
  return await db.select().from(noticia)
    .orderBy(ordem === "asc" ? asc(noticia.dataCriacao) : desc(noticia.dataCriacao));
}