class Historico {
    constructor(termoBuscado, usuario = "Teste") {
        this.termoBuscado = termoBuscado;
        this.usuario = usuario;
        this.data = new Date();
    }

    get termoBuscado() {
        return this._termoBuscado;
    }

    set termoBuscado(novoTermo) {
        if (!novoTermo) throw new Error("O termo buscado é obrigatório");
        this._termoBuscado = novoTermo;
    }

    get usuario() {
        return this._usuario;
    }

    set usuario(novoUsuario) {
        this._usuario = novoUsuario;
    }

    get data() {
        return this._data;
    }

    set data(novaData) {
        this._data = novaData;
    }
    
    toJSON() {
        return {
            termoBuscado: this.termoBuscado,
            usuario: this.usuario,
            data: this.data
        };
    }
}

module.exports = Historico;