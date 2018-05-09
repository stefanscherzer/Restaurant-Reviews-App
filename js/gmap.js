document.addEventListener("DOMContentLoaded", function(event) {
  function addScript( url, callback ) {
      var script = document.createElement( 'script' );
      if( callback ) script.onload = callback;
      script.type = 'text/javascript';
      script.src = url;
      document.body.appendChild( script );
  }

  function loadMapsAPI() {
      addScript( 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC_I5HXdV-tJTwj0ljdzbCx8DsxAL3ejmg&libraries=places&callback=initMap' );
  }

  loadMapsAPI();
});
