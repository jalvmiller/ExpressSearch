"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Historico = void 0;
class Historico {
    _id;
    termoBuscado;
    usuario;
    data;
    constructor(termoBuscado, usuario = "Teste") {
        if (!termoBuscado) {
            throw new Error("O termo buscado é obrigatório");
        }
        this.termoBuscado = termoBuscado;
        this.usuario = usuario;
        this.data = new Date();
    }
}
exports.Historico = Historico;
