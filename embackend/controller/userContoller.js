const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const request = require("request");
const { getUserByEmail } = require("../config/documentdb");
const { documentClient, snsClient, sqsClient } = require("../config/config");
const response = require("../utils/response");
const parse = require("csv-parse").parse;
const fs = require("fs");
const eventBridge = new AWS.EventBridge();
const queueUrl = process.env.QUEUE_ARN;
const SNS_ARN = process.env.SNS_ARN;
const TABLE_NAME = process.env.TABLE_NAME;

const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return response(res, 409, false, { message: "User already exists" });
    }

    if (password !== confirmPassword) {
      return response(res, 409, false, { message: "Password doesn't match." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const params = {
      TableName: TABLE_NAME,
      Item: {
        type: "user",
        id: email,
        name: name,
        password: hashedPassword,
        confirmPassword: hashedPassword,
        role: "admin",
      },
    };

    await documentClient.put(params).promise();

    return response(res, 201, true, { message: "User created successfully" });
  } catch (error) {
    console.error("Error during registration", error);
    return response(res, 500, false, { message: "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
      return response(res, 401, true, { message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return response(res, 401, true, {
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d",
    });

    return response(res, 200, true, {
      token,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    return response(res, 500, false, { message: "Login failed" });
  }
};

const addEmployee = async (req, res) => {
  try {
    const { name, email, password, salary, address } = req.body;
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return response(res, 409, true, { message: "Employee already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      TableName: TABLE_NAME,
      Item: {
        type: "user",
        CreationTime: new Date().toISOString(),
        name: name,
        id: email,
        password: hashedPassword,
        confirmPassword: hashedPassword,
        salary,
        address,
        role: "employee",
      },
    };

    const snsResponse = await snsClient
      .publish({
        Message:
          "Hello " + name + ",\nEmployee account has been created successfully",
        TopicArn: SNS_ARN,
        Subject: "Employee Created",
      })
      .promise();

    await documentClient.put(newUser).promise();
    const subscriptionParams = {
      Protocol: "email",
      TopicArn: SNS_ARN,
      Endpoint: email,
    };

    await snsClient.subscribe(subscriptionParams).promise();

    return response(res, 201, true, {
      message: "Employee created successfully",
    });
  } catch (error) {
    console.error("Error during user creation", error);
    return response(res, 500, false, { message: "Employee creation failed" });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { name, email, salary, address } = req.body;
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return response(res, 404, false, { message: "Employee not found" });
    }

    const updatedUser = {
      TableName: TABLE_NAME,
      Key: {
        type: "user",
        id: email,
      },
      UpdateExpression:
        "SET #name = :name, salary = :salary, address = :address",
      ExpressionAttributeValues: {
        ":name": name,
        // ":password": await bcrypt.hash(password, 10),
        ":salary": salary,
        ":address": address,
      },
      ExpressionAttributeNames: {
        "#name": "name",
      },
      ReturnValues: "ALL_NEW",
    };

    const snsResponse = await snsClient
      .publish({
        Message:
          "Hello " + name + ",\nEmployee account has been updated successfully",
        TopicArn: SNS_ARN,
        Subject: "Employee Updated",
      })
      .promise();

    await documentClient.update(updatedUser).promise();

    return response(res, 200, true, {
      message: "Employee updated successfully",
    });
  } catch (error) {
    console.error("Error during user update", error);
    return response(res, 500, false, { message: "Employee update failed" });
  }
};

const addEmployees = async (req, res) => {
  try {
    console.log(req.file);
    if (!req.file) {
      return response(res, 400, false, { message: "CSV file is required." });
    }

    const file = req.file;

    const employeeDataArray = [];

    const data = fs.readFileSync(file.path);
    parse(data, async (err, records) => {
      if (err) {
        console.error(err);
        return res
          .status(400)
          .json({ success: false, message: "An error occurred" });
      }

      try {
        const chunkSize = 10;
        for (let i = 1; i < records.length; i += chunkSize) {
          const chunk = records.slice(i, i + chunkSize);
          const sqsParams = {
            QueueUrl: queueUrl,
            Entries: chunk.map((employeeData, index) => ({
              Id: `${index + 1}`,
              MessageBody: JSON.stringify({
                name: employeeData[0],
                email: employeeData[1],
                password: employeeData[2],
                salary: employeeData[3],
                address: employeeData[4],
              }),
            })),
          };

          const a = await sqsClient.sendMessageBatch(sqsParams).promise();
        }

        return response(res, 201, true, {
          message:
            "Employee creation requests processed and queued successfully",
        });
      } catch (error) {
        console.error("Error parsing CSV file", error);
        return response(res, 500, false, { message: "Error parsing CSV file" });
      }

      return res.json({ data: records });
    });
  } catch (error) {
    console.error("Error during employee creation", error);
    return response(res, 500, false, {
      message: "Employee creation failed",
    });
  }
};

const deleteEmployee = async (req, res) => {
  let message;

  try {
    const { email } = req.body;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return response(res, 404, false, { message: "Employee not found" });
    }

    const deleteUserParams = {
      TableName: TABLE_NAME,
      Key: {
        type: "user",
        id: email,
      },
    };

    const snsResponse = await snsClient
      .publish({
        Message:
          "Hello " +
          email +
          ",\nEmployee account has been deleted successfully",
        TopicArn: SNS_ARN,
        Subject: "Employee Deleted",
      })
      .promise();

    const listSubscriptionsParams = {
      TopicArn: SNS_ARN,
    };

    const subscriptions = await snsClient
      .listSubscriptionsByTopic(listSubscriptionsParams)
      .promise();

    const subscription = subscriptions.Subscriptions.find(
      (sub) => sub.Endpoint === email
    );
    if (subscription) {
      await documentClient.delete(deleteUserParams).promise();
      if (subscription.SubscriptionArn === "PendingConfirmation") {
        message = "Employee deleted successfully;";
      } else {
        const unsubscribeParams = {
          SubscriptionArn: subscription.SubscriptionArn,
        };

        await snsClient.unsubscribe(unsubscribeParams).promise();
        message = "Employee deleted successfully;";
      }
    }

    return response(res, 200, true, {
      message,
    });
  } catch (error) {
    console.error("Error during user deletion", error);
    return response(res, 500, false, { message: "Employee deletion failed" });
  }
};

const getEmployee = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return response(res, 404, false, { message: "Employee not found" });
    }

    const params = {
      TableName: TABLE_NAME,
      Key: {
        type: "user",
        id: email,
      },
      ProjectionExpression: "name, email, salary, address",
    };

    const result = await documentClient.get(params).promise();
    const userData = result.Item;

    return response(res, 200, true, { userData });
  } catch (error) {
    console.error("Error fetching employee data", error);
    return response(res, 500, false, {
      message: "Failed to fetch employee data",
    });
  }
};

const getEmployees = async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME,
    };

    const result = await documentClient.scan(params).promise();
    const employeesData = result.Items;

    if (employeesData.length === 0) {
      return response(res, 404, false, { message: "No employees found" });
    }

    return response(res, 200, true, { employeesData });
  } catch (error) {
    console.error("Error fetching employees data", error);
    return response(res, 500, false, {
      message: "Failed to fetch employees data",
    });
  }
};

module.exports = {
  register,
  login,
  addEmployee,
  addEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployee,
  getEmployees,
};
