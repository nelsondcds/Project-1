console.log("js.js linked");


var mainthing = document.getElementById("mainform");
var ageQ = document.getElementById("agecheck");
var yesBtn = document.getElementById("yy");
var noBtn = document.getElementById("nn");
var refusePage = document.getElementById("notage")
var ageinfo = document.getElementById("infoform")



noBtn.addEventListener("click", function(e){
    e.preventDefault();
    refuseenter();
})

yesBtn.addEventListener("click", function(e){
    e.preventDefault();
    // beginmain();
    showinfo();
});

function beginmain() {
    mainthing.style.display = "block";
    ageQ.style.display = "none";
    ageinfo.style.display = "none";
}

function refuseenter() {
    refusePage.style.display = "block";
    ageQ.style.display = "none";
    ageinfo.style.display = "none";

  }

 function showinfo() {
    ageinfo.style.display = "block";
    ageQ.style.display = "none";
 } 

function CalculateAge(){

    var userDateinput = document.getElementById("DOB").value;  
    console.log(userDateinput);
    
    // convert user input value into date object
    var birthDate = new Date(userDateinput);
     console.log(" birthDate"+ birthDate);
    
    // get difference from current date;
    var difference=Date.now() - birthDate.getTime(); 
         
    var  ageDate = new Date(difference); 
    var calculatedAge=   Math.abs(ageDate.getUTCFullYear() - 1970);
    if (calculatedAge < 21 || userDateinput === "") {
       refuseenter();
    }else{
        beginmain();
        
    };
    
}


var formEl = document.querySelector("#brew-form");
var responseContainerEl = document.querySelector(".responsive-container");
var mapContainerEl = document.querySelector("#map");
var brewlistEl = document.querySelector("#brew-list");

var brewFormHandler = function(event) {
    event.preventDefault();
    var brewURL = "https://api.openbrewerydb.org/breweries?" //by_type=brewpub&by_page=10&by_dist=
    var geoURL = "https://www.mapquestapi.com/geocoding/v1/address?key=i59AhjaYZTQaOPj86iKkHTeoACIvMK7I&location="
    var addressInput = document.querySelector("input[name='address']").value;
    var cityInput = document.querySelector("input[name='city']").value;
    var stateInput = document.querySelector("select[name='state']").value;
    var breweryTypeInput = document.querySelector("select[name='brewery-type']").value;
    var listLengthInput = document.querySelector("input[name='list-length']").value;


    if (!addressInput || !cityInput || !stateInput) {
        brewlistEl.innerHTML = "";
        var addressAlert = document.createElement("h4");
        addressAlert.textContent = "You need to fill out the address form!";
        formEl.setAttribute("search-id","addressAlert");
        brewlistEl.appendChild(addressAlert);
        return false;
    }
    
    if (listLengthInput && (listLengthInput < 1 || listLengthInput > 50)) {
        brewlistEl.innerHTML = "";
        var numberAlert = document.createElement("h4");
        numberAlert.textContent = "You need to enter a number between 1 and 50!";
        formEl.setAttribute("search-id","numberAlert");
        brewlistEl.appendChild(numberAlert);
        return false;
    }

    formEl.reset();

    var newSearch = formEl.hasAttribute("search-id");

    if (newSearch) {
        brewlistEl.innerHTML = "";
    }

    geoURL += addressInput + "," + cityInput + "," + stateInput;

    if (listLengthInput) {
        brewURL += "per_page=" + listLengthInput;
    } else {
        brewURL += "per_page=10";
    }

    if (breweryTypeInput && breweryTypeInput != "") {
        brewURL += "&by_type=" + breweryTypeInput;
    }
    
    brewFetch(geoURL,brewURL);

    mapContainerEl.style.display = "block";
};


var brewFetch = function(geoURL,BrewURL){
    formEl.setAttribute("search-id","true");

    

    fetch(geoURL)
        .then(function(response){
            return response.json();
        })
        .then(function(response){
            var lat = JSON.stringify(response.results[0].locations[0].latLng.lat);

            var lng = JSON.stringify(response.results[0].locations[0].latLng.lng);


            BrewURL += "&by_dist=" + lat + "," + lng;

            fetch(BrewURL)
                .then(function(response){
                    return response.json();
                })
                .then(function(response){
                    var breweries = [];

                    var mapLatLng = [];

                    console.log(response);

                    for (var i = 0 ; i < response.length ; i++) {
                      
                        var listGroup = document.createElement("div");
                      
                        listGroup.setAttribute("class", "mb-4");
                      
                        breweries[i] = [];

                        mapLatLng[i] = [];

                        mapLatLng[i] = response[i].latitude + "," + response[i].longitude;

                        breweries[i][0] = document.createElement("p");


                        breweries[i][0].textContent = response[i].name;

                        breweries[i][1] = document.createElement("p");

                        breweries[i][1].textContent = response[i].brewery_type.toUpperCase();
                        
                        breweries[i][2] = document.createElement("p");
                        
                        breweries[i][2].textContent = response[i].street + ", " + response[i].city 
                            + ", " + response[i].state + " " + response[i].postal_code;



                            listGroup.appendChild(breweries[i][0]);
                        
                            listGroup.appendChild(breweries[i][1]);

                            listGroup.appendChild(breweries[i][2]);

                            brewlistEl.appendChild(listGroup);
                    }
                    


                    L.mapquest.key = 'i59AhjaYZTQaOPj86iKkHTeoACIvMK7I';

                    var map = L.mapquest.map('map', {
                        center: [lat, lng],
                        layers: L.mapquest.tileLayer('map'),
                        zoom: 12
                      });
                      
                      var directions = L.mapquest.directions();

                      directions.setLayerOptions({
                          startMarker: {
                              draggable: false,
                              icon: "marker",
                              iconOptions: {
                                  size: "sm",
                              }
                          },
                          endMarker: {
                              draggable: false,
                            icon: 'marker',
                            iconOptions: {
                              size: 'sm',
                            }
                          },
                          routeRibbon: {
                            color: "#2aa6ce",
                            opacity: 0,
                            showTraffic: false,
                            draggable: false
                          },
                          waypointMarker: {
                              draggable: false
                          },
                      });

                      L.mapquest.textMarker([lat, lng], {
                        text: 'You Are Here!',
                        position: 'bottom',
                        type: 'marker',
                        icon: {
                          primaryColor: '#00cc66',
                          secondaryColor: '#ffffff',
                          size: 'sm'
                        }
                      }).addTo(map);

                      directions.route({
                        locations: mapLatLng
                      });
                
                })
              
        })

};

formEl.addEventListener("submit", brewFormHandler);
