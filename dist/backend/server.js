"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const Website_1 = require("./model/Website");
const WebsiteDAO_1 = require("./dao/WebsiteDAO");
const Historico_1 = require("./model/Historico");
const HistoricoDAO_1 = require("./dao/HistoricoDAO");
const Favorito_1 = require("./model/Favorito");
const FavoritoDAO_1 = require("./dao/FavoritoDAO");
const database_1 = require("./dao/database");
const app = (0, express_1.default)();
const PORT = 3001;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Inicializa DAOs
const webDAO = new WebsiteDAO_1.WebsiteDAO();
const histDAO = new HistoricoDAO_1.HistoricoDAO();
const favDAO = new FavoritoDAO_1.FavoritoDAO();
// --- ROTAS WEBSITES ---
// 1. Listar todos ou buscar por termo
app.get('/api/websites', async (req, res) => {
    const q = req.query.q;
    const usuario = req.query.usuario;
    try {
        if (q) {
            const user = usuario || 'anonimo';
            const entradaHist = new Historico_1.Historico(q, user);
            await histDAO.registrarBusca(entradaHist);
            // Busca os sites que contém a palavra-chave buscada
            const resultados = await webDAO.buscar(q);
            return res.json(resultados);
        }
        else {
            // Se não passar busca, lista todos
            const todos = await webDAO.listarTodos();
            return res.json(todos);
        }
    }
    catch (error) {
        console.error('Erro na rota GET /api/websites:', error);
        res.status(500).json({ error: 'Erro ao buscar websites', details: error.message });
    }
});
// 2. Obter um website por ID
app.get('/api/websites/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const site = await webDAO.buscarPorId(id);
        if (!site) {
            return res.status(404).json({ error: 'Website não encontrado' });
        }
        res.json(site);
    }
    catch (error) {
        console.error(`Erro na rota GET /api/websites/${id}:`, error);
        res.status(500).json({ error: 'Erro ao obter website', details: error.message });
    }
});
// 3. Cadastrar Website
app.post('/api/websites', async (req, res) => {
    const { titulo, url, palavrasChave, descricao } = req.body;
    try {
        const novoSite = new Website_1.Website(titulo, url, palavrasChave || [], descricao || '');
        const resultado = await webDAO.cadastrarSite(novoSite);
        res.status(201).json({ message: 'Website cadastrado com sucesso', id: resultado.insertedId });
    }
    catch (error) {
        console.error('Erro na rota POST /api/websites:', error);
        if (error.message.includes('Campos obrigatórios')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Erro ao cadastrar website', details: error.message });
    }
});
// 4. Atualizar Website
app.put('/api/websites/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, url, palavrasChave, descricao } = req.body;
    try {
        const dadosAtualizar = {};
        if (titulo !== undefined)
            dadosAtualizar.titulo = titulo;
        if (url !== undefined)
            dadosAtualizar.url = url;
        if (palavrasChave !== undefined)
            dadosAtualizar.palavrasChave = palavrasChave;
        if (descricao !== undefined)
            dadosAtualizar.descricao = descricao;
        const modCount = await webDAO.atualizarSite(id, dadosAtualizar);
        if (modCount === 0) {
            return res.status(404).json({ error: 'Website não encontrado ou nenhuma alteração realizada' });
        }
        res.json({ message: 'Website updated successfully' });
    }
    catch (error) {
        console.error(`Erro na rota PUT /api/websites/${id}:`, error);
        res.status(500).json({ error: 'Erro ao atualizar website', details: error.message });
    }
});
// 5. Deletar Website
app.delete('/api/websites/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // as string 
        const delCount = await webDAO.deletarSite(id);
        if (delCount === 0) {
            return res.status(404).json({ error: 'Website não encontrado' });
        }
        res.json({ message: 'Website removido com sucesso' });
    }
    catch (error) {
        console.error(`Erro na rota DELETE /api/websites/${id}:`, error);
        res.status(500).json({ error: 'Erro ao deletar website', details: error.message });
    }
});
// --- ROTAS DE FAVORITOS / HISTÓRICO ---
// Adicionar favorito
app.post('/api/favoritos', async (req, res) => {
    const { websiteId, nota } = req.body;
    try {
        const novoFav = new Favorito_1.Favorito(websiteId, nota);
        await favDAO.salvarFavorito(novoFav);
        res.status(201).json({ message: 'Website favoritado com sucesso' });
    }
    catch (error) {
        console.error('Erro na rota POST /api/favoritos:', error);
        if (error.message.includes('obrigatório')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Erro ao favoritar website', details: error.message });
    }
});
// Listar histórico de buscas
app.get('/api/historico', async (req, res) => {
    try {
        const historico = await histDAO.obterHistorico();
        res.json(historico);
    }
    catch (error) {
        console.error('Erro na rota GET /api/historico:', error);
        res.status(500).json({ error: 'Erro ao listar histórico', details: error.message });
    }
});
// Inicialização do banco de dados e do servidor
async function inicializar() {
    try {
        await (0, database_1.conectarBanco)();
        app.listen(PORT, () => {
            console.log(`Servidor Express rodando na porta ${PORT}`);
        });
    }
    catch (error) {
        console.error('Erro ao conectar ao banco e iniciar servidor:', error);
        process.exit(1);
    }
}
inicializar();
