const { mockClient } = require('aws-sdk-client-mock')
const deleteFunction = require('./../delete').delete
const { DynamoDBDocumentClient, GetCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const ddbMock = mockClient(DynamoDBDocumentClient);
describe("update", () => {
    it("should return 404 when there are no Course", async () => {
        const expectedResponse = {
            "status-code": 404,
            "message": "Course not found",
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
    it('should return 200 when successfully update Course', async () => {
        const expectedResponse = {
            "status-code": 200,
            "message": "Successfully delete Course",
            "body":{}
        }
        ddbMock.on(GetCommand).resolves({
            Item: {
                "ID": "ABCD-1234",
                "title": "Course 1",
                "description": "Course 1 description",
                "price": 250000
            }
        })
        ddbMock.on(DeleteCommand).resolves({})
        const response = await deleteFunction({
            pathParameters: {
                id: 'ABCD-1234'
            }
        });
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual(expectedResponse)
    })
    it('should return 500 when failed update Course', async () => {
        const expectedResponse = {
            "status-code": 500,
            "message": "Failed delete Course",
            "body":{}
        }
        ddbMock.on(GetCommand).rejects("error")
        const response = await deleteFunction({
            pathParameters: {
                id: 'ABCD-1234'
            }
        });
        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.body)).toEqual(expectedResponse)
    })
})