const { mockClient } = require('aws-sdk-client-mock')
const { create } = require('./../create')
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const ddbMock = mockClient(DynamoDBDocumentClient);
jest.mock('uuid', () => ({ v4: () => 'ABCD-1234' }));
describe("create", () => {
    beforeEach(() => {
        ddbMock.reset();
    });
    it('should return 200 when successfully create Course', async () => {
        const expectedResponse = {
            "status-code": 201,
            "message": "Successfully create Course",
            "body":{
                "ID": "ABCD-1234",
                "title": "Course 1",
                "description": "Course 1 description",
                "price": 250000
            }
        }
        ddbMock.on(PutCommand).resolves({
            Item: {
                "ID": "ABCD-1234",
                "title": "Course 1",
                "description": "Course 1 description",
                "price": 250000
            }
        })
        const response = await create({
            body: JSON.stringify({
                "title": "Course 1",
                "description": "Course 1 description",
                "price": 250000
            })
        });
        expect(response.statusCode).toBe(201);
        expect(JSON.parse(response.body)).toEqual(expectedResponse)
    })
    it('should return 500 when failed create Course', async () => {
        const expectedResponse = {
            "status-code": 500,
            "message": "Failed create Course",
            "body":{}
        }
        ddbMock.on(PutCommand).rejects("error")
        const response = await create({
            body: JSON.stringify({
                "title": "Course 1",
                "description": "Course 1 description",
                "price": 250000
            })
        });
        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.body)).toEqual(expectedResponse)
    })
})