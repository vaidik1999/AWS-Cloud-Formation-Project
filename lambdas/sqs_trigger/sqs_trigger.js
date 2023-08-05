const AWS = require("aws-sdk");
// const bcrypt = require("bcryptjs");

const AWS_DEFAULT_REGION = process.env.REGION;
const TABLE_NAME = process.env.TABLE_NAME;

AWS.config.update({
  region: AWS_DEFAULT_REGION,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log(event["Records"]);

  if (event["Records"] && event["Records"].length > 0) {
    const { body } = event["Records"][0];

    const { name, email, password, salary, address } = JSON.parse(body);

    // console.log(name, email, password, salary);

    const params = {
      TableName: TABLE_NAME,
      Key: {
        id: email,
        type: "user",
      },
    };

    try {
      const { Item } = await dynamoDB.get(params).promise();
      if (Item) {
        console.log("email already exist");
        const response = {
          statusCode: 400,
          body: JSON.stringify("email alrelady exist"),
        };
        return response;
      }
    } catch (error) {
      console.log(error);
      const response = {
        statusCode: 500,
        body: JSON.stringify("error occured while fetching from dynamo"),
      };
      return response;
    }

    // password = await bcrypt.hash(password, 10);

    const item = {
      TableName: TABLE_NAME,
      Item: {
        id: email,
        name,
        password,
        salary,
        address,
        type: "user",
      },
    };

    const data = await dynamoDB.put(item).promise();

    const response = {
      statusCode: 200,
      body: JSON.stringify("There is a record to insert"),
    };
    return response;
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify("No record to insert"),
  };
  return response;
};
