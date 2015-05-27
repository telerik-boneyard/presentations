//
//  main.m
//  TNSBridgeApp
//
//  Created by Yavor Georgiev on 07.03.14.
//  Copyright (c) 2014 г. Telerik. All rights reserved.
//

#import <WatchKit/WatchKit.h>
#import <NativeScript/NativeScript.h>

static TNSRuntime* runtime;

__attribute__((constructor))
void initialize() {
    runtime = [[TNSRuntime alloc] initWithApplicationPath:[NSBundle mainBundle].bundlePath];
    TNSRuntimeInspector.logsToSystemConsole = YES;
    [runtime executeModule:@"./"];
}
