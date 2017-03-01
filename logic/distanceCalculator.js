module.exports.getDistanceWithCycle = function getDistanceWithCycle(locations) {
    if (locations.length == 0) {
        return 0;
    }
    var distance = module.exports.getDistance(locations)
    return distance + locations[0].distance(locations[locations.length - 1]);
}

module.exports.getDistance = function getDistance(locations) {
    var distance = 0.0;
    for (var i = 0; i < locations.length - 1; i++) {
        distance += locations[i].distance(locations[i + 1])
    }
    return distance;
}
