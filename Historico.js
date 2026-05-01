class Historico {
    constructor(termoBuscado, usuario = "Teste") {
        if (!termoBuscado) { 
            throw new Error("O termo buscado é obrigatório");
        }

        this.termoBuscado = termoBuscado;
        this.usuario = usuario;
        this.data = new Date();
    }

    // Guarda as pesquisas
}

module.exports = Historico;