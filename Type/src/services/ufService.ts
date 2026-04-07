import { db } from "../db.js";
import { uf } from "../schema.js";

export async function cadastrarUF(nome: string, sigla: string) {
  await db.insert(uf).values({ nome, sigla });
  console.log("UF cadastrada!");
}

export async function listarUFs() {
  return await db.select().from(uf);
}