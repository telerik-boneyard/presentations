//
//  InterfaceController.m
//  TNSWatchKitApp WatchKit Extension
//
//  Created by Panayot Cankov on 5/14/15.
//  Copyright (c) 2015 Telerik. All rights reserved.
//

#import "InterfaceController.h"

@interface InterfaceController()
@property (strong, nonatomic) IBOutlet WKInterfaceLabel *tapsLabel;

@end

@implementation InterfaceController

- (void)awakeWithContext:(id)context {
    [super awakeWithContext:context];

    // Configure interface objects here.
}

- (void)willActivate {
    // This method is called when watch view controller is about to be visible to user
    [super willActivate];
}

- (void)didDeactivate {
    // This method is called when watch view controller is no longer visible
    [super didDeactivate];
}

- (IBAction)tapIncrement {
}


@end



