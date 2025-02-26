import { MongoClient, Db } from 'mongodb'
import { MongoDBClient } from '../../types/interfaces'
import { MongoDBConfig } from '../../types/interfaces'







class MongoDB implements MongoDBClient {
  client: any;
  private config: MongoDBConfig
  private db: Db;
  private dbName: string;
  constructor(config: MongoDBConfig) {
    this.config = config;
    // this.mongoUrl: string = mongoUrl: string;
    // this.dbName: string = dbName: string;
    // this.client: any = new MongoClient(mongoUrl);

  }

  async connect(): Promise<void> {
    this.client = new MongoClient(this.config.mongoUrl)
    await this.client.connect()
    this.db = this.client.db(this.dbName)
    console.log('connected')
  }

  async createTimeseriesCollection(collectionName: string) {

    await this.db.createCollection(collectionName, {
      timeseries: {
        timeField: 'timestamp',
        metaField: 'metadata',
        granularity: 'minutes'
      }
    })
  }
  async insertDocument(collectionName: string, document: any) {
    const collection = this.db.collection(collectionName)
    await collection.insertOne(document)
  }

  async close() {
    await this.client.close()
  }
}
export default MongoDB

