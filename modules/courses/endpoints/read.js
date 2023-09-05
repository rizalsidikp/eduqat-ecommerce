'use strict';
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand , GetCommand} = require("@aws-sdk/lib-dynamodb");
const response = require("../../../shared/lib/responses");


const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
module.exports.list = async () => {
    const command = new ScanCommand({
        TableName: process.env.DYNAMODB_COURSE_TABLE,
    });
    const result = await docClient.send(command);
    if (result.Count === 0) {
        return response.json([], 404, 'Courses not found');
    }
    return response.json(result.Items, 200, 'Successfully get Courses');
};

module.exports.get = async (event) => {
    const id = event.pathParameters.id
    const getCommand = new GetCommand({
        TableName: process.env.DYNAMODB_COURSE_TABLE,
        Key: {
            ID: id
        }
    })
    const result = await docClient.send(getCommand);
    if (!result.Item) {
        return response.json({}, 404, 'Course not found');
    }
    return response.json(result.Item, 200, 'Successfully get Course');
}