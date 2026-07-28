const express = require('express');
const cors = require('cors');

const Website = require('./model/Website');
const WebsiteDAO = require('./dao/WebsiteDAO');
const Historico = require('./model/Historico');
const HistoricoDAO = require('./dao/HistoricoDAO');
const Favorito = require('./model/Favorito');
const FavoritoDAO = require('./dao/FavoritoDAO');

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Inicializa DAOs
const webDAO = new WebsiteDAO();
const histDAO = new HistoricoDAO();
const favDAO = new FavoritoDAO();

// --- ROTAS WEBSITES ---
// --- ROTAS WEBSITES ---
// --- ROTAS WEBSITES ---

// 1. Listar todos ou buscar por termo
// (Ex: GET /api/websites ou GET /api/websites?q=termo&usuario=user1)
app.get('/api/websites', async (req, res) => {

    const { q, usuario } = req.query; // 'q' é o termo de busca, 'usuario' é opcional

    try {
        if (q) {
            // Registra a busca no histórico (simulando comportamento original)

            const user = usuario || 'anonimo';
            const entradaHist = new Historico(q, user);

            await histDAO.registrarBusca(entradaHist);

            // Busca os sites que contém a palavra-chave buscada
            const resultados = await webDAO.buscar(q);
            return res.json(resultados);
        } else {
            // Se não passar busca, lista todos
            const todos = await webDAO.listarTodos();
            return res.json(todos);
        }
    } catch (error) {
        console.error('Erro na rota GET /api/websites:', error);
        res.status(500).json({ error: 'Erro ao buscar websites', details: error.message });
    }
});

// 2. Obter um website por ID (Ex: GET /api/websites/65f1a23b...)
app.get('/api/websites/:id', async (req, res) => {

    const { id } = req.params;

    try {
        const site = await webDAO.buscarPorId(id);

        if (!site) {
            return res.status(404).json({ error: 'Website não encontrado' });
        }
        res.json(site);
    } catch (error) {
        console.error(`Erro na rota GET /api/websites/${id}:`, error);
        res.status(500).json({ error: 'Erro ao obter website', details: error.message });
    }
});

// 3. Cadastrar Website (Ex: POST /api/websites)
app.post('/api/websites', async (req, res) => {

    const { titulo, url, palavrasChave, descricao } = req.body;

    try {
        const novoSite = new Website(titulo, url, palavrasChave || [], descricao || '');
        const resultado = await webDAO.cadastrarSite(novoSite);

        res.status(201).json({ message: 'Website cadastrado com sucesso', id: resultado.insertedId });
    } catch (error) {
        console.error('Erro na rota POST /api/websites:', error);

        if (error.message.includes('Campos obrigatórios')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Erro ao cadastrar website', details: error.message });
    }
});

// 4. Atualizar Website (Ex: PUT /api/websites/65f1a23b...)
app.put('/api/websites/:id', async (req, res) => {

    const { id } = req.params;
    const { titulo, url, palavrasChave, descricao } = req.body;

    try {
        const dadosAtualizar = {};

        if (titulo !== undefined) dadosAtualizar.titulo = titulo;
        if (url !== undefined) dadosAtualizar.url = url;
        if (palavrasChave !== undefined) dadosAtualizar.palavrasChave = palavrasChave;
        if (descricao !== undefined) dadosAtualizar.descricao = descricao;

        const modCount = await webDAO.atualizarSite(id, dadosAtualizar);

        if (modCount === 0) {
            return res.status(404).json({ error: 'Website não encontrado ou nenhuma alteração realizada' });
        }

        res.json({ message: 'Website updated successfully' });
    } catch (error) {
        console.error(`Erro na rota PUT /api/websites/${id}:`, error);
        res.status(500).json({ error: 'Erro ao atualizar website', details: error.message });
    }
});

// 5. Deletar Website (Ex: DELETE /api/websites/65f1a23b...)
app.delete('/api/websites/:id', async (req, res) => {

    const { id } = req.params;

    try {
        const delCount = await webDAO.deletarSite(id);

        if (delCount === 0) {
            return res.status(404).json({ error: 'Website não encontrado' });
        }

        res.json({ message: 'Website removido com sucesso' });
    } catch (error) {
        console.error(`Erro na rota DELETE /api/websites/${id}:`, error);
        res.status(500).json({ error: 'Erro ao deletar website', details: error.message });
    }
});

// --- ROTAS DE FAVORITOS / HISTÓRICO ---
// --- ROTAS DE FAVORITOS / HISTÓRICO ---
// --- ROTAS DE FAVORITOS / HISTÓRICO ---

// Adicionar favorito (Ex: POST /api/favoritos)
app.post('/api/favoritos', async (req, res) => {
    const { websiteId, nota } = req.body;
    try {
        const novoFav = new Favorito(websiteId, nota);
        await favDAO.salvarFavorito(novoFav);
        res.status(201).json({ message: 'Website favoritado com sucesso' });
    } catch (error) {
        console.error('Erro na rota POST /api/favoritos:', error);
        if (error.message.includes('obrigatório')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Erro ao favoritar website', details: error.message });
    }
});

// Listar histórico de buscas (Ex: GET /api/historico)
app.get('/api/historico', async (req, res) => {
    try {
        const historico = await histDAO._executar(col => col.find({}).toArray());
        res.json(historico);
    } catch (error) {
        console.error('Erro na rota GET /api/historico:', error);
        res.status(500).json({ error: 'Erro ao listar histórico', details: error.message });
    }
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT}`);
});
