import cors from '@middy/http-cors';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import bcrypt from 'bcryptjs';
import middy from 'middy';
import { createAWSResErr } from '../sharedFunctions/createAWSResErr';

const DB = new DynamoDB.DocumentClient();

async function login(event: { body: string }, _context: any) {
  const { email, password } = JSON.parse(event.body);

  if (!email || !password) {
    return createAWSResErr(401, 'Please provide email and password!');
  }

  const params = {
    TableName: process.env.USER_TABLE_NAME,
    KeyConditionExpression: '#email = :email',
    ExpressionAttributeNames: {
      '#email': 'email'
    },
    ExpressionAttributeValues: {
      ':email': email
    }
  };

  try {
    const result = await DB.query(params).promise();
    const user = result.Items[0];

    if (user === undefined) {
      return createAWSResErr(404, 'No user found with that email');
    }

    if (!(await verifyPassword(password, user.password))) {
      return createAWSResErr(401, 'Incorrect password');
    }

    return {
      statusCode: 201,
      body: JSON.stringify(user)
    };
  } catch (error) {
    return createAWSResErr(404, error);
  }
}

async function verifyPassword(candidatePassword: string, userPassword: string) {
  return bcrypt.compareSync(candidatePassword, userPassword);
}

export const handler = middy(login).use(cors());
