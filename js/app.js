var map;
function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 59.3293, lng: 18.0686},
        zoom: 13
    });

    // Create a new blank array for all the listing markers.
        var markers = []
        var locations = [
            {title: 'Kungsträdgården', location: {lat: 59.3312, lng: 18.0701}},
            {title: 'Fotografiska', location: {lat: 59.3176787, lng: 18.0840427}},
            {title: 'Storkyrkan', location: {lat: 59.3283089, lng: 18.0615532}},
            {title: 'Stockholms Medeltidsmuseum', location: {lat: 59.3282955, lng: 18.0681193}},
            {title: 'Sergels Torg', location: {lat: 59.3331614, lng: 18.0509036}}
        ];

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
            //icon: defaultIcon,
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
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

function AppViewModel() {
    this.firstName = ko.observable("Bert");
    this.lastName = ko.observable("Bertington");
}
ko.applyBindings(new AppViewModel());