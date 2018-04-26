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

app.get('/soma', function (req, res) {
  //fs.readFile( __dirname + "/" + "index.html", 'utf8', function (err, data) {
     //console.log( data );

      var urlsub = (req.url).split("=");
      var x = parseInt(urlsub[1].match(/\d/g).join(''));
      var y = parseInt(urlsub[2].match(/\d/g).join(''));
      var soma = x + y;
      console.log(x);
      console.log(y);
      var resultado = "Resultado: " + soma;
  
  //
  
  res.send(resultado);
  
})


var server = app.listen(8083, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
