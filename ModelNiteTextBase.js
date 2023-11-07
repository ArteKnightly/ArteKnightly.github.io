// ModelNiteTextBase.js
// This will serve as our fake JSON data for testing purposes
var eventData = {
    name: "Hello World Event",
    Date: "2023-11-02",
    Time: "8:00 PM",
    Location: "Virtual Space",
    SpotifyEdit: "http://example.com/edit",
    SpotifyListen: "http://example.com/listen"
};
function ModelNiteTextBase() {
    this.eventDetails = new EventDetails(eventData, 100, 100, 20);
 }