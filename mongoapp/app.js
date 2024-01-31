const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(url);
async function run() {
  const users = [
    { name: "Bob", age: 34 },
    { name: "Sam", age: 33 },
    { name: "Tom", age: 23 },
  ];

  try {
    // connect to server
    await mongoClient.connect();
    const db = mongoClient.db("usersdb");
    const collection = db.collection("users");
    await collection.insertMany(users);
    const result = await collection.findOneAndUpdate(
      { name: "Sam" },
      { $set: { name: "Samuel" } },
      { returnDocument: "after" }
    );
    console.log(result);
  } catch (err) {
    console.log("Error occured");
    console.log(err);
  } finally {
    // close the connection
    await mongoClient.close();
    console.log("connection closed");
  }
}
run().catch(console.error);
