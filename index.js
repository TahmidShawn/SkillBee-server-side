const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;



// middleware

app.use(cors());
app.use(express.json());

// mongoDB connect 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.azrqgfm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const jobCollection = client.db("jobDB").collection("job")
        const myBidsCollection = client.db("jobDB").collection("myBids")

        // all job category data 
        app.get('/jobs', async (req, res) => {
            const cursor = jobCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        // single job data via id
        app.get('/jobs/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await jobCollection.findOne(query);
            res.send(result)
        })

        // insert add job data to api ('/jobs')
        app.post('/jobs', async (req, res) => {
            const newJob = req.body;
            console.log(newJob);
            const result = await jobCollection.insertOne(newJob);
            res.send(result);
        })

        // insert add myBids data to api ('/myBids')
        app.post('/myBids', async (req, res) => {
            const myBids = req.body;
            console.log(myBids);
            const result = await myBidsCollection.insertOne(myBids);
            res.send(result);
        })

        // My Bids category data 
        app.get('/myBids', async (req, res) => {
            console.log(req.query.email);
            let query = {};
            if (req.query?.email) {
                query = { email: req.query?.email }
            }
            const cursor = myBidsCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })

        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
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
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Skill Bee server running on port ${port}`)
})