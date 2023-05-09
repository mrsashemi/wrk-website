require('dotenv').config();
const S3 = require('aws-sdk/clients/s3');

const s3 = new S3();

// uploads a file to s3
function uploadFile(file: any, name: string) {
    //const fileStream = streamifier.createReadStream(file.buffer).pipe(process.stdout);
    //const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: file.buffer,
        Key: name
    }

    return s3.upload(uploadParams).promise();
}

exports.uploadFile = uploadFile

// downlaods a file from s3
function getFileStream(fileKey: any) {
    const downloadParams = {
        Key: fileKey,
        Bucket: process.env.AWS_BUCKET_NAME,   
    }

    return s3.getObject(downloadParams).createReadStream();
}

exports.getFileStream = getFileStream

function deleteFileFromS3(fileKey: any) {
    const deleteParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey
    }

    return s3.deleteObject(deleteParams).promise();
} 

exports.deleteFileFromS3 = deleteFileFromS3