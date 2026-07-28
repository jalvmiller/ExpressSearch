"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseDAO = void 0;
const database_1 = require("./database");
const fs = __importStar(require("fs"));
// T extends { _id?: any }> significa que T pode ser qualquer coisa que tenha _id
// ou seja, pode ser qualquer coisa desde que seja um objeto que possua ou possa
// possuir uma propriedade chamada _id.. ele olha dentro do objeto
// BaseDAO parametrizado com tipo generico, ou seja, faz com que a coleção seja 
// tipada de acordo com o model específico do DAO
// restrições de visibilidade para os métodos.. protected, private
class BaseDAO {
    collec;
    constructor(collec) {
        this.collec = collec;
    }
    _salvarLog(erro) {
        const mensagem = `[${new Date().toISOString()}] ERRO: ${erro.message}\nStack: ${erro.stack}\n\n\n`;
        fs.appendFileSync('error.log', mensagem);
    }
    // protected -> executável só por classes-filhas
    // <R> segundo genérico da classe, representa o tipo de retorno que virá do BD
    // Se fizer um insertOne(), R é igual a resultado da inserção
    // Se fizer um find.toArray() R é igual a um array
    // o ts descobre qual tipo de R a partir do código dentro do callback
    // operacao: (col: Collection<T>) => Promise<R>, define que o param operacao
    // deve ser uma função callback.. esse calback
    // recebe a coleção MongoDB tipada com T
    // executa a query e retorna uma promessa com o resultado R
    // ): Promise<R>, define que o método _executar como um todo retorna uma promessa com o resultado R
    // async cadastrarSite(site: IWebsite) {
    //     return await this._executar(col => col.insertOne(site));
    // }
    // T é IWebsite (definido na classe)
    // col é inferido como Collection<IWebsite>
    // A operação é col.insertOne(site). O retorno desse método do MongoDB é do tipo InsertOneResult<IWebsite>
    // Portanto, o genérico <R> assume o tipo InsertOneResult<IWebsite>
    // O método final cadastrarSite retorna um Promise<InsertOneResult<IWebsite>> 
    async _executar(operacao) {
        try {
            const db = await (0, database_1.conectarBanco)();
            const col = db.collection(this.collec);
            return await operacao(col);
        }
        catch (err) {
            this._salvarLog(err);
            throw err;
        }
    }
}
exports.BaseDAO = BaseDAO;
