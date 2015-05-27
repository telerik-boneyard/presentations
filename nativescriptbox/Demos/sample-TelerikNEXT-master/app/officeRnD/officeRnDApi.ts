import http = require("http");
import imageSource = require("image-source");
import imageCache = require("ui/image-cache");
import appViewModel = require("../app-view-model");


var officeRnDApi = "https://www.officernd.com/api/v1/";
var cache = new imageCache.Cache();
export var defaultNotFoundImageSource = imageSource.fromFile("~/images/no-map.png");

cache.maxRequests = 5;

function getImage(uri, done) {
    var source = cache.get(uri);

    if (source) {
        done(source);
    } else {
        cache.push({
            key: uri,
            url: uri,
            completed: function (result, key) {
                if (key === uri) {
                    done(result);
                }
            }
        });
    }
}

export function getRoomImage(info: appViewModel.RoomInfo, update: (image: imageSource.ImageSource) => void ) {
    var getRoomImageUri;
    if (info.url) {
        getRoomImageUri = info.url;
    }
    else {
        getRoomImageUri = officeRnDApi + "rooms/" + info.roomId + "/export-uri?theme=" + info.theme;
    }

    console.log("Loading: " + getRoomImageUri);
    http.getJSON(getRoomImageUri)
        .then(function (res) {
            var uri = "https:" + (<any>res).uri;
            // TODO: Read room name from the endpoint
            console.log("Loading image: " + uri);
            getImage(uri, function (image) {
                console.log("Image downloaded");
                update(image);
            });
        }, function (err) {
            console.log("ERROR: " + err);
            update(defaultNotFoundImageSource);
        });
}