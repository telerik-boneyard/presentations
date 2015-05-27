var vmModule = require("../view-models/add-comment-view-model");
var frameModule = require("ui/frame");
var platformModule = require("platform");
var viewModule = require("ui/core/view");
var viewModel;

function pageNavigatedTo(args) {
    var page = args.object;

    viewModel = new vmModule.addCommentViewModel();
    viewModel.activity = page.navigationContext;
    page.bindingContext = viewModel
    
    MONITOR.trackFeature('View.AddComment');
    
    setFocusToTextField();
}

function setFocusToTextField() {
    var page = frameModule.topmost().currentPage;
    var commentTextBox = viewModule.getViewById(page, "add-comment-text");
    
    commentTextBox.focus();
}

function backButtonClicked(args){
    goBack();
}

function goBack(){
    if (frameModule.topmost().canGoBack) {
        frameModule.topmost().goBack();
    } else {
        frameModule.topmost().navigate({
            moduleName: "views/activity-page",
            context: viewModel.activity
        });
    }
}

function addComment() {
    viewModel.addComment().then(goBack);
}

exports.backButtonClicked = backButtonClicked;
exports.pageNavigatedTo = pageNavigatedTo;
exports.addComment = addComment;