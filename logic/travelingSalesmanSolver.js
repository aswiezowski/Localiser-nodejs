var distances = [];
var locations = [];

module.exports.findShortestPath = function findShortestPath(startLocation, initialLocations) {
    if (initialLocations.length < 4) {
        return initialLocations.slice();
    }
    var queue = [];
    initDistances(initialLocations);
    var solution = [];
    solution.push(0);
    var bestPath = getInititalSolution();
    var bestDistance = getDistanceWithCycle(bestPath);
    queue.push(solution);
    while (queue.length != 0) {
        solution = getBest(queue);
        queue.splice(queue.indexOf(solution), 1);
        if (getLowerBound(solution) < bestDistance) {
            var children = getBranches(solution);
            for (let childIndex in children) {
                var child = children[childIndex];
                if (child.length == locations.length) {
                    var distanceWithCycle = getDistanceWithCycle(child);
                    if (distanceWithCycle < bestDistance) {
                        bestDistance = distanceWithCycle;
                        bestPath = child;
                    }
                } else {
                    var bound = getLowerBound(child);
                    if (bound < bestDistance) {
                        queue.push(child);
                    }
                }
            }
        }
    }
    return getResults(startLocation, bestPath);
}

function initDistances(initLocations) {
    locations = initLocations.slice();
    distances = new Array(locations.length);
    for (var i = 0; i < locations.length; i++) {
        distances[i] = new Array(locations.length);
        for (var j = 0; j < locations.length; j++) {
            if (i == j) {
                distances[i][j] = Number.MAX_VALUE;
            } else {
                distances[i][j] = locations[i].distance(locations[j]);
            }
        }
    }
}

function getInititalSolution() {
    var initialBest = [];
    for (var node = 0; node < distances.length; node++) {
        initialBest.push(node);
    }
    return initialBest;
}

function getLowerBound(partialSolution) {
    var minDistance = getDistanceForPath(partialSolution);
    for (var nodeFrom = 0; nodeFrom < distances.length; nodeFrom++) {
        if (partialSolution.indexOf(nodeFrom) == -1 || isLastInList(nodeFrom, partialSolution)) {
            var min = Number.MAX_VALUE;
            for (var nodeTo = 0; nodeTo < distances.length; nodeTo++) {
                if (partialSolution.indexOf(nodeTo) == -1) {
                    min = Math.min(min, getDistance(nodeFrom, nodeTo));
                }
            }
            minDistance += min;
        }
    }
    return minDistance;
}

function getBest(paths) {
    return paths.reduce(function (prev, curr) {
        return getDistanceWithCycle(prev) < getDistanceWithCycle(curr) ? prev : curr;
    });
}

function getDistanceForPath(path) {
    var distance = 0.0;
    for (var i = 0; i < path.length - 1; i++) {
        distance += getDistance(path[i], path[i + 1]);
    }
    return distance;
}

function isLastInList(item, list) {
    return list.indexOf(item) + 1 == list.length;
}

function getBranches(partialSolution) {
    var branches = [];
    for (var node = 0; node < locations.length; node++) {
        if (partialSolution.indexOf(node) == -1) {
            var branch = partialSolution.slice();
            branch.push(node);
            if (branch.length == locations.length - 1) {
                branch = branch.concat(getMissingNodes(branch));
            }
            branches.push(branch);
        }
    }
    return branches;
}

function getMissingNodes(branch) {
    var missingNode = [];
    for (var node = 0; node < locations.length; node++) {
        if (branch.indexOf(node) == -1) {
            missingNode.push(node);
        }
    }
    return missingNode;
}

function getResults(startLocation, solution) {
    var startLocationId = locations.indexOf(startLocation);
    var startNode = solution.indexOf(startLocationId);
    var result = [];
    for (var node = startNode; node < solution.length; node++) {
        result.push(locations[solution[node]]);
    }
    for (var node = 0; node < startNode; node++) {
        result.push(locations[solution[node]]);
    }
    return result;
}

function getDistance(startNode, endNode) {
    return distances[startNode][endNode];
}

function getDistanceWithCycle(path) {
    var distance = 0.0;
    for (var i = 0; i < path.length - 1; i++) {
        distance += getDistance(path[i], path[i + 1]);
    }
    distance += getDistance(path[path.length - 1], path[0]);
    return distance;
}