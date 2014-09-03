var express = require('express')
var server = express()

server.get('/', function (request, response) {
  response.set('Content-Type', 'text/html');
  response.sendfile(__dirname + '/index.html')
})

server.listen(3000)