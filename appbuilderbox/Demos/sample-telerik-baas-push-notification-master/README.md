sample-telerik-baas-push-notification
=====================================
<a href="https://platform.telerik.com/#appbuilder/clone/https%3A%2F%2Fgithub.com%2FIcenium%2Fsample-telerik-baas-push-notification" target="_blank"><img src="http://docs.telerik.com/platform/appbuilder/sample-apps/images/try-in-appbuilder.png" alt="Try in AppBuilder" title="Try in AppBuilder" /></a>

This application is a basic example of using Push Notifications provided by Telerik BackEnd Services.

### Requirements
- Registration in Telerik BackEnd Services (http://www.telerik.com/backend-services) and Telerik AppBuilder (http://www.telerik.com/appbuilder)
- The certificates required for APNS (Apple Push Notifications Service)everl
- Active GCM (Google Cloud Messaging) service and Google project API key

### Install
1. Log in Telerik AppBuilder and clone the repository.
2. Open the main.js file located in the '/scripts/app' folder. 
3. Locate the string GOOGLE_PROJECT_NUMBER and replace it with your Google project number. More details on obtaining the project number can be found here: https://developers.google.com/console/help/#projectnumber
4. Locate the string BAAS_API_KEY and replace it with the API Key of your 'Friends' project in Telerik BackEnd Services portal. It can be found in the API Keys section.
5. Enable Push Notifications in Telerik BackEnd Services. Go to your project settings and in the Push Notifications section activate the push providers.
5. Deploy the project to mobile device and run it.
