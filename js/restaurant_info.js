let restaurant;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
      google.maps.event.addListenerOnce(map, 'idle', function(){
        // do something only the first time the map is loaded
        document.getElementsByTagName('iframe')[0].setAttribute('title', 'Google Maps for restaurants');
      });
    }
  });
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const imgURL = DBHelper.imageUrlForRestaurant(restaurant);
  const imgName = imgURL.substring(0, imgURL.lastIndexOf('.'));
  const ext = imgURL.substring(imgURL.lastIndexOf('.')+1);;

  const picture = document.getElementById('restaurant-pic');
  const src1 = document.createElement('source');
  src1.setAttribute('media', '{min-width: 801px}');
  src1.setAttribute('srcset', imgName + '_large_1x.' + ext + ' 1x, ' + imgName + '_large_2x.' + ext + ' 2x');
  picture.append(src1);
  const src2 = document.createElement('source');
  src2.setAttribute('media', '{min-width: 501px}');
  src2.setAttribute('srcset', imgName + '_medium_1x.' + ext + ' 1x, ' + imgName + '_medium_2x.' + ext + ' 2x');
  picture.append(src2);
  const image = document.createElement('img');
  image.id = 'restaurant-img';
  image.src = imgName + '_small.' + ext;
  image.alt = restaurant.name + ' - restaurant\'s photo';;
  picture.append(image);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  li.classList.add('review-container');

  const reviewHeader = document.createElement('div');
  reviewHeader.classList.add('review-header');
  li.appendChild(reviewHeader);

  const name = document.createElement('div');
  name.classList.add('review-name');
  name.innerHTML = review.name;
  reviewHeader.appendChild(name);

  const date = document.createElement('div');
  date.classList.add('review-date');
  date.innerHTML = review.date;
  reviewHeader.appendChild(date);

  const rating = document.createElement('div');
  rating.classList.add('review-rating');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');

  // var a = document.createElement('a');
  // var linkText = document.createTextNode("my title text");
  // a.appendChild(linkText);
  // a.title = "my title text";
  // a.href = "http://example.com";

  const a = document.createElement('a');
  a.href = DBHelper.urlForRestaurant(restaurant);
  a.innerHTML = restaurant.name;
  a.setAttribute('aria-current', 'page');
  li.appendChild(a);

  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
