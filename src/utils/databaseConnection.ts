import { MongoClient } from "mongodb";

import "dotenv/config";

import mongodbUri from "./mongodbUri.js";

export default new MongoClient(mongodbUri, {});
