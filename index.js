//use express for routing
var express = require('express')
var server = express()
//use core querystring library to extract form information
var querystring = require('querystring')

var links = []


server.get('/', function (request, response) {
  response.set('Content-Type', 'text/html');
  response.sendFile(__dirname + '/index.html')
})

server.get('/results', function (req, res) {
  response.sendFile(__dirname + '/results.html')
})

server.post('/crawl', function (req, res) {
  console.log('post   '+links )
  links = []
  var crawl = require('./crawler.js')
  // make crawler instance
  // pass url from request
  // redirect to '/' with result of the crawler module
  req.on('data', function (chunk) {
    var body = chunk.toString()
    var url = querystring.parse(body)
    crawl.begin(url['crawl_url'], links, redirect)
  });
  var redirect = function () {
    res.redirect('/')
  }
  res.redirect('/')
})


server.listen(3000)