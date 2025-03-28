const mongoose = require('mongoose');

const path = require('path');

require('dotenv').config({
    path: path.resolve(process.cwd(), '.env.test')
});

const { connect } = require('../../models');

beforeAll(async()=> {
    await connect();
});

afterAll(async()=>{
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();

});

afterEach(async()=>{
    const collections = mongoose.connection.collection;

    for (const modelo in collections){
        const collection = collections[modelo];
        await collection.deleteMany();
    }

});