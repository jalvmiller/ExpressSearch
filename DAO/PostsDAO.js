const BaseDAO = require('./BaseDAO');

//module.exports = class Posts {
//    static async find () {
//            const cont = await MongoClient.connect('mongodb://mongo/exemplo01');
//            const db = cont.db();
//
//            return await db.collection('posts').find().toArray();
//    }
//}

class PostsDAO extends BaseDAO {
    constructor() { 
        super('posts');
    }
    
    async find(busca) {
        return await this._executar(col => {
            if (busca) {
                return col.find({ content: new RegExp('^' + busca) }).toArray();
            }
            return col.find().toArray();
        });
    }

    async insert(content) {
        return await this._executar(col => col.insertOne({ content: content }));
    }
}

module.exports = PostsDAO;