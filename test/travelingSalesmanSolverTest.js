var chai = require('chai');
var simple = require('simple-mock')
var distanceCalculator = require('../logic/distanceCalculator')
var Location = require('../models/location')
var solver = require('../logic/travelingSalesmanSolver')

var assert = chai.assert;


suite('Traveling Salesman Solver', function () {
    setup(function () {
    });

    suite('findShortestPath', function () {
        test('shouldReturnSamePathWhenLessThanFourLocations', function () {
            var loc1 = new Location(52.249592, 21.012296, "Main Square");
            var loc2 = new Location(52.247608, 21.014779, "King's Castle");
            var loc3 = new Location(52.242998, 21.016722, "Presidential Palace");
            var initialLocations = [loc1, loc2, loc3];

            var path = solver.findShortestPath(loc3, initialLocations);

            assert.deepEqual(path, initialLocations);
        });

        test('shouldReturnLessOrEqualPathDistance', function () {
            var loc1 = new Location(50.061424, 19.937340, "Main Square");
            var loc2 = new Location(50.054640, 19.893508, "Koscioszko Mound");
            var loc3 = new Location(50.054877, 19.893238, "Pilsudzki Mound");
            var loc4 = new Location(50.037975, 19.958465, "Krak Mound");
            var loc5 = new Location(50.070075, 20.068145, "Wanda Mound");
            var initialLocations = [loc1, loc2, loc3, loc4, loc5];

            var path = solver.findShortestPath(loc3, initialLocations);
            var pathDistance = distanceCalculator.getDistanceWithCycle(path);
            var initialPathdistance = distanceCalculator.getDistanceWithCycle(initialLocations);

            assert.isTrue(pathDistance <= initialPathdistance);
        });

        test('shouldReturnEqualDistanceWhenPermutatingLocations', function () {
            var loc1 = new Location(50.070892, 19.938521, "krakow");
            var loc2 = new Location(50.254658, 19.024302, "katowice");
            var loc3 = new Location(51.755600, 19.450057, "lodz");
            var loc4 = new Location(52.399548, 16.920722, "poznan");
            var loc5 = new Location(52.220967, 21.015730, "warszawa");

            var path = solver.findShortestPath(loc3, [loc1, loc2, loc3, loc4, loc5]);
            var path2 = solver.findShortestPath(loc1, [loc5, loc2, loc1, loc4, loc3]);
            var path1Distance = distanceCalculator.getDistanceWithCycle(path);
            var path2Distance = distanceCalculator.getDistanceWithCycle(path2);

            assert.approximately(path1Distance, path2Distance, 0.0001);
        });

    });
});