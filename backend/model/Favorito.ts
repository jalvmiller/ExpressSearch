import { ObjectId } from 'mongodb';
import { IFavorito } from '../types/Favorito';

// uso do | -> operador matemático binário bitwise
// uso do || -> é usado como operador lógico OR em condições de if ou ternários
// o | está sendo usado como de acordo com o Union Types,
// diz que a propriedade aceita tanto ObjectId quanto String
export class Favorito implements IFavorito {
    _id?: ObjectId;
    websiteId: ObjectId | string;
    nota: number;
    dataFavoritado: Date;

    constructor(websiteId: ObjectId | string, nota = 0) {
        if (!websiteId) throw new Error("ID do website é obrigatório para favoritar");
        this.websiteId = websiteId;
        this.nota = nota;
        this.dataFavoritado = new Date();
    }
}
