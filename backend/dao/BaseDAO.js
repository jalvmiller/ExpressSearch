const { MongoClient } = require('mongodb');
const fs = require('fs');

class BaseDAO {
    constructor(collec) {
        this.url = 'mongodb://127.0.0.1:27017';
        this.client = new MongoClient(this.url);
        this.dbName = 'exemplo01';
        this.collec = collec;
    }

    _salvarLog(erro) {
        const mensagem = `[${new Date().toISOString()}] ERRO: ${erro.message}\nStack: ${erro.stack}\n\n\n`;
        fs.appendFileSync('error.log', mensagem); // lembrar de usar backtick quando usar format
    }

    async _executar(operacao) {
        try {
            await this.client.connect();

            const db = this.client.db(this.dbName);
            const col = db.collection(this.collec);

            return await operacao(col);
        } catch (err) {
            this._salvarLog(err); // armazena
            throw err;
        } finally {
            await this.client.close();
        }
    }
}

module.exports = BaseDAO;