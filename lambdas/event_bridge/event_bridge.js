const AWS = require("aws-sdk");
const sns = new AWS.SNS();

const SNS_ARN = process.env.SNS_ARN;

exports.handler = async (event, context) => {
  const employeeEmail = event.email; // Make sure the 'email' field is sent in the EventBridge event

  const message =
    "Your employee profile completion reminder. Please complete your profile.";

  const params = {
    Message: message,
    TopicArn: SNS_ARN, // Replace with the ARN of the SNS topic you created in Step 1
  };

  try {
    await sns.publish(params).promise();
    return {
      statusCode: 200,
      body: "SNS message sent successfully.",
    };
  } catch (error) {
    console.error("Error sending SNS message", error);
    return {
      statusCode: 500,
      body: "Failed to send SNS message.",
    };
  }
};
