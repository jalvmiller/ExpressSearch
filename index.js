const Website = require('./Website');
const WebsiteDAO = require('./DAO/WebsiteDAO');
const Historico = require('./Historico');
const HistoricoDAO = require('./DAO/HistoricoDAO');
const Favorito = require('./Favorito');
const FavoritoDAO = require('./DAO/FavoritoDAO');
const fs = require('fs');

// Função utilitária para registrar logs de erro no arquivo e no console
function registrarErro(mensagem, error) {
    console.error(`${mensagem} ${error.message}`);
    const log = `[${new Date().toISOString()}] ERRO: ${error.message}\nStack: ${error.stack}\n\n\n`;
    fs.appendFileSync('error.log', log);
}

//Cadastrar novo Website
async function cadastrarWebsite(titulo, url, palavrasChave, descricao) {
    const dao = new WebsiteDAO();
    try {
        const novoSite = new Website(titulo, url, palavrasChave, descricao);
        await dao.cadastrarSite(novoSite);

        console.log("\nWebsite indexado no serviço de busca: ", titulo);
    } catch (error) {
        registrarErro("Cadastro inválido\n", error);
    }
}

// Favoritar
// Favortiar
async function favoritarWebsite(id, nota) {
    try {
        if (!id || nota === undefined) {
            throw new Error("Campos obrigatórios ausentes: id e nota.");
        }
        const dao = new FavoritoDAO();
        const novoFav = new Favorito(id, nota);
        await dao.salvarFavorito(novoFav);
        console.log(`\nWebsite ${id} adicionado aos favoritos com nota ${nota}\n`);
    } catch (error) {
        registrarErro("\nErro ao favoritar:", error);
    }
}

// Realizar busca e registrar
// Realizar busca e registrar
async function realizarBusca(termo, usuario) {
    let resultados = [];
    try {
        if (!termo || !usuario) {
            throw new Error("Campos obrigatórios ausentes: termo e usuário.");
        }
        const webDAO = new WebsiteDAO();
        const histDAO = new HistoricoDAO();

        console.log("\n== BUSCA ==");
        console.log(`Processando busca por: "${termo}"`);

        // Validar termo
        const entradaHist = new Historico(termo, usuario);

        // Registrar no historico
        await histDAO.registrarBusca(entradaHist);

        // Executar o método de busca
        resultados = await webDAO.buscar(termo);

        console.log(`Encontrados ${resultados.length} resultados.`);
        console.log(resultados); // Exibe array

    } catch (error) {
        registrarErro("Erro na Busca:", error);
    }

    return resultados;
}

// Deletar
// Deletar
async function deletarWebsite(id) {
    try {
        if (!id) {
            throw new Error("Campo obrigatório ausente: id.");
        }
        const dao = new WebsiteDAO();
        console.log(`\n[DELETAR] Tentando remover ID: ${id}`);
        const totalDeletado = await dao.deletarSite(id);
        
        if (totalDeletado > 0) {
            console.log("Website removido do índice");
        } else {
            console.log("Nenhum site encontrado com o ID: ", id);
        }
    } catch (error) {
        registrarErro("Erro na Deleção:", error);
    }
}



async function rodarSistema() {
    // Ok
    await cadastrarWebsite("Google", "https://google.com", ["busca", "tech"], "Teste");

    // Teste de Busca, gerar registro de pesquisa na tabela Historico
    await realizarBusca("tech", "user01");

    // Teste de Erro, sem titulo e sem URL
    //await cadastrarWebsite("", "https://errocampo", []);
    //await cadastrarWebsite("", "erronaURL", []);
    //await cadastrarWebsite("SemErro", "https://semerrocampo", ["SemErro"], "Paratercrteza");
    //await realizarBusca("SemErro", "user01");

    console.log("\n ======== Teste de deletar e favoritar ======== ")
    const resultados = await realizarBusca("tech", "user01");

    if (resultados && resultados.length > 0) {
        const idExistente = resultados[0]._id.toString();

        // Favoritar
        await favoritarWebsite(idExistente, 10);

        // Deletar
        //await deletarWebsite(idExistente);
    }
}

rodarSistema();