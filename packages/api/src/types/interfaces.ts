import { Config } from "lighthouse";
import { Browser } from "puppeteer-core";
export interface MongoDBConfig {
  mongoUrl: string;
  dbName: string;
  collectionName: string;
}

export interface MongoDBClient {
  client: any;
  connect(): Promise<void>;
}

export interface LighthouseServiceConfig extends Config {
  extends?: string;
  //output?: string | string[];
  settings?: {
    onlyAudits?: string[];
    onlyCategories?: string[];
  };
  browser: Browser;
}
