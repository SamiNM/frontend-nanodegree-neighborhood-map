var map;
var markers = [];
var list = ko.observableArray(['Select All']);
var bounds;
var Model = function(){
    // All the locations and its title are located here in this object
    this.locations = ko.observable([
           {title:'Jenadriyah', location: {lat: 24.9614714 , lng: 46.7924881 }},
           {title:'King Abdul Aziz Historical Centre', location: {lat: 24.6482653 , lng: 46.710906 }},
           {title:'King Khalid International Airport', location: {lat: 24.9594483 , lng: 46.7030525 }},
           {title:'King Saud University',    location: {lat: 24.7162327 , lng: 46.6191101 }},
           {title:'King Abdullah Financial District', location: {lat: 24.7619573 , lng: 46.6404337 }},
           {title:'Diriyah',  location: {lat: 24.7513522 , lng: 46.535511 }},
           {title:'King Fahd Medical City',  location: {lat: 24.6878492 , lng: 46.7034388 }},
           {title:'Kingdom Centre',  location: {lat: 24.7114458 , lng: 46.6743867 }},
           {title:'King Abdulaziz City for Science and Technology',  location: {lat: 24.7167346 , lng: 46.6441083 }},
           {title:'Princess Nora bint Abdul Rahman University',   location: {lat: 24.8464875 , lng: 46.7247677 }}
    ]);

};
// Copying all the titles of the locations in observableArray called list to show it in the drop down list
var model = new Model();
for(var i=0; i <  model.locations().length; i++){
    var title = model.locations()[i].title;
    list.push(title);
} 

// inital function to initialize the google map and setting default markers
function initMap() {
    
    map = new google.maps.Map(document.getElementById('map'), {
     center: {lat: 24.774265, lng: 46.738586},
     zoom: 14
    });
    
    bounds = new google.maps.LatLngBounds();
    var model = new Model();
    var largeInfowindow = new google.maps.InfoWindow();
    for(var i=0; i <  model.locations().length; i++){
        var position = model.locations()[i].location;
        var title = model.locations()[i].title;
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP
        });
        bounds.extend(marker.position);
        marker.addListener('click', function(){
            return populateInfoWindow(this , largeInfowindow);
        });        
        markers.push(marker);
        
    }
    
    map.fitBounds(bounds);
    
    function populateInfoWindow(marker, infowindow){ 
        if(infowindow.marker != marker){
            // set timeout to marker bounce animation for 3 second 
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){ 
                marker.setAnimation(null);                
            }, 3000);
            infowindow.marker = marker;
            callInfo(marker.title,infowindow);
            infowindow.open(map,marker);

            infowindow.addListener('closeclick', function(){
                infowindow.marker = null;
                marker.setAnimation(null);                
            });
        }
    }
}

// calling Wikipedia API on a special marker and returning info about it
var callInfo = function(title,infowindow){
    wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+ title +'&format=json&callback=wikiCallback';
    
    $.ajax(wikiUrl,{
        dataType: 'jsonp',
        success: function( response ){
            var article = response[1];
            
            infowindow.setContent('<div class="info"><a target="_blank" href="http://en.wikipedia.org/wiki/'+ title +'">' +title+ '</a></div>');
        },
        error: function(){
            alert("Can't load matched article");
        }
    });
    
};

// filtering markers on the map 
var viewModel = function() {
    var self = this;
    var select = document.getElementById('selected');
    
    select.addEventListener('change',function(){
        if( 'Select All' === select.value){
            for(var i=0; i < markers.length ;i++ ){
                markers[i].setAnimation(google.maps.Animation.DROP);
                markers[i].setMap(map);
                
            }
        }else{
            for(var j=0; j < markers.length ;j++ ){
                bounds.extend(markers[j].position);
                if(markers[j].title != select.value ){
                    markers[j].setMap(null);
                }else{
                    markers[j].setAnimation(google.maps.Animation.DROP);
                    markers[j].setMap(map);
                }
            }    
        }
        map.fitBounds(bounds);
    });
    
    


};
ko.applyBindings(new viewModel());

