import { ObjectId } from 'mongodb';

export interface IHistorico {
    _id?: ObjectId;
    termoBuscado: string;
    usuario: string;
    data: Date;
}
