
  // make request with the url
  // pull the links from the response as long as they include the word events
    // if this is not efficient enough pull the url that has the word event and no numbers
      //definitely need to go to the events page
      //because a restful site would follow events/:id formula, so no numbers should mean an index page which lists all events
    // pull the links from the response and return any that include /(event)+.+\d+/
  // return the links

exports.begin = function (url) {

  //use the core htto library in order to make GET requests to the websites we are crawling
  var http = require('http')
  //use the core url library to parse urls
  var parser = require('url')
  //regex to identify individual event links
  var eventsRegex = /<a href="(\S*?event\S*?\/\d*\S*?)"/ig
  // regex to identify the link to the event homepages
  var eventPageRegex = /<a href="(\S*?event\S*?)"/ig
  // variable to hold the links from the first request
  var body = []
  // variable to hold the links from second request
  var links = []
  //save the host so we have enough info to build the second request
  var host = parser.parse(url, false, true)['host']

  var req = http.get(url, function (res) {
    // call the input url
    res.on('data', function (chunk) {
      var match = eventPageRegex.exec(chunk.toString())
      // if we find a url that we expect to be a link to the event #show page add it to the our array
      if (match) {
        body.push(match[1])
      }
    })
    res.on('end', function () {
      //once we have all the data, make a second request to get the show page
      console.log('body ' + body)
      var eventUrl = body[0]
      //make sure the url is properly formatted and includes the host name

      if ( eventUrl.indexOf(host) === -1) {
        eventUrl = 'http://' + host + eventUrl
      }
      //make the request
      console.log('url ' + eventUrl)
      if (eventUrl) {
        http.get(eventUrl, function (res) {
          res.on('data', function (chunk) {
            //save any links that match the regex format which should indicate an event#show page
            var match = eventsRegex.exec(chunk.toString())
            if (match) {
              links.push(match[1])
            }
          })
          res.on('end', function () {
            console.log('links ' + links)
          })
        }).on('error', function (e) {
          console.log(e.message)
        })
      }
    })
  }).on('error', function (e) {
    console.log(e.message)
  })
}