import { MongoClient } from "mongodb";

import "dotenv/config";

import mongodbUri from "./mongodbUri";

export default new MongoClient(mongodbUri, {});
