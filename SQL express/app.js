const mysql = require("mysql2");
const express = require("express");
const app = express();
const urlencodedParser = express.urlencoded({ extended: false });
const pool = mysql.createPool({
  connectionLimit: 5,
  host: "MYSQL8003.site4now.net",
  database: "db_aa4023_bobmarl",
  user: "aa4023_bobmarl",
  password: "Qq1@3456",
});

app.set("view engine", "hbs");

app.get("/", function (request, response) {
  pool.query("SELECT * FROM usersdb2", function (err, data) {
    if (err) return console.log(err);
    response.render("index.hbs", {
      users: data,
    });
  });
});
app.get("/create", function (request, response) {
  response.render("create.hbs");
});

app.post("/create", urlencodedParser, function (request, response) {
  if (!request.body) return response.sendStatus(400);
  const name = request.params.name;
  const age = request.params.age;
  pool.query(
    "INSERT INTO usersdb2 (name, age) VALUES (?,?)",
    [name, age],
    function (err, data) {
      if (err) return console.log(err);
      response.redirect("/");
    }
  );
});
app.get("/edit/:id", function (request, response) {
  const id = request.params.id;
  pool.query("SELECT * FROM usersdb2 WHERE id=?", [id], function (err, data) {
    if (err) return console.log(err);
    response.render("edit.hbs", {
      user: data[0],
    });
  });
});
app.post("/edit", urlencodedParser, function (request, response) {
  if (!request.body) return response.sendStatus(400);
  const name = request.params.name;
  const age = request.params.age;
  const id = request.params.id;
  pool.query(
    "UPDATE usersdb2 SET name=?, age=? WHERE id=?",
    [name, age, id],
    function (err, data) {
      if (err) return console.log(err);
      response.redirect("/");
    }
  );
});
app.post("/delete/:id", function (request, response) {
  const id = request.params.id;
  pool.query("DELETE FROM usersdb2 WHERE id=?", [id], function (err, data) {
    if (err) return console.log(err);
    response.redirect("/");
  });
});

app.listen(3000, function () {
  console.log("The server is up...");
});
