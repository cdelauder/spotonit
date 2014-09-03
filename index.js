var express = require('express')
var server = express()


server.get('/', function (request, response) {
  response.set('Content-Type', 'text/html');
  response.sendFile(__dirname + '/index.html')
})

server.post('/crawl', function (request, response) {
  // make crawler instance
  // pass url from request
  // redirect to '/' with result of the crawler module
  response.redirect('/results')
})


server.listen(3000)