var platform = require('platform'),
    platformExt = require('platform-ext');

'use strict'

var mainScreen = platform.screen.mainScreen,
    device = platformExt.device;

var info = {
    screen: mainScreen.widthPixels + 'x' + mainScreen.heightPixels,
    language: device.language
};

exports.environmentInfo = info;
exports.userAgent = device.userAgent;
