Friends Sample App for NativeScript
=============================
This repository contains the [Friends sample app](http://docs.telerik.com/platform/backend-services/samples/friends/friends-sample). The Friends app is a sample mobile app showcasing the integration of Telerik Platform services into a native mobile appllication using [the NativeScript framework](http://github.com/nativescript/nativescript). To download the source code, just click on the "Download ZIP" button.

## Showcased features and SDKs

Here is a list of the features that are showcased in the Friends sample app:

- Cloud data access (Telerik Backend Services)
- Working with files (Telerik Backend Services)
- User registration and authentication (Telerik Backend Services)
- Responsive images (Telerik Backend Services)
- Basic app analytics (Telerik Analytics)
- Tracking custom events (Telerik Analytics)

To implement all the features listed above, the sample app utilizes the following Telerik products and SDKs:

- Telerik Backend Services JavaScript SDK - used to work with Telerik Backend Services.
- Custom Analytics plugin in Telerik AppBuilder.

## Requirements  

The following is a list of requirements for the sample app:

- **Active Telerik Platform account**  
To use this sample app you must have an active Telerik Platform account. Depending on your license you may not be able to use all features of the app. For more information on what is included in the different editions, please check out the pricing page for the respective product. All features included in the sample app will work in the free trial period. Go to [http://platform.telerik.com](http://platform.telerik.com) for more info.

- **Telerik AppBuilder**  
Telerik AppBuilder In-Browser Client, Windows Client or Visual Studio Extension.

## Configuring the sample app
The Friends sample app comes fully functional, but to see it in action you must link it to your own Telerik Platform account.

What you need to set:

- **API key for Telerik Backend Services**  
This links the sample mobile app to a project in Telerik Backend Services. When you activate Telerik Backend Services a Friends sample project is created for you automatically. It has necessary structure defined and some data pre-filled. You must use its API key.  
To set the API key open the /app/app.js file and replace $EVERLIVE_API_KEY$ with the API Key of your 'Friends' project.
> If you happen to break the structure of the automatically generated Friends sample project, you can delete it and a fresh instance will be created again for you automatically. Alternatively, you could create a new project and choose to start from a Friends template, instead of starting from a blank project.

- [optional] **API key for Telerik Analytics**  
This step is optional, it links the sample mobile app to a Telerik Analytics project in your account. Just find the $EQATEC_PRODUCT_KEY$ placeholder in the code and replace it with a product key of Analytics Javascript project. If you do not set this the sample will still work, but no analytics data will collected.

By default the Friends Sample is configured to use HTTP. In case you wish to switch to HTTPS please update the global.BS_SCHEME setting in the /app/app.js file to "https".

## Running the sample app
Once the app is configured as described in the previous section, you can run it either on a real device or in the Telerik AppBuilder simulator. See more info how in this [help article](http://docs.telerik.com/platform/appbuilder/sample-apps/clone-sample-app).

> Make sure the emulator or the device you use have working Internet connection when running the sample. Internet connection is necessary in order to connect to the cloud.
