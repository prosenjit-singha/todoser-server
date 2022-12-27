require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.send("Server is running..."));

const uri = `mongodb+srv://${process.env.DB_USER_ID}:${process.env.DB_USER_PASS}@cluster0.0hl8m1y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
  } finally {
  }
}

run().catch((err) => console.log(err));

app.listen(port, () => console.log("Server is running on port - ", port));
