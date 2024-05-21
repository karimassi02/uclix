// connection.js
const mongoose = require("mongoose");
const Movie = require("../models/movieModel");
const connection = "mongodb://localhost:27017/Uclix";
const connectDb = () => {
  return mongoose.connect(connection);
};
module.exports = connectDb;
