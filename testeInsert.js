const WebsiteDAO = require('./DAO/WebsiteDAO');
const Website = require('./model/Website');

async function testarCadastro() {
    try {
        
        const site = new Website(
            'Google',
            'https://www.google.com',
            ['pesquisa', 'busca'],
            'Motor de busca'
        );
        
        console.log('Objeto criado:', site.toJSON());
        
        const dao = new WebsiteDAO();
        const resultado = await dao.cadastrarSite(site.toJSON());
        
        console.log('Website cadastrado com sucesso');
        console.log('Resultado:', resultado);
    } catch (erro) {
        console.error('Erro ao cadastrar:', erro.message);
        console.error('Stack:', erro.stack);
    }
}

testarCadastro();
