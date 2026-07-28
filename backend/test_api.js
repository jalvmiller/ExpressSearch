const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}/api`;

async function testarAPI() {
    console.log("=== INICIANDO TESTES DO CRUD DO BACKEND ===\n");

    let siteId = null;

    // 1. Teste de Cadastro (POST)
    try {
        console.log("1. Testando cadastro de site...");
        const response = await fetch(`${BASE_URL}/websites`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titulo: 'GitHub Teste',
                url: 'https://github.com',
                palavrasChave: ['git', 'code', 'repo'],
                descricao: 'Hospedagem de repositórios git'
            })
        });

        const data = await response.json();
        console.log("Resposta do Cadastro:", data);
        if (response.status === 201 && data.id) {
            siteId = data.id;
            console.log(`✅ Cadastro realizado com sucesso! ID gerado: ${siteId}\n`);
        } else {
            console.log("❌ Falha no cadastro!\n");
            return;
        }
    } catch (error) {
        console.error("Erro no cadastro:", error);
        return;
    }

    // 2. Teste de Listar Todos (GET)
    try {
        console.log("2. Testando listagem de todos os sites...");
        const response = await fetch(`${BASE_URL}/websites`);
        const data = await response.json();
        console.log(`✅ Listagem realizada! Encontrados ${data.length} sites.`);
        console.log("Exemplo de site listado:", data.find(s => s._id === siteId) || data[0]);
        console.log();
    } catch (error) {
        console.error("Erro na listagem:", error);
    }

    // 3. Teste de Obter por ID (GET)
    try {
        console.log(`3. Testando obtenção do site pelo ID: ${siteId}...`);
        const response = await fetch(`${BASE_URL}/websites/${siteId}`);
        const data = await response.json();
        if (response.status === 200) {
            console.log("✅ Site obtido por ID:", data);
        } else {
            console.log("❌ Falha ao obter por ID:", data);
        }
        console.log();
    } catch (error) {
        console.error("Erro ao obter por ID:", error);
    }

    // 4. Teste de Busca por Termo (GET com registro de Histórico)
    try {
        console.log("4. Testando busca por palavra-chave 'git'...");
        const response = await fetch(`${BASE_URL}/websites?q=git&usuario=test_runner`);
        const data = await response.json();
        console.log(`✅ Resultados da busca: ${data.length} sites encontrados.`);
        console.log(data);
        console.log();
    } catch (error) {
        console.error("Erro na busca:", error);
    }

    // 5. Teste de Histórico (GET)
    try {
        console.log("5. Verificando se a busca foi registrada no histórico...");
        const response = await fetch(`${BASE_URL}/historico`);
        const data = await response.json();
        const registro = data.find(h => h.termoBuscado === 'git' && h.usuario === 'test_runner');
        if (registro) {
            console.log("✅ Busca registrada com sucesso no histórico!", registro);
        } else {
            console.log("❌ Registro de histórico não encontrado.");
        }
        console.log();
    } catch (error) {
        console.error("Erro ao consultar histórico:", error);
    }

    // 6. Teste de Atualização (PUT)
    try {
        console.log(`6. Testando atualização do site ID: ${siteId}...`);
        const response = await fetch(`${BASE_URL}/websites/${siteId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titulo: 'GitHub Enterprise Teste',
                descricao: 'Plataforma corporativa de hospedagem de código'
            })
        });
        const data = await response.json();
        if (response.status === 200) {
            console.log("✅ Site atualizado com sucesso!");
        } else {
            console.log("❌ Falha ao atualizar site:", data);
        }
        console.log();
    } catch (error) {
        console.error("Erro ao atualizar:", error);
    }

    // 7. Teste de Favorito (POST)
    try {
        console.log(`7. Testando favoritar o site ID: ${siteId} com nota 9...`);
        const response = await fetch(`${BASE_URL}/favoritos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                websiteId: siteId,
                nota: 9
            })
        });
        const data = await response.json();
        if (response.status === 201) {
            console.log("✅ Site favoritado com sucesso!");
        } else {
            console.log("❌ Falha ao favoritar site:", data);
        }
        console.log();
    } catch (error) {
        console.error("Erro ao favoritar:", error);
    }

    // 8. Teste de Deleção (DELETE)
    try {
        console.log(`8. Testando remoção do site ID: ${siteId}...`);
        const response = await fetch(`${BASE_URL}/websites/${siteId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (response.status === 200) {
            console.log("✅ Site removido com sucesso!");
        } else {
            console.log("❌ Falha ao remover site:", data);
        }
        console.log();
    } catch (error) {
        console.error("Erro ao deletar:", error);
    }

    // 9. Verificação final de deleção
    try {
        console.log(`9. Confirmando se o site ID: ${siteId} foi deletado de fato...`);
        const response = await fetch(`${BASE_URL}/websites/${siteId}`);
        if (response.status === 404) {
            console.log("✅ Confirmado: Site não existe mais (404).");
        } else {
            console.log("❌ O site ainda foi encontrado ou ocorreu um comportamento inesperado:", response.status);
        }
        console.log();
    } catch (error) {
        console.error("Erro na verificação de deleção:", error);
    }

    console.log("=== TESTES CONCLUÍDOS ===");
}

testarAPI();
