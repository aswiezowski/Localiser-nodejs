var express = require('express');
var router = express.Router();
var pg = require('pg').native;
var crypto = require('crypto');
var config_test = require('../config/db.json');

var pool = new pg.Pool(config_test);

pool.on('error', function (error, client) {
    console.error("Error from pool: ", error)
});

router.get('/:code', get);

function get(request, response) {
    var code = request.params.code;
    pool.query('SELECT * FROM localisations WHERE code = $1', [code])
        .then(result => handleResult(response, result))
        .catch(exception => handleException(exception, response));
}

function handleResult(response, result) {
    if (result.rows[0]) {
        response.json(result.rows[0]);
    } else {
        response.status(404).json({"status": "Can't find location with given code"})
    }
}

function handleException(exception, response) {
    console.error('error fetching client from pool', exception);
    response.status(500).json(exception);
}

router.post('/', save);

function save(request, response) {
    var location = getLocationFrom(request.body);
    if (!isValid(location)) {
        response.status(400).json({"status": "Longitude or latitude is invalid"});
        return;
    }
    location.code = getCode();
    pool.query('INSERT INTO localisations(latitude, longitude, code, description) VALUES($1, $2, $3, $4)', [location.latitude, location.longitude, location.code, location.description])
        .then(result => response.json({"code": location.code}))
        .catch(exception => handleException(exception, response));
}

function getLocationFrom(body) {
    return {
        "latitude": body.latitude,
        "longitude": body.longitude,
        "description": body.description
    };
}

function isValid(location) {
    if (location.longitude < -180 || location.longitude > 180 || location.latitude < -90 || location.latitude > 90) {
        return false;
    }
    return true;
}
function getCode() {
    var bytes = crypto.randomBytes(6);
    return Buffer.from(bytes).toString('base64');
}

router.delete('/:code', remove);

function remove(request, response) {
    var code = request.params.code;
    pool.query('DELETE FROM localisations WHERE code = $1', [code])
        .then(result => response.json({"status": "Deleted successfully"}))
        .catch(exception => handleException(exception, response));
}

router.put("/:code", update);

function update(request, response) {
    var location = getLocationFrom(request.body);
    if (!isValid(location)) {
        response.status(400).json({"status": "Longitude or latitude is invalid"});
        return;
    }
    location.code = request.params.code;
    pool.query('UPDATE localisations SET (latitude, longitude, description) = ($1, $2, $3)', [location.latitude, location.longitude, location.description])
        .then(result => response.json({"status": "Updated successfully"}))
        .catch(exception => handleException(exception, response));
}

module.exports = router;