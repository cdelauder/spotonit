var express = require('express')
var server = express()
var querystring = require('querystring')


server.get('/', function (request, response) {
  response.set('Content-Type', 'text/html');
  response.sendFile(__dirname + '/index.html')
})

server.post('/crawl', function (req, res) {
  var crawl = require('./crawler.js')
  // make crawler instance
  // pass url from request
  // redirect to '/' with result of the crawler module
  req.on('data', function (chunk) {
    var body = chunk.toString()
    var url = querystring.parse(body)
    crawl.begin(url['crawl_url'])
  });

  res.redirect('/')
})


server.listen(3000)