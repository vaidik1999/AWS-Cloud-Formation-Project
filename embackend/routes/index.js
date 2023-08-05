const router = require("express").Router();
const adminManager = require("./admin/adminManager");
const response = require("../utils/response");

router.use("/admin", adminManager);

router.get("/test", (req, res) => {
  return response(res, 201, true, {
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    queueArn: process.env.QUEUE_ARN,
    snsArn: process.env.SNS_ARN,
    tableName: process.env.TABLE_NAME,
  });
});

module.exports = router;
