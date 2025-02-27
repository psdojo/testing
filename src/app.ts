import express, { Request, Response } from 'express'
import LighthouseService from './modules/LighthouseService.js'
import MongoDB from '../modules/mongodb.js'
import { GridFSBucket } from 'mongodb'

const app = express();
const mongoUrl = 'mongodb://localhost:27017'
const dbName = 'webaudit'
const collectionName = 'performance'


const mongoDB: MongoDB = new MongoDB(mongoUrl, dbName)
app.post('/', async (req: Request, res: Response) => {
  //how does this code works
  //
  const lighthouseService: LighthouseService = new LighthouseService({})
  app.use(express.json())
  const { url }: { url: string } = req.body
  console.log(url)

  const report = await lighthouseService.runTest(url)

  await mongoDB.connect()
  // console.log(mongoDB.client.db(dbName))
  console.log('connected')

  // await mongoDB.createTimeseriesCollection(collectionName, {
  //   timeseries: {
  //     timeField: ' timestamp',
  //     metaField: 'metadata',
  //     granularity: 'minutes'
  //   }
  // })

  const bucket = new GridFSBucket(mongoDB.client.db(dbName))
  console.log(bucket)
  const buffer = Buffer.from(JSON.stringify(report))
  const uploadStream = bucket.openUploadStream('json')
  // `report-${new Date().toISOString()}.json`
  //
  // const uploadStream = bucket.openUploadStream(`report-${new Date().toISOString()}.json`);
  //
  //
  //
  //
  // uploadStream.write(buffer)
  // uploadStream.end()
  await new Promise((resolve, reject) => {
    uploadStream.write(buffer, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  uploadStream.end();

  // Wait for the upload to complete
  await new Promise((resolve, reject) => {
    uploadStream.on('finish', resolve);
    uploadStream.on('error', reject);
  });
  //
  //
  const document = {
    timestamp: new Date(),
    metadata: {
      url,
      reportId: uploadStream.id
    },
  }

  await mongoDB.insertDocument(collectionName, document)
  console.log(document)
  await mongoDB.close()

  // console.log(report)
  // return report
  // res.status(200).send(report)
  // console.log(report)
  // res.status(200).json(report)
  // res.status(200).json({ message: 'audit completed successfully' })
  // res.status(200).json(document)
})
app.listen(3000, () => { console.log("server is running") })
