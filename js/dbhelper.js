/**
 * Common database helper functions.
 */
class DBHelper {

  static initIDB() {
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

    var open = indexedDB.open('restaurant-db', 1);

    open.onupgradeneeded = function() {
      var db = open.result;
      var store = db.createObjectStore("restaurants", {keyPath: "id"});
      var reviews = db.createObjectStore("reviews", {keyPath: "id", autoIncrement: true});
    };

    return open;
  }

  static readIDB(callback) {
    var open = DBHelper.initIDB();

    open.onsuccess = function() {
      // Start a new transaction
      var db = open.result;
      var tx = db.transaction("restaurants", "readonly");
      var store = tx.objectStore("restaurants");

      var getRestaurants = store.getAll();

      getRestaurants.onsuccess = function() {
          callback(getRestaurants.result);
      };

      // Close the db when the transaction is done
      tx.oncomplete = function() {
          db.close();
      };
    }
  }

  static writeIDB(data) {
    var open = DBHelper.initIDB();

    open.onsuccess = function() {
      // Start a new transaction
      var db = open.result;
      var tx = db.transaction("restaurants", "readwrite");
      var store = tx.objectStore("restaurants");

      store.put(data);

      // Close the db when the transaction is done
      tx.oncomplete = function() {
          db.close();
      };
    }
  }

  static readRestaurentReviewsIDB(id, callback) {
    var open = DBHelper.initIDB();

    open.onsuccess = function() {
      // Start a new transaction
      var db = open.result;
      var tx = db.transaction("reviews", "readonly");
      var store = tx.objectStore("reviews");

      var getReviews = store.getAll();
      console.log('readRestaurentReviewsIDB for restaurant ', id);
      getReviews.onsuccess = function() {
          let results = getReviews.result.filter(r => r.restaurant_id == id);
          console.log('unfiltered reviews: ', getReviews.result);
          console.log('filtered reviews: ', results);
          if (results.length == 0) { results = {}; }
          callback(results);
      };

      // Close the db when the transaction is done
      tx.oncomplete = function() {
          db.close();
      };
    }
  }

  static readAllReviewsIDB(callback) {
    var open = DBHelper.initIDB();

    open.onsuccess = function() {
      // Start a new transaction
      var db = open.result;
      var tx = db.transaction("reviews", "readonly");
      var store = tx.objectStore("reviews");

      var getReviews = store.getAll();

      getReviews.onsuccess = function() {
          callback(getReviews.result);
      };

      // Close the db when the transaction is done
      tx.oncomplete = function() {
          db.close();
      };
    }
  }

  static writeReviewsIDB(data) {
    var open = DBHelper.initIDB();

    open.onsuccess = function() {
      // Start a new transaction
      var db = open.result;
      var tx = db.transaction("reviews", "readwrite");
      var store = tx.objectStore("reviews");
      var showMsg = true;

      if (data.id != undefined) {
        showMsg = false;
      }
      if (data.updatedAt == undefined) {
        data['updatedAt'] = new Date();
      }

      console.log('IDB store autoIncrement: ', store.autoIncrement);
      console.log('review data for IDB: ', data);

      var updateReviewRequest = store.put(data);

      updateReviewRequest.onsuccess = function() {
        if (showMsg == true) {
          var msg = document.getElementById("msg_success");
          msg.style.opacity = "1";
          msg.style.display = "block";
        }
        console.log('success storing review!');
      };

      // Close the db when the transaction is done
      tx.oncomplete = function() {
          db.close();
      };
    };

    open.onerror = function() {
      console.log("There has been an error within writeReviewsIDB: " + open.error);
      var msg = document.getElementById("msg_error");
      msg.style.opacity = "1";
      msg.style.display = "block";
    };
  }

  static deleteReviewByIdIDB(reviewID) {
    var open = DBHelper.initIDB();

    open.onsuccess = function() {
      // Start a new transaction
      var db = open.result;
      var tx = db.transaction("reviews", "readwrite");
      var store = tx.objectStore("reviews");

      var deleteRequest = store.delete(reviewID);

      deleteRequest.onsuccess = function() {
          console.log('review ', reviewID, ' from IDB deleted');
      };

      // Close the db when the transaction is done
      tx.oncomplete = function() {
          db.close();
      };
    }
  }

  static deleteReviewByRestaurantIdIDB(restaurantID) {
    var open = DBHelper.initIDB();

    open.onsuccess = function() {
      // Start a new transaction
      var db = open.result;
      var tx = db.transaction("reviews", "readwrite");
      var store = tx.objectStore("reviews");

      var getReviews = store.getAll();
      console.log('deleteReviewByRestaurantIdIDB for restaurant ', restaurantID);
      getReviews.onsuccess = function() {
          getReviews.result.map(function(reviews) {
            if (reviews['restaurant_id'] == restaurantID) {
              let reviewID = reviews['id'];
              var deleteRequest = store.delete(reviewID);
              deleteRequest.onsuccess = function() {
                  console.log('review ', reviewID, ' from IDB deleted');
              };
            }
          });
      };

      // Close the db when the transaction is done
      tx.oncomplete = function() {
          db.close();
      };
    }
  }

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATA_URL() {
    const port = 1337; // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  static get REVIEWS_GET_URL() {
    const port = 1337; // Change this to your server port
    return `http://localhost:${port}/reviews/?restaurant_id=`;
  }

  static get REVIEW_POST_URL() {
    const port = 1337; // Change this to your server port
    return `http://localhost:${port}/reviews/`;
  }

  /**
   * Fetch reviews by restaurant_id.
   */
  static fetchReviewsByRestaurantId(id, callback) {
    DBHelper.readRestaurentReviewsIDB(id, (reviews) => {
      if (typeof reviews !== 'undefined' && reviews.length > 0) {
        console.log('reviews for restaurant-', id,' from IDB: ', reviews);
        callback(null, reviews);
      } else {
        console.log('reviews for restaurant-', id,' from API');
        fetch(DBHelper.REVIEWS_GET_URL + id, {method: "GET"})
          .then((resp) => resp.json())
          .then(function(data) {
            data.map(function(reviews) {
              reviews['fromAPI'] = true;
              DBHelper.writeReviewsIDB(reviews);
            });
            console.log('fetched reviews for restaurant-', id, ': ', data);
            callback(null, data);
          })
          .catch(function(error) {
            callback(error, null);
          });
      }
    });
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    DBHelper.readIDB((restaurants) => {
      if (typeof restaurants !== 'undefined' && restaurants.length > 0) {
        console.log('restaurants from IDB');
        callback(null, restaurants);
      } else {
        console.log('restaurants from API');
        fetch(DBHelper.DATA_URL, {method: "GET"})
          .then((resp) => resp.json())
          .then(function(data) {
            data.map(restaurant => DBHelper.writeIDB(restaurant));
            callback(null, data);
          })
          .catch(function(error) {
            callback(error, null);
          });
      }
    });
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

  static postReview(reviewData) {
    console.log('post review to API');
    fetch(DBHelper.REVIEW_POST_URL, {
      method: 'POST',
      body: JSON.stringify(reviewData),
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: 'same-origin', // include, same-origin, *omit
      mode: 'no-cors', // no-cors, cors, *same-origin
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // *client, no-referrer
    })
    .then(function() {
      console.log('post-review restaurantID:', reviewData.restaurant_id);
      DBHelper.deleteReviewByRestaurantIdIDB(reviewData.restaurant_id);
      var msg = document.getElementById("msg_success");
      msg.style.opacity = "1";
      msg.style.display = "block";
      console.log('success posting review!');
    })
    .catch(function(error) {
      var msg = document.getElementById("msg_error");
      msg.style.opacity = "1";
      msg.style.display = "block";
      console.log('error posting review: ', error);
    });
  }

  static storeReview(reviewData) {
    console.log('store review in indexedDB');
    var response = DBHelper.writeReviewsIDB(reviewData);
  }

  static submitStoredReviews() {
    DBHelper.readAllReviewsIDB((reviews) => {
      if (typeof reviews !== 'undefined' && reviews.length > 0) {
        console.log('reviews from IDB:', reviews);

        reviews.map((review) => {
          if (review['fromAPI'] == true) {
            return;
          }

          var reviewID = review['id'];
          delete review['id'];
          delete review['updatedAt'];
          console.log('review: ', review);
          console.log('post stored review to API');
          fetch(DBHelper.REVIEW_POST_URL, {
            method: 'POST',
            body: JSON.stringify(review),
            headers: new Headers({
              'Content-Type': 'application/json'
            }),
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            // credentials: 'same-origin', // include, same-origin, *omit
            mode: 'no-cors', // no-cors, cors, *same-origin
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // *client, no-referrer
          })
          .then(function() {
            // DBHelper.deleteReviewByIdIDB(reviewID);
            DBHelper.deleteReviewByRestaurantIdIDB(review.restaurant_id);
            console.log('success posting stored review!');
          })
          .catch(function(error) {
            console.log('error posting stored review: ', error);
          });
        });

      } else {
        console.log('no stored reviews in IDB');
      }
    });
  }

}
