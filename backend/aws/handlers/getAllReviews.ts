import cors from '@middy/http-cors';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import middy from 'middy';
import { createAWSResErr } from '../sharedFunctions/createAWSResErr';

const DB = new DynamoDB.DocumentClient();

async function getAllReviews() {
  const params = {
    TableName: process.env.REVIEW_TABLE_NAME
  };

  try {
    const result = await DB.scan(params).promise();
    const reviews = result.Items;
    return {
      statusCode: 200,
      body: JSON.stringify({ reviews })
    };
  } catch (errorMessage) {
    return createAWSResErr(404, errorMessage);
  }
}

export const handler = middy(getAllReviews).use(cors());
