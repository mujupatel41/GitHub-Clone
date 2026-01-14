const AWS = require("aws-sdk");

AWS.config.update({region: "eu-north-1"});

const s3 = AWS.S3();

const S3_BUCKET = "mygitbucket41";

module.exports = { s3, S3_BUCKET };