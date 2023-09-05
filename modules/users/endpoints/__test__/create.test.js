const { mockClient } = require('aws-sdk-client-mock')
const { create } = require('./../create')
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const ddbMock = mockClient(DynamoDBDocumentClient);
jest.mock('uuid', () => ({ v4: () => 'ABCD-1234' }));
describe("create", () => {
    beforeEach(() => {
        ddbMock.reset();
    });
    it('should return 200 when successfully create User', async () => {
        const expectedResponse = {
            "status-code": 201,
            "message": "Successfully create User",
            "body":{
                "email": "user1@example.com",
                "ID": "ABCD-1234",
                "name": "User 1"
            }
        }
        ddbMock.on(PutCommand).resolves({
            Item: {
                "email": "user1@example.com",
                "ID": "ABCD-1234",
                "name": "User 1"
            }
        })
        const response = await create({
            body: JSON.stringify({
                "name": "User 1",
                "email": "user1@example.com",
            })
        });
        expect(response.statusCode).toBe(201);
        expect(JSON.parse(response.body)).toEqual(expectedResponse)
    })
    it('should return 500 when failed create User', async () => {
        const expectedResponse = {
            "status-code": 500,
            "message": "Failed create User",
            "body":{}
        }
        ddbMock.on(PutCommand).rejects("error")
        const response = await create({
            body: JSON.stringify({
                "name": "User 1",
                "email": "user1@example.com",
            })
        });
        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.body)).toEqual(expectedResponse)
    })
})