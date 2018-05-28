//Meetup API autorization for OAuth
const loginURL = `https://secure.meetup.com/oauth2/authorize?client_id=4m8k9ur03980t5eh8hnl0g8363&response_type=token&redirect_uri=https://guardiannw.github.io/BoardGameNight/`;
const url = window.location.href;
const regex = /(?:#|\?|&)(?:([a-zA-Z_]+)=([^&]+))*/g;
let matcher;
let queryParams = {};
//defining crucial varibles for map and Meetup search url
while(matcher = regex.exec(url)) {
    const [,key, val] = matcher;
    queryParams[key] = val;
}

//google map api
let addMarker;
function initMap() {
    if (!Object.keys(queryParams).length)
        window.location.href = loginURL;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let user_lat = position.coords.latitude;
            let user_lon = position.coords.longitude;
            let initialLocation = { lat: user_lat, lng: user_lon };

            let mapOptions = {
                zoom: 9,
                center: initialLocation,
            };
        
            let map = new google.maps.Map(document.getElementById('map'),
            mapOptions);

            addMarker = initAddMarkerWithMap(map);

            //resets the map to be centered on the user's location
            fetchMeetupData(user_lat, user_lon);
        });
    };
}

//takes user to the login page to allow access from Meetup
//reloads page with JSONP data with nearby events
function fetchMeetupData(lat, lon) {
    const requestURL = `https://api.meetup.com/2/concierge?access_token=${queryParams.access_token}&lon=${lon}&category_id=11&radius=smart&lat=${lat}`;

    $.ajax(requestURL, {
        dataType: 'jsonp',
        success: (data) => {
            displayresults(data);
        }
    });
}

//adds customer marker to map
function initAddMarkerWithMap(map) {
    return function addMarker(coords) {
            let marker = new google.maps.Marker({
                position: coords,
                map,
                icon: {
                    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Map_marker.svg/156px-Map_marker.svg.png',
                    scaledSize: new google.maps.Size(18,24)
            }
        })} 
}

//takes a result and returns the time, place, description, and name 
//the event
function renderResults(result) {
    let time = new Date(result.time);
    let date = time.toString('MMM dd');

    const venueExists = result.venue !== undefined;
    const groupExists = result.group !== undefined;

    let latitude, longitude;
    //a check whether the event is a group event or a public event
    if (venueExists) {
        latitude = result.venue.lat;
        longitude = result.venue.lon;
    } else {
        latitude = result.group.group_lat;
        longitude = result.group.group_lon;
    }
    //displays a marker on map for event
    if (venueExists || groupExists) {
        const pin = {lat: latitude, lng: longitude}
        addMarker(pin);
    } else {
        console.log(`No latitude and longitude availible.`);
    }
    
    return (`
        <div class="js-events">
            <h4>${result.name}</h4>
                ${result.description}
                <span>Hosted by ${result.group.name}</span><br/>
                <span>Starts at ${date}</span><br/>
                <a href="${result.event_url}" target="_blank">Link</a><br/>
        </div>`)
        
}
//takes data from JSONP and displays it with the renderResults function
function displayresults(data) {
    const events = data.results.map((item, index) => renderResults(item));
    $('.js-results').html(events);
}
