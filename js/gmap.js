
/**
 * Initialize Google map, called from HTML.
 */
loadMap = () => {
  let elem = document.getElementById('staticMap');
  elem.parentNode.removeChild(elem);

  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });

  google.maps.event.addListenerOnce(map, 'idle', function(){
    // do something only the first time the map is loaded
    document.getElementsByTagName('iframe')[0].setAttribute('title', 'Google Maps for restaurants');
  });

  DBHelper.fetchRestaurants((error, restaurants) => {
    if (error) {
      console.log('error fetching restaurants:', error);
    } else {
      restaurants.forEach(restaurant => {
        // Add marker to the map
        const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
        google.maps.event.addListener(marker, 'click', () => {
          window.location.href = marker.url
        });
        self.markers.push(marker);
      });
    }
  });
};

loadMap();
