import observable = require("data/observable");
import pages = require("ui/page");
import gestures = require("ui/gestures");
import listView = require("ui/list-view");
import frame = require("ui/frame");
import view = require("ui/core/view");
import search = require("ui/search-bar");
import platform = require("platform");
import button = require("ui/button");
import appViewModel = require("./app-view-model");

export function pageLoaded(args: observable.EventData) {
    var page = <pages.Page>args.object;

    // Enable platform specific feature (in this case Android page caching)
    if (frame.topmost().android) {
        frame.topmost().android.cachePagesOnNavigate = true;
    }

    hideSearchKeyboard(page);

    var iosFrame = frame.topmost().ios;
    if (iosFrame) {
        // Fix status bar color and nav bar vidibility
        iosFrame.controller.view.window.backgroundColor = UIColor.blackColor();
        iosFrame.navBarVisibility = "never";
    }

    page.bindingContext = appViewModel.appModel;
}

export function selectSession(args: listView.ItemEventData) {
    var session = <appViewModel.SessionModel>args.view.bindingContext;
    var page = view.getAncestor(<view.View>args.object, "Page")
    hideSearchKeyboard(page);

    if (!session.isBreak) {
        frame.topmost().navigate({
            moduleName: "session-page",
            context: session
        });
    }
}

export function selectView(args: observable.EventData) {
    var btn = <button.Button>args.object;
    var page = view.getAncestor(btn, "Page");
    var slideBar = <any>page.getViewById("sideBar");
    slideBar.closeSlideContent();

    appViewModel.appModel.selectView(parseInt((<any>btn).tag), btn.text);
    hideSearchKeyboard(page);
}

export function toggleFavorite(args: gestures.GestureEventData) {
    var session = <appViewModel.SessionModel>args.view.bindingContext;
    session.toggleFavorite();
}

export function showSlideout(args: gestures.GestureEventData) {
    var page = view.getAncestor(args.view, "Page");
    var slideBar = <any>page.getViewById("sideBar");
    slideBar.openSlideContent();
    hideSearchKeyboard(page);
}

function hideSearchKeyboard(page: view.View) {
    var searchBar = <search.SearchBar>page.getViewById("search");
    if (searchBar.android) {
        searchBar.android.clearFocus();
    }
    if (searchBar.ios) {
        searchBar.ios.resignFirstResponder();
    }
}

export function goToUrl(args: gestures.GestureEventData) {
    var url = (<any>args.view).tag;
    if (url) {
        if (platform.device.os === platform.platformNames.ios) {
            var nsUrl = NSURL.URLWithString(url);
            var sharedApp = UIApplication.sharedApplication();
            if (sharedApp.canOpenURL(nsUrl)) {
                sharedApp.openURL(nsUrl);
            }
        }
        else if (platform.device.os === platform.platformNames.android) {
            var intent = new android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse(url));
            var activity = frame.topmost().android.activity;
            activity.startActivity(android.content.Intent.createChooser(intent, "share"));
        }
    }
}