const { mockClient } = require('aws-sdk-client-mock')
const { list, get } = require('./../read')
const { DynamoDBDocumentClient, ScanCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const ddbMock = mockClient(DynamoDBDocumentClient);

describe("list", () => {
  beforeEach(() => {
    ddbMock.reset();
  });
  it("should return 404 when there are no Enrollments", async () => {
    const expectedResponse = {
        "status-code": 404,
        "message": "Enrollments not found",
        "body": []
    }
    ddbMock.on(ScanCommand).resolves({
      Items: [],
      Count: 0
    })
    const response = await list();
    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toEqual(expectedResponse)
  })
  it("should return 200 when there are Enrollments", async () => {
    const expectedResponse = {
      "status-code": 200,
      "message": "Successfully get Enrollments",
      "body": [
            {
                "user": {
                    "name": "User 1",
                    "email": "user1@example.com",
                    "ID": "a9ccd4b1-a1b7-4930-8141-2b6999ba180c"
                },
                "user_id": "a9ccd4b1-a1b7-4930-8141-2b6999ba180c",
                "ID": "4561eaaf-e79c-4f69-8a99-325c0b8970b3",
                "course": {
                    "description": "Course 1 description",
                    "ID": "0717683e-0c16-4d83-b335-caccc9724276",
                    "title": "Course 1",
                    "price": 250000
                },
                "course_id": "0717683e-0c16-4d83-b335-caccc9724276"
            }
      ]
    }
    ddbMock.on(ScanCommand).resolves({
        Items: [
            {
                "user": {
                    "name": "User 1",
                    "email": "user1@example.com",
                    "ID": "a9ccd4b1-a1b7-4930-8141-2b6999ba180c"
                },
                "user_id": "a9ccd4b1-a1b7-4930-8141-2b6999ba180c",
                "ID": "4561eaaf-e79c-4f69-8a99-325c0b8970b3",
                "course": {
                    "description": "Course 1 description",
                    "ID": "0717683e-0c16-4d83-b335-caccc9724276",
                    "title": "Course 1",
                    "price": 250000
                },
                "course_id": "0717683e-0c16-4d83-b335-caccc9724276"
            }
        ],
      Count: 1
    })
    const response = await list();
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(expectedResponse)
  })
})

describe("get", () => {
  beforeEach(() => {
    ddbMock.reset();
  });
  it("should return 404 when there are no Enrollment", async () => {
    const expectedResponse = {
        "status-code": 404,
        "message": "Enrollment not found",
        "body": {}
    }
    ddbMock.on(GetCommand).resolves({})
    const response = await get({
      pathParameters: {
        id: 1
      }
    });
    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toEqual(expectedResponse)
  })
  it("should return 200 when there are Enrollment", async () => {
    const expectedResponse = {
        "status-code": 200,
        "message": "Successfully get Enrollment",
        "body":{
            "user": {
                "name": "User 1",
                "email": "user1@example.com",
                "ID": "a9ccd4b1-a1b7-4930-8141-2b6999ba180c"
            },
            "user_id": "a9ccd4b1-a1b7-4930-8141-2b6999ba180c",
            "ID": "4561eaaf-e79c-4f69-8a99-325c0b8970b3",
            "course": {
                "description": "Course 1 description",
                "ID": "0717683e-0c16-4d83-b335-caccc9724276",
                "title": "Course 1",
                "price": 250000
            },
            "course_id": "0717683e-0c16-4d83-b335-caccc9724276"
        }
    }
    ddbMock.on(GetCommand).resolves({
        Item: {
            "user": {
                "name": "User 1",
                "email": "user1@example.com",
                "ID": "a9ccd4b1-a1b7-4930-8141-2b6999ba180c"
            },
            "user_id": "a9ccd4b1-a1b7-4930-8141-2b6999ba180c",
            "ID": "4561eaaf-e79c-4f69-8a99-325c0b8970b3",
            "course": {
                "description": "Course 1 description",
                "ID": "0717683e-0c16-4d83-b335-caccc9724276",
                "title": "Course 1",
                "price": 250000
            },
            "course_id": "0717683e-0c16-4d83-b335-caccc9724276"
        }
    })
    const response = await get({
      pathParameters: {
        id: '4561eaaf-e79c-4f69-8a99-325c0b8970b3'
      }
    });
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(expectedResponse)
  })
})
