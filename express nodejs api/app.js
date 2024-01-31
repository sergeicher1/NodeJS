const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("public"));

// database for test
const users = [];
let id = 1; // to define id

// helper function to serach index of user by id
function findUserIndexById(id) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id == id) return i;
  }
  return -1;
}
app.get("/api/users", function (request, response) {
  response.send(users);
});
// get one user by id
app.get("/api/users/:id", function (request, response) {
  const id = request.params.id; // get id
  // find in array user by id
  const index = findUserIndexById(id);
  // send the user
  if (index > -1) {
    response.send(users[index]);
  } else {
    response.status(404).send("User not found");
  }
});
// getting sent data
app.post("/api/users", function (request, response) {
  if (!request.body) return response.sendStatus(400);
  const userName = request.body.name;
  const userAge = request.body.age;
  const user = { name: userName, age: userAge };
  // give the id from id variable and increment it by 1
  user.id = id++;
  // add user to array
  users.push(user);
  response.send(user);
});
// delete user by id
app.delete("/api/users/:id", function (request, response) {
  const id = request.params.id;
  const index = findUserIndexById(id);
  if (index > -1) {
    //delete user by index from array
    const user = users.splice(index, 1)[0];
    response.send(user);
  } else {
    response.status(404).send("User not found");
  }
});
// change user
app.put("/api/users", function (request, response) {
  if (!request.body) return response.sendStatus(400);
  const id = request.body.id;
  const userName = request.body.name;
  const userAge = request.body.age;
  const index = findUserIndexById(id);
  if (index > -1) {
    // change data in user
    const user = users[index];
    user.age = userAge;
    user.name = userName;
    response.send(user);
  } else {
    response.status(404).send("User not found");
  }
});

app.listen(3000, function () {
  console.log("The server is up! on http://localhost:3000");
});
