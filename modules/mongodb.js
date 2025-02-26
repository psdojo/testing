import { MongoClient } from 'mongodb'


class MongoDB {
  constructor(mongoUrl, dbName) {
    this.mongoUrl = mongoUrl
    this.dbName = dbName
    this.client = new MongoClient(mongoUrl)

  }

  async connect() {
    await this.client.connect()
    this.db = this.client.db(this.dbName)
    console.log('connected')
  }

  async createTimeseriesCollection(collectionName) {

    await this.db.createCollection(collectionName, {
      timeseries: {
        timeField: 'timestamp',
        metaField: 'metadata',
        granularity: 'minutes'
      }
    })
  }
  async insertDocument(collectionName, document) {
    const collection = this.db.collection(collectionName)


    await collection.insertOne(document)



  }

  async close() {
    await this.client.close()


  }
}

export default MongoDB
