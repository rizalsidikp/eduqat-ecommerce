const { mockClient } = require('aws-sdk-client-mock')
const { update } = require('./../update')
const { DynamoDBDocumentClient, UpdateCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const ddbMock = mockClient(DynamoDBDocumentClient);
describe("update", () => {
    it("should return 404 when there are no user", async () => {
        const expectedResponse = {
            "status-code": 404,
            "message": "User not found",
            "body": {}
        }
        ddbMock.on(GetCommand).resolves({})
        const response = await update({
            pathParameters: {
                id: 1
            },
            body: JSON.stringify({
                name: "Changed Name"
            })
        });
        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.body)).toEqual(expectedResponse)
    })
    it('should return 200 when successfully update User', async () => {
        const expectedResponse = {
            "status-code": 200,
            "message": "Successfully update User",
            "body":{
                "email": "user1@example.com",
                "ID": "a9ccd4b1-a1b7-4930-8141-2b6999ba180c",
                "name": "User 1 Changed"
            }
        }
        ddbMock.on(GetCommand).resolves({
            Item: {
                "email": "user1@example.com",
                "ID": "a9ccd4b1-a1b7-4930-8141-2b6999ba180c",
                "name": "User 1"
            }
        })
        ddbMock.on(UpdateCommand).resolves({
            Item: {
                "email": "user1@example.com",
                "ID": "a9ccd4b1-a1b7-4930-8141-2b6999ba180c",
                "name": "User 1 Changed"
            }
        })
        const response = await update({
            pathParameters: {
                id: 'a9ccd4b1-a1b7-4930-8141-2b6999ba180c'
            },
            body: JSON.stringify({
                "name": "User 1 Changed"
            })
        });
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual(expectedResponse)
    })
    it('should return 500 when failed update User', async () => {
        const expectedResponse = {
            "status-code": 500,
            "message": "Failed update User",
            "body":{}
        }
        ddbMock.on(GetCommand).rejects("error")
        const response = await update({
            pathParameters: {
                id: 'a9ccd4b1-a1b7-4930-8141-2b6999ba180c'
            },
            body: JSON.stringify({
                "name": "User 1 Changed"
            })
        });
        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.body)).toEqual(expectedResponse)
    })
})