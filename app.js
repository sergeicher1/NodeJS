const { Model } = require("mongoose");
const Sequelize = require("sequelize");
const sequelize = new Sequelize("usersdb", "root", "123456", {
  dialect: "mysql",
  host: "loclhost",
});
class User extends Model {}
const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});
sequelize
  .sync()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => console.log(err));
