const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    studio: {
        type: String,
        required: true
    },
    people: [{
        name:{
            type:String,
            required:true
        },
        role: {
            type: String,
            required: true
        }
    }],
    category: {
        type: String,
        required: true
    },
    review: [{
        user: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        }
    }],
    tag: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    }
});

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;