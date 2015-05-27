var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var observable = require("data/observable");
var LocalSettings = require("local-settings");
var validationModule = require("../utils/validate");

var addCommentViewModel = (function (_super) {
    __extends(addCommentViewModel, _super);

    function addCommentViewModel (source) {
        _super.call(this);
        this._activity = new observable.Observable();
        this._commentText = new observable.Observable();
        this._commentText = "";
    }

    Object.defineProperty(addCommentViewModel.prototype, "activity", {
        get: function () 
        {
            return this._activity;
        },
        set: function(value)
        {
            if (this._activity !== value) {
                this._activity = value;
                this.notify({ object: this, eventName: observable.knownEvents.propertyChange, propertyName: "activity", value: value });
            }
        }
    });
    
    Object.defineProperty(addCommentViewModel.prototype, "commentText", {
        get: function () 
        {
            return this._commentText;
        },
        set: function(value)
        {
            if (this._commentText !== value) {
                this._commentText = value;
                this.notify({ object: this, eventName: observable.knownEvents.propertyChange, propertyName: "commentText", value: value });
            }
        }
    });
         
    addCommentViewModel.prototype.addComment = function () {
        var userId = LocalSettings.getString(USER_ID);
        var data = EVERLIVE.data('Comments');

        var that = this;
        
        return new Promise(function (resolve, reject) {
            if (validationModule.validate(that._commentText, [validationModule.minLengthConstraint], "Invalid comment")) {
                //Load busy indicator
                that.set("isLoading", true);
                
                data.create({ 
                        'Comment' : that._commentText,
                        'UserId': userId,
                        'ActivityId': that._activity.Id
                    },
                    function (data) {
                        that.set("isLoading",false);
                        MONITOR.trackFeature('Event.CommentCreated');
                        resolve();
                    },
                    function (error) {
                        that.set("isLoading",false);
                        alert(JSON.stringify(error));
                        reject();
                    });

                //Clear text field
                that.set("comment", "");
            }
        });
    };
    
    return addCommentViewModel;
})(observable.Observable);

exports.addCommentViewModel = addCommentViewModel;