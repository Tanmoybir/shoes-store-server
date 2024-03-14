const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// MeddleWare
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
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
        const myCartCollection = client.db("shoesDB").collection("myCart")

        // app.get('/api/v1/shoes', async (req, res) => {
        //     try {
        //         let query = {}
        //         let sortObj = {}
        //         const category = req.query.category
        //         const company = req.query.company
        //         const color = req.query.color
        //         const price = req.query.price
        //         console.log(price);
        //         // Sorting
        //         const sortField = req.query.sortField;
        //         const sortOrder = req.query.sortOrder;
        //         if(company){
        //             query.company = company
        //         }
        //         if(category) {
        //             query.category = category
        //         }
        //         if(color) {
        //             query.color = color
        //         }
        //         if(price) {
        //             query = {price:{$eq:price}}
        //         }

        //         if (sortField && sortOrder) {
        //             sortObj[sortField] = sortOrder
        //         }

        //         const cursor = shoesCollection.find(query).sort(sortObj)
        //         const result = await cursor.toArray()
        //         res.send(result)
        //     }
        //     catch (error) {
        //         res.status(500).send({ message: error.message })
        //     }
        // })

        // 
        app.get('/api/v1/shoes', async (req, res) => {
            try {
                let query = {};
                let sortObj = {};
                let priceConditions = [];

                // Extracting query parameters
                const { category, company, color, price, sortField, sortOrder } = req.query;

                // Adding query parameters to the MongoDB query
                if (company) query.company = company;
                if (category) query.category = category;
                if (color) query.color = color;

                // Constructing price conditions
                if (price) {
                    priceConditions.push({ price: { $eq: parseInt(price) } }); // Price equals
                    priceConditions.push({ price: { $lt: parseInt(price) } }); // Price less than
                }

                // Combining price conditions using $or operator
                if (priceConditions.length > 0) {
                    query.$or = priceConditions;
                }

                // Building sort object for MongoDB
                if (sortField && sortOrder) {
                    sortObj[sortField] = sortOrder; // Parse sortOrder to integer
                }

                // Fetching shoes data based on query and sorting
                const cursor = shoesCollection.find(query).sort(sortObj);
                const result = await cursor.toArray();

                res.json(result);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });

        app.get('/api/v1/shoes/:id', async (req, res) => {
            try {
                const id = req.params.id
                // console.log(id);
                const query = { _id: new ObjectId(id) }
                // console.log(query);
                const result = await shoesCollection.findOne(query)
                res.json(result)
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        })

        app.post('/api/v1/user/myCart', async (req, res) => {
            try { 
                const myCart = req.body
                const result = await myCartCollection.insertOne(myCart)
                res.json(result)
            }
            catch (error) {
                res.status(500).json({ message: error.message });
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