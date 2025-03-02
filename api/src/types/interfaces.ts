import { Config } from 'lighthouse';
export interface MongoDBConfig {
  mongoUrl: string,
  dbName: string,
  collectionName: string
}
export interface CustomConfig extends ChromeLauncher {
  port: number,
}





export interface MongoDBClient {
  client: any;
  connect(): Promise<void>;

}

export interface LighthouseServiceConfig {
  extends?: string;
  output?: string;
  settings?: {
    onlyAudits?: string[:]
  }
}
