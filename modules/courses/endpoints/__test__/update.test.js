const { mockClient } = require('aws-sdk-client-mock')
const { update } = require('./../update')
const { DynamoDBDocumentClient, UpdateCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const ddbMock = mockClient(DynamoDBDocumentClient);
describe("update", () => {
    it("should return 404 when there are no Course", async () => {
        const expectedResponse = {
            "status-code": 404,
            "message": "Course not found",
            "body": {}
        }
        ddbMock.on(GetCommand).resolves({})
        const response = await update({
            pathParameters: {
                id: 1
            },
            body: JSON.stringify({
                name: "Changed Course"
            })
        });
        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.body)).toEqual(expectedResponse)
    })
    it('should return 200 when successfully update Course', async () => {
        const expectedResponse = {
            "status-code": 200,
            "message": "Successfully update Course",
            "body":{
                "ID": "ABCD-1234",
                "title": "Course 1 changed",
                "description": "Course 1 description changed",
                "price": 150000
            }
        }
        ddbMock.on(GetCommand).resolves({
            Item: {
                "ID": "ABCD-1234",
                "title": "Course 1",
                "description": "Course 1 description",
                "price": 250000
            }
        })
        ddbMock.on(UpdateCommand).resolves({
            Item: {
                "ID": "ABCD-1234",
                "title": "Course 1 changed",
                "description": "Course 1 description changed",
                "price": 150000
            }
        })
        const response = await update({
            pathParameters: {
                id: 'ABCD-1234'
            },
            body: JSON.stringify({
                "title": "Course 1 changed",
                "description": "Course 1 description changed",
                "price": 150000
            })
        });
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual(expectedResponse)
    })
    it('should return 500 when failed update Course', async () => {
        const expectedResponse = {
            "status-code": 500,
            "message": "Failed update Course",
            "body":{}
        }
        ddbMock.on(GetCommand).rejects("error")
        const response = await update({
            pathParameters: {
                id: 'ABCD-1234'
            },
            body: JSON.stringify({
                "name": "Course 1 Changed"
            })
        });
        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.body)).toEqual(expectedResponse)
    })
})