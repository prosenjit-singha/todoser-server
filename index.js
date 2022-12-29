require("dotenv").config();
const jwt = require("jsonwebtoken");
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
    const users = client.db("todoser").collection("users");
    app.get("/tasks", async (req, res) => {
      try {
        const { userId } = req.query;
        const result = await users.find({}).toArray();
        res.send(result);
      } catch (error) {
        res.sendStatus(500);
        console.log("error", error);
      }
    });
    app.post("/tasks", async (req, res) => {
      try {
        const { userId } = req.query;
        const result = await users.updateOne();
      } catch (error) {
        res.sendStatus(500);
        console.log(error);
      }
    });
  } finally {
  }
}

app.post("/get-access-token", (req, res) => {
  const { uid, email } = req.body;
  console.log(uid, email);
  console.log(req.query.uid);
  const token = jwt.sign({ uid, email }, process.env.JWT_SECRET);
  res.send({ token });
});

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) return res.sendStatus(403);
    req.decoded = decoded;
    next();
  });
}

run().catch((err) => console.log(err));

app.listen(port, () => console.log("Server is running on port - ", port));
