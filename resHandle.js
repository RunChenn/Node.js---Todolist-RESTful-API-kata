const { HEADERS } = require('./corsHeader');

const successHandle = (res, todos) => {
  res.writeHead(200, HEADERS);
  res.write(
    JSON.stringify({
      status: 'success',
      data: todos,
    })
  );
  res.end();
};

const errorHandle = (res, statusCode, message) => {
  res.writeHead(statusCode, HEADERS);
  res.write(
    JSON.stringify({
      status: 'false',
      message,
    })
  );
  res.end();
};

module.exports = {
  successHandle,
  errorHandle,
};
