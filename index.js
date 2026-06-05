const express = require('express');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const websiteRoutes = require('./routes/websiteRoutes');
const viewRoutes = require('./routes/viewRoutes');
const postsRoutes = require('./routes/postsRoutes');

const app = express();

// Configuração do Template Engine HBS
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'view'));

// Arquivos Estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuração do Express Session
app.use(session({
    secret: 'chave_secreta_sessao',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Rotas
app.use('/', authRoutes);
app.use('/websites', websiteRoutes);
app.use('/', viewRoutes);
app.use('/posts', postsRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Sistema executando via porta ${PORT}`);
});
