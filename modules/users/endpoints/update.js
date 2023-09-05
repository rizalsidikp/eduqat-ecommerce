'use strict';
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const response = require("../../../shared/lib/responses");


const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
module.exports.update = async (event) => {
    const id = event.pathParameters.id
    const body = JSON.parse(event.body)
    const getCommand = new GetCommand({
        TableName: process.env.DYNAMODB_USER_TABLE,
        Key: {
            ID: id
        }
    });
    try {
        const exist = await docClient.send(getCommand);
        if (!exist.Item) {
            return response.json({}, 404, 'User not found');
        }
        const updateCommand = new UpdateCommand({
            TableName: process.env.DYNAMODB_USER_TABLE,
            Key: {
                ID: id,
            },
            UpdateExpression: "set #name = :name",
            ExpressionAttributeValues: {
                ":name": body.name,
            },
            ExpressionAttributeNames:{
                "#name": "name"
            },
            ReturnValues: "ALL_NEW",
        });

        const result = await docClient.send(updateCommand);
        return response.json(result.Item, 200, 'Successfully update User');
    } catch (error) {
        return response.json(error, 500, 'Failed update User');
    }
};