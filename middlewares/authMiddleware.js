// Middleware de Autenticação usando Session
function authMiddleware(req, res, next) {
    if (req.session && req.session.login) {
        req.usuario = req.session.login; // Extraindo usuário da sessão
        return next();
    }
    return res.status(401).json({ error: "Acesso negado. Faça o login." });
}

module.exports = authMiddleware;
