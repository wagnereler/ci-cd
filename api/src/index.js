"use strict";

const http = require("http");

const port = Number(process.env.PORT || 3000);

const server = http.createServer((_, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "ok" }));
});

server.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
