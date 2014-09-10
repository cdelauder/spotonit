
  // make request with the url
  // pull the links from the response as long as they include the word events
    // if this is not efficient enough pull the url that has the word event and no numbers
      //definitely need to go to the events page
      //because a restful site would follow events/:id formula, so no numbers should mean an index page which lists all events
    // pull the links from the response and return any that include /(event)+.+\d+/
  // return the links

exports.begin = function (url, response, callback) {

  //use the core htto library in order to make GET requests to the websites we are crawling
  var http = require('http')
  //use the core url library to parse urls
  var parser = require('url')
  //regex to identify individual event links
  var eventRegex = /<a href="(\S*?event\S*?[\/][\d*]\S*?)"/ig
  // regex to identify the link to the event homepages
  var eventsRegex = /<a href="(\S*?event\S*?)"/ig
  // variable to hold the links from the first request
  var listingLinks = []
  // variable to hold the links from second request
  var links = []
  //save the host so we have enough info to build the second request
  var host = parser.parse(url, false, true)['host']
  // build a regex to find any links on the same host
  var allLinksRegex = new RegExp('<a href="(http://' + host + '\\S*)"', 'ig')
  // build a regex to find any links that include a specific object id
  var idRegex = new RegExp('<a href="(' + '\\S*[&]\\S*[id]\\S*)"', 'ig')
  var counter = 0

  var requester = function (eventRegex, eventsRegex) {
    var req = http.get(url, function (res) {
      // call the input url
      res.on('data', function (chunk) {
        // if we find a url that we expect to be a link to the event #show page add it to the our array
        var match = eventsRegex.exec(chunk.toString())
        if (match) {
          listingLinks.push(match[1])
        }
        // try to grab any event urls we come across too on the initial page
        var linkMatch = eventRegex.exec(chunk.toString())
        if (linkMatch && links.indexOf(linkMatch[1] === -1)) {
          links.push(linkMatch[1])
        }
      })
      res.on('end', function () {
        if (listingLinks.length > 0) {
          //once we have all the data, make a second request to get the show page 
          linkGrabber(eventRegex)
        } else {
          // need a solution for non-RESTful sites
          requester(idRegex, allLinksRegex)
        }
      })
    }).on('error', function (e) {
      console.log(e.message)
    })
  }

  var linkGrabber = function (regex) {
    var requests = 0
    for (var i=0; i < listingLinks.length; i++) { 
    //make sure the url is properly formatted and includes the host name
      var eventUrl = listingLinks[i]
      if ( eventUrl.indexOf(host) === -1) {
        eventUrl = 'http://' + host + eventUrl
      }
      if (eventUrl) {
        http.get(eventUrl, function (res) {
          res.on('data', function (chunk) {
            //save any links that match the regex format which should indicate an event#show page
            var match = regex.exec(chunk.toString())
            if (match && links.indexOf(match[1] === -1)) {
              links.push(match[1])
            }
          })
          res.on('end', function () {
            requests++
            //once the requests are in call the function to format the links in html
            if (i === listingLinks.length || links.length >= 10) {
              makeHtml(i, regex)
            } 
          })
        }).on('error', function (e) {
          requests++
          if (requests === listingLinks.length || links.length >= 10) {
              makeHtml(i, regex)
          } 
          console.log(e.message)
        })
      } 
    }      
  }

  var makeHtml = function (i, regex) {
    counter++
    // make a link corresponding to each link
    var html = ''
    for (var j=0; j < links.length; j++) {
      var link = links[j]
      if ( link.indexOf(host) === -1) {
        link = 'http://' + host + link
      }
      html += '<a href="' + link + '">' + link + '</a><br>'
    }
    // send the response if we have enough links or are out of data
    if (counter === i || links.length > 10) {
      // but if it too short crawl again using a the links as the landing pages
      if (links.length > 10) {
        callback(html, response)
      } else {
        counter = 0
        requester(regex, allLinksRegex)
      }
    }
  }
  // call the function to start the crawl
  if (url.indexOf('event') > 0) {
    requester(eventRegex, eventsRegex)
  } else {
    // need a solution for non-RESTful sites
    requester(idRegex, allLinksRegex)
  }
}