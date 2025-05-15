import "dotenv/config";

// Verify that the MONGODB environment variables are defined
if (process.env.MONGODB_USERNAME === undefined) {
    throw new Error("MONGODB_USERNAME environment variable not defined.");
}
if (process.env.MONGODB_PASSWORD === undefined) {
    throw new Error("MONGODB_PASSWORD environment variable not defined.");
}
if (process.env.MONGODB_HOST === undefined) {
    throw new Error("MONGODB_HOST environment variable not defined.");
}
if (process.env.MONGODB_DBNAME === undefined) {
    throw new Error("MONGODB_DBNAME environment variable not defined.");
}

// Constructs the MongoDB connection URI from environment variables.
export default `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DBNAME}?retryWrites=true`;
