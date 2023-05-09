import express, { Router, Request, Response } from "express";
const multer = require('multer');
const {saveImg} = require('../controllers/imageController');
const router = express.Router();

// storage variable to upload file and provide destination folder
const storage = multer.memoryStorage({
    destination: function (req: Request, file: Response, cb: any) {
        cb(null, '')
    }
})

// below variable is defined to check the type of file which is uploaded
const filefilter = (req: Request, file: any, cb: any) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/JPG' || file.mimetype === 'image/png' || file.mimetype === 'image/PNG') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}


// define the upload variable for the configuration of photo being uploaded
const upload = multer({storage: storage, fileFilter: filefilter});
router.post('/save-image', upload.single('image'), saveImg);

module.exports = router;