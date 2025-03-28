const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');

require('dotenv').config({
    path: path.resolve(process.cwd(), '.env.test')
});

let mongo = undefined;

beforeAll(async()=>{

    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    await mongoose.connect(uri);
});

afterAll(async()=> {

    if(mongo){
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongo.stop();
    }
});

afterEach(async()=> {

    if(mongo){
        const collections = mongoose.connection.collections;
        for(const modelo in collections){
            const collection = collections[modelo];
            await collection.deleteMany();
        }
    }
});