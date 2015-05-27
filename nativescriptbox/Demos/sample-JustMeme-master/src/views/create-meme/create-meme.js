var applicationModule = require("application");
var dialogsModule = require("ui/dialogs");
var Meme = require("./Meme");

var _page;
var meme;

exports.loaded = function(args) {
	_page = args.object;
	meme = new Meme();
	_page.bindingContext = meme;

	if (applicationModule.ios) {
		_page.ios.title = "Create New";
	}
};

exports.unloaded = function() {
	meme.destroy();
	meme = null;
};

exports.navigatedTo = function() {
	//grab the image from the navigation context.
	var selectedImage = _page.navigationContext;
	meme.setImage(selectedImage);
};

exports.save = function() {
	var saved = meme.save();
	if (!saved) {
		console.log("New meme not saved....");
	} else {
		var options = {
			title: "Meme Saved",
			message: "Congratulations, Meme Saved!",
			okButtonText: "OK"
		};

		dialogsModule.alert(options);
	}
};

exports.share = function() {
	meme.share();
};
