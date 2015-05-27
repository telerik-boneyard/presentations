import observable = require("data/observable");
import pages = require("ui/page");
import gestures = require("ui/gestures");
import platform = require("platform");
import utils = require("utils/utils");
import frame = require("ui/frame");
import button = require("ui/button");
import label = require("ui/label");
import view = require("ui/core/view");
import list = require("ui/list-view");
import scrollView = require("ui/scroll-view");
import appViewModel = require("./app-view-model");

export function pageNavigatedTo(args: observable.EventData) {
    var page = <pages.Page>args.object;

    page.bindingContext = page.navigationContext;

    disableScroll(<list.ListView>page.getViewById("sepakers-list"));

}

function disableScroll(listView: list.ListView) {
    if (listView.android) {
        listView.android.setSelector(new android.graphics.drawable.ColorDrawable(0));
        listView.android.setOnTouchListener(new android.view.View.OnTouchListener({
            onTouch: function (view: android.view.View, motionEvent: android.view.MotionEvent) {
                return (motionEvent.getAction() === android.view.MotionEvent.ACTION_MOVE);
            }
        }));
    }
    if (listView.ios) {
        listView.ios.scrollEnabled = false;
        listView.ios.allowsSelection = false;
    }
}

export function toggleFavorite(args: gestures.GestureEventData) {
    var item = <appViewModel.SessionModel>args.view.bindingContext;
    item.toggleFavorite();
}

export function shareTap(args: gestures.GestureEventData) {
    var item = <appViewModel.SessionModel>args.view.bindingContext;

    var shareText = item.title + " ";

    if (item.speakers) {
        var speakerNames = "";
        var byStr = item.speakers.forEach((sp, i, arr) => {
            if (sp.twitterName) {
                speakerNames += "@" + sp.twitterName + " ";
            }
        });

        if (speakerNames) {
            shareText += "by " + speakerNames;
        }
    }

    shareText += " #TelerikNEXT";

    if (platform.device.os === platform.platformNames.android) {
        var intent = new android.content.Intent(android.content.Intent.ACTION_SEND);
        intent.setType("text/plain");
        intent.putExtra(android.content.Intent.EXTRA_SUBJECT, "subject");
        intent.putExtra(android.content.Intent.EXTRA_TEXT, shareText);

        var activity = frame.topmost().android.activity;
        activity.startActivity(android.content.Intent.createChooser(intent, "share"));
    }
    else if (platform.device.os === platform.platformNames.ios) {
        var currentPage = frame.topmost().currentPage;

        var controller = new UIActivityViewController(utils.ios.collections.jsArrayToNSArray([shareText]), null);

        (<UIViewController>currentPage.ios).presentViewControllerAnimatedCompletion(controller, true, null);
    }
}

export function toogleDescritpion(args: observable.EventData) {
    var btn = <button.Button>args.object;
    var page = view.getAncestor(btn, "Page");

    var txtDesc = <label.Label>page.getViewById("txtDescription");
    var scroll = <scrollView.ScrollView>page.getViewById("scroll");
    var item = <appViewModel.SessionModel>page.bindingContext;

    if (btn.text === "MORE") {
        btn.text = "LESS";
        txtDesc.text = item.description;
    }
    else {
        btn.text = "MORE";
        txtDesc.text = item.descriptionShort;
        scroll.scrollToVerticalOffset(0, false);
    }
}

export function backTap(args: gestures.GestureEventData) {
    frame.topmost().goBack();
}

export function showMapTap(args: gestures.GestureEventData) {
    var session = <appViewModel.SessionModel>args.view.bindingContext;

    frame.topmost().navigate({
        moduleName: "map-page",
        context: session
    });
}

export function backSwipe(args: gestures.SwipeGestureEventData) {
    if (args.direction === gestures.SwipeDirection.Right) {
        frame.topmost().goBack();
    }
}