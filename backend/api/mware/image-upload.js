const multer = require('multer');
const fs = require('fs');
const https = require('https');
const request = require('request');
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './tmp/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname.replace(/\s/g, ''))
    }
});

const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
        cb(new Error("File type not supported"), false);
    else {
        cb(null, true);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}).single('image');

module.exports = async (req, res, next) => {
    try {
        await upload(req, res, async (err) => {
            try {
                if (err) {
                    throw new Error(err.message);
                } else {
                    const formData = {
                        // Pass data via Streams
                        image: fs.createReadStream(req.file.path),
                    };
                    await request.post({
                        url: process.env.FILE_STORAGE,
                        formData: formData
                    }, async function optionalCallback(err, httpResponse, body) {
                        if(!req.file) {
                            next();
                        } else {
                            body = JSON.parse(body);
                            console.log(body);
                            if (err) {
                                throw new Error(err)
                            }

                            if(httpResponse.statusCode != 200) {
                                throw new Error(body.message)
                            }

                            await unlinkAsync(req.file.path);
                            req.file = body.filename;
                            next();
                        }
                    });
                }
            } catch (err) {
                console.log("Error: " + err.message);
                return res.status(500).json({ error:err.message });
            }
        });
    } catch (err) {
        console.log("Error: " + err.message);
        return res.status(500).json({ error:err.message });
    }
}

