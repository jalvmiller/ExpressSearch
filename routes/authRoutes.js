const express = require('express');
const router = express.Router();

// Rota de Login usando Session
router.post('/login', (req, res) => {
    let login = req.body.login;
    let senha = req.body.senha;

    if (login === 'admin' && senha === 'admin') {
        req.session.login = login;
        res.json({ message: 'Login realizado com sucesso' });
    } else {
        res.status(403).json({ error: 'Forbidden' });
    }
});

module.exports = router;
