"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Favorito = void 0;
// uso do | -> operador matemático binário bitwise
// uso do || -> é usado como operador lógico OR em condições de if ou ternários
// o | está sendo usado como de acordo com o Union Types,
// diz que a propriedade aceita tanto ObjectId quanto String
class Favorito {
    _id;
    websiteId;
    nota;
    dataFavoritado;
    constructor(websiteId, nota = 0) {
        if (!websiteId)
            throw new Error("ID do website é obrigatório para favoritar");
        this.websiteId = websiteId;
        this.nota = nota;
        this.dataFavoritado = new Date();
    }
}
exports.Favorito = Favorito;
