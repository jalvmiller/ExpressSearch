import { BaseDAO } from './BaseDAO';
import { IFavorito } from '../types/Favorito';

export class FavoritoDAO extends BaseDAO<IFavorito> {
    constructor() {
        super('favoritos');
    }

    async salvarFavorito(favorito: IFavorito) {
        return await this._executar(col => col.insertOne(favorito));
    }
}
