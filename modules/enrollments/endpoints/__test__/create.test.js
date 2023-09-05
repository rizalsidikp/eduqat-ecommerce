const { mockClient } = require('aws-sdk-client-mock')
const { create } = require('./../create')
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const ddbMock = mockClient(DynamoDBDocumentClient);
jest.mock('uuid', () => ({ v4: () => 'ABCD-1234' }));
describe("create", () => {
    beforeEach(() => {
        ddbMock.reset();
    });
    it('should return 200 when successfully create Enrollment', async () => {
        const expectedResponse = {
            "status-code": 201,
            "message": "Successfully create Enrollment",
            "body":{
                "user": {
                    "name": "User 1",
                    "email": "user1@example.com",
                    "ID": "a9ccd4b1-a1b7-4930-8141-2b6999ba180c"
                },
                "user_id": "a9ccd4b1-a1b7-4930-8141-2b6999ba180c",
                "ID": "ABCD-1234",
                "course": {
                    "description": "Course 1 description",
                    "ID": "0717683e-0c16-4d83-b335-caccc9724276",
                    "title": "Course 1",
                    "price": 250000
                },
                "course_id": "0717683e-0c16-4d83-b335-caccc9724276"
            }
        }
        ddbMock.on(PutCommand).resolves({
            Item: {
                "user": {
                    "name": "User 1",
                    "email": "user1@example.com",
                    "ID": "a9ccd4b1-a1b7-4930-8141-2b6999ba180c"
                },
                "user_id": "a9ccd4b1-a1b7-4930-8141-2b6999ba180c",
                "ID": "ABCD-1234",
                "course": {
                    "description": "Course 1 description",
                    "ID": "0717683e-0c16-4d83-b335-caccc9724276",
                    "title": "Course 1",
                    "price": 250000
                },
                "course_id": "0717683e-0c16-4d83-b335-caccc9724276"
            }
        })
        const response = await create({
            body: JSON.stringify({
                "user": {
                    "name": "User 1",
                    "email": "user1@example.com",
                    "ID": "a9ccd4b1-a1b7-4930-8141-2b6999ba180c"
                },
                "user_id": "a9ccd4b1-a1b7-4930-8141-2b6999ba180c",
                "course": {
                    "description": "Course 1 description",
                    "ID": "0717683e-0c16-4d83-b335-caccc9724276",
                    "title": "Course 1",
                    "price": 250000
                },
                "course_id": "0717683e-0c16-4d83-b335-caccc9724276"
            })
        });
        expect(response.statusCode).toBe(201);
        expect(JSON.parse(response.body)).toEqual(expectedResponse)
    })
    it('should return 500 when failed create Enrollment', async () => {
        const expectedResponse = {
            "status-code": 500,
            "message": "Failed create Enrollment",
            "body":{}
        }
        ddbMock.on(PutCommand).rejects("error")
        const response = await create({
            body: JSON.stringify({
                "user": {
                    "name": "User 1",
                    "email": "user1@example.com",
                    "ID": "a9ccd4b1-a1b7-4930-8141-2b6999ba180c"
                },
                "user_id": "a9ccd4b1-a1b7-4930-8141-2b6999ba180c",
                "course": {
                    "description": "Course 1 description",
                    "ID": "0717683e-0c16-4d83-b335-caccc9724276",
                    "title": "Course 1",
                    "price": 250000
                },
                "course_id": "0717683e-0c16-4d83-b335-caccc9724276"
            })
        });
        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.body)).toEqual(expectedResponse)
    })
})