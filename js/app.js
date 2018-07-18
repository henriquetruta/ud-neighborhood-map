var locations = [
    {title: 'Kungsträdgården', location: {lat: 59.3312, lng: 18.0701}, id: "50a4ed93e4b076212794a85d"},
    {title: 'Fotografiska', location: {lat: 59.3176787, lng: 18.0840427}, id: "4e733f1cfa76812398c108eb"},
    {title: 'Storkyrkan', location: {lat: 59.3283089, lng: 18.0615532}, id: "51ed16a1498e8e7bddb91ac8"},
    {title: 'Stockholms Medeltidsmuseum', location: {lat: 59.3282955, lng: 18.0681193}, id: "568526f5498e3d43edc46556"},
    {title: 'Sergels Torg', location: {lat: 59.3331614, lng: 18.0509036}, id: "4c5b30c7857ca59333cec6cb"}
];
var map;
var markers = []

function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
  }

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 59.3293, lng: 18.0686},
        zoom: 13
    });

    // Create a new blank array for all the listing markers.
        var defaultIcon = makeMarkerIcon('d10a0a');
        var highlightedIcon = makeMarkerIcon('e59706');

        //ko.applyBindings(locations);
        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            // populateInfoWindow(this, largeInfowindow);
            toggleBounce(this);
        });
        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
        }
        showListings()

    function showListings() {
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    }
    function populateInfoWindow(marker, infowindow) {}
}

var foursquareBaseUrl = "https://api.foursquare.com/v2/venues/";
var token = "4DP1YIFCPFTYVVOGNPQGJUPTHWGTOL1UPY1VN42W12DPX0HJ";
var clientId = "XQA2ZAKTSM0GQQE3SKSBCOF3EOFSTQUSR0SE3IH3DI2HV50A";
var authSuffix = "?v=20161016&client_id=" + clientId + "&client_secret=" + token;
var querySuffix = "&query=park&intent=browse&radius=2000";

function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

function getImageFullUrl(photo) {
    return photo['prefix'] + "300x300" + photo['suffix'];
}

function AppViewModel() {
    var self = this;

    self.locations = ko.observableArray(locations);
    self.query = ko.observable('');

    self.markerDetails = ko.observable(false);
    self.imagePath = ko.observable('');
    self.imageDetails = ko.observable('');
    self.likes = ko.observable('');

    self.filteredLocations = ko.computed(function() {
        if (!self.query()) {
            markers.map(m => m.setVisible(true));
            return self.locations();
        } else {
            markers.map(m =>
                m.title.toLowerCase().includes(self.query().toLowerCase()) ?
                m.setVisible(true) : m.setVisible(false));
            return self.locations().filter(
                l => l.title.toLowerCase().includes(self.query().toLowerCase()));
        }
    });

    self.hideInfo = function() {
        self.markerDetails(false);
    }

    self.getCorrespondingMarker = function(name) {
        var i;
        for (i = 0; i < markers.length; i++) {
            if (markers[i].title == name) {
                return markers[i];
            }
        }
        return markers[0];
    }

    self.toggleShowDetails = function(location) {
        url = foursquareBaseUrl + location.id + "/" + authSuffix;
        $.ajax({
            type: "GET",
            url: url,
            success: function (response) {
                if (self.markerDetails() == true) {
                    self.markerDetails(false);
                    // self.hideInfo();
                } else {
                    var locationDetails = response['response']['venue'];
                    var name = locationDetails['name'];
                    self.imageDetails(name);
                    self.imagePath(getImageFullUrl(locationDetails['bestPhoto']));
                    self.likes("Likes: " + locationDetails['likes']['count']);
                    self.markerDetails(true);
                }
                toggleBounce(self.getCorrespondingMarker(name));
            },
            error: function (xhr) {
                if (xhr.status == 429) {
                    alert("Looks like there is some problem with your " +
                          "Foursquare requests quota. Please, try again later.");
                } else if (xhr.status >= 401 && xhr.status <= 403) {
                    alert("There was an authentication error with the Foursquare " +
                          "API. Check your credentials and try again.");
                } else {
                    alert("An error occurred: " + xhr.responseJSON.meta.errorDetail);
                    console.log(xhr);
                }
            }
        });
    }
}

ko.applyBindings(new AppViewModel());