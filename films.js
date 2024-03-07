const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const UserShema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    genre: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('User', UserShema);