# JustMeme

JustMeme is a NativeScript-built iOS and Android app for creating memes and sharing them with your friends and family.

![](assets/ss.png)
![](assets/ss2.png)
![](assets/ss3.png)

## Download

[![](assets/ios-app-store-icon.png)](https://itunes.apple.com/us/app/justmeme/id989340374?mt=8)

## Development

This app was built with the [NativeScript CLI](https://github.com/NativeScript/nativescript-cli). Once you have the [CLI installed](https://github.com/NativeScript/nativescript-cli#installation), use the following commands to setup JustMeme:

```
$ git clone https://github.com/NativeScript/JustMeme.git
$ cd JustMeme
$ tns platform add ios
$ tns platform add android
```

JustMeme uses Babel to transpile the ES6-written source into ES5 that can run on JavaScriptCore and V8 in NativeScript. To setup a Gulp watcher to transpile your code start by installing the necessary dependencies from npm:

```
$ npm install
```

Next run Gulp to start the watcher:

```
$ gulp
```

From there you're good to run the app on your device of choice. For instance the following runs the app on an iOS emulator:

```
$ tns run ios --emulator
```

### ES6

JustMeme is written in ES6, and uses [Babel](https://babeljs.io/) to transpile the ES6 source into ES5 that can run on the JavaScript VMs NativeScript uses (JavaScriptCore and V8). For more information on learning ES6, refer to [Babel's documentation on the subject](https://babeljs.io/docs/learn-es6/).

### Linting

JustMeme uses [JSHint](http://jshint.com/) and [JSCS](http://jscs.info/) for code linting. To kick off both, run `gulp lint` within the `src` directory:

```
$ gulp lint
```