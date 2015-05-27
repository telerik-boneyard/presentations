var vmModule = require("../view-models/activity-view-model");
var frameModule = require("ui/frame");
var gestures = require("ui/gestures");
var platformModule = require("platform");
var viewModule = require("ui/core/view");
var viewModel;

function pageNavigatedTo(args) {
    var page = args.object;

    viewModel = new vmModule.ActivityViewModel();
    viewModel.activity = page.navigationContext;
    
    page.bindingContext = viewModel
    
    if (platformModule.device.os === "iOS") {
        var scrollView = viewModule.getViewById(page, "scrollView");
        scrollView.ios.directionalLockEnabled = true;
        
        var listView = viewModule.getViewById(page, "commentsList");
        listView.ios.scrollEnabled = false;
    }
    
    MONITOR.trackFeature('View.Activity');
}

function backButtonClicked(args){
    goBack();
}

function goBack(){
    if (frameModule.topmost().canGoBack) {
        frameModule.topmost().goBack();
    } else {
        frameModule.topmost().navigate("views/activities-page");
    }
}

function commentButtonClicked(args){
    frameModule.topmost().navigate({
        moduleName: "views/add-comment-page",
        context: viewModel.activity
    });
}

function deleteButtonClicked(args){
    var dialogs = require("ui/dialogs");
    dialogs.confirm({
        title: "Delete activity",
        message: "Are you sure?",
        okButtonText: "Delete",
        cancelButtonText: "Cancel"
        })
    .then(function (result) {
        if(result)
        {
             viewModel.deleteActivity().then(function() { goBack(); });    
        }
    });
}

exports.backButtonClicked = backButtonClicked;
exports.commentButtonClicked = commentButtonClicked;
exports.deleteButtonClicked = deleteButtonClicked;
exports.pageNavigatedTo = pageNavigatedTo;