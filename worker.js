var linkModule = (function (args) {
  var http = require('http')
  var through = require('through')
  var links = []
  var linkUrl = process.argv[2]
  var host = process.argv[3]
  

  
  var regex 
  if (process.argv[4] === '0') {
    regex = /<a href="(\S*?event\S*?[\/][\d*]\S*?)"/gi
  } else {
    regex = new RegExp('<a href="(' + '\\S*[&]\\S*[id]\\S*)"', 'ig')
  }
  if ( linkUrl.indexOf(host) === -1) {
    linkUrl = 'http://' + host + linkUrl
  }
  if (linkUrl) {
    http.get(linkUrl, function (res) {
      res.on('data', function (chunk) {
        return chunk.toString()
        //save any links that match the regex format which should indicate an event#show page
      })
      res.on('end', function () {
      }).pipe(through(write, end))
    }).on('error', function (e) {
      console.log(e.message)
    }).pipe(through(write, end))
    function write (chunk) {
      var match 
      while ((match = regex.exec(chunk.toString())) !== null) {
        console.log('write ' + match)
        if (match && links.indexOf(match[1]) === -1) {
          links.push(match[1])
        }
      }
    }
    function end () {
      console.log('links ' + links)
      process.send({'links':links})
      //once the requests are in call the function to format the links in html
      // process.disconnect()
    }
  }

}) ()