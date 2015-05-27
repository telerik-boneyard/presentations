import pages = require("ui/page");
import gestures = require("ui/gestures");
import utils = require("utils/utils");
import frame = require("ui/frame");
import observable = require("data/observable");
import appViewModel = require("./app-view-model");
import rndApi = require("./officeRnD/officeRnDApi");

export function pageNavigatedTo(args: observable.EventData) {
    var page = <pages.Page>args.object;
    var roomInfo: appViewModel.RoomInfo;
    
    if (page && page.navigationContext) {
        roomInfo = <appViewModel.RoomInfo>page.navigationContext.roomInfo;
    }

    var vm = new observable.Observable();
    if (roomInfo) {
        vm.set("name", roomInfo.name);
        vm.set("isLoading", true);

        rndApi.getRoomImage(roomInfo, function (imageSource) {
            vm.set("image", imageSource);
            vm.set("isLoading", false);
        });
    }
    else {
        vm.set("name", "No map ifno");
        vm.set("image", rndApi.defaultNotFoundImageSource);
    }

    page.bindingContext = vm;
}

export function backTap(args: gestures.GestureEventData) {
    frame.topmost().goBack();
}

export function backSwipe(args: gestures.SwipeGestureEventData) {
    if (args.direction === gestures.SwipeDirection.Right) {
        frame.topmost().goBack();
    }
}