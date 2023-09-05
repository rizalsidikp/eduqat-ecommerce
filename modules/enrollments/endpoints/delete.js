'use strict';
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, DeleteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const response = require("../../../shared/lib/responses");


const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
module.exports.delete = async (event) => {
    const id = event.pathParameters.id
    const getCommand = new GetCommand({
        TableName: process.env.DYNAMODB_ENROLLMENT_TABLE,
        Key: {
            ID: id
        }
    });
    try {
        const exist = await docClient.send(getCommand);
        if (!exist.Item) {
            return response.json({}, 404, 'Enrollment not found');
        }
        const deleteCommand = new DeleteCommand({
            TableName: process.env.DYNAMODB_ENROLLMENT_TABLE,
            Key: {
                ID: id
            },
        });
        await docClient.send(deleteCommand);
        return response.json({}, 200, 'Successfully delete Enrollment');
    } catch (error) {
        return response.json(error, 500, 'Failed delete Enrollment');
    }
};