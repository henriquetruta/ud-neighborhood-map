String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
}

function bounce(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ marker.setAnimation(null); }, 750);
}

function getImageFullUrl(photo) {
    return photo['prefix'] + "300x300" + photo['suffix'];
}

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

function showMenu() {
    var menu = document.getElementById("container");
    if (menu.style.display == "none" || menu.style.display == '') {
        menu.style.width = '300px';
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
        menu.style.width = '0px';
    }
}