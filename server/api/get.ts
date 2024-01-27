import { getVideoThumbnail } from 'video-thumbnails';
import AWS from 'aws-sdk';

export default defineEventHandler(async (event) => {
  const { url, seconds } = getQuery(event);

  // must have URL
  if (!url) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Error getting thumbnail (no url provided).',
    });
  }

  console.log(`Getting thumbnail at ${seconds}s from: ${url}`);

  try {
    // get the thumbnail using our video-thumbnails package
    const response = await getVideoThumbnail(String(url), Number(seconds) || 1);

    if (response.buffer) {
      // Save the thumbnail to R2 Cloudflare storage
      await saveToR2Storage(response.buffer);

      // Set response headers
      setResponseHeader(event, 'content-type', 'image/png');
      setResponseHeader(event, 'content-length', response.buffer.length);

      // Return the thumbnail buffer
      return response.buffer;
    }
  } catch (error) {
    console.log('Error getting thumbnail:', error);
  }

  // return an error
  throw createError({
    statusCode: 400,
    statusMessage: 'Error getting thumbnail.',
  });
});

async function saveToR2Storage(buffer) {
  // Configure AWS SDK with Cloudflare R2 credentials
  const s3 = new AWS.S3({
    region: 'auto',
    endpoint: process.env.AWS_REGION1,
    accessKeyId: process.env.AWS_REGION2,
    secretAccessKey: process.env.AWS_REGION3,
    s3ForcePathStyle: true, // Necessary for R2 Cloudflare storage
    signatureVersion: 'v4',
  });

  const params = {
    Bucket: 'dishpatch',
    Key: 'path/in/r2/storage/thumbnail.png', // Adjust the path as needed
    Body: buffer,
    ContentType: 'image/png',
    ACL: 'public-read',
  };

  // Upload the thumbnail to R2 Cloudflare storage
  await s3.upload(params).promise();
}
