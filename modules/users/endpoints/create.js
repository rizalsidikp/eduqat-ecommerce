'use strict';
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const response = require("../../../shared/lib/responses");
const { v4: uuidv4 } = require("uuid");


const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
module.exports.create = async (event) => {
    const body = JSON.parse(event.body)
    try {
        const item = {
            ID: uuidv4(),
            name: body.name,
            email: body.email,
        }
        const putItemCommand = new PutCommand({
            TableName: process.env.DYNAMODB_USER_TABLE,
            Item: item,
        });
        await docClient.send(putItemCommand);
        return response.json(item, 201, 'Successfully create User');
    } catch (error) {
        return response.json(error, 500, 'Failed create User');
    }
};