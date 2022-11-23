const AWS = require('aws-sdk');
const write = require('./db_operations').write;

jest.setTimeout(10000);

function getDataFromDb() {
  let resolve;
  let reject;
  const promise = new Promise((_res, _rej) => {
    resolve = _res;
    reject = _rej;
  });

  // Set the region
  AWS.config.update({ region: 'us-east-1' });

  // Create the DynamoDB service object
  const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

  const params = {
    TableName: 'CUSTOMER_LIST',
    Key: {
      'CUSTOMER_ID': { S: '001' },
      'CUSTOMER_NAME': { S: 'Richard Roe' }
    }
  };

  // Call DynamoDB to read the item from the table
  ddb.getItem(params, function (err, data) {
    if (err) {
      console.log('error while reading from DB')
      console.log(err);
      reject();
    } else {
      console.log("Success", data.Item);
      resolve(data.Item);
    }
  });

  return promise;
}

test('writes without error', async () => {
  await write(1, 2);
  const data = await getDataFromDb();
  console.log(data);

  expect(data.CUSTOMER_ID.S).toBe('001');
  expect(data.CUSTOMER_NAME.S).toBe('Richard Roe');
});
