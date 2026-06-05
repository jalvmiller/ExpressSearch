const express = require('express');
const router = express.Router();
const PostsDAO = require('../DAO/PostsDAO');
const { registrarErro } = require('../logger');

router.get('/', async (req, res) => {
    const busca = req.query.busca;
    const dao = new PostsDAO();
    try {
        const posts = await dao.find(busca);
        res.render('posts', { posts: posts });
    } catch (error) {
        registrarErro("Erro na Busca de Posts:", error);
        res.status(500).send("Erro interno do servidor");
    }
});

router.post('/', async (req, res) => {
    const content = req.body.content;
    const dao = new PostsDAO();
    try {
        await dao.insert(content);
        res.redirect('/posts');
    } catch (error) {
        registrarErro("Erro ao inserir Post:", error);
        res.status(500).send("Erro interno do servidor");
    }
});

module.exports = router;
