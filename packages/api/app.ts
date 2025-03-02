import express, { Request, Response } from 'express'
import cors from "cors"
import LighthouseService from './src/modules/LighthouseService.ts'
import { ChromeLauncherService } from './src/modules/LighthouseService.ts'
import MongoDB from './src/modules/mongodb.ts'
import { GridFSBucket } from 'mongodb'
import { CustomConfig } from './src/types/interfaces.ts'
import * as chromeLauncher from 'chrome-launcher'
const app = express()
const mongoUrl = 'mongodb://localhost:27017'
const dbName = 'webaudit'
const MongoDBConfig = { mongoUrl, dbName }
const mongoDB: MongoDB = new MongoDB(MongoDBConfig)
const collectionName = 'performance'
// const LighthouseConfig: CustomConfig = { port }
// const chromeConfig: chromeLauncher.Options = {
//   chromeFlags: ['--headless', '--no-sandbox'],
//   chromePath: '/home/a/a/new/api/chrome/linux-132.0.6834.159/chrome-linux64/chrome',
// }
// const chromeLauncherService = new ChromeLauncherService(chromeConfig)
const chromeLauncherService = new ChromeLauncherService(null)
const lighthouseService = new LighthouseService({})

app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173'
}))
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
//   res.header('Access-Control-Allow-Headers, 'Origin, X - Requested - With, Content - Type, Accept');
//   next();
// })
app.post('/', async (req: Request, res: Response) => {
  //how does this code works
  //

  const { url }: { url: string } = req.body
  // console.log(url)
  const chrome = await chromeLauncherService.launchChrome()
  // console.log('chrome launched', chrome)
  const report = await lighthouseService.runTest(url)
  console.log('chrome')
  console.log(report)

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
  await mongoDB.close()

  // console.log(report)
  // return report
  res.status(200).send(report)
  // console.log(report)
  // res.status(200).json(report)
  // res.status(200).json({ message: 'audit completed successfully' })
  // res.status(200).json(document)
})
app.listen(3000, () => { console.log("server is running") })
