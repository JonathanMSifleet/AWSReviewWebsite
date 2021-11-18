import middy from '@middy/core';
import cors from '@middy/http-cors';
import s3 from 'aws-sdk/clients/s3';
import { createAWSResErr } from '../sharedFunctions/createAWSResErr';
const storage = new s3();

export async function setReviewPicture(event: {
  pathParameters: { slug: string };
  body: string;
}) {
  console.log(
    '🚀 ~ file: setReviewPicture.ts ~ line 11 ~ slug',
    event.pathParameters.slug
  );
  const filename = `${event.pathParameters.slug}.jpg`;
  try {
    await deletePicture(filename);
    const buffer = await prepareImage(event.body);
    const result = await uploadPicture(filename, buffer);
    return {
      statusCode: 200,
      body: JSON.stringify(`Found at: ${result}`)
    };
  } catch (error) {
    return createAWSResErr(500, error);
  }
}
async function deletePicture(filename: string) {
  const params = {
    Bucket: process.env.REVIEW_BUCKET_NAME,
    Key: filename
  };

  try {
    return await storage.deleteObject(params).promise();
  } catch (error) {
    return createAWSResErr(500, error);
  }
}

async function prepareImage(body: string) {
  const base64 = body.replace(/^data:image\/\w+;base64,/, '');
  return Buffer.from(base64, 'base64');
}

async function uploadPicture(filename: string, body: Buffer) {
  const result = await storage
    .upload({
      Bucket: process.env.REVIEW_BUCKET_NAME,
      Key: filename,
      Body: body,
      ContentEncoding: 'base64',
      ContentType: 'image/jpg'
    })
    .promise();

  return result.Location;
}

export const handler = middy(setReviewPicture).use(cors());
