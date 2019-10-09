const AWS = require("aws-sdk");

AWS.config.loadFromPath("./config.json");
const docClient = new AWS.DynamoDB.DocumentClient();

const post = params => {
  return new Promise((resolve, reject) => {
    docClient.put(params, (err, data) => {
      if (err) {
        reject({
          statusCode: 500,
          body: JSON.stringify({
            code: err.code,
            message: err.message
          })
        });
      } else {
        resolve({ statusCode: 200, body: JSON.stringify(data) });
      }
    });
  });
};

module.exports = {
  post
};
