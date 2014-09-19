SpotOn.it Webcrawler
========

Use this app to return a list of event urls when given a url from an event site. It will return at least 10 urls for each entry.

#### Installation and Usage

1) Clone the repository

2) Run 'npm install' to install the dependencies(express.js)

3) Use 'node index.js' to start the server

``` 
    git clone https://github.com/cdelauder/spotonit.git
    npm install
    node index.js
```

4) Visit [http://localhost:3000](http://localhost:3000) to input a url

5) Use the 'back' link to return and input another url

#### Update

I have implemented a version using streams for flow control which resulted in better performance and improved accuracy. To use this version:
```
    git checkout streams
    node index.js
```

I have also implemented a version spawning workers to handle the http requests and regex events. To use this version:
```
    git checkout multithread
    node index.js
```

Both of the above include a benchmark with the results. I anticipated that the multithread version would result in signifcant speed gains, but that was not the case. They are roughly identical in speed. 