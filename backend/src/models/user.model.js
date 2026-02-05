const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  id: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true
},
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profilePhoto: {
    type: DataTypes.STRING
  },
  resume: {
    type: DataTypes.STRING
  },
  skills: {
    type: DataTypes.TEXT
  },
  degree: {
    type: DataTypes.STRING
  },
  institute: {
    type: DataTypes.STRING
  },
  graduationYear: {
    type: DataTypes.STRING
  }
});

module.exports = User;
