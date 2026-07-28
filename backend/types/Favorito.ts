import { ObjectId } from 'mongodb';

export interface IFavorito {
    _id?: ObjectId;
    websiteId: ObjectId | string;
    nota: number;
    dataFavoritado: Date;
}
