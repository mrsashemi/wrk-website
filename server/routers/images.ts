import express, { Router, Request, Response } from "express";
const multer = require('multer');
const {saveImg, saveArtwork, savePhoto, saveSketch, saveSprites, readAllImgs, readOneImg, updateOneImg, deleteOneImg, readFromS3} = require('../controllers/imageController');
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

// post requests
router.post('/save-image', upload.single('image'), saveImg);
router.post('/save-artwork', saveArtwork);
router.post('/save-photo', upload.single('image'), savePhoto);
router.post('/save-sketch', upload.single('image'), saveSketch);
router.post('/save-sprites', upload.single('image'), saveSprites);

// get requests
router.get('/all-images/:type', readAllImgs)
router.get('/single-image/:img', readOneImg)
router.get('/image/:key', readFromS3)

// patch requests
router.patch('/update-image/:img', updateOneImg)

// delete requests 
router.delete('/delete-image/:img', deleteOneImg)

module.exports = router;