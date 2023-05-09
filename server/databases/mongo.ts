import { MongoClient } from 'mongodb';
require('dotenv').config();

// connect to mongodb database
const connectionString = process.env.ATLAS_URI || "";
const mongoCli = new MongoClient(connectionString);

async function mongoConnection() {
    let connection: MongoClient;

    try {
        connection = await mongoCli.connect();
        if (connection) return connection.db("ArtSite");
    } catch (error) {
        console.error(error);
    }
}

const db = mongoConnection();

export default db;

