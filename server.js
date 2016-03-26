var request = require("request")
var cheerio = require("cheerio")
var express = require("express");
var app = express();
var result = []
var recent = [];

app.get('/search/:search', function(req, res) {
  result = []
  var query = req.params.search;
  var offset = req.query.offset || 0;
  recent.push({query: query, when: new Date()})
  request("http://imgur.com/r/" + query + "/new/page/" + offset, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        
        $('.post').each(function(i, el) {
          var url = $(el).find("a").find("img").attr('src');
          var alt = $(el).find(".hover p").text();
          var meta = {url: url, alt: alt};
          result.push(meta)
        });
      }
      res.send(result);
    });
});

app.get("/recent", function(req,res){
    res.json(recent)
})

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.listen(process.env.PORT, function(){
    console.log("server listening on port " + process.env.PORT)
})