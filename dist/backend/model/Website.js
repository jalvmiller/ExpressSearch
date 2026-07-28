"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Website = void 0;
// Em ts, é preciso declarar as propriedades no escôpo de classe
// antes de usar o construtor.. diferente de JS
// import segue o ESModules ao invés do CommonJS, ou seja, sem module.exports
// e sim export class Website
class Website {
    // _id? -> optional property, quando um obj novo é criado para ser enviado ao Mongo
    // ele ainda não tem um id (o mongo gera quando salva).. ou seja, aceite que pode vir nulo
    _id;
    titulo;
    url;
    descricao;
    palavrasChave;
    dataIndex;
    // titulo: string, atrelar o tipo
    constructor(titulo, url, palavrasChave = [], descricao = "") {
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
exports.Website = Website;
