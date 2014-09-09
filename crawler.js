
  // make request with the url
  // pull the links from the response as long as they include the word events
    // if this is not efficient enough pull the url that has the word event and no numbers
      //definitely need to go to the events page
      //because a restful site would follow events/:id formula, so no numbers should mean an index page which lists all events
    // pull the links from the response and return any that include /(event)+.+\d+/
  // return the links

exports.begin = function (url, links, redirect) {

  //use the core htto library in order to make GET requests to the websites we are crawling
  var http = require('http')
  //use the core url library to parse urls
  var parser = require('url')
  //regex to identify individual event links
  var eventRegex = /<a href="(\S*?event\S*?[\/][\d*]\S*?)"/ig
  // regex to identify the link to the event homepages
  var eventsRegex = /<a href="(\S*?event\S*?)"/ig
  // variable to hold the links from the first request
  var body = []
  // variable to hold the links from second request
  // var links = []
  //save the host so we have enough info to build the second request
  var host = parser.parse(url, false, true)['host']
  // build a regex to find any links on the same host
  var allLinksRegex = new RegExp('<a href="(http://' + host + '\\S*)"', 'ig')
  // build a regex to find any links that include a specific object id
  var idRegex = new RegExp('<a href="(' + '\\S*[&]\\S*)"', 'ig')

  var requester = function (eventRegex, eventsRegex) {
    var req = http.get(url, function (res) {
      // call the input url
      res.on('data', function (chunk) {
        var match = eventsRegex.exec(chunk.toString())
        // if we find a url that we expect to be a link to the event #show page add it to the our array
        if (match) {
          body.push(match[1])
        }
      })
      res.on('end', function () {
        if (body.length > 0) {
          //once we have all the data, make a second request to get the show page
          for (var i=0; i < body.length; i++) { 
          //make sure the url is properly formatted and includes the host name
            var eventUrl = body[i]
            if ( eventUrl.indexOf(host) === -1) {
              eventUrl = 'http://' + host + eventUrl
            }
            if (eventUrl) {
              http.get(eventUrl, function (res) {
                res.on('data', function (chunk) {
                  //save any links that match the regex format which should indicate an event#show page
                  var match = eventRegex.exec(chunk.toString())
                  if (match) {
                    links.push(match[1])
                  }
                })
                res.on('end', function () {
                  if (i >= body.length && links.length >= 10) {
                    return links
                  } 
                })
              }).on('error', function (e) {
                console.log(e.message)
              })
            }
          } 
        } else {
          console.log(links)
          // need a solution for non-RESTful sites
          requester(idRegex, allLinksRegex)
        }
      })
    }).on('error', function (e) {
      console.log(e.message)
    })
    // redirect()
    
  }

  requester(eventRegex, eventsRegex)
}