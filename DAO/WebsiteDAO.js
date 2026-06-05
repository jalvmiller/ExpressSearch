const BaseDAO = require('./BaseDAO');
const { ObjectId } = require('mongodb');

class WebsiteDAO extends BaseDAO {
    constructor() { 
        super('websites');
     }
    
    async cadastrarSite(site) {
        return await this._executar(col => col.insertOne(site));
    }
    
    async buscar(termo) {
        return await this._executar(col => col.find({ palavrasChave: termo }).toArray());
    }

    async deletarSite(id) {
    return await this._executar(async (col) => {
        const resultado = await col.deleteOne({ _id: new ObjectId(id) });
        return resultado.deletedCount; // Retorna 1 se deletou, 0 se não achou
    });
}
}

// LEMBRAR module.exports se classe
module.exports = WebsiteDAO;