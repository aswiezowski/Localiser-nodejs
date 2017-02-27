var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var pg = require('pg').native;
var config = {
	user : 'localiser_node',
	database : 'localiser_node',
	password : '1`5RFA9fm5+M',
	host : '127.0.0.1',
	port : 5432,
	max : 10,
	idleTimeoutMillis : 30000,
};
var pool = new pg.Pool(config);
var crypto = require('crypto');

app.use(bodyParser.json());

app.get('/localisations/:code', function(req, res) {
	pool.connect(function(err, client, done) {
		if (err) {
			res.json(err);
			return console.error('error fetching client from pool', err);
		}
		client.query('SELECT * FROM localisations WHERE code = $1', [ req.params.code ],
				function(err, result) {
					done(err);
					if (err) {
						res.json(err);
						return console.error('error running query', err);
					}
					res.json(result.rows[0]);
				});
	});
});

app.post('/localisations/', function(req, res) {
	
	pool.connect(function(err, client, done) {
		if (err) {
			res.json(err);
			return console.error('error fetching client from pool', err);
		}
		var bytes = crypto.randomBytes(6);
		var code = Buffer.from(bytes).toString('base64');
		client.query('INSERT INTO localisations(latitude, longitude, code) VALUES($1, $2, $3)', [ req.body.latitude, req.body.longitude, code ],
				function(err, result) {
					done(err);
					if (err) {
						res.json(err);
						return console.error('error running query', err);
					}
					res.json({"code":code});
				});
	});
	
});

var server = app.listen(1300, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("Example app listening at http://%s:%s", host, port);

});