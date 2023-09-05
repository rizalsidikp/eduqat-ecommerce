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
        TableName: process.env.DYNAMODB_COURSE_TABLE,
        Key: {
            ID: id
        }
    });
    try {
        const exist = await docClient.send(getCommand);
        if (!exist.Item) {
            return response.json({}, 404, 'Course not found');
        }
        const updateCommand = new UpdateCommand({
            TableName: process.env.DYNAMODB_COURSE_TABLE,
            Key: {
                ID: id,
            },
            UpdateExpression: "set #title = :title, #description = :description, #price = :price",
            ExpressionAttributeValues: {
                ":title": body.title,
                ":description": body.description,
                ":price": body.price,
            },
            ExpressionAttributeNames:{
                "#title": "title",
                "#description": "description",
                "#price": "price",
            },
            ReturnValues: "ALL_NEW",
        });

        const result = await docClient.send(updateCommand);
        return response.json(result.Item, 200, 'Successfully update Course');
    } catch (error) {
        return response.json(error, 500, 'Failed update Course');
    }
};