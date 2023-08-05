const AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
});

console.log(process.env.AWS_DEFAULT_REGION);

exports.documentClient = new AWS.DynamoDB.DocumentClient();
exports.snsClient = new AWS.SNS();
exports.sqsClient = new AWS.SQS();
