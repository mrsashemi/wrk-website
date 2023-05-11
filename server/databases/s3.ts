require('dotenv').config();
const S3 = require('aws-sdk/clients/s3');

const s3 = new S3();

interface multerFile {
    buffer: Buffer, 
    encoding: string, 
    fieldname: string, 
    mimetype: string, 
    originalname: string, 
    size: number;
};

// uploads a file to s3
function uploadFile(file: multerFile, name: string) {
    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: file.buffer,
        Key: name
    }

    return s3.upload(uploadParams).promise();
}

exports.uploadFile = uploadFile

// downlaods a file from s3
function getFileStream(fileKey: string) {
    const downloadParams = {
        Key: fileKey,
        Bucket: process.env.AWS_BUCKET_NAME,   
    }

    return s3.getObject(downloadParams).createReadStream();
}

exports.getFileStream = getFileStream

function deleteFileFromS3(fileKey: string) {
    const deleteParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey
    }

    return s3.deleteObject(deleteParams).promise();
} 

exports.deleteFileFromS3 = deleteFileFromS3