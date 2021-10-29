const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

//middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.obwta.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();

        const database = client.db('TakTourDb');
        const TourEventsCollection = database.collection('TourEventsCollection');
        const RegisterEventsCollection = database.collection('RegisterEventsCollection');

        //GET api
        app.get('/events', async(req, res) => {
            const cursor = TourEventsCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/events/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await TourEventsCollection.findOne(query);
            res.send(result)
        })
        //POST api
        app.post('/registerevents', async(req, res) => {
            const event = req.body;
            const result = await RegisterEventsCollection.insertOne(event);
            res.json(result)
        })
        app.post('/registerevents/byemail', async(req, res) => {
            const email = req.body;
            const query = {email: {$in: email}};
            const result = await RegisterEventsCollection.find(query).toArray();
            res.send(result)
        })
        //get register event data
        app.get('/registerevents', async(req, res) => {
            const cursor = RegisterEventsCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })
        //delete api
        app.delete('/registerevents/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await RegisterEventsCollection.deleteOne(query);
            res.json(result)
        })
        //Updated api
        app.put('/registerevents/:id', async(req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = {_id: ObjectId(id)};
            const option = {upsert: true}
            const updatedoc ={
                $set:{
                    status: data.status
                }
            }
            const result = await RegisterEventsCollection.updateOne(filter,updatedoc,option)
            res.json(result)
        })
    }
    finally{

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Tour server is connected');
});

app.listen(port, (req, res) => {
    console.log('port is', port)
})