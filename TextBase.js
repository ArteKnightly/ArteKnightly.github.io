class ModelNiteTextBase {



}


TextObject.prototype.display = function () {
    // Display all the event details
    for (let detail of this.eventDetails.details) {
        detail.display();
    }
};

TextObject.prototype.setPosition = function (x, y) {
    this.x = x;
    this.y = y;
};
