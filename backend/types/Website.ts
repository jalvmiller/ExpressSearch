import { ObjectId } from 'mongodb';

export interface IWebsite {
    _id?: ObjectId;
    titulo: string;
    url: string;
    descricao?: string;
    palavrasChave: string[];
    dataIndex: Date;
}
