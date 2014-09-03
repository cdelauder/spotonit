var express = require('express')
var server = express()

server.get('/', function (request, response) {
  response.set('Content-Type', 'text/html');
  response.sendFile(__dirname + '/index.html')
})

server.post('/crawl', function (request, response) {
  console.log('in post route')
  response.redirect('/results')
})

server.get('/results', function (request, response) {
  response.set('Content-Type', 'text/html')
  response.sendFile(__dirname, + '/results.html')
})

server.listen(3000)