var vmModule = require("../view-models/add-activity-view-model");
var frameModule = require("ui/frame");
var platformModule = require("platform");
var Everlive = require("../lib/everlive.all.min");
var LocalSettings = require("local-settings");
var viewModule = require("ui/core/view");
var viewModel;

function pageNavigatedTo(args) {
    var page = args.object;
    viewModel = new vmModule.AddActivityViewModel();
    page.bindingContext = viewModel;
    
    MONITOR.trackFeature('View.AddActivity');
    
    setFocusToTextField();
    verifyUserPermissions();
}

function setFocusToTextField() {
    var page = frameModule.topmost().currentPage;
    var commentTextBox = viewModule.getViewById(page, "add-activity-text");
    
    commentTextBox.focus();
}

function verifyUserPermissions(){
    var userId = LocalSettings.getString(USER_ID);
    if(typeof(userId) === 'undefined' || userId === ""){
        frameModule.topmost().navigate("views/main-page");
    }
}

function backButtonClicked(args){
    if (frameModule.topmost().canGoBack) {
        frameModule.topmost().goBack();
    } else {
        frameModule.topmost().navigate("views/activities-page");
    }
}

function addActivity() {
    viewModel.addActivity()
    .then(function() { 
        frameModule.topmost().navigate("views/activities-page"); 
    },
    function(error) { 
        alert(JSON.stringify(error));
    });
}

exports.backButtonClicked = backButtonClicked;
exports.pageNavigatedTo = pageNavigatedTo;
exports.addActivity = addActivity;