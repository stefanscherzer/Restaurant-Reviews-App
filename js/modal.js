var modal = document.getElementById('reviewModal');

// Get the button that opens the modal
var btn = document.getElementById("reviewBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

window.addEventListener("DOMContentLoaded", function () {
  document.forms[0].onsubmit = async(e) => {
    e.preventDefault();

    const formdata = new FormData(e.target);
    var object = {};
    formdata.forEach(function(value, key){
        object[key] = value;
    });
    // var json = JSON.stringify(object);

    console.log('form values: ', object);
    console.log('status: ', navigator.onLine);
    if (navigator.onLine == true) {
      DBHelper.postReview(object);
    } else {
      DBHelper.storeReview(object);
    }

    modal.style.display = "none";
    document.forms[0].reset();
  }
});
