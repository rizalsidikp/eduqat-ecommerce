const { mockClient } = require('aws-sdk-client-mock')
const { list, get } = require('./../read')
const { DynamoDBDocumentClient, ScanCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const ddbMock = mockClient(DynamoDBDocumentClient);

describe("list", () => {
  beforeEach(() => {
    ddbMock.reset();
  });
  it("should return 404 when there are no Courses", async () => {
    const expectedResponse = {
        "status-code": 404,
        "message": "Courses not found",
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
  it("should return 200 when there are Courses", async () => {
    const expectedResponse = {
      "status-code": 200,
      "message": "Successfully get Courses",
      "body": [
          {
              "ID": "ABCD-1234",
              "title": "Course 1",
              "description": "Course 1 description",
              "price": 250000
          }
      ]
    }
    ddbMock.on(ScanCommand).resolves({
      Items: [
          {
              "ID": "ABCD-1234",
              "title": "Course 1",
              "description": "Course 1 description",
              "price": 250000
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
  it("should return 404 when there are no Course", async () => {
    const expectedResponse = {
        "status-code": 404,
        "message": "Course not found",
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
  it("should return 200 when there are Course", async () => {
    const expectedResponse = {
      "status-code": 200,
      "message": "Successfully get Course",
      "body":{
          "ID": "ABCD-1234",
          "title": "Course 1",
          "description": "Course 1 description",
          "price": 250000
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
    const response = await get({
      pathParameters: {
        id: 'a9ccd4b1-a1b7-4930-8141-2b6999ba180c'
      }
    });
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(expectedResponse)
  })
})
