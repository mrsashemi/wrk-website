import { Request, Response } from "express";
import { Db, ObjectId } from "mongodb";
import db from "../databases/mongo";
const { uploadFile, getFileStream, deleteFileFromS3 } = require('../databases/s3');
import sharp, { Metadata } from 'sharp';
import path from 'path';

interface multerFile {
    buffer: Buffer, 
    encoding: string, 
    fieldname: string, 
    mimetype: string, 
    originalname: string, 
    size: number;
};

interface MulterRequest extends Request {
    file: multerFile;
}

interface ResArray {
    name: string,
    res: number
}

// worker function that processes image into various sizes and into webp format prior to upload to s3
async function processAndUploadImage(file: multerFile, buffer: Buffer, resolutions: ResArray[], type: string, name: string) {
    let result = [];

    try {
        // get metadata and ck the orientation in order to determine the appropriate size
        const metadata: Metadata = await sharp(file.buffer).metadata();
        let landscape: boolean = true;
        let ratio: number;

        if ((metadata.width as number) > (metadata.height as number)) {
            ratio = (metadata.height as number)/(metadata.width as number)
        } else {
            landscape = false;
            ratio = (metadata.width as number)/(metadata.width as number);
        }

        for (let i = 0; i < resolutions.length; i++) {
            let s3result;
            let w;
            let h;

            // set the width and height according to the passed resolutions array
            if (landscape) {
                w = resolutions[i].res;
                h = Math.floor(resolutions[i].res * ratio);
            } else {
                w = Math.floor(resolutions[i].res * ratio);
                h = resolutions[i].res;
            }

            // use sharp to create a new image
            const image = await sharp(buffer)
                .resize({
                    width: w,
                    height: h
                })
                .toFormat("webp")
                .webp({quality: 80})
                .toBuffer()

            // set the file buffer to the newly created image and pass to s3
            if (image) {
                file.buffer = image
                s3result = await uploadFile(file, type+"_"+resolutions[i].name+"_"+name+".webp");
                if (s3result) result.push(s3result);
            }
        }

        if (result.length) return result;
    } catch (error) {
        console.log(`An error occurred during processing: ${error}`);
    }
}


// save original image to S3 bucket and originals collection in mongodb
exports.saveImg = async (req: Request, res: Response): Promise<any> => {
    const resolutions: ResArray[] = [
        {name: "1536", res: 1536},
        {name: "1280", res: 1280},
        {name: "1024", res: 1024},
        {name: "768", res: 768},
        {name: "640", res: 640},
        {name: "320", res: 320}
    ]

    try {
        const file = (req as MulterRequest).file;
        let name = path.parse(file.originalname).name

        const images: any = await processAndUploadImage(file, file.buffer, resolutions, "original", name);
    
        let collection = (await db as Db).collection("originals");
        let img = {
            type: "originals",
            resolutions: {
                res_1536: {url: images[0].Location, key: images[0].Key},
                res_1280: {url: images[1].Location, key: images[1].Key},
                res_1024: {url: images[2].Location, key: images[2].Key},
                res_768: {url: images[3].Location, key: images[3].Key},
                res_640: {url: images[4].Location, key: images[4].Key},
                res_320: {url: images[5].Location, key: images[5].Key},
            },
            name: name,
            date: new Date(),
        };
    
        let result = await collection.insertOne(img);

        if (result) {
            (result as any).img = img

            res.send(result).status(200);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Database error while creating image"
        })
    }
}

exports.saveArtwork = async (req: Request, res: Response): Promise<any> => {
    try {
        let img = req.body;
        let collection = (await db as Db).collection("artworks");
        img.date = new Date();
        let result = await collection.insertOne(img);

        if (result) {
            (result as any).img = img
            res.send(result).status(200);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Database error while creating new artwork"
        })
    }
}

exports.savePhoto = async (req: Request, res: Response): Promise<any> => {
    const resolutions: ResArray[] = [
        {name: "1536", res: 1536},
        {name: "1280", res: 1280},
        {name: "1024", res: 1024},
        {name: "768", res: 768},
        {name: "640", res: 640},
        {name: "320", res: 320}
    ]

    try {
        let img = req.body;
        let images: any;
        const file = (req as MulterRequest).file;

        if (file) {
            images = await processAndUploadImage(file, file.buffer, resolutions, "edit", img.name);
            img.resolutions = {
                res_1536: {url: images[0].Location, key: images[0].Key},
                res_1280: {url: images[1].Location, key: images[1].Key},
                res_1024: {url: images[2].Location, key: images[2].Key},
                res_768: {url: images[3].Location, key: images[3].Key},
                res_640: {url: images[4].Location, key: images[4].Key},
                res_320: {url: images[5].Location, key: images[5].Key},
            }
        }
        img.date = new Date();

        let collection = (await db as Db).collection("photographs");
        let result = await collection.insertOne(img);

        if (result) {
            (result as any).img = img
            res.send(result).status(200);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Database error while creating new photo"
        })
    }
}

exports.saveSketch = async (req: Request, res: Response): Promise<any> => {
    const resolutions: ResArray[] = [
        {name: "1536", res: 1536},
        {name: "1280", res: 1280},
        {name: "1024", res: 1024},
        {name: "768", res: 768},
        {name: "640", res: 640},
        {name: "320", res: 320}
    ]

    try {
        let img = req.body;
        const file = (req as MulterRequest).file;
        const images: any = await processAndUploadImage(file, file.buffer, resolutions, "sketch", img.name);
        let collection = (await db as Db).collection("sketches");

        img.resolutions = {
            res_320: {url: images[5].Location, key: images[5].Key},
            res_640: {url: images[4].Location, key: images[4].Key},
            res_768: {url: images[3].Location, key: images[3].Key},
            res_1024: {url: images[2].Location, key: images[2].Key},
            res_1280: {url: images[1].Location, key: images[1].Key},
            res_1536: {url: images[0].Location, key: images[0].Key},
        }
        img.date = new Date();
        let result = await collection.insertOne(img);

        if (result) {
            (result as any).img = img
            res.send(result).status(200);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Database error while creating new sketch"
        })
    }
}

exports.saveSprites = async (req: Request, res: Response): Promise<any> => {
    try {
        const file = (req as MulterRequest).file;
        let img = req.body;
        let s3result = await uploadFile(file, "sprites_"+img.element+"_"+file.originalname);
        img.sprites = {url: s3result.Location, key: s3result.Key}
        img.date = new Date();
    
        let collection = (await db as Db).collection("sprites");
        let result = await collection.insertOne(img);
    
        if (result) {
            (result as any).img = img
            res.send(result).status(200);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Database error while creating new sprites"
        })
    }
}

// read all images metadata
exports.readAllImgs = async (req: Request, res: Response): Promise<any> => {
    try {
        let type = req.params.type;
        let collection = (await db as Db).collection(type);
        let results = await collection.find({}).toArray();

        if (results) res.send(results).status(200); 
        else res.send("Not found").status(404);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Database error while retrieving images"
        })
    }
}

// read one image metadata
exports.readOneImg = async (req: Request, res: Response): Promise<any> => {
    try {
        let img = JSON.parse(decodeURIComponent(req.params.img))
        let collection = (await db as Db).collection(img.type);
        let query = {_id: new ObjectId(img.id)};
        let result = await collection.findOne(query);

        if (!result) res.send("Not found").status(404);
        else res.send(result).status(200);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Database error while retrieving image"
        })
    }  
}

// read image data from s3
exports.readFromS3 = async (req: Request, res: Response): Promise<any> => {
    try {
        const key = req.params.key;
        const readStream = getFileStream(key)

        readStream.pipe(res);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Database error while retrieving image"
        })
    }  
}

// update one image 
exports.updateOneImg = async (req: Request, res: Response): Promise<any> => {
  try {
    let img = JSON.parse(decodeURIComponent(req.params.img))
    let collection = (await db as Db).collection(img.type);
    let query = {_id: new ObjectId(img.id)};
    let updates = [{$set: req.body}]
    let result = await collection.updateOne(query, updates, {upsert: false});
    
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({
        error: "Database error while retrieving image"
    })
  }
}

// delete one image 
exports.deleteOneImg = async (req: Request, res: Response): Promise<any> => {
    try {
        let img = JSON.parse(decodeURIComponent(req.params.img))
        let collection = (await db as Db).collection(img.type);
        let query = {_id: new ObjectId(img.id)};
        let result = await collection.deleteOne(query);


        if (result) {
            if (img.toDelete) {
                for (const s3img in img.toDelete) {
                    await deleteFileFromS3(img.toDelete[s3img].key)
                }
            }

            res.send(result).status(200); 
        } else {
            res.send("Not found").status(404);
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Database error while retrieving image"
        })
    }
}
