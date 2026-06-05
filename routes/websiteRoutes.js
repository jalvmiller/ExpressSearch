const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Website = require('../model/Website');
const WebsiteDAO = require('../DAO/WebsiteDAO');
const Historico = require('../model/Historico');
const HistoricoDAO = require('../DAO/HistoricoDAO');
const Favorito = require('../model/Favorito');
const FavoritoDAO = require('../DAO/FavoritoDAO');
const { registrarErro } = require('../logger');

// Cadastrar novo Website
router.post('/', authMiddleware, async (req, res) => {
    const { titulo, url, palavrasChave, descricao } = req.body;
    const dao = new WebsiteDAO();
    try {
        const novoSite = new Website(titulo, url, palavrasChave, descricao);
        await dao.cadastrarSite(novoSite.toJSON());

        console.log("\nWebsite indexado no serviço de busca: ", novoSite.titulo);
        res.status(201).json({ message: "Website indexado", website: novoSite });
    } catch (error) {
        registrarErro("Cadastro inválido\n", error);
        res.status(400).json({ error: error.message });
    }
});

// Realizar busca e registrar (GET /websites)
router.get('/', authMiddleware, async (req, res) => {
    const termo = req.query.busca;
    const usuario = req.usuario; 
    try {
        if (!termo) {
            throw new Error("Campos obrigatórios ausentes: termo (busca).");
        }
        const webDAO = new WebsiteDAO();
        const histDAO = new HistoricoDAO();

        console.log("\n== BUSCA ==");
        console.log(`Processando busca por: "${termo}"`);

        const entradaHist = new Historico(termo, usuario);

        await histDAO.registrarBusca(entradaHist.toJSON());
        const resultados = await webDAO.buscar(termo);

        console.log(`Encontrados ${resultados.length} resultados.`);
        res.json({ resultados });
    } catch (error) {
        registrarErro("Erro na Busca:", error);
        res.status(400).json({ error: error.message });
    }
});

// Favoritar
router.post('/:id/favorito', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { nota } = req.body;
    try {
        if (!id || nota === undefined) {
            throw new Error("Campos obrigatórios ausentes: id e nota.");
        }
        const dao = new FavoritoDAO();
        const novoFav = new Favorito(id, nota);
        await dao.salvarFavorito(novoFav.toJSON());

        console.log(`\nWebsite ${id} adicionado aos favoritos com nota ${nota}\n`);
        res.status(201).json({ message: "Website favoritado com sucesso", favorito: novoFav });
    } catch (error) {
        registrarErro("\nErro ao favoritar:", error);
        res.status(400).json({ error: error.message });
    }
});

// Deletar
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            throw new Error("Campo obrigatório ausente: id.");
        }
        const dao = new WebsiteDAO();

        console.log(`\n[DELETAR] Tentando remover ID: ${id}`);
        const totalDeletado = await dao.deletarSite(id);
        
        if (totalDeletado > 0) {
            console.log("Website removido do índice");
            res.json({ message: "Website removido com sucesso" });
        } else {
            console.log("Nenhum site encontrado com o ID: ", id);
            res.status(404).json({ error: "Nenhum site encontrado" });
        }
    } catch (error) {
        registrarErro("Erro na Deleção:", error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
