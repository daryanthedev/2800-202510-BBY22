import { MongoClient } from "mongodb";

import "dotenv/config";

import mongodbUri from "./mongodbUri.js";

/**
 * Exports a MongoDB client instance using the connection URI from environment variables.
 */
export default new MongoClient(mongodbUri, {});
