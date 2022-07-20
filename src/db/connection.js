require('dotenv').config();
const { MongoClient } = require('mongodb')

const client = new MongoClient(process.env.MONGO_URI)

const connection = async () => {
    try {
        //Connect above MongoClient to server. 
        await client.connect()
        //Declares database - db within client cluster named 'Movies.'
        const db = client.db('Movies');
        //Returns collection 'Movie' within declared database.
        return db.collection('Movie')
    } catch (error) {
        console.log('Connection failed.')
    }
}

module.exports = { client, connection }