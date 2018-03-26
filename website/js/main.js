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

fetch('/events')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);
        var arrayLength = myJson.length;
        for (var i = 0; i < arrayLength; i++) {
            var div = document.createElement("div");       
            div.innerHTML = myJson[i].name + " " + myJson[i].start.month + "-" + myJson[i].start.day + " Dit begint om: " + myJson[i].start.hour + ":00"              
            document.getElementById("holder").appendChild(div);                   
    }
  });
