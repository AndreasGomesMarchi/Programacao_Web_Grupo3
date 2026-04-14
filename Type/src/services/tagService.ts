import { db } from "../db.js";
import { tag } from "../schema.js";

export async function cadastrarTag(nome: string) {
  await db.insert(tag).values({ nome });
  console.log("Tag cadastrada com sucesso!");
}

export async function listarTags() {
  return await db.select().from(tag);
}