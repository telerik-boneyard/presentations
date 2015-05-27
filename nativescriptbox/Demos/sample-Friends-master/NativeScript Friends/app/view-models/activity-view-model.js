var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var LocalSettings = require("local-settings");
var observable = require("data/observable");
var observableArray = require("data/observable-array");
var Everlive = require("../lib/everlive.all.min");
var activityItemViewModel = require("./activity-item-view-model");

var ActivityViewModel = (function (_super) {
    __extends(ActivityViewModel , _super);

    function ActivityViewModel (source) {
        _super.call(this);
        this._activity = new observable.Observable();
        this._comments = new observableArray.ObservableArray(); 
        this._isLoading = false;
    }
    
    Object.defineProperty(ActivityViewModel.prototype, "isLoading", {
        get: function () {
            return this._isLoading;
        },
        set: function(value) {
            this._isLoading = value;
            this.notify({ object: this, eventName: observable.knownEvents.propertyChange, propertyName: "isLoading", value: value });
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(ActivityViewModel.prototype, "activity", {
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
    
    Object.defineProperty(ActivityViewModel.prototype, "comments", {
        get: function () 
        {
            this.isLoading = true;
            
            var that = this;
            var commentsData = EVERLIVE.data("Comments");
            
            var query = new Everlive.Query();
            query.where().eq("ActivityId", that._activity.Id);
            query.orderDesc("CreatedAt");
            
            var expandExp = {
                "UserId": {
                    "ReturnAs": "UserName",
                    "SingleField": "DisplayName"
                },
                "UserId":{
                  "ReturnAs":"User",
                  "TargetTypeName":"Users",
                  "Expand":{
                     "Picture":{
                        "TargetTypeName":"System.Files"
                     }
                  }
               }
            };
            
            commentsData.expand(expandExp).get(query)
            .then(function(data) {
                if (data && data.count !== 0)
                {
                    for (i=0; i<data.count; i++)
                    {
                        var activityItem = new activityItemViewModel.ActivityItemViewModel(data.result[i]);
                        data.result[i] = activityItem;
                    }
                    
                    that._comments.push(data.result);
                }
                that.isLoading = false;
            },
            function(error) {
                alert(JSON.stringify(error));
                that.isLoading = false;
            });
            
            return this._comments;
        },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ActivityViewModel.prototype, "activityDateFormatted", {
        get: function () 
        {
            var m_names = new Array("JAN", "FEB", "MAR", 
            "APR", "MAY", "JUN", "JUL", "AUG", "SEP", 
            "OCT", "NOV", "DEC");

            var d = new Date(this._activity.CreatedAt);
            var curr_date = d.getDate();
            var curr_month = d.getMonth();
            var curr_year = d.getFullYear();
            var dateString = m_names[curr_month] + " " + curr_date + ", " + curr_year;
            
            return dateString;
        }
    });
    
    Object.defineProperty(ActivityViewModel.prototype, "userCanDeleteActivity", {
        get: function () 
        {
            var userId = LocalSettings.getString(USER_ID);
            return this._activity.User.Id === userId;
        }
    });
    
    ActivityViewModel.prototype.deleteActivity = function () {
        var that = this;
        
        return new Promise(function (resolve, reject) {
            var activities = EVERLIVE.data("Activities");
            
            activities.destroySingle({ Id: that._activity.Id },
                function(){
                    return resolve();
                },
                function(error){
                    alert(JSON.stringify(error));
                    return reject();
                }
            );
        });
    };
    
    return ActivityViewModel;
})(observable.Observable);

exports.ActivityViewModel = ActivityViewModel;