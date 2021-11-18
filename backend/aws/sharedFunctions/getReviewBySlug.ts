import DynamoDB from 'aws-sdk/clients/dynamodb';
import { createAWSResErr } from './createAWSResErr';
const db = new DynamoDB.DocumentClient();

export async function getReviewBySlug(slug: string) {
  try {
    const params = {
      TableName: process.env.REVIEW_TABLE_NAME,
      Key: { slug }
    };

    const result = await db.get(params).promise();
    return result.Item;
  } catch (error) {
    return createAWSResErr(404, error);
  }
}
