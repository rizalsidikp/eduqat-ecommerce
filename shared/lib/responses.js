module.exports.json = (body = {}, status = 200, message = '') => {
  return  {
      statusCode: status,
      headers: {
        "Access-Control-Allow-Origin" : "*"
      },
      body: JSON.stringify({
          "status-code": status,
          "message": message,
          "body": body
      })
  };
};