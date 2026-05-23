const express = require('express');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
dotenv.config();

const uri = process.env.MONGODB_URI;

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const db = client.db('IdeaVault');
        const ideasCollection = db.collection('ideas');

        app.get('/ideas', async (req, res) => {
            const result = await ideasCollection.find({}).toArray();

            res.send(result);
        });

        app.post('/idea', async (req, res) => {
            const ideaData = req.body;
            console.log(ideaData);
            const result = await ideasCollection.insertOne(ideaData);
            
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello! IdeaVault from server');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});