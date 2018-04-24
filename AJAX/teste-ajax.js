var express = require('express');
var app = express();
//var bodyParser = require('body-parser');
//app.use(bodyParser.json()); // for parsing application/json
var fs = require("fs");

app.get('/', function (req, res) {
   fs.readFile( __dirname + "/" + "index.html", 'utf8', function (err, data) {
       // console.log( data );
       res.end( data );
   });
})

app.get('/ola', function (req, res) {
  //fs.readFile( __dirname + "/" + "index.html", 'utf8', function (err, data) {
   //    console.log( data );
  var d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();
  var hms = h+":"+m+":"+s;
  res.type('json');
  res.send({"hora": hms});
       //res.end( '{ "msg": "ola!" }' );
   //});
})


var server = app.listen(8083, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
