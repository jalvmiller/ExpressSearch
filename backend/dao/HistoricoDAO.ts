import { BaseDAO } from './BaseDAO';
import { IHistorico } from '../types/Historico';

export class HistoricoDAO extends BaseDAO<IHistorico> {
    constructor() {
        super('historico');
    }

    async registrarBusca(historico: IHistorico) {
        return await this._executar(col => col.insertOne(historico));
    }

    async obterHistorico() {
        return await this._executar(col => col.find({}).toArray());
    }
}
