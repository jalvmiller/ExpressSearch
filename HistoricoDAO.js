const BaseDAO = require('./BaseDAO');

class HistoricoDAO extends BaseDAO {
    constructor() { 
        super('historico');
     }
    
    async registrarBusca(historico) {
        return await this._executar(col => col.insertOne(historico));
    }
}

// LEMBRAR module.exports se classe
module.exports = HistoricoDAO;