var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var observable = require("data/observable");
var validationModule = require("../utils/validate");
var LocalSettings = require("local-settings");

var AddActivityViewModel = (function (_super) {
    __extends(AddActivityViewModel, _super);

    function AddActivityViewModel(source) {
        _super.call(this);
        this._activity = new observable.Observable();
        this._activity = "";
    }

    AddActivityViewModel.prototype.addActivity = function () {
        var userId = LocalSettings.getString(USER_ID);
        var data = EVERLIVE.data('Activities');

        var that = this;
        
        return new Promise(function (resolve, reject) {
            if(validationModule.validate(that._activity, [validationModule.minLengthConstraint],"Invalid activity")){
                //Load busy indicator
                that.set("isLoading", true);
                
                data.create({ 
                        'Text' : that.activity,
                        'UserId': userId
                    },
                    function(data){
                        that.set("isLoading",false);
                        MONITOR.trackFeature('Event.ActivityCreated');
                        resolve();
                    },
                    function(error){
                        that.set("isLoading",false);
                        reject(error);
                    });

                //Clear text field
                that.set("activity", "");
            }
        });
    };

    Object.defineProperty(AddActivityViewModel.prototype, "activity", {
        get: function () 
        {
            return this._activity;
        },
        set: function(value)
        {
            if (this._activity !== value) {
                this._activity = value;
            }
        }
    });
    
    return AddActivityViewModel;
})(observable.Observable);

exports.AddActivityViewModel = AddActivityViewModel;