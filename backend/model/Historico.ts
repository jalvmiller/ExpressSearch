import { ObjectId } from 'mongodb';
import { IHistorico } from '../types/Historico';

export class Historico implements IHistorico {
    _id?: ObjectId;
    termoBuscado: string;
    usuario: string;
    data: Date;

    constructor(termoBuscado: string, usuario = "Teste") {
        if (!termoBuscado) { 
            throw new Error("O termo buscado é obrigatório");
        }

        this.termoBuscado = termoBuscado;
        this.usuario = usuario;
        this.data = new Date();
    }
}
