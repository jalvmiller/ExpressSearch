import { ObjectId } from 'mongodb';
import { IWebsite } from '../types/Website';

// Em ts, é preciso declarar as propriedades no escôpo de classe
// antes de usar o construtor.. diferente de JS

// import segue o ESModules ao invés do CommonJS, ou seja, sem module.exports
// e sim export class Website
export class Website implements IWebsite {
    // _id? -> optional property, quando um obj novo é criado para ser enviado ao Mongo
    // ele ainda não tem um id (o mongo gera quando salva).. ou seja, aceite que pode vir nulo
    _id?: ObjectId;
    titulo: string;
    url: string;
    descricao?: string;
    palavrasChave: string[];
    dataIndex: Date;

    // titulo: string, atrelar o tipo
    constructor(titulo: string, url: string, palavrasChave: string[] = [], descricao = "") {
        if (!titulo || !url) {
            throw new Error("Campos obrigatórios: título e URL");
        }

        this.titulo = titulo;
        this.url = url;
        this.descricao = descricao;
        this.palavrasChave = palavrasChave;
        this.dataIndex = new Date();
    }
}
