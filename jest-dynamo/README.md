# test dynamo write using jest

This little demo shows:

- how to test Node.js code which writes data to [DynamoDB](https://aws.amazon.com/dynamodb/)
- using the [Jest](https://jestjs.io/) testing framework

## Prerequisites

Install NPM deps by running:

```shell
npm install
```

## Running the test

In order to run this, please create an AWS account, and generate security credentials:

- `Access Key ID`
- `Secret Access Key`

Also, you need a DynamoDB database with:

```text
table name: CUSTOMER_LIST
Partition key: CUSTOMER_ID (String)
Sort key: CUSTOMER_NAME (String)
```

When all is setup on AWS side, you can run the actual test:

```shell
AWS_ACCESS_KEY_ID="your_access_key" AWS_SECRET_ACCESS_KEY="your_secret_access_key" npx jest ./write.test.js
```
