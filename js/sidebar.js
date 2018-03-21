function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    if (document.getElementById("maincontent-main")) {
      document.getElementById("maincontent-main").style.marginLeft = "250px";
    } else {
      document.getElementById("maincontent").style.marginLeft = "250px";
    }
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    if (document.getElementById("maincontent-main")) {
      document.getElementById("maincontent-main").style.marginLeft= "0";
    } else {
      document.getElementById("maincontent").style.marginLeft= "0";
    }
}
