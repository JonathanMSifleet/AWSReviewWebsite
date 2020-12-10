const middy = require('middy');
const cors = require('middy/middlewares');
import { createAWSResErr } from '../util/createAWSResErr';
const AWS =require('aws-sdk');
const bcrypt = require( 'bcryptjs');

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function login(event, _context) {

  const { email, password } = JSON.parse(event.body);

  if (!email || !password) {
    return createAWSResErr(401, 'Please provide email and password!');
  }

  const params = {
    TableName: process.env.USER_TABLE_NAME,
    KeyConditionExpression: '#email = :email',
    ExpressionAttributeNames: {
      "#email": "email"
    },
    ExpressionAttributeValues: {
      ':email': email
    }
  };

  try {
    const result = await dynamodb.query(params).promise();
    const user = result.Items[0];

    if (!(await verifyPassword(password, user.password))) {
      return createAWSResErr(401, 'Incorrect email or password');
    } else {
      return {
        statusCode: 201,
        body: JSON.stringify(user)
      };
    }
  } catch (e) {
    console.error(e);
    return createAWSResErr(404, e);
  }
}

async function verifyPassword (candidatePassword, userPassword) {
  return bcrypt.compareSync(candidatePassword, userPassword);
}

export const handler = middy(login)
  .use(cors());