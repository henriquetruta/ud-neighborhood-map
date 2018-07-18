var locations = [
    {title: 'Kungsträdgården', location: {lat: 59.3312, lng: 18.0701}, id: "50a4ed93e4b076212794a85d"},
    {title: 'Fotografiska', location: {lat: 59.3176787, lng: 18.0840427}, id: "4e733f1cfa76812398c108eb"},
    {title: 'Storkyrkan', location: {lat: 59.3283089, lng: 18.0615532}, id: "51ed16a1498e8e7bddb91ac8"},
    {title: 'Stockholms Medeltidsmuseum', location: {lat: 59.3282955, lng: 18.0681193}, id: "568526f5498e3d43edc46556"},
    {title: 'Sergels Torg', location: {lat: 59.3331614, lng: 18.0509036}, id: "4c5b30c7857ca59333cec6cb"}
];
var map;
var largeInfoWindow;
var markers = []

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
        largeInfoWindow = new google.maps.InfoWindow();
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfoWindow);
            bounce(this);
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
}

var foursquareBaseUrl = "https://api.foursquare.com/v2/venues/";
var token = "4DP1YIFCPFTYVVOGNPQGJUPTHWGTOL1UPY1VN42W12DPX0HJ";
var clientId = "XQA2ZAKTSM0GQQE3SKSBCOF3EOFSTQUSR0SE3IH3DI2HV50A";
var authSuffix = "?v=20161016&client_id=" + clientId + "&client_secret=" + token;
var querySuffix = "&query=park&intent=browse&radius=2000";

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
                } else {
                    var locationDetails = response['response']['venue'];
                    var name = locationDetails['name'];
                    self.imageDetails(name);
                    self.imagePath(getImageFullUrl(locationDetails['bestPhoto']));
                    self.likes("Likes: " + locationDetails['likes']['count']);
                    self.markerDetails(true);
                }
                var marker = self.getCorrespondingMarker(name);
                populateInfoWindow(marker, infoWindow, locationDetails);
                bounce(marker);
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

function populateInfoWindow(marker, infoWindow, locationDetails) {
    // Check to make sure the infoWindow is not already opened on this marker.
    if (infoWindow.marker != marker) {
        // Clear the infoWindow content to give foursquare time to load.
        infoWindow.setContent('');
        infoWindow.marker = marker;
        // TODO: Uncomment
        // var name = locationDetails['name'];
        // var imageUrl = getImageFullUrl(locationDetails['bestPhoto']);
        // var likes = locationDetails['likes']['count'] + " Likes";
        // var locationUrl = locationDetails['canonicalUrl'];

        var name = "NOMEEE"
        var imageUrl = "https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2016/04/1461661155cheshire1-feat.png";
        var locationUrl = "https://foursquare.com/v/foursquare-hq/4ab7e57cf964a5205f7b20e3";
        var likes = "5 Likes";
        var content = ('<div>' +
            '<span>{0}</span><br>'+
            '<img width="160px" height="160px" src="{1}"/><br>' +
            '<a href="{2}" target="_blank">View on Foursquare</a>' +
            '<span>{3}</span> </div>').format(name, imageUrl, locationUrl, likes);
        infoWindow.setContent(content);
        // Make sure the marker property is cleared if the infoWindow is closed.
        infoWindow.addListener('closeclick', function() {
            infoWindow.marker = null;});
        // Open the infoWindow on the correct marker.
        infoWindow.open(map, marker);
    }
}

ko.applyBindings(new AppViewModel());