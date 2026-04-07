import { db } from "../db.js";
import { cidade } from "../schema.js";

export async function cadastrarCidade(nome: string, ufId: number) {
  await db.insert(cidade).values({ nome, ufId });
  console.log("Cidade cadastrada!");
}

export async function listarCidades() {
  return await db.select().from(cidade);
}