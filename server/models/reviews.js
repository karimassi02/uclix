const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;