import { MongoClient, Db } from 'mongodb';


const url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';
const dbName = 'searchdb';

let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * Conecta ao banco de dados MongoDB (se já não estiver conectado)
 * e retorna a instância do banco de dados (Db)
 */
export async function conectarBanco(): Promise<Db> {
    if (db) return db;

    try {
        client = new MongoClient(url);

        await client.connect();
        db = client.db(dbName);

        console.log('Conectado ao MongoDB com sucesso.');
        return db;
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        throw error;
    }
}

/**
 * Retorna a instância ativa do banco de dados
 * Lança um erro se a conexão ainda não foi inicializada
 */
export function obterBanco(): Db {

    if (!db) {
        throw new Error('O banco de dados não foi inicializado. Chame conectarBanco() primeiro.');
    }

    return db;
}

/**
 * Fecha a conexão com o MongoDB
 */
export async function fecharBanco(): Promise<void> {
    if (client) {
        await client.close();

        client = null;
        db = null;

        console.log('Conexão com o MongoDB encerrada.');
    }
}
