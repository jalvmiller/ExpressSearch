const BaseDAO = require('./BaseDAO');

class FavoritoDAO extends BaseDAO {
    constructor() { 
        super('favoritos');
    }
    
    async salvarFavorito(favorito) {
        return await this._executar(col => col.insertOne(favorito));
    }
}

module.exports = FavoritoDAO;