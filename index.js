//Requiring all the needed modules
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

//Importing MongoDB schema
const HiringChallenge = require('./models/hiringChallenge');
const Post = require('./models/post');

//Setting up PORT
const port = process.env.port || 3000;

//to store image URL from Digital Ocean and the image mongodb id
let imageURL;
let image_id;

//TESTING
const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com/test2')
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.SPACES_ID_KEY,
    secretAccessKey: process.env.SPACES_SECRET_KEY,
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'csite',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            console.log(file);
            //file name should be mongodb id
            // cb(null, file.originalname)
            cb(null, image_id);
        },
    }),
}).single('file')

//connecting to MongoDB DataBase
mongoose.connect('mongodb://localhost:27017/collabi-test');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Data Base Connected to Index.js collabi-test');
});

const app = express();
app.use(express.urlencoded({ extended: true }));

//post Hiring Challenge
app.post('/api/hiringChallenge', async (req, res, next) => {
    try{
        const post = req.body.post;
        const newHiringChallenge = await new HiringChallenge(post);
        await newHiringChallenge.save();
        console.log('New Hiring Challenge Saved -> _id : ' + newHiringChallenge._id);
        res.status(200).json({post});
    } catch(err) {
        console.log('Error :' + err);
        res.send(err);
    }
});

// app.post('/api/uploadImage', async (req, res) => {
//     await upload(req, res, (err) => {
//         if (err || req.file == undefined) {
//             console.log(err)
//             return res.status(400).json({ errors: err })
//         }
//         console.log(req.file)
//         return res.status(200).json({ url: req.file.location })
//     })
// });

app.post('/api/post', async (req, res, next) => {
    try{
        const post = {};
        post[title] = req.body.title;
        post[companyName] = req.body.companyName;
        post[description] = req.body.body;
        const[websiteLink] = req.body.companyLink;
        const newPost = await new Post(post);
        await newPost.save();
        image_id = newPost._id;
        const postImage = req.body;
        await upload(req, res, (err) => {
            if (err || req.file == undefined) {
                console.log(err);
            }else {
                console.log(req.file)
                imageURL = req.file.location;
                // return res.status(200).json({ url: req.file.location })
            }
        })
        newPost.uploadImage = imageURL;
        post[image] = imageURL;
        console.log('New Post Saved -> _id : ' + newPost._id);
        res.status(200).json({post});
    } catch(err) {
        console.log('Error :' + err);
        res.send(err);
    }
})

app.listen(port, () => {
    console.log(`Server Listening at ${port}`);
})