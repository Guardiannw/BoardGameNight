const MeetUp_API_URL = 'https://api.meetup.com/2/concierge?zip=84043&offset=0&format=json&category_id=11&photo-host=public&page=500&sig_id=254699968&sig=9dfeb60b3e337a30d4407e49010a86088996c42a';

const game_events = STORE.results

console.log(STORE);

function renderResults(result) {
    console.log(`ran renderResults just fine`);
    return (`
        <div class="js-events">
            <h3>${result.name}</h3>
                ${result.description}
                <span>Hosted by ${result.group.name}</span><br/>
                <a href="${result.event_url}" target="_blank">Link</a><br/>
        </div>`)
}

function displayresults(data) {
    const events = game_events.map((item, index) => renderResults(item));
    $('.js-results').html(events);
    console.log(`displayresults ran`);
}


function watchSubmit() {
    $('.js-location-form').submit(event => {
        event.preventDefault();
        displayresults(STORE);
        // displayMeetupData(STORE);
    });
    console.log(`watchSubmit ran`)
}

$(watchSubmit)