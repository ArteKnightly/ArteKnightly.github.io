
function ModelNiteTextDisplay(jsonData, x, y, size) {
    TextDisplay.call(this, x, y, '', size);
    this.latestEvent = this.getLatestEvent(jsonData.figureNite);
}

// Inherit from TextDisplay
ModelNiteTextDisplay.prototype = Object.create(TextDisplay.prototype);
ModelNiteTextDisplay.prototype.constructor = ModelNiteTextDisplay;

ModelNiteTextDisplay.prototype.getLatestEvent = function (events) {
    return events.reduce(function (prev, current) {
        return (prev.UUIDFigureNite > current.UUIDFigureNite) ? prev : current;
    });
};