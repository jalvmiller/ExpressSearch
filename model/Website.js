class Website {
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

    get titulo() {
        return this._titulo;
    }

    set titulo(novoTitulo) {
        if (!novoTitulo) throw new Error("Título é obrigatório");
        this._titulo = novoTitulo;
    }

    get url() {
        return this._url;
    }

    set url(novaUrl) {
        if (!novaUrl) throw new Error("URL é obrigatória");
        this._url = novaUrl;
    }

    get palavrasChave() {
        return this._palavrasChave;
    }

    set palavrasChave(novasPalavras) {
        this._palavrasChave = novasPalavras;
    }

    get descricao() {
        return this._descricao;
    }

    set descricao(novaDescricao) {
        this._descricao = novaDescricao;
    }

    get dataIndex() {
        return this._dataIndex;
    }

    set dataIndex(novaData) {
        this._dataIndex = novaData;
    }

    toJSON() {
        return {
            titulo: this.titulo,
            url: this.url,
            palavrasChave: this.palavrasChave,
            descricao: this.descricao,
            dataIndex: this.dataIndex
        };
    }
}

module.exports = Website;