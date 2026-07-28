const Website = require('./backend/model/Website');
const WebsiteDAO = require('./WebsiteDAO');
const Historico = require('./backend/model/Historico');
const HistoricoDAO = require('./HistoricoDAO');
const Favorito = require('./backend/model/Favorito');
const FavoritoDAO = require('./FavoritoDAO');
const fs = require('fs');

//Cadastrar novo Website
async function cadastrarWebsite(titulo, url, palavrasChave, descricao) {
    const dao = new WebsiteDAO();
    try {
        const novoSite = new Website(titulo, url, palavrasChave, descricao);
        await dao.cadastrarSite(novoSite);

        console.log("\nWebsite indexado no serviço de busca: ", titulo);
    } catch (error) {
        console.error("Cadastro inválido\n");
        const log = `[${new Date().toISOString()}] ERRO: ${error.message}\nStack: ${error.stack}\n\n\n`;
        fs.appendFileSync('error.log', log);
    }
}

// Favoritar
// Favortiar
async function favoritarWebsite(id, nota) {
    const dao = new FavoritoDAO();
    try {
        const novoFav = new Favorito(id, nota);
        await dao.salvarFavorito(novoFav);
        console.log(`\nWebsite ${id} adicionado aos favoritos com nota ${nota}\n`);
    } catch (error) {
        console.error("\nErro ao favoritar: ", error.message);
    }
}

// Realizar busca e registrar
// Realizar busca e registrar
async function realizarBusca(termo, usuario) {
    const webDAO = new WebsiteDAO();
    const histDAO = new HistoricoDAO();

    let resultados = [];
    try {
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
        console.error("Erro na Busca: ", error.message);
    }

    return resultados;
}

// Deletar
// Deletar
async function deletarWebsite(id) {
    const dao = new WebsiteDAO();
    try {
        console.log(`\n[DELETAR] Tentando remover ID: ${id}`);
        const totalDeletado = await dao.deletarSite(id);
        
        if (totalDeletado > 0) {
            console.log("Website removido do índice");
        } else {
            console.log("Nenhum site encontrado com o ID: ", id);
        }
    } catch (error) {
        console.error("Erro na Deleção: ", error.message);
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