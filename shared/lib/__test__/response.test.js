const response = require('./../responses')

describe("response", () => {
    it("should be return default response", () => {
        const result = response.json()
        expect(result).toEqual({
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin" : "*"
            },
            body: JSON.stringify({
                "status-code": 200,
                "message": "",
                "body": {}
            })
        })
    })
})