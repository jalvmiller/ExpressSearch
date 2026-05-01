class Favorito {
    constructor(websiteId, nota = 0) {
        if (!websiteId) throw new Error("ID do website é obrigatório para favoritar");
        this.websiteId = websiteId;
        this.nota = nota;
        this.dataFavoritado = new Date();
    }
}

module.exports = Favorito;