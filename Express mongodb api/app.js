const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectId;

const app = express();
app.use(express.json()); // connect auto parsing json
app.use(express.static("public")); // static files will be in public folder

// connection string for local mongodb
const mongoClient = new MongoClient("mongodb://127.0.0.1:27017/");

(async () => {
  try {
    await mongoClient.connect();
    app.locals.collection = mongoClient.db("usersdb").collection("users");
    app.listen(3000);
    console.log("Server is listening for connections");
  } catch (err) {
    return console.log(err);
  }
})();

app.get("/api/users", async (request, response) => {
  const collection = request.app.locals.collection;
  try {
    const users = await collection.find({}).toArray();
    response.send(users);
  } catch (err) {
    console.log(err);
    response.sendStatus(500);
  }
});
// get one user by id
app.get("/api/users/:id", async (request, response) => {
  const collection = request.app.locals.collection;
  try {
    const id = new objectId(request.params.id);
    const user = await collection.findOne({ _id: id });
    if (user) response.send(user);
    else response.sendStatus(404);
  } catch (err) {
    console.log(err);
    response.sendStatus(500);
  }
});

// getting sent data
app.post("/api/users",  async (request, response) => {
  if (!request.body) return response.sendStatus(400);
  const userName = request.body.name;
  const userAge = request.body.age;
  const user = { name: userName, age: userAge };
  const collection = request.app.locals.collection;
  try {
    await collection.insertOne(user);
    response.send(user);
  } catch (err) {
    console.log(err);
    response.sendStatus(500);
  }
});
// delete user by id
app.delete("/api/users/:id", async (request, response) => {
  const collection = request.app.locals.collection;

  try {
    const id = new objectId(request.params.id);
    const user = await collection.findOneAndDelete({ _id: id });
    if (user) response.send(user);
    else response.sendStatus(404);
  } catch (err) {
    console.log(err);
    response.sendStatus(500);
  }
});
// change user
app.put("/api/users", async (request, response) => {
  if (!request.body) return response.sendStatus(400);
  const userName = request.body.name;
  const userAge = request.body.age;
  const collection = request.app.locals.collection;

  try {
    const id = new objectId(request.body.id);
    const user = await collection.findOneAndUpdate(
      { _id: id },
      { $set: { age: userAge, name: userName } },
      { returnDocument: "after" }
    );
    if (user) response.send(user);
    else response.sendStatus(404);
  } catch (err) {
    console.log(err);
    response.sendStatus(500);
  }
});

// listen , to close the program (ctrl + c)
process.on("SIGINT", async () => {
  await mongoClient.close();
  console.log("The app is closed.");
  process.exit();
});
