function ArtNiteTextDisplay(jsonData, x, y, size) {
    TextDisplay.call(this, x, y, '', size);
    this.latestEvent = this.getLatestEvent(jsonData.artNite);
}

// Inherit from TextDisplay
ArtNiteTextDisplay.prototype = Object.create(TextDisplay.prototype);
ArtNiteTextDisplay.prototype.constructor = ArtNiteTextDisplay;

ArtNiteTextDisplay.prototype.getLatestEvent = function (events) {
    return events.reduce(function (prev, current) {
        return (prev.UUIDEvent > current.UUIDEvent) ? prev : current;
    });
};