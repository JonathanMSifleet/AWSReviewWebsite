import cors from '@middy/http-cors';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import middy from 'middy';
import { createAWSResErr } from '../sharedFunctions/createAWSResErr';
const DB = new DynamoDB.DocumentClient();

async function deleteAccount(
  event: { requestContext: { authorizer: { email: string } } },
  _context: any
) {
  const { email } = event.requestContext.authorizer;

  const params = {
    TableName: process.env.USER_TABLE_NAME,
    Key: {
      email
    },
    ConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  };

  try {
    const result = await DB.delete(params).promise();
    return {
      statusCode: 204,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return createAWSResErr(403, error);
  }
}

export const handler = middy(deleteAccount).use(cors());
