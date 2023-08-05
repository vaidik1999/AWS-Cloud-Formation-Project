const AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
});

const TABLE_NAME = process.env.TABLE_NAME;

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const getUserByEmail = async (email) => {
  console.log("get user by email", email);
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: email,
      type: "user",
    },
  };

  try {
    const { Item } = await dynamoDB.get(params).promise();
    return Item;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

const createUser = async (user) => {
  const params = {
    TableName: TABLE_NAME,
    Item: user,
  };

  try {
    await dynamoDB.put(params).promise();
    console.log("User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

module.exports = {
  getUserByEmail,
  createUser,
};
