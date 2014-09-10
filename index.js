//use express for routing
var express = require('express')
var server = express()
//use core querystring library to extract form information
var querystring = require('querystring')


server.get('/', function (request, response) {
  response.set('Content-Type', 'text/html');
  response.sendFile(__dirname + '/index.html')
})


server.post('/crawl', function (req, res) {
  var linkHtml = ''
  var crawl = require('./crawler.js')
  // make crawler instance
  // pass url from request, along with the callback and the response object
  req.on('data', function (chunk) {
    var body = chunk.toString()
    var url = querystring.parse(body)
    linkHtml = crawl.begin(url['crawl_url'], response, buildResponse)
  });
  var response = res
  var buildResponse = function (linkHtml, res) {
    // make the response a function so it can be passed as a callback once the api calls have been made
    res.write('<html><body>' + 
      linkHtml + 
      '<a href="/">Back</a>' +
      '</body></html>')
    res.end()
  }
})


server.listen(3000)