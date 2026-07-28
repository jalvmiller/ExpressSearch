"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoritoDAO = void 0;
const BaseDAO_1 = require("./BaseDAO");
class FavoritoDAO extends BaseDAO_1.BaseDAO {
    constructor() {
        super('favoritos');
    }
    async salvarFavorito(favorito) {
        return await this._executar(col => col.insertOne(favorito));
    }
}
exports.FavoritoDAO = FavoritoDAO;
