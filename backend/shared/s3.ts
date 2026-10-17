import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
});

const BUCKET = process.env.S3_BUCKET || "smart-library-demo-data";

// Write JSON data to S3
export const writeToS3 = async (key: string, data: any) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: JSON.stringify(data),
    ContentType: "application/json",
  });
  return await s3Client.send(command);
};

// Build the S3 key path for a transaction
export const buildTransactionKey = (transactionId: string) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `transactions/${year}/${month}/${day}/${transactionId}.json`;
};