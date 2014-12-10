document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	navigator.splashscreen.hide();
	deviceInfoApp = new deviceInfoApp();
	deviceInfoApp.run();
}

function deviceInfoApp() {
}

deviceInfoApp.prototype = {
    
	run:function() {
		var that = this;
		document.getElementById("deviceName").addEventListener("click", function() {
			that._viewDeviceName.apply(that, arguments);
		});
		document.getElementById("deviceCordovaVersion").addEventListener("click", function() {
			that._viewCordovaVersion.apply(that, arguments);
		});
		document.getElementById("devicePlatform").addEventListener("click", function() {
			that._viewDevicePlatform.apply(that, arguments);
		});
		document.getElementById("deviceUUID").addEventListener("click", function() {
			that._viewDeviceUUID.apply(that, arguments);
		});
		document.getElementById("deviceVersion").addEventListener("click", function() {
			that._viewDeviceVersion.apply(that, arguments);
		});
	},
    
	_viewDeviceName : function() {
		var infoField = document.getElementById("infoField");
		infoField.innerHTML = device.model;
	},
    
	_viewCordovaVersion : function() {
		var infoField = document.getElementById("infoField");
		infoField.innerHTML = device.cordova;
	},
    
	_viewDevicePlatform : function () {
		var infoField = document.getElementById("infoField");
		infoField.innerHTML = device.platform;
	},
    
	_viewDeviceUUID : function () {
		var infoField = document.getElementById("infoField");
		infoField.innerHTML = device.uuid;
	},
    
	_viewDeviceVersion:function viewDeviceVersion() {
		var infoField = document.getElementById("infoField");
		infoField.innerHTML = device.version;
	}
};