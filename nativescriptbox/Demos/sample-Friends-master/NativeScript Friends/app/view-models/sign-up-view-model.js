var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var observable = require("data/observable");
var dialogs = require("ui/dialogs");
var validationModule = require("../utils/validate");
var LocalSettings = require("local-settings");

var SignUpViewModel = (function (_super){
    
    __extends(SignUpViewModel, _super);
    
    function SignUpViewModel(source) {
        _super.call(this);
        this._source = source;
        this._isLoading = false;
        
        //User
        this._email = "";
        this._password = "";
        this._info = {
          DisplayName: "",
          Email: "",
          gender: "",
          about: ""
        };    
    }
    
   SignUpViewModel.prototype.signUp = function() {
        var that = this;
        
        return new Promise(function (resolve, reject) {
        
            if (validationModule.validate(that._email, [validationModule.minLengthConstraint, validationModule.validEmailConstraint],"Invalid email") &&
               validationModule.validate(that._password, [validationModule.minLengthConstraint],"Invalid password") &&
               validationModule.validate(that._info.DisplayName, [validationModule.minLengthConstraint],"Invalid name")) {
                
                that.set("isLoading", true);
                
                EVERLIVE.Users.register(
                that._email,
                that._password,
                that._info,
                function(data) {

                    EVERLIVE.Users.login(that._email, that._password, 
                        function (data) {

                            //Store in local storage
                            LocalSettings.setString(TOKEN_DATA_KEY, data.result.access_token);
                            LocalSettings.setString(USER_ID, data.result.principal_id);
                            
                            that.set("isLoading", false);

                            //Clear all fields
                            that.set("password", "");
                            that.set("name", "");
                            that.set("email", "");
                            that.set("gender", "");
                            that.set("about", "");
                            resolve();
                        },
                        function(error) {
                            reject(error.message || "Can't log in! Please try again!");
                        });
                },
                function(error) {         
                    that.set("isLoading", false);
                    reject(error.message || "Can't register");
                });
            } else {
                reject("Invalid input");
            }
        }); 
    };
    
    Object.defineProperty(SignUpViewModel.prototype, "isLoading", {
        get: function () {
            return this._isLoading;
        },
        set: function(value) {
            this._isLoading = value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(SignUpViewModel.prototype, "email", {
        get: function () {
            return this._email;
        },
        set: function(value) {
            this._email = value.toLowerCase();
            this._info.Email = value;
        },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(SignUpViewModel.prototype, "password", {
        get: function () {
            return this._password;
        },
        set: function(value) {
            this._password = value;
        },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(SignUpViewModel.prototype, "name", {
        get: function () {
            return this._info.DisplayName;
        },
        set: function(value) {
            this._info.DisplayName = value;
        },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(SignUpViewModel.prototype, "gender", {
        get: function () {
            return this._info.gender;
        },
        set: function(value) {
            this._info.gender = value;
        },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(SignUpViewModel.prototype, "about", {
        get: function () {
            return this._info.about;
        },
        set: function(value) {
            this._info.about = value;
        },
        enumerable: true,
        configurable: true
    });
    
    return SignUpViewModel;
})(observable.Observable);

exports.SignUpViewModel = SignUpViewModel;