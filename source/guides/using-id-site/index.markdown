---
layout: doc
lang: guides
title: Using Stormpath's ID Site to Host your User Management UI
---

{% docs info %}
  **This feature is currently in Beta.**  If you have any questions, bug reports, or enhancement requests please email support@stormpath.com. 
{% enddocs %}

{% docs info %} 
Currently supported Stormpath SDKs for this feature include: **Java**
{% enddocs %}

In this guide, we discuss how to set up Stormpath to host a set of web pages that enable your applications to quickly and securely offer common identity management functions like login, registration, and password reset.

{% docs tip %}
ID site page are a convenience feature in Stormpath.  If you prefer to build and host your own pages, you can recreate much of the functionality using Stormpath's Core API.
{% enddocs %}

##What is an ID Site
Stormpath ID Site is a set of hosted and pre-built user interface screens that take care of common identity functions for your applications-- login, registration, password reset.  ID Site can be access via your own custom domain like id.mydomain.com and shared across multiple applications to create centralized authentication if needed.  

The screens, and even the functionality, of ID site are completely customizable.  You have full access to the source code of the ID Site screens so you can make simple changes like adding your own logo and changing CSS or more complex changes like adding fields, adding javascript code, adding screens, removing screens, and even changing how the screens behave.  

## Why should I use Stormpath ID Site?

Building, securing, and maintaining identity screens for your users is time consuming, full of security concerns, and often more complex than many developers estimate.  Stormpath ID Site gives you and your development team peace of mind that you will have best in class user security quickly and easily, with very little code-- minimizing risk to your project timeline. 

In addition, ID Site will automatically detect any Workflow or Social Login configurations you have set in Stormpath and show the appropriate buttons, messaging, and behavior.

Stormpath ID Sites fully decouples your identity screens from your applications, making it incredibly easy to provide the same login / registration pages for multiple applications -- achieving centralized user management and authentication with a clean and easy user experience.

<!--Over time, ID Sites will be enhanced for Single-Sign-On and handle delegated authentication for additional applications.-->

## How does ID Site Work
<!-- Needs Diagram -->

Enables an app with sdk to a redirect to a working set of pages to do auth, register

When users enters data, id site will automatically use stormpath ID to validate any credentials and create a security assertion that only their application can understand (can't spoof or modify the behavior== signed).  Once that occurs, the id will redirect back to the application. the app will take the asertion and use the sdk will validate and unpack the user data and go on its merry way. 

<!-- sequence diagram -->


Source code for ID Site is hosted on GitHub.  Stormpath infra, when modifuing, can detect changes to a specific branch in a specific repo and automatically sync your file to the stormpath infra.  

The default source code for ID Site is hosted on GitHub.  Simple customization, like adding a logo, can be doing via Stormpath's Admin Console.   More advanced customizations to your ID Site's look, feel, and behavior can done by forking and modifying the default source code. 

Below is the default look and feel for your ID Site:

![](/images/guides/Login.png =700x) 

To use your application with an ID Site, you must use the Stormpath Java SDK to enable the integration.  ID Sites enable the following workflow:

1. The user visits your application for the first time and clicks the login/sign up button
2. The user is redirected to the ID Site using the Stormpath Java SDK
3. The user either signs up or logs into the ID Site
4. If successful, the ID Site will redirect the user back to your application with the assertion about the user's identity

In other words, your ID Site allows for application-initiated workflows and is used to supplement your application with the functionality that ID Site provides.

## Notes on security
Authentication is handled on a Stormpath hosted ID Site to Stormpath directly.  So they're no additional hops to secure

Communication between ID site and Stormpath is using one time use tokens.  So no replay attacks.  

Info being sent from ID site back to your app is being signed that only your app and id site have shared secret.  All of this is transparent to the developer-- its all handled by the sdk.

ALl comm is over SSL.  Host their SSL

## Setting up your ID Site
Setting up your ID Site consists of using the Stormpath Admin Console to configure your ID Site.  Your ID Site uses a default configuration for testing purposes, but can be fully configured to host customized code or hosted through your own domain. 

To set up your ID Site, log into the Administrator Console and:

1. Click on the `ID Site` Tab
2. Add your application URL that will process the callback from the ID Site to the `Authorized Redirect URIs` property.  This URL will be hosted by your application and will use the Stormpath SDK to handle the assertion about the user on a redirect
3. Click the `Update` button at the bottom of the page

Once an ID Site is configured, a subdomain that will host your ID Site is set up on `stormpath.io`.  This follows the format of `tenant-name.id.stormpath.io` where tenant-name is the name of your Stormpath `Tenant`.

{% docs note %}
<!-- Something about not being able to reach the url directly -->
{% enddocs %}

For more advanced configurations, there are additional properties in the ID Site configuration that can help:

+ Set a Logo to appear at the top of the default ID Site
+ Set a custom domain name (like id.mydomain.com) and SSL certificate to host your ID Site from your domain, securely
+ Set a custom github repo to host your ID Site (to host custom code)

<!-- needs screenshot -->

## Setting up your Application to use ID Site

In order to set up your application to use ID Site, you will need to install the Stormpath SDK.  The Stormpath SDK and hosted ID Site will do most of the work for your application, including signing and unpacking secure communication between themselves.  With the SDK is installed, you will need to implement two steps: 

+ Sending a User to the ID Site to Authenticate / Sign up
+ Consuming responses from the ID Site to your Application

<!-- 
When a user visits your application and needs to login, sign up, or reset their password, you need to use the Stormpath Java SDK to integrate your application with your ID Site.  The Stormpath Java SDK will allow you to:

+ Communicate securely and redirect the user to your ID Site
+ Take a valid authentication request from the ID Site and return an `Account` object for the user

When integrating an ID Site to your application, you can break down the integration into two steps:

+ Sending a User to the ID Site to Authenticate / Sign up
+ Consuming responses from the ID Site to your Application
-->

### Sending a User to the ID Site to Authenticate / Sign up

When a user wants to login to or register for your application, you will need to redirect them to your ID Site. The Stormpath SDK will generate a secure URL for the HTTP redirect on your application's behalf and include data needed by ID Site. 

To demonstrate how the SDK works, we’ll use an example. Imagine you are  building a Stormtrooper application for managing Stormtrooper equipment— like awesome helmets and blasters. The application is using Stormpath's ID Site for authentication.

A typical set of steps in your application are as follows:

1. You render your application with a login button
2. The user clicks the login button which will send a request to you server
3. Your server will use the Stormpath SDK to get the redirection URL for the ID Site
4. Your server responds with an HTTP 302 which redirects the user to the ID Site URL 

To build an ID Site URL for redirection, you must ask the Stormpath `Application` object for an `ID Site URL Builder`.  From the builder, you can set important properties to pass information and make sure the ID Site can call back to your application.

To get an `ID Site URL Builder`:

        Application application = client.getResource(applicationRestUrl, Application.class);

        IdSiteUrlBuilder idSiteBuilder = application.newIdSiteUrlBuilder();

{% docs info %}
**Reminder** - An `Application` in Stormpath is a representation of your real world application.  For more info check out our [Tutorial](https://stormpath.com/tutorial/) or [Product Guide](/java/product-guide/).
{% enddocs %}

The `ID Site URL Builder` will allow you to configure the URL to include:

+ `Callback URI` (required)- The callback URI will be called by ID Site when a successful login or registration event occurs. The Callback URI is **required** for the builder and it must match an `Authorized Redirect URI` in the Admin Console's ID Site settings.  See the [Setting up your ID Site](#setting-up-your-id-site) section in this guide.
+ `Path` (optional)- a relative link to a page in your ID Site.  The default ID Site does not require a path and will default to the login page.  If you would like to send the user to a specific page in ID site, like the registration page or the forgot password page, you would set that in the `Path`.  If you are using the default ID Site, the URLs are:
    + Registration - `/#/register`  
    + Forgot Password - `/#/forgot` 
+ `State` (optional) - a string that stores information that your application needs _after_ the user is redirected back to your application.  You may need to store information about what page the user was on, or any variables that are important for your application.

Once the parameters are configured on your `ID Site URL Builder`, you can call the `build` method to get a string representation of the URL. 

The HTTP response to the user should resemble:

        HTTP/1.1 302 Found

        Cache-Control: no-store no-cache
        Pragma: no-cache
        Expires: -1
        Location: %%GENERATED_ID_SITE_URL_FROM_BUILDER%%

Creating the redirection with an `HTTPServletResponse` would follow:

    response.setStatus(302, "Found");
    response.setHeader("Cache-control", "no-cache, no-store");
    response.setHeader("Pragma", "no-cache");
    response.setHeader("Expires", "-1");
    response.setHeader("Location", idSiteBuilder.build());

### Consuming responses from the ID Site to your Application

Once the user has logged in, created an account, or verified an account, the ID Site will redirect the user back to your application using the `Callback URI` you included when you first redirected the user to ID Site.  The Stormpath SDK will verify the signature on the callback message and unpacks the user information. 

The `Callback URI` that was set when configuring the `ID Site URL Builder` is `http://trooperapp.com/authenticate`.  The `/authenticate` endpoint is wired to call a method in your servlet.  The app can use the Stormpath Java SDK and the `Application` object to create an `ID Site Callback Handler`.  The callback handler will allow you to get access to the account and other important properties.

For example:

    public void authenticate(HttpServletRequest request, HttpServletResponse response) {
         Application application = client.getResource(applicationRestUrl, Application.class);

         AccountResult accountResult = application.newIdSiteCallbackHandler(request).getAccountResult();

         Account account = accountResult.getAccount();
    }   

The `AccountResult` will be able to give your app the ability to understand:

+ The `Account` for the successful account result
+ A `boolean` that will return true for a newly created account
+ A `String` of the state that was set when using the `ID Site URL Builder`

Once the account is retrieved, you can get access to additional account properties that are important to your app, such as `Groups` or `CustomData`

##  Wrapping up

In this guide, we discussed how to set up a Stormpath ID Site as well as how your application can leverage your ID Site to provide common application work flows around user login and registration. This feature is currently in beta. If you have any questions, bug reports, or enhancement requests please email support@stormpath.com.



