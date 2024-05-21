const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PeopleSchema = new Schema({
  familyname: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
});

const People = mongoose.model("People", PeopleSchema);

module.exports = People;
