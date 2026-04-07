import readline from "readline-sync";
import { cadastrarUF, listarUFs } from "./services/ufService.js";
import { cadastrarCidade, listarCidades } from "./services/cidadeService.js";
import { cadastrarNoticia } from "./services/noticiaService.js";
import { db } from "./db.js";
import { noticia, cidade, uf } from "./schema.js";
import { eq, desc, asc } from "drizzle-orm";

// Lista para noticias
async function listarTodas(ordem: "asc" | "desc") {
  const dados = await db.select()
    .from(noticia)
    .leftJoin(cidade, eq(noticia.cidadeId, cidade.id))
    .orderBy(ordem === "asc" ? asc(noticia.dataCriacao) : desc(noticia.dataCriacao));

  if (dados.length === 0) {
    console.log("Nenhuma notícia encontrada.");
    return;
  }

  dados.forEach((n, i) => {
    console.log(`${i + 1} - ${n.noticia.titulo} - ${n.cidade?.nome}`);
  });

  detalhar(dados);
}

// Detalha a noticia
function detalhar(lista: any[]) {
  const op = readline.question("\n(d) Detalhar | (z) Voltar: ");

  if (op === "d") {
    const num = readline.questionInt("Número: ");
    const item = lista[num - 1];

    if (!item) {
      console.log("Inválido!");
      return;
    }

    console.log("\n===== DETALHE =====");
    console.log("Título:", item.noticia.titulo);
    console.log("Texto :", item.noticia.texto);
  }
}

// FILTRAR POR UF
async function noticiasPorUF() {
  const ufs = await listarUFs();

  if (ufs.length === 0) {
    console.log("Nenhuma UF cadastrada.");
    return;
  }

  ufs.forEach((u, i) => {
    console.log(`${i + 1} - ${u.nome}`);
  });

  const escolha = readline.questionInt("Escolha UF: ");
  const ufId = ufs[escolha - 1]?.id;

  if (!ufId) return;

  const ordem = readline.question("(a) recente | (b) antiga: ");

  const dados = await db.select()
    .from(noticia)
    .leftJoin(cidade, eq(noticia.cidadeId, cidade.id))
    .leftJoin(uf, eq(cidade.ufId, uf.id))
    .where(eq(uf.id, ufId))
    .orderBy(ordem === "b" ? asc(noticia.dataCriacao) : desc(noticia.dataCriacao));

  if (dados.length === 0) {
    console.log("Nenhuma notícia encontrada.");
    return;
  }

  dados.forEach((n, i) => {
    console.log(`${i + 1} - ${n.noticia.titulo} - ${n.cidade?.nome}`);
  });

  detalhar(dados);
}

// AGRUPADO POR UF
async function agrupadoPorUF() {
  const dados = await db.select()
    .from(noticia)
    .leftJoin(cidade, eq(noticia.cidadeId, cidade.id))
    .leftJoin(uf, eq(cidade.ufId, uf.id))
    .orderBy(asc(uf.nome));

  if (dados.length === 0) {
    console.log("Sem dados.");
    return;
  }

  console.log("\n--- LISTA AGRUPADA ---");

  let atual = "";
  let contador = 1;

  dados.forEach((n) => {
    const nomeUF = n.uf?.sigla || "SEM UF";

    if (nomeUF !== atual) {
      atual = nomeUF;
      console.log(`\n# ${nomeUF}`);
    }

    console.log(`${contador} - ${n.noticia.titulo} - ${n.cidade?.nome}`);
    contador++;
  });

  detalhar(dados);
}

// Menu
export async function menu() {
  while (true) {
    console.log("\n===== MENU =====");
    console.log("0 - Cadastrar notícia");
    console.log("1 - Notícias recentes");
    console.log("2 - Notícias antigas");
    console.log("3 - Notícias por estado");
    console.log("4 - Agrupado por estado");
    console.log("5 - Cadastrar UF");
    console.log("6 - Cadastrar cidade");
    console.log("7 - Sair");

    const op = readline.question("Escolha: ");

    switch (op) {

      // 0 - CADASTRAR NOTÍCIA

      case "0":
        const titulo = readline.question("Título: ");
        const texto = readline.question("Texto: ");

        const cidades = await listarCidades();

        if (cidades.length === 0) {
          console.log("Cadastre cidades primeiro!");
          break;
        }

        cidades.forEach((c, i) => {
          console.log(`${i + 1} - ${c.nome}`);
        });

        const escolhaCidade = readline.questionInt("Cidade: ");
        const cidadeId = cidades[escolhaCidade - 1]?.id;

        if (!cidadeId) {
          console.log("Inválido!");
          break;
        }

        await cadastrarNoticia(titulo, texto, cidadeId);
        break;

      // 1 - RECENTES
      case "1":
        await listarTodas("desc");
        break;


      // 2 - ANTIGAS

      case "2":
        await listarTodas("asc");
        break;


      // 3 - POR UF

      case "3":
        await noticiasPorUF();
        break;


      // 4 - AGRUPADO

      case "4":
        await agrupadoPorUF();
        break;


      // 5 - CADASTRAR UF

      case "5":
        const nomeUF = readline.question("Nome UF: ");
        const sigla = readline.question("Sigla: ");
        await cadastrarUF(nomeUF, sigla);
        break;

  
      // 6 - CADASTRAR CIDADE

      case "6":
        const nomeCidade = readline.question("Nome cidade: ");
        const ufs = await listarUFs();

        if (ufs.length === 0) {
          console.log("Cadastre UF primeiro!");
          break;
        }

        ufs.forEach((u, i) => {
          console.log(`${i + 1} - ${u.nome}`);
        });

        const escolhaUF = readline.questionInt("UF: ");
        const ufId = ufs[escolhaUF - 1]?.id;

        if (!ufId) {
          console.log("Inválido!");
          break;
        }

        await cadastrarCidade(nomeCidade, ufId);
        break;


      // 7 - SAIR
      case "7":
        console.log("Encerrando...");
        process.exit(0);

      default:
        console.log("Opção inválida!");
    }
  }
}