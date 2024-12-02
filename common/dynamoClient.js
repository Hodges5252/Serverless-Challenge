const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, DeleteCommand, ScanCommand, PutCommand, UpdateCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");

//Setup for DynamoDB for all functions
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

module.exports = {
    ddbDocClient,
    GetCommand,
    DeleteCommand,
    ScanCommand,
    PutCommand,
    UpdateCommand,
    QueryCommand,
};