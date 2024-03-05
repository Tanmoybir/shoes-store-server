const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// MeddleWare
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xmlybhe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const shoesCollection = client.db("shoesDB").collection("shoes")

        app.get('/api/v1/shoes', async (req, res) => {
            try {
                let query = {}
                const company = req.query.company
                // console.log(company);
                if(company){
                    query.company = company
                }
                const cursor = shoesCollection.find(query)
                const result = await cursor.toArray()
                res.send(result)
            }
            catch (error) {
                res.status(500).send({ message: error.message })
            }
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
    res.send('Shoes Store Server')
})

app.listen(port, () => {
    console.log(`Shoes Store Server Started on port ${port}`)
})