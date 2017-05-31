var chai = require('chai');
var location = require('../models/location')

var assert = chai.assert;


suite('Location', function () {
    setup(function () {
    });

    suite('distance', function () {
        test('should return valid distance between two locations', function () {
            var loc1 = new location(52.241929, 20.993809);
            var loc2 = new location(52.244274, 21.000941);
            var distance = loc1.distance(loc2);

            assert.approximately(distance, 551.28, 1);
        });
    });
});