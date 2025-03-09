import { MongoClient } from "mongodb";
class MongoDB {
    client;
    config;
    db;
    dbName;
    constructor(config) {
        this.config = config;
        // this.mongoUrl: string = mongoUrl: string;
        // this.dbName: string = dbName: string;
        // this.client: any = new MongoClient(mongoUrl);
    }
    async connect() {
        this.client = new MongoClient(this.config.mongoUrl);
        await this.client.connect();
        this.db = this.client.db(this.dbName);
        // console.log('connected')
    }
    async createTimeseriesCollection(collectionName) {
        await this.db.createCollection(collectionName, {
            timeseries: {
                timeField: "timestamp",
                metaField: "metadata",
                granularity: "minutes",
            },
        });
    }
    async insertDocument(collectionName, document) {
        const collection = this.db.collection(collectionName);
        await collection.insertOne(document);
    }
    async close() {
        await this.client.close();
    }
}
export default MongoDB;
