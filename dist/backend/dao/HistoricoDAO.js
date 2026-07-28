"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoricoDAO = void 0;
const BaseDAO_1 = require("./BaseDAO");
class HistoricoDAO extends BaseDAO_1.BaseDAO {
    constructor() {
        super('historico');
    }
    async registrarBusca(historico) {
        return await this._executar(col => col.insertOne(historico));
    }
    async obterHistorico() {
        return await this._executar(col => col.find({}).toArray());
    }
}
exports.HistoricoDAO = HistoricoDAO;
