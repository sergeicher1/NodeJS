const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const app = express();

app.use(express.json()); // connect auto parsing json
app.use(express.static("public")); // static files will be in public folder

const userScheme = new Schema(
  { name: String, age: Number },
  { versionKey: false }
);
const User = mongoose.model("User", userScheme);

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/usersdb");
    app.listen(3000);
    console.log("Server is waiting for connections");
  } catch (err) {
    return console.log(err);
  }
}
// get all users
app.get("/api/users", async (request, response) => {
  const id = request.params.id;
  // get all users
  const users = await User.find({});
  response.send(users);
});
// get one user by id
app.get("/api/users/:id", async (request, response) => {
  const id = request.params.id;
  const user = await User.findById(id);
  if (user) response.send(user);
  else response.sendStatus(404);
});

// getting sent data
app.post("/api/users",  async (request, response) => {
  if (!request.body) return response.sendStatus(400);
  const userName = request.body.name;
  const userAge = request.body.age;
  const user = new User({ name: userName, age: userAge });
  // save to DB
  await user.save();
  response.send(user);
});
// delete user by id
app.delete("/api/users/:id", async (request, response) => {
  const id = request.params.id;
  // delete by id
  const user = await User.findByIdAndDelete(id);
  if (user) response.send(user);
  else response.sendStatus(404);
});
// change user
app.put("/api/users",  async (request, response) => {
  if (!request.body) return response.sendStatus(400);
  const userName = request.body.name;
  const userAge = request.body.age;
  const newUser = { age: userAge, name: userName };
  //update user data by id
  const user = await User.findOneAndUpdate({ _id: id }, newUser, { new: true });
  if (user) response.send(user);
  else response.sendStatus(404);
});
main();
// listen , to close the program (ctrl + c)
process.on("SIGINT", async () => {
  await mongoose.disconnect();
  console.log("The app is closed.");
  process.exit();
});
