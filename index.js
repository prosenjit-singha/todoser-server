require("dotenv").config();
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const userCollection = client.db("todoser").collection("users");
    app.get("/tasks", verifyToken, async (req, res) => {
      try {
        const { uid } = req.query;
        if (uid !== req.decoded.uid) return res.sendStatus(403);

        const data = await userCollection.findOne({ uid });

        res.send(data.tasks);
      } catch (error) {
        res.sendStatus(500);
        console.log("error", error);
      }
    });

    app.post("/tasks", verifyToken, async (req, res) => {
      try {
        const { uid } = req.query;
        if (uid !== req.decoded.uid) return res.sendStatus(403);
        const payload = req.body;
        const result = await userCollection.updateOne(
          { uid },
          {
            $set: {
              tasks: payload,
            },
          },
          {
            upsert: true,
          }
        );

        res.send(result);
      } catch (error) {
        res.sendStatus(500);
        console.log(error);
      }
    });

    app.post("/get-access-token", async (req, res) => {
      try {
        const { uid, email } = req.body;
        const user = {
          uid,
          email,
          tasks: [],
        };
        const record = await userCollection.findOne({ uid });
        if (!record) await userCollection.insertOne(user);
        const token = jwt.sign({ uid, email }, process.env.JWT_SECRET);
        return res.send({ token });
      } catch (error) {
        res.sendStatus(500);
      }
    });
  } finally {
  }
}

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
