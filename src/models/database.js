let database;

class Database {
    collectionName;
    collection;

    static setDatabase(db) {
        database = db;
    }

    constructor(collectionName) {
        this.collectionName = collectionName;
        this.collection = database.collection(collectionName);
    }

    findOne(filters) {
        return this.collection.findOne(filters);
    }

    find() {
        return this.collection.find();
    }

    insertOne(user) {
        return this.collection.insertOne(user);
    }

    updateOne(filter, data){
        return this.collection.updateOne(filter, data);
    }
}

module.exports = Database;