const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middelware
app.use(express.json());
app.use(cors());

const uri = 
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2eupeky.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const jobCollection=client.db('solo-db').collection('solo')


    app.post('/add-job', async (req,res)=>{
      const jobData=req.body;
      const result=await jobCollection.insertOne(jobData)
      res.send(result)
    })
    app.get('/jobs', async (req,res)=>{
      const result=await jobCollection.find().toArray()
      res.send(result)
    })
    app.get('/jobs/:email', async (req,res)=>{ 
      const email=req.params.email;
      const query={'buyer.email':email}
      const result=await jobCollection.find(query).toArray()
      res.send(result)
    })

    app.delete('/job/:id', async (req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const result=await jobCollection.deleteOne(query)
      res.send(result)
    }) 

    app.get('/job/:id', async (req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const result=await jobCollection.findOne(query)
      res.send(result)
    }) 

    app.get('/job/:id', async (req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const result=await jobCollection.findOne(query)
      res.send(result)
    }) 

    app.put('/add-update/:id', async (req,res)=>{
      const id=req.params.id;
      const jobData=req.body;
      const update={
        $set: jobData
      }

      const query={_id: new ObjectId(id)}
      const options={upsert:true}
      const result=await jobCollection.updateOne(query,update,options)
      res.send(result)

    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server ruunning wow");
});
app.listen(port, () => {
  console.log(`my server is running right now on${port}`);
});
