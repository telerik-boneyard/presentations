var observable = require("data/observable");

var imageManipulation = require("../../shared/image-manipulation/image-manipulation");
var localStorage = require("../../shared/local-storage/local-storage");
var utilities = require("../../shared/utilities");
var analyticsMonitor = require("../../shared/analytics");

var socialShare = require("../../node_modules/nativescript-social-share/social-share");
var _ = require("../../node_modules/lodash/index");

class Meme extends observable.Observable {
	constructor() {
		super();
		var debouncedRefresh = _.debounce(() => {
			this.refresh();
		}, 10, { leading: true });

		// Add an event listener to refresh the memeImage every time there is a change to the properties
		this.addEventListener(observable.Observable.propertyChangeEvent, (changes) => {
			// skip if memeImage changes
			if (changes.propertyName === "memeImage" || !this.image) {
				return;
			}

			// Call refresh meme, but make sure it doesn't get called more often than every 200ms
			debouncedRefresh();
		});
	}
	destroy() {
		this.removeEventListener(observable.Observable.propertyChangeEvent);
	}
	reset() {
		this.set("topText", "");
		this.set("bottomText", "");
		this.set("fontSize", 50);
		this.set("isBlackText", false);
	}
	setImage(image) {
		this.set("memeImage", image);
		this.reset();
		this.image = image;
		this.uniqueImageName = utilities.generateUUID() + ".png";
	}
	refresh() {
		var image = imageManipulation.addText({
			image: this.image,
			topText: this.topText,
			bottomText: this.bottomText,
			fontSize: this.fontSize,
			isBlackText: this.isBlackText
		});

		this.set("memeImage", image);
	}
	save() {
		analyticsMonitor.trackFeature("CreateMeme.SaveLocally");
		this.refresh();
		return localStorage.saveLocally(this.uniqueImageName, this.memeImage);
	}
	share() {
		analyticsMonitor.trackFeature("CreateMeme.Share");
		socialShare.shareImage(this.memeImage);
	}
}

module.exports = Meme;
