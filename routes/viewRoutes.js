const express = require('express');
const router = express.Router();

router.get('/pato', (req, res) => {
    res.render('pato', { title: 'Patooooo'} );
});

router.get('/outra', (req, res) => {
    res.end('Outra');
});

module.exports = router;
