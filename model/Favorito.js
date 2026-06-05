class Favorito {
    constructor(websiteId, nota = 0) {
        this.websiteId = websiteId;
        this.nota = nota;
        this.dataFavoritado = new Date();
    }

    get websiteId() {
        return this._websiteId;
    }

    set websiteId(novoId) {
        if (!novoId) throw new Error("ID do website é obrigatório para favoritar");
        this._websiteId = novoId;
    }

    get nota() {
        return this._nota;
    }

    set nota(novaNota) {
        this._nota = novaNota;
    }

    get dataFavoritado() {
        return this._dataFavoritado;
    }

    set dataFavoritado(novaData) {
        this._dataFavoritado = novaData;
    }
    
    toJSON() {
        return {
            websiteId: this.websiteId,
            nota: this.nota,
            dataFavoritado: this.dataFavoritado
        };
    }
}

module.exports = Favorito;