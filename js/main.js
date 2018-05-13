let restaurants,
  neighborhoods,
  cuisines
var map
var markers = []

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  });
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  activateFavoriteButtons();
  if (document.getElementsByTagName('iframe')[0] != undefined && document.getElementsByTagName('iframe')[0].getAttribute('title') == 'Google Maps for restaurants') {
    console.log('addMarkersToMap');
    addMarkersToMap();
  } else {
    console.log('loadStaticMapsAPI');
    loadStaticMapsAPI();
  }
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  const imgName = DBHelper.imageUrlForRestaurant(restaurant);
  const ext = 'jpg';

  const picture = document.createElement('picture');
  const src1 = document.createElement('source');
  src1.setAttribute('media', '{min-width: 801px}');
  src1.setAttribute('srcset', imgName + '_large_1x.' + ext + ' 1x, ' + imgName + '_large_2x.' + ext + ' 2x');
  picture.append(src1);
  const src2 = document.createElement('source');
  src2.setAttribute('media', '{min-width: 501px}');
  src2.setAttribute('srcset', imgName + '_medium_1x.' + ext + ' 1x, ' + imgName + '_medium_2x.' + ext + ' 2x');
  picture.append(src2);
  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = imgName + '_small.' + ext;
  image.alt = restaurant.name + ' - restaurant\'s photo';
  picture.append(image);
  li.append(picture);

  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more);

  const favStatus = (restaurant.is_favorite == undefined ? 'false' : String(restaurant.is_favorite));
  console.log('status: ', favStatus, ' --- ', String(restaurant.is_favorite));
  const fav = document.createElement('button');
  fav.className = (favStatus == 'false' ? 'faBtn fa fa-star-o' : 'faBtn fa fa-star');
  fav.value = restaurant.id + '_' + favStatus;
  li.append(fav);

  return li;
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
}

loadStaticMapsAPI = (restaurants = self.restaurants) => {
  let coordinates = '';
  restaurants.forEach(restaurant => {
    coordinates += '&markers=' + restaurant.latlng.lat + ',' + restaurant.latlng.lng;
  });

  let lat = 40.722216;
  let lng = -73.987501;
  let zoom = 12;

  let mapURL = 'https://maps.googleapis.com/maps/api/staticmap?center=' + lat + ',' + lng + '&zoom=' + zoom + '&size=640x400&scale=2key=AIzaSyC_I5HXdV-tJTwj0ljdzbCx8DsxAL3ejmg' + coordinates;

  const image = document.createElement('img');
  image.src = mapURL;
  image.id = 'staticMap';
  image.alt = 'New York City';

  document.getElementById('map').appendChild(image);
}

document.getElementById('map').addEventListener('mouseover', function(event) {
  let mapsUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC_I5HXdV-tJTwj0ljdzbCx8DsxAL3ejmg&libraries=places';
  let mapsInit = 'js/gmap.js';

  [
    mapsUrl,
    mapsInit
  ].forEach(function(src) {
    var script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.async = false;
    document.body.appendChild(script);
  });
}, {once : true});

activateFavoriteButtons = () => {
  console.log('activateFavoriteButtons now ...');
  Array.from(document.getElementsByClassName('faBtn')).forEach(function(element) {
    element.addEventListener('click', function(e) {
      console.log('btn value: ', this.value);
      let tgt = e.target;
      tgt.classList.toggle('fa-star');
      tgt.classList.toggle('fa-star-o');

      let res = this.value.split('_');
      let favorite = (res[1] == 'true' ? 'false' : 'true');
      tgt.value = res[0] + '_' + favorite;
      DBHelper.toggleFavoriteRestaurant(res[0], favorite);
      DBHelper.clearIDB();
    });
  });
}

updateRestaurants();
