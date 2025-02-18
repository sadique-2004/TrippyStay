const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String,
        // required: true,  // adding required to ensure a comment is provided
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,  // adding required to ensure a rating is provided
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

module.exports = mongoose.model("Review", reviewSchema);
