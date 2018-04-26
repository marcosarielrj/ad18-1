var express = require('express');
var app = express();
//var bodyParser = require('body-parser');
//app.use(bodyParser.json()); // for parsing application/json
var fs = require("fs");

app.get('/', function (req, res) {
   fs.readFile( __dirname + "/" + "index3.html", 'utf8', function (err, data) {
       // console.log( data );
       res.end( data );
   });
})

app.get('/soma', function (req, res) {
  //fs.readFile( __dirname + "/" + "index.html", 'utf8', function (err, data) {
     //console.log( data );
    if (req.method === "GET"){

      var x = toString(req.x);
      var y = toString(req.y);
      console.log(x);
      console.log(y);

    }
  var soma;
  
  //
  
  
  res.type('json');
  res.send({"hora": hms});
  
})


var server = app.listen(8083, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
