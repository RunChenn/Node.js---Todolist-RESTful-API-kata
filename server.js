const http = require('http');
const { v4: uuidv4 } = require('uuid');
const { successHandle, errorHandle } = require('./resHandle');
const { HEADERS } = require('./corsHeader');

const todos = [];

const reqListener = (req, res) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  if (req.url == '/todos' && req.method == 'GET') {
    successHandle(res, todos);
  } else if (req.url == '/todos' && req.method == 'POST') {
    req.on('end', () => {
      try {
        const title = JSON.parse(body)?.title ?? undefined;

        if (title) {
          const todo = {
            title: title,
            id: uuidv4(),
          };
          todos.push(todo);
          successHandle(res, todos);
          return;
        }
        errorHandle(res, 400, '參數有誤');
      } catch (err) {
        errorHandle(res, 400, '無此網站路由');
      }
    });
  } else if (req.url == '/todos' && req.method == 'DELETE') {
    todos.length = 0;
    successHandle(res, todos);
  } else if (req.url.startsWith('/todos/') && req.method == 'DELETE') {
    const id = req.url.split('/').pop();
    const index = todos.findIndex((ele) => ele.id === id);
    if (index !== -1) {
      todos.splice(index, 1);
      successHandle(res, todos);
      return;
    }
    errorHandle(res, 400, `查無此ID：${id}。`);
  } else if (req.url.startsWith('/todos/') && req.method == 'PATCH') {
    req.on('end', () => {
      try {
        const todo = JSON.parse(body).title;
        const id = req.url.split('/').pop();
        const index = todos.findIndex((ele) => ele.id === id);
        if (todo !== undefined && index !== -1) {
          todos[index].title = todo;
          successHandle(res, todos);
          return;
        }
        errorHandle(res, 400, '查無此ID 或 參數有誤');
      } catch (err) {
        errorHandle(res, 400, '無此網站路由');
      }
    });
  } else if (req.method == 'OPTIONS') {
    res.writeHead(200, HEADERS);
    res.end();
  } else {
    errorHandle(res, 404, '無此網站路由');
  }
};

const server = http.createServer(reqListener);
server.listen(process.env.PORT || 3005);
