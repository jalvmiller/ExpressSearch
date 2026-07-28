import { Collection } from 'mongodb';
import { conectarBanco } from './database';
import * as fs from 'fs';
import { IWebsite } from '../types/Website';

// T extends { _id?: any }> significa que T pode ser qualquer coisa que tenha _id
// ou seja, pode ser qualquer coisa desde que seja um objeto que possua ou possa
// possuir uma propriedade chamada _id.. ele olha dentro do objeto

// BaseDAO parametrizado com tipo generico, ou seja, faz com que a coleção seja 
// tipada de acordo com o model específico do DAO

// restrições de visibilidade para os métodos.. protected, private
export class BaseDAO<T extends { _id?: any }> {
    protected collec: string;

    constructor(collec: string) {
        this.collec = collec;
    }

    private _salvarLog(erro: Error) {
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

    protected async _executar<R>(operacao: (col: Collection<T>) => Promise<R>): Promise<R> {
        try {
            const db = await conectarBanco();
            const col = db.collection<T>(this.collec);
            return await operacao(col);
        } catch (err: any) {
            this._salvarLog(err);
            throw err;
        }
    }
}
