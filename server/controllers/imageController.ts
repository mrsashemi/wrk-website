import { Request, Response } from "express";
import { Db, ObjectId } from "mongodb";
import db from "../databases/mongo";
const { uploadFile, getFileStream, deleteFileFromS3 } = require('../databases/s3');
import sharp, { Metadata } from 'sharp';
import path from 'path';

interface MulterRequest extends Request {
    file: any;
}

async function processAndUploadImage(file: any, buffer: any, resolutions: any, type: any) {
    let result = [];
    let name = path.parse(file.originalname).name

    try {
        // get metadata and check the orientation in order to determine the appropriate size
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
    const resolutions = [
        {name: "1536", res: 1536},
        {name: "320", res: 320}
    ]

    try {
        const file = (req as MulterRequest).file;
        const images: any = await processAndUploadImage(file, file.buffer, resolutions, "original");
    
        let collection = (await db as Db).collection("originals");
        let img = {
            type: "originals",
            original: images[0].Location,
            thumbnail: images[1].Location,
            keys: {original: images[0].Key, thumbnail: images[1].Key},
            date: new Date(),
        };
    
        let result = await collection.insertOne(img);
        if (result) res.send(result).status(200);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Database error while creating image"
        })
    }
}

exports.saveArtwork = async (req: Request, res: Response): Promise<any> => {
    const resolutions = [
        {name: "1280", res: 1280},
        {name: "1024", res: 1024},
        {name: "768", res: 768},
        {name: "640", res: 640}
    ]

    try {
        const file = (req as MulterRequest).file;
        const images: any = await processAndUploadImage(file, file.buffer, resolutions, "original");
        let collection = (await db as Db).collection("artworks");
        let img = req.body;
    
        img.primary.res_640 = {url: images[3].Location, name: images[3].Key, res: 640}
        img.primary.res_768 = {url: images[2].Location, name: images[2].Key, res: 768 }
        img.primary.res_1024 = {url: images[1].Location, name: images[1].Key, res: 1024}
        img.primary.res_1280 = {url: images[0].Location, name: images[0].Key, res: 1280}
        img.date = new Date();
    
        let result = await collection.insertOne(img);
        if (result) res.send(result).status(200);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Database error while creating new artwork"
        })
    }
}

exports.savePhoto = async (req: Request, res: Response): Promise<any> => {
    const resolutions = [
        {name: "1280", res: 1280},
        {name: "1024", res: 1024},
        {name: "768", res: 768},
        {name: "640", res: 640}
    ]
  
    try {
        let img = req.body;
        if (img.edited) {
            resolutions.unshift({name: "1536", res: 1536})
            resolutions.push({name: "320", res: 320})
        } 

        const file = (req as MulterRequest).file;
        const images: any = await processAndUploadImage(file, file.buffer, resolutions, (img.edited) ? "edit" : "original");
        let collection = (await db as Db).collection("photographs");

        img.resolutions.res_640 = {url: images[(img.edited) ? 4 : 3].Location, name: images[3].Key, res: 640}
        img.resolutions.res_768 = {url: images[(img.edited) ? 3 : 2].Location, name: images[2].Key, res: 768 }
        img.resolutions.res_1024 = {url: images[(img.edited) ? 2 : 1].Location, name: images[1].Key, res: 1024}
        img.resolutions.res_1280 = {url: images[(img.edited) ? 1 : 0].Location, name: images[0].Key, res: 1280}
        if (img.edited) {
            img.resolutions.res_320 = {url: images[5].Location, name: images[5].Key, res: 320}
            img.resolutions.res_1536 = {url: images[0].Location, name: images[0].Key, res: 1536}
        }

        img.date = new Date();
    
        let result = await collection.insertOne(img);
        if (result) res.send(result).status(200);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Database error while creating new artwork"
        })
    }
}

exports.saveSketch = async (req: Request, res: Response): Promise<any> => {
    const resolutions = [
        {name: "full", res: 1536},
        {name: "thumbnail", res: 320}
    ]

    const file = (req as MulterRequest).file;
    const images: any = processAndUploadImage(file, file.buffer, resolutions, "original");

    let collection = (await db as Db).collection("sketches");
    let img = req.body;

    img.resolutions = {
        res_320: {url: images[5].Location, name: images[5].Key},
        res_640: {url: images[4].Location, name: images[4].Key},
        res_768: {url: images[3].Location, name: images[3].Key},
        res_1024: {url: images[2].Location, name: images[2].Key},
        res_1280: {url: images[1].Location, name: images[1].Key},
        res_1536: {url: images[0].Location, name: images[0].Key},
    }
    img.date = new Date();

    let result = await collection.insertOne(img);
    res.send(result).status(204);
}

exports.saveSprites = async (req: Request, res: Response): Promise<any> => {
    const resolutions = [
        {name: "full", res: 1536},
        {name: "thumbnail", res: 320}
    ]
    const file = (req as MulterRequest).file;
    let type = req.body.type;

    const images: any = processAndUploadImage(file, file.buffer, resolutions, "original");

    let collection = (await db as Db).collection(type);
    let img = req.body;

    if (type === "originals") {
        img.original = images[0].Location;
        img.thumbnail = images[1].Location;
        img.keys = {original: images[0].Key, thumbnail: images[1].Key}
    } else {
        img.resolutions = {
            res_320: {url: images[5].Location, name: images[5].Key},
            res_640: {url: images[4].Location, name: images[4].Key},
            res_768: {url: images[3].Location, name: images[3].Key},
            res_1024: {url: images[2].Location, name: images[2].Key},
            res_1280: {url: images[1].Location, name: images[1].Key},
            res_1536: {url: images[0].Location, name: images[0].Key},
        }
    }

    img.date = new Date();

    let result = await collection.insertOne(img);
    res.send(result).status(204);
}



// read all images 
exports.readAllImgs = async (req: Request, res: Response): Promise<any> => {
    let type = req.body.type;
    let collection = (await db as Db).collection(type);
    let results = await collection.find({}).toArray();
  
    res.send(results).status(200);
}

// read one image 
exports.readOneImg = async (req: Request, res: Response): Promise<any> => {
    let type = req.body.type;
    let collection = (await db as Db).collection(type);
    let query = {_id: new ObjectId(req.params.id)};
    let result = await collection.findOne(query);
  
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
}

// update one image 
exports.updateOneImg = async (req: Request, res: Response): Promise<any> => {
    let type = req.body.type;
    let collection = (await db as Db).collection(type);
    let updates: any;

    let query = {_id: new ObjectId(req.params.id)};
    let result = await collection.updateOne(query, updates);
    
    res.send(result).status(200);
}

// delete one image 
exports.deleteOneImg = async (req: Request, res: Response): Promise<any> => {
    let type = req.body.type;
    let collection = (await db as Db).collection(type);
    let query = {_id: new ObjectId(req.params.id)};
    let result = await collection.deleteOne(query);
    
    res.send(result).status(200);
}
