
  // make request with the url
  // pull the links from the response and filter any links that don't include the word events
    // if this is not efficient enough pull the url that has the word event and no numbers
    // pull the links from the response and return any that include /(event)+.+\d+/
  // return the links

exports.begin = function (url) {

  var http = require('http')

  var body = ''
  
  http.get(url, function (res) {
    console.log(res.statusCode)
    res.on('data', function (chunk) {
      body += chunk.toString()
      // var links = body.match(/(http.*event.*")*/)
      console.log(body)
    })
  }).on('error', function (e) {
    console.log(e)
  })



}