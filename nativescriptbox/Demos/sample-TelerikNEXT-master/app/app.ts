import application = require("application");

if(application.android) {
    application.onLaunch = function (intent) {
        console.log("onLaunch");
        application.android.onActivityCreated = function (activity) {
            console.log("onCreated");
            var id = activity.getResources().getIdentifier("AppTheme", "style", activity.getPackageName());
            activity.setTheme(id);
        }

        application.android.onActivityStarted = function (activity) {
            console.log("onStarted");
            var window = activity.getWindow();
            if (window) {
                window.setBackgroundDrawable(null);
            }
        }
    }
}

// Set the start module for the application
application.mainModule = "main-page";

// Start the application
application.start();
