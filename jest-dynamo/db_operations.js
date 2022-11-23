const AWS = require("aws-sdk");

function setupDbConnection() {
  let resolve;
  let reject;
  const promise = new Promise((_res, _rej) => {
    resolve = _res;
    reject = _rej;
  });

  // Set the region
  AWS.config.update({ region: 'us-east-1' });

  AWS.config.getCredentials(function (err) {
    if (err) {
      console.log('credentials not loaded');
      console.log(err.stack);
      reject();
    } else {
      console.log("Access key:", AWS.config.credentials.accessKeyId);

      // Create the DynamoDB service object
      const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

      resolve(ddb);
    }
  });

  return promise;
}

function writeToDb(ddb) {
  let resolve;
  let reject;
  const promise = new Promise((_res, _rej) => {
    resolve = _res;
    reject = _rej;
  });

  const params = {
    TableName: 'CUSTOMER_LIST',
    Item: {
      'CUSTOMER_ID': { S: '001' },
      'CUSTOMER_NAME': { S: 'Richard Roe' }
    }
  };

  // Call DynamoDB to add the item to the table
  ddb.putItem(params, function (err, data) {
    if (err) {
      console.log('error while writing to DB')
      console.log(err);
      reject();
    } else {
      console.log("Success", data);
      resolve(data);
    }
  });

  return promise;
}

function write(a, b) {
  let resolve;
  let reject;
  const promise = new Promise((_res, _rej) => {
    resolve = _res;
    reject = _rej;
  });

  setupDbConnection()
    .then((ddb) => {
      writeToDb(ddb)
        .then((data) => {
          resolve(data);
        })
        .catch(() => {
          reject();
        });
    })
    .catch(() => {
      reject();
    });

  return promise;
}

module.exports = {
  write
};
