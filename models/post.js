const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    companyName: {
        type: String,
        required: true,
        maxLength: 50
    },
    title: {
        type: String,
        required: true,
        maxLength: 100
    },
    uploadImage : {
        type: String, // Since we will be storing the url of the image
        // required: true
    },
    description: {
        type: String,
        required: true,
        maxLength: 500
    },
    websiteLink: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Post', postSchema);