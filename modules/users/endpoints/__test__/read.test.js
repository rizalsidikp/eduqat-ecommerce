const { mockClient } = require('aws-sdk-client-mock')
const { list, get } = require('./../read')
const { DynamoDBDocumentClient, ScanCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const ddbMock = mockClient(DynamoDBDocumentClient);

describe("list", () => {
  beforeEach(() => {
    ddbMock.reset();
  });
  it("should return 404 when there are no users", async () => {
    const expectedResponse = {
        "status-code": 404,
        "message": "Users not found",
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
  it("should return 200 when there are users", async () => {
    const expectedResponse = {
      "status-code": 200,
      "message": "Successfully get Users",
      "body": [
          {
              "email": "user1@example.com",
              "ID": "a9ccd4b1-a1b7-4930-8141-2b6999ba180c",
              "name": "User 1"
          }
      ]
    }
    ddbMock.on(ScanCommand).resolves({
      Items: [
          {
              "email": "user1@example.com",
              "ID": "a9ccd4b1-a1b7-4930-8141-2b6999ba180c",
              "name": "User 1"
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
  it("should return 404 when there are no user", async () => {
    const expectedResponse = {
        "status-code": 404,
        "message": "User not found",
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
  it("should return 200 when there are user", async () => {
    const expectedResponse = {
      "status-code": 200,
      "message": "Successfully get User",
      "body":{
        "email": "user1@example.com",
        "ID": "a9ccd4b1-a1b7-4930-8141-2b6999ba180c",
        "name": "User 1"
      }
    }
    ddbMock.on(GetCommand).resolves({
      Item: {
        "email": "user1@example.com",
        "ID": "a9ccd4b1-a1b7-4930-8141-2b6999ba180c",
        "name": "User 1"
      }
    })
    const response = await get({
      pathParameters: {
        id: 'a9ccd4b1-a1b7-4930-8141-2b6999ba180c'
      }
    });
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(expectedResponse)
  })
})
