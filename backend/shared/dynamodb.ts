import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1",
});

export const dynamo = DynamoDBDocumentClient.from(client);

// Save any item to any table
export const putItem = async (tableName: string, item: any) => {
  const command = new PutCommand({
    TableName: tableName,
    Item: item,
  });
  return await dynamo.send(command);
};

// Get single item by key
export const getItem = async (tableName: string, key: any) => {
  const command = new GetCommand({
    TableName: tableName,
    Key: key,
  });
  const result = await dynamo.send(command);
  return result.Item;
};

// Update item
export const updateItem = async (
  tableName: string,
  key: any,
  updateExpression: string,
  expressionValues: any,
  expressionNames?: any
) => {
  const command = new UpdateCommand({
    TableName: tableName,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionValues,
    ExpressionAttributeNames: expressionNames,
    ReturnValues: "ALL_NEW",
  });
  return await dynamo.send(command);
};

// Scan entire table (use carefully - for small tables only)
export const scanTable = async (tableName: string, filterExpression?: string, expressionValues?: any) => {
  const command = new ScanCommand({
    TableName: tableName,
    FilterExpression: filterExpression,
    ExpressionAttributeValues: expressionValues,
  });
  const result = await dynamo.send(command);
  return result.Items || [];
};

// Query by index
export const queryTable = async (
  tableName: string,
  keyCondition: string,
  expressionValues: any,
  indexName?: string
) => {
  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: keyCondition,
    ExpressionAttributeValues: expressionValues,
    IndexName: indexName,
  });
  const result = await dynamo.send(command);
  return result.Items || [];
};