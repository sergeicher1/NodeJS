const User = require("../models/user.js");

exports.addUser = function (request, response) {
  response.render("create.hbs");
};
exports.getUsers = async function (request, response) {
  const allUsers = await User.find({});
  response.render("users.hbs", {
    users: allUsers,
  });
};
exports.postUser = async function (request, response) {
  if (!request.body) return response.sendStatus(400);
  const userName = request.body.name;
  const userAge = request.body.age;
  const user = new User(userName, userAge);
  user.save();
  response.redirect("/users");
};
