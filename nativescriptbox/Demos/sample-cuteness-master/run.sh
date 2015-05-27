#! /bin/bash

gitresult=$( { git status | grep "fatal: Not a git repository" > /dev/null; } 2>&1 )
if [[ ! -d "./sample-cuteness" && "${gitresult}" != "" ]]; then
# Cloning to default dir
    echo "=> Downloading sample-cuteness from git"
    printf "\r=> "
    command git clone "https://github.com/NativeScript/sample-cuteness.git"
    cd sample-cuteness
fi

npmresult=$(npm list -g | grep 'nativescript@');
if [[ "$npmresult" == "" ]]; then
    npm install -g nativescript
fi

unamestr=`uname`
if [[ "$unamestr" == "Darwin" ]]; then
    iosresult=$(tns platform list | grep 'Installed platforms.*ios');
    if [[ "$iosresult" == "" ]]; then
        tns platform add ios
    fi
    tns run ios --emulator
else
    androidresult=$(tns platform list | grep 'Installed platforms.*android');
    if [[ "$androidresult" == "" ]]; then
        tns platform add android
    fi
    tns run android --emulator
fi

