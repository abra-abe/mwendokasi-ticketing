require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const connectToDatabase = async () => {
    try{
        await client.connect();
        console.log('Connected to MongoDB');
        
        return client.db('test');
    }catch(err){
        console.error(`Error establishing connection pool: ${err}`);
    }
}

module.exports = { connectToDatabase }