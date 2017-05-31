function toRadians(angle) {
    return angle * Math.PI / 180;
}

var Radius = 6371;

module.exports = class Location {
    constructor(latitude, longitude, description) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
    }

    distance(location) {
        var latDistance = toRadians(location.latitude - this.latitude)
        var lonDistance = toRadians(location.longitude - this.longitude)
        var a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2) + Math.cos(toRadians(this.latitude)) * Math.cos(toRadians(location.latitude)) * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2)
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Radius * c * 1000
    }

    isValid() {
        if (this.longitude < -180 || this.longitude > 180 || this.latitude < -90 || this.latitude > 90) {
            return false;
        }
        return true;
    }


}

