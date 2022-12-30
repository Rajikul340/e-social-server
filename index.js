const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lrjyghr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function eSocial() {
  try {
    const mediaCollection = client.db("e-social").collection("media-data");
    const commentCollection = client.db("e-social").collection("commentdata");
    const userCollection = client.db("e-social").collection("users");

    app.post("/mediadata", async (req, res) => {
      const mediaData = req.body;
      const result = await mediaCollection.insertOne(mediaData);
      res.send(result);
    });
    app.post("/users", async (req, res) => {
      const users = req.body;
      const result = await userCollection.insertOne(users);
      res.send(result);
    });
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log("amir id ta", id);
      const filter = { _id: ObjectId(id) };
      console.log("fitler ta ki ", filter);
      const result = await userCollection.findOne(filter);
      console.log("akjon user je ke", result);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const query = {};
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });

    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updateUser = req.body;
      const option = {upsert:true}
      const updatedoc={
        $set:{
        displayName:updateUser.displayName,
        photoURL:updateUser.photoURL,
        email:updateUser.email,
         name:'rajib'
        }
      }
      const result = await userCollection.updateOne(filter, updatedoc, option)

      console.log(updatedoc);
      res.send(result)
    });
    app.post("/comment", async (req, res) => {
      const commentData = req.body;
      const result = await commentCollection.insertOne(commentData);
      res.send(result);
    });

    app.get("/comment", async (req, res) => {
      const query = {};
      const cursor = commentCollection.find(query).sort({ time: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/mediadata", async (req, res) => {
      const query = {};
      const cursor = mediaCollection.find(query).sort({ time: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/mediadata/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await mediaCollection.findOne(query);
      res.send(result);
    });
  } catch {}
}

eSocial().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`server running on ${port}`);
});
