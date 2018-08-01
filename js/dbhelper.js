/**
 * Common database helper functions.
 */
const objectStore = 'restaurantObjectStore';
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  /**
   * Create IndexedDB
  */
  static initDB(){
    const indexedDB = window.indexedDB;
    const open = indexedDB.open('restaurantDB', 1);

    open.onupgradeneeded = function onUpgradeNeeded(){
      const db = open.result;
      db.createObjectStore(objectStore, {keyPath: 'id'});
    };

    return open;
  }

  /**
   * Store data to DB
  */
  static storeData(data){
    const open = DBHelper.initDB();

    open.onsuccess = function onSuccess(){
      const db = open.result;
      const tx = db.transaction(objectStore, 'readwrite');
      const store = tx.objectStore(objectStore);

      data.forEach((resp)=>{
        store.put(resp);
      });
    };
  }

  /**
   * Get data from DB
  */
  static getData(query, callback){
    const open = DBHelper.initDB();

    open.onsuccess = function onSuccess(){
      const db = open.result;
      const tx = db.transaction(objectStore, 'readwrite');
      const store = tx.objectStore(objectStore);

      let res = store.getAll();
      if (query){
        res = store.get(parseInt(query, 10));
      };

      res.onsuccess = function resOnSuccess(){
        callback(res.result);
      };

      tx.oncomplete = function onComplete(){
        db.close();
      };
    };
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    DBHelper.getData(null, (data)=>{
      if (data){
        console.log('DBs Data', data);
        callback(null, data);
      }

      fetch(DBHelper.DATABASE_URL)
      .then((response)=>response.json())
      .then((restaurant)=> {
        console.log('Response', restaurant);
        callback(null, restaurant);
        DBHelper.storeData(restaurant)
      })
      .catch((err)=>{
        callback(err, null);
      })

    })

  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.getData(id, (data)=>{
      if (data){
        console.log('DBs Data', data);
        callback(null, data);
        return;
      }
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
    return (`./img/${restaurant.id}.jpg`);
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

}

/**
 * Add title for iframes
 */
titleLoad = () =>{
  document.getElementsByTagName( "iframe" )[0].setAttribute("title", "Iframe Map");  
}
