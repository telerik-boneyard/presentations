var application = require("application");
application.mainModule = "./views/main-page";

/*
 * Define constants which we will use across the application
 */
global.BS_API_KEY = "$EVERLIVE_API_KEY$";
global.BS_SCHEME = "http";
global.BS_URL = "";
global.TOKEN_DATA_KEY = "authenticationToken";
global.USER_ID = "userId";
global.EVERLIVE = null;
global.MONITOR = null;

application.onLaunch = function (context) {
    // For Android applications, the context is an android.content.Intent class.
    // For iOS applications, the context is undefined.
    if (application.android) {
        console.log("Launched Android application with the following intent: " + context + ".");
    }
    else if (application.ios) {
        console.log("Launched iOS application.");
    }
};

application.onSuspend = function () {
    console.log("Application suspended.");
};

application.onResume = function () {
    console.log("Application resumed.");
};

application.onExit = function () {
    console.log("Application will exit.");
    if(MONITOR !== null){
        MONITOR.stop();
    }
};

application.onLowMemory = function () {
    console.log("Memory is low.");
};

application.onUncaughtError = function (error) {
    console.log("Application error: " + error.name + "; " + error.message + "; " + error.nativeError);
};

application.start();
