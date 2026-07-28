"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conectarBanco = conectarBanco;
exports.obterBanco = obterBanco;
exports.fecharBanco = fecharBanco;
const mongodb_1 = require("mongodb");
const url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';
const dbName = 'searchdb';
let client = null;
let db = null;
/**
 * Conecta ao banco de dados MongoDB (se já não estiver conectado)
 * e retorna a instância do banco de dados (Db)
 */
async function conectarBanco() {
    if (db)
        return db;
    try {
        client = new mongodb_1.MongoClient(url);
        await client.connect();
        db = client.db(dbName);
        console.log('Conectado ao MongoDB com sucesso.');
        return db;
    }
    catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        throw error;
    }
}
/**
 * Retorna a instância ativa do banco de dados
 * Lança um erro se a conexão ainda não foi inicializada
 */
function obterBanco() {
    if (!db) {
        throw new Error('O banco de dados não foi inicializado. Chame conectarBanco() primeiro.');
    }
    return db;
}
/**
 * Fecha a conexão com o MongoDB
 */
async function fecharBanco() {
    if (client) {
        await client.close();
        client = null;
        db = null;
        console.log('Conexão com o MongoDB encerrada.');
    }
}
