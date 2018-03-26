(function($){
    $(function(){
    
        $('.button-collapse').sideNav();
        $('.parallax').parallax();
    
    }); // end of document ready
    })(jQuery); // end of jQuery name space

$(document).ready(function() {
    $("#getWeatherForcast").click(function() {
        var city = $("#city").val();
        var key = '8877070b6d5e68288c1f3a0dbac54ef6';

        $.ajax({
            url: '',
        });
    });
});

/*fetch('/events')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);
        var arrayLength = myJson.length;
        for (var i = 0; i < arrayLength; i++) {
            var p = document.createElement("p");
            p.className = "left-align light"       
            p.innerHTML = myJson[i].name + " Datum: " + myJson[i].start.day + "-" + myJson[i].start.month + "-2018" + " Tijdstip: " + myJson[i].start.hour + ":00"              
            document.getElementById("holder").appendChild(p);                   
    }
  });*/

  fetch('/events')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);
        var arrayLength = myJson.length;
        for (var i = 0; i < arrayLength; i++) {
            var p = document.createElement("p");
            p.className = "left-align light apiName"   
            p.innerHTML = myJson[i].name           
            document.getElementById("holder").appendChild(p);  
            var p = document.createElement("p");
            p.className = "left-align light apiDate"       
            p.innerHTML =  myJson[i].start.day + '-' + myJson[i].start.month + '-2018'    
            document.getElementById("holder").appendChild(p);   
            var p = document.createElement("p");
            p.className = "left-align light apiTime"       
            p.innerHTML =  myJson[i].start.hour + ':00'           
            document.getElementById("holder").appendChild(p);                   
    }
  });
