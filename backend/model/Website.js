class Website {
    //          TITULO   URL   PALAVRASCHAVE          DESCRICAO
    constructor(titulo, url,  palavrasChave = [], descricao = ""){
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

module.exports = Website;