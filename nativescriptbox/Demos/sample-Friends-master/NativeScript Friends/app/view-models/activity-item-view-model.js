var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var observable = require("data/observable");
var imageSource = require("image-source");
var imageCache = require("ui/image-cache");
var platformModule = require("platform");

var cache = new imageCache.Cache();
cache.maxRequests = 5;
cache.enableDownload();

var ActivityItemViewModel = (function (_super){
    
    __extends(ActivityItemViewModel, _super);
    
    function ActivityItemViewModel(source) {
        _super.call(this);
        this._source = source;
        if (this._source) {
            var property;
            for (property in this._source) {
                this.set(property, this._source[property]);
            }
        }
    }

    Object.defineProperty(ActivityItemViewModel.prototype, "hasPicture", {
        get: function () {
           return !!this._source.Picture;
        }
    });
    
    Object.defineProperty(ActivityItemViewModel.prototype, "pictureImageHeight", {
        get: function () {
           var height = platformModule.screen.mainScreen.heightPixels;
           return height * 0.15;
        }
    });
    
    Object.defineProperty(ActivityItemViewModel.prototype, "pictureImageSource", {
        get: function () {
            var that = this;
            if (this._source && !this._pictureImageSource) {
                if (cache && that._source.Picture) {
                    var url = that._source.Picture;
                    var screenWidth = platformModule.screen.mainScreen.widthPixels;
                    var responsiveImagesUrl = getResponsiveUrl(url, screenWidth);
                    var cachedImg = cache.get(responsiveImagesUrl);
                    
                    if (cachedImg) {
                        that._pictureImageSource = cachedImg;
                    } else {
                        cache.push({
                            key: responsiveImagesUrl,
                            url: responsiveImagesUrl,
                            completed: function (result, key) {
                                if (responsiveImagesUrl === key) {                                    
                                    that._pictureImageSource = result;
                                    that.notify({ object: that, eventName: observable.knownEvents.propertyChange, propertyName: "pictureImageSource", value: that._pictureImageSource });
                                }
                            }
                        });
                    }
                }
            }
            return this._pictureImageSource;
        }
    });
    
    Object.defineProperty(ActivityItemViewModel.prototype, "userName", {
        get: function () {
            if (this._source) {
                this._userName = this._source.User.DisplayName;
                this.notify({ object: this, eventName: observable.knownEvents.propertyChange, propertyName: "userName", value: this._userName });
            }
            return this._userName;        
        }
    });
    
    Object.defineProperty(ActivityItemViewModel.prototype, "avatarImageSource", {
        get: function () {

            var that = this;
            var url = this._source.User.Picture === null ? null : this._source.User.Picture.Uri;

            if (!url) {
                this._avatarImageSource = null;
            }
            else if (this._source && !this._avatarImageSource) {
                var responsiveImagesUrl = getResponsiveUrl(url, 100);
                
                if (cache) {
                    var cachedImg = cache.get(responsiveImagesUrl);
                    if (cachedImg) {
                        that._avatarImageSource = cachedImg;
                    }
                    else {
                        cache.push({
                            key: responsiveImagesUrl,
                            url: responsiveImagesUrl,
                            completed: function (result, key) {
                                if (responsiveImagesUrl === key) {                                    
                                    that._avatarImageSource = result;
                                    that.notify({ object: that, eventName: observable.knownEvents.propertyChange, propertyName: "avatarImageSource", value: that._avatarImageSource });
                                }
                            }
                        });
                    }
                }
            }

            return this._avatarImageSource;
        }
    });
    
    Object.defineProperty(ActivityItemViewModel.prototype, "defaultAvatarImageSource", {
        get: function () {
            var avatarImage = imageSource.fromFile("~/res/avatar.png");
            return avatarImage;
        },
        enumerable: true,
        configurable: true
    });
   
    return ActivityItemViewModel;
})(observable.Observable);

//ScaleFactor define how many times the width of the image to be smaller than the screen width. Height is automatically adjusted. 
function getResponsiveUrl (url, targetWidth) {
    if(typeof(url) === 'undefined' && typeof(targetWidth) === 'undefined'){
        return '';
    }
        
    return "https://bs1.cdn.telerik.com/image/v1/" + BS_API_KEY + "/resize=w:" + targetWidth + "/" + url;
}

exports.ActivityItemViewModel = ActivityItemViewModel;