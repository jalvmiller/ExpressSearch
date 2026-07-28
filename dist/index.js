"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const Website_1 = require("./backend/model/Website");
const WebsiteDAO_1 = require("./backend/dao/WebsiteDAO");
const Historico_1 = require("./backend/model/Historico");
const HistoricoDAO_1 = require("./backend/dao/HistoricoDAO");
const Favorito_1 = require("./backend/model/Favorito");
const FavoritoDAO_1 = require("./backend/dao/FavoritoDAO");
const database_1 = require("./backend/dao/database");
const fs = __importStar(require("fs"));
// Cadastrar novo Website
async function cadastrarWebsite(titulo, url, palavrasChave, descricao) {
    const dao = new WebsiteDAO_1.WebsiteDAO();
    try {
        const novoSite = new Website_1.Website(titulo, url, palavrasChave, descricao);
        await dao.cadastrarSite(novoSite);
        console.log("\nWebsite indexado no serviço de busca: ", titulo);
    }
    catch (error) {
        console.error("Cadastro inválido\n");
        const log = `[${new Date().toISOString()}] ERRO: ${error.message}\nStack: ${error.stack}\n\n\n`;
        fs.appendFileSync('error.log', log);
    }
}
// Favoritar
async function favoritarWebsite(id, nota) {
    const dao = new FavoritoDAO_1.FavoritoDAO();
    try {
        const novoFav = new Favorito_1.Favorito(id, nota);
        await dao.salvarFavorito(novoFav);
        console.log(`\nWebsite ${id} adicionado aos favoritos com nota ${nota}\n`);
    }
    catch (error) {
        console.error("\nErro ao favoritar: ", error.message);
    }
}
// Realizar busca e registrar
async function realizarBusca(termo, usuario) {
    const webDAO = new WebsiteDAO_1.WebsiteDAO();
    const histDAO = new HistoricoDAO_1.HistoricoDAO();
    let resultados = [];
    try {
        console.log("\n== BUSCA ==");
        console.log(`Processando busca por: "${termo}"`);
        // Registrar no historico
        const entradaHist = new Historico_1.Historico(termo, usuario);
        await histDAO.registrarBusca(entradaHist);
        // Executar o método de busca
        resultados = await webDAO.buscar(termo);
        console.log(`Encontrados ${resultados.length} resultados.`);
        console.log(resultados); // Exibe array
    }
    catch (error) {
        console.error("Erro na Busca: ", error.message);
    }
    return resultados;
}
// Deletar
async function deletarWebsite(id) {
    const dao = new WebsiteDAO_1.WebsiteDAO();
    try {
        console.log(`\n[DELETAR] Tentando remover ID: ${id}`);
        const totalDeletado = await dao.deletarSite(id);
        if (totalDeletado > 0) {
            console.log("Website removido do índice");
        }
        else {
            console.log("Nenhum site encontrado com o ID: ", id);
        }
    }
    catch (error) {
        console.error("Erro na Deleção: ", error.message);
    }
}
async function rodarSistema() {
    try {
        // Conectar ao Banco de Dados (Singleton)
        await (0, database_1.conectarBanco)();
        // Ok
        await cadastrarWebsite("Google", "https://google.com", ["busca", "tech"], "Teste");
        // Teste de Busca, gerar registro de pesquisa na tabela Historico
        await realizarBusca("tech", "user01");
        // _id!
        console.log("\n ======== Teste de deletar e favoritar ======== ");
        const resultados = await realizarBusca("tech", "user01");
        if (resultados && resultados.length > 0) {
            const idExistente = resultados[0]._id.toString();
            // Favoritar
            await favoritarWebsite(idExistente, 10);
            // Deletar
            //await deletarWebsite(idExistente);
        }
    }
    catch (error) {
        console.error("Erro na execução do sistema:", error);
    }
    finally {
        // Encerrar conexão do banco no Singleton
        await (0, database_1.fecharBanco)();
    }
}
rodarSistema();
