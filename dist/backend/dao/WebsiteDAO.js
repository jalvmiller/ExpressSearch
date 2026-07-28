"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsiteDAO = void 0;
const BaseDAO_1 = require("./BaseDAO");
const mongodb_1 = require("mongodb");
class WebsiteDAO extends BaseDAO_1.BaseDAO {
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
            const resultado = await col.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return resultado.deletedCount; // Retorna 1 se deletou, 0 se não achou
        });
    }
    async buscarPorId(id) {
        return await this._executar(col => col.findOne({ _id: new mongodb_1.ObjectId(id) }));
    }
    async atualizarSite(id, dadosAtualizados) {
        return await this._executar(async (col) => {
            const resultado = await col.updateOne(
            // Lembrar que esse bloco está contido no 
            // método col.updateOne() chamado dentro do método _executar()
            // chamada async de método anônimo com a coleção como param
            // e o retorno desse método anônimo é o result.modifiedCount
            // esse valor é retornado para o método atualizarSite
            // e por sua vez é retornado para o método atualizarSite do controller
            // -------------------------------------------------------------------
            // Filtro para encontrar o documento pelo ID,
            // lembrar que o Mongo usa um tipo binário ObjectId para ids
            // é necessário converter a string para ObjectId antes de usar como filtro
            // 1. uso de closure (função declara dentro de outra tem acesso às variáveis
            // e parâmetros da externa)
            // 2. { _id: new ObjectId(id)} indica agrupamento chave-valor em um objeto
            // literal na memória.. diferente de const id = new ObjectId(id) onde é
            // a associado o valor à uma variável, o mongo não saberia onde procurar o
            // valor
            { _id: new mongodb_1.ObjectId(id) }, 
            // Atualização que define quais campos serão modificados
            // o $set é um operador do Mongo, ele diz "alterar apenas os campos passados"
            { $set: dadosAtualizados });
            return resultado.modifiedCount; // Retorna a quantidade de registros modificados
        });
    }
    async listarTodos() {
        return await this._executar(col => col.find({}).toArray());
    }
}
exports.WebsiteDAO = WebsiteDAO;
