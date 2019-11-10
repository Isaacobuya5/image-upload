const express = require('express');
const cloudinary = require('cloudinary').v2;
//const multipart = require('connect-multiparty');
// const multipartMiddleware = multipart();

const app = express();
const multer = require('multer');
const port = 3000;



const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        console.log(file);
        cb(null, file.originalname);
    }
});

cloudinary.config({
    cloud_name: 'isaacobuya5',
    api_key: '227988723278481',
    api_secret: '2lx57iSju8-TbGJ-Dbz_1d14Yvc'
});

app.get('/', (req, res) => res.send({message: "Hello, welcome to my server!"}));

app.post('/upload', (req, res, next) => {
    const upload = multer({ storage }).single('photo')
    upload(req, res, function(err) {
        if (err) {
            return res.send(err);
        }
        console.log("file uploaded succesfully to the server");
        console.log(req.file);
// SEND FILE TO CLOUDINARY
        const path = req.file.path;
        const uniqueFilename = new Date().toISOString()

    cloudinary.uploader.upload(path, 
        { public_id: `blog/${uniqueFilename}`, tags: `blog` },
        function(err, image) {
            if (err) return res.send(err)
            console.log('file uploaded to cloudinary')
            //remove file from the server
            const fs = require('fs');
            fs.unlinkSync(path);
            //return image details
            res.json(image);
    });
    })
});

app.listen(port, () => console.log('Server is running'));
