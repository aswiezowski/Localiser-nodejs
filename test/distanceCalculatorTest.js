var chai = require('chai');
var simple = require('simple-mock')
var distanceCalculator = require('../logic/distanceCalculator')
var Location = require('../models/location')

var assert = chai.assert;


suite('Location', function () {
    setup(function () {
    });

    suite('distance', function () {
        test('shouldReturnZeroWhenDistanceWithCycleForNoLocation', function () {
            var distance = distanceCalculator.getDistance([]);

            assert.equal(distance, 0);
        });

        test('shouldReturnValidDistanceForTwoLocations', function () {
            var loc1 = new Location();
            var loc2 = new Location();
            simple.mock(loc1, 'distance').returnWith(10);
            simple.mock(loc2, 'distance').returnWith(10);

            var distance = distanceCalculator.getDistance([loc1, loc2]);

            assert.equal(distance, 10);
        });

        test('shouldReturnValidDistanceWithCycleForTwoLocations', function () {
            var loc1 = new Location();
            var loc2 = new Location();
            simple.mock(loc1, 'distance').returnWith(11);
            simple.mock(loc2, 'distance').returnWith(11);

            var distance = distanceCalculator.getDistanceWithCycle([loc1, loc2]);

            assert.equal(distance, 22);
        });
    });
});