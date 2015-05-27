var vmModule = require("../view-models/sign-up-view-model");
var frameModule = require("ui/frame");
var dialogs = require("ui/dialogs");
var view = require("ui/core/view");
var platformModule = require("platform");

var viewModel;

// Event handler for Page "loaded" event attached in sign-up-page.xml
function pageLoaded(args) {
    var page = args.object;
    viewModel = new vmModule.SignUpViewModel();
    page.bindingContext = viewModel;    
    
    MONITOR.trackFeature('View.SignUp');
    
}

function goBack(args){
    if (frameModule.topmost().canGoBack) {
        frameModule.topmost().goBack();
    } else {
        frameModule.topmost().navigate("views/main-page");
    }
}

function signUp(args){
    viewModel.signUp().then(function(){
        frameModule.topmost().navigate("views/activities-page");
    },
    function(error) {
        alert(error);
    });
}

function chooseGender(args) {
    var options = {
        title: "Choose your gender",
        actions: ["Male", "Female"],
    };
    dialogs.action(options).then(function (result) {
        viewModel.set("gender", result);
        
    });
}

exports.pageLoaded = pageLoaded;
exports.goBack = goBack;
exports.signUp = signUp;
exports.chooseGender = chooseGender;