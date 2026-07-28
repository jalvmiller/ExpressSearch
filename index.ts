import { Website } from './backend/model/Website';
import { WebsiteDAO } from './backend/dao/WebsiteDAO';
import { Historico } from './backend/model/Historico';
import { HistoricoDAO } from './backend/dao/HistoricoDAO';
import { Favorito } from './backend/model/Favorito';
import { FavoritoDAO } from './backend/dao/FavoritoDAO';
import { conectarBanco, fecharBanco } from './backend/dao/database';
import * as fs from 'fs';

// Cadastrar novo Website
async function cadastrarWebsite(titulo: string, url: string, palavrasChave: string[], descricao: string) {
    const dao = new WebsiteDAO();
    try {
        const novoSite = new Website(titulo, url, palavrasChave, descricao);
        await dao.cadastrarSite(novoSite);

        console.log("\nWebsite indexado no serviço de busca: ", titulo);
    } catch (error: any) {
        console.error("Cadastro inválido\n");
        const log = `[${new Date().toISOString()}] ERRO: ${error.message}\nStack: ${error.stack}\n\n\n`;
        fs.appendFileSync('error.log', log);
    }
}

// Favoritar
async function favoritarWebsite(id: string, nota: number) {
    const dao = new FavoritoDAO();
    try {
        const novoFav = new Favorito(id, nota);
        await dao.salvarFavorito(novoFav);
        console.log(`\nWebsite ${id} adicionado aos favoritos com nota ${nota}\n`);
    } catch (error: any) {
        console.error("\nErro ao favoritar: ", error.message);
    }
}

// Realizar busca e registrar
async function realizarBusca(termo: string, usuario: string) {
    const webDAO = new WebsiteDAO();
    const histDAO = new HistoricoDAO();

    let resultados: any[] = [];
    try {
        console.log("\n== BUSCA ==");
        console.log(`Processando busca por: "${termo}"`);

        // Registrar no historico
        const entradaHist = new Historico(termo, usuario);
        await histDAO.registrarBusca(entradaHist);

        // Executar o método de busca
        resultados = await webDAO.buscar(termo);

        console.log(`Encontrados ${resultados.length} resultados.`);
        console.log(resultados); // Exibe array

    } catch (error: any) {
        console.error("Erro na Busca: ", error.message);
    }

    return resultados;
}

// Deletar
async function deletarWebsite(id: string) {
    const dao = new WebsiteDAO();
    try {
        console.log(`\n[DELETAR] Tentando remover ID: ${id}`);
        const totalDeletado = await dao.deletarSite(id);
        
        if (totalDeletado > 0) {
            console.log("Website removido do índice");
        } else {
            console.log("Nenhum site encontrado com o ID: ", id);
        }
    } catch (error: any) {
        console.error("Erro na Deleção: ", error.message);
    }
}

async function rodarSistema() {
    try {
        // Conectar ao Banco de Dados (Singleton)
        await conectarBanco();

        // Ok
        await cadastrarWebsite("Google", "https://google.com", ["busca", "tech"], "Teste");

        // Teste de Busca, gerar registro de pesquisa na tabela Historico
        await realizarBusca("tech", "user01");

        // _id!
        console.log("\n ======== Teste de deletar e favoritar ======== ")
        const resultados = await realizarBusca("tech", "user01");
        if (resultados && resultados.length > 0) {
            const idExistente = resultados[0]._id!.toString();

            // Favoritar
            await favoritarWebsite(idExistente, 10);

            // Deletar
            //await deletarWebsite(idExistente);
        }
    } catch (error) {
        console.error("Erro na execução do sistema:", error);
    } finally {
        // Encerrar conexão do banco no Singleton
        await fecharBanco();
    }
}

rodarSistema();
