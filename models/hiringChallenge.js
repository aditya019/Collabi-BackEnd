const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hiringChallengeSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxLength: 50
    },
    level : {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    description: {
        type: String,
        required: true,
        maxLength: 500
    },
    about: {
        type: String,
        required: true,
        maxLength: 100
    },
    tags: {
        type: [String],
        required: true,
    }
});

module.exports = mongoose.model('HiringChallenge', hiringChallengeSchema);