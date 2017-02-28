var express = require('express');
var bodyParser = require('body-parser');
var location = require('./routes/location.js');

var app = express();

app.use(bodyParser.json());
app.use('/locations', location);

var server = app.listen(1300, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server listening at http://%s:%s", host, port);

});