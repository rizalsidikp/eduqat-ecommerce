const { mockClient } = require('aws-sdk-client-mock')
const deleteFunction = require('./../delete').delete
const { DynamoDBDocumentClient, GetCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const ddbMock = mockClient(DynamoDBDocumentClient);
describe("update", () => {
    it("should return 404 when there are no user", async () => {
        const expectedResponse = {
            "status-code": 404,
            "message": "User not found",
            "body": {}
        }
        ddbMock.on(GetCommand).resolves({})
        const response = await deleteFunction({
            pathParameters: {
                id: 1
            }
        });
        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.body)).toEqual(expectedResponse)
    })
    it('should return 200 when successfully update User', async () => {
        const expectedResponse = {
            "status-code": 200,
            "message": "Successfully delete User",
            "body":{}
        }
        ddbMock.on(GetCommand).resolves({
            Item: {
                "email": "user1@example.com",
                "ID": "a9ccd4b1-a1b7-4930-8141-2b6999ba180c",
                "name": "User 1"
            }
        })
        ddbMock.on(DeleteCommand).resolves({})
        const response = await deleteFunction({
            pathParameters: {
                id: 'a9ccd4b1-a1b7-4930-8141-2b6999ba180c'
            }
        });
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual(expectedResponse)
    })
    it('should return 500 when failed update User', async () => {
        const expectedResponse = {
            "status-code": 500,
            "message": "Failed delete User",
            "body":{}
        }
        ddbMock.on(GetCommand).rejects("error")
        const response = await deleteFunction({
            pathParameters: {
                id: 'a9ccd4b1-a1b7-4930-8141-2b6999ba180c'
            }
        });
        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.body)).toEqual(expectedResponse)
    })
})