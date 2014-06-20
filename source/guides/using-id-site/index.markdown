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

In this guide, we discuss how to set up Stormpath to host a set of web pages that will allow your applications to leverage Stormpath infrastructure for login, registration, and password reset.

## Why should I use Stormpath to host my UI?

With a few lines of code in your application, you can quickly and easily leverage Stormpath to host identity management pages.  These pages can include login, user registration, and password reset.  In Stormpath terms, these pages are called an ID Site.  

Stormpath's vision for this feature is to allow you to be able to quickly wire up your applications to use Stormpath without development effort around login, registration, forgot password, input validation, and security. Since Stormpath is hosting and managing your ID site, there is little to no development that needs to occur on UI's related to user sign up and login work flows.

<!--Over time, ID Sites will be enhanced for Single-Sign-On and handle delegated authentication for additional applications.-->

## What is an ID Site?

An ID Site by default consists of a set of web pages that allows your end-users to register, login, and reset their passwords.  Hosting on Stormpath infrastructure gives your ID Site a reliable and fast way to provide this functionality to your applications. ID Sites use best practices in security when communicating between the Stormpath REST API and your application.

Below is the default look and feel for your ID Site:

![](/images/guides/Login.png =700x)

Your default ID Site can be white-labeled for your applications with the source code available on [github](https://github.com/stormpath/idsite-src).  The ID Site is dynamic; it can detect if your application is configured for Google or Facebook login and display the buttons.  The ID site will also detect if workflows (such as email verification) are enabled and will provide basic messaging. Your ID Site can be used for multiple applications, making it possible to provide the same login / registration page for multiple applications.  

To use your application with an ID Site, you must use the Stormpath Java SDK to  enable the integration.  ID Sites enable the following workflow:

1. The user visits your application for the first time and clicks the login/sign up button
2. The user is redirected to the ID Site using the Stormpath Java SDK
3. The user either signs up or logs into the ID Site
4. If successful, the ID Site will redirect the user back to your application with the assertion about the user's identity

In other words, your ID Site allows for application-initiated workflows and is used to supplement your application with the functionality that ID Site provides.

## Setting up your ID Site

Setting up your ID Site consists of using the Stormpath Admin Console to configure your ID Site.  Your ID Site uses a default configuration for testing purposes, but can be fully configured to host customized code or hosted through your own domain. 

To set up your ID Site, log into the Administrator Console and:

1. Click on the `ID Site` Tab
2. Add your application URL that will process the callback from the ID Site to the `Authorized Redirect URIs` property
3. Click the `Update` button at the bottom of the page

Once an ID Site is configured, a subdomain that will host your ID Site is set up on `stormpath.io`.  This follows the format of `tenant-name.id.stormpath.io` where tenant-name is the name of your Stormpath `Tenant`.

For more advanced configurations, there are additional properties in the ID Site configuration that can help:

+ Set a Logo to appear at the top of the default ID Site UI
+ Set a custom domain name and SSL certificate (to host your ID Site from your domain, securely)
+ Set a custom github repo to host your ID Site (to host custom code)

## Using the Stormpath SDK to Enable your App to use your ID Site

When a user visits your application and needs to login, sign up, or reset their password, you need to use the Stormpath Java SDK to integrate your application with your ID Site.  The Stormpath Java SDK will allow you to:

+ Communicate securely and redirect the user to your ID Site
+ Take a valid authentication request from the ID Site and return an `Account` object for the user

When integrating an ID Site to your application, you can break down the integration into two steps:

+ Sending a User to the ID Site to Authenticate / Sign up
+ Consuming responses from the ID Site to your Application

### Sending a User to the ID Site to Authenticate / Sign up

When a user wants to login to or register for your site, it is required to use the Stormpath SDK to redirect the user to the ID Site. For example, let's look at a login scenario:

1. You render your application with a login button
2. User clicks the login button which links to `/login`
3. Your application on the `/login` request:
    1. Uses the Stormpath SDK to get the redirection URL got the ID Site
    2. Redirects the user to the ID Site URL

To build an ID Site URL for redirection, you must ask the application for an `ID Site URL Builder`.  From the builder, you can set important properties to pass information and make sure the ID Site can call back to your application.

To get an `ID Site URL Builder`:

        Application application = client.getResource(applicationRestUrl, Application.class);

        IdSiteUrlBuilder idSiteBuilder = application.newIdSiteUrlBuilder();

{% docs info %}
**Reminder** - An `Application` is a representation of your real world application.  For more info check out our [Tutorial](https://stormpath.com/tutorial/) or [Product Guide](/java/product-guide/).
{% enddocs %}

The `ID Site URL Builder` will allow you to configure the URL to include:

+ `Callback URI` - The callback URI will be called when a successful login or registration event occurs. The Callback URI is **required** for the builder and it must match an `Authorized Redirect URI` in the Admin Console's ID Site settings.   
+ `Path` - an optional path for the ID Site.  The default ID Site does not require a path and will default to the login page.  There are additional pages that you can use the `Path` to get to. This is important if you would like to separate the login button from the sign up button:
    + `/#/register` - the path that will get the user to the registration page
    + `/#/forgot` - the path that will get the user to the forgot password page
+ `State` - an optional string that stores information that your application needs after the user is redirected back to your application.  You may need to store information about what page the user was on, or any variables that are important for your application.

Once the parameters are configured on your `ID Site URL Builder`, you can call the `build` method to get a string representation of the URL to which to redirect the user.

The HTTP response to the user should resemble:

        HTTP/1.1 302 Found

        Cache-Control: no-store no-cache
        Pragma: no-cache
        Expires: -1
        Location: %%GENERATED_ID_SITE_URL_FROM_BUILDER%%

Creating the redirection with an `HTTPServletResponse` would follow:

    HttpServletResponse response; // You'll need to initialize this properly

    response.setHeader("Cache-control", "no-cache, no-store");
    response.setHeader("Pragma", "no-cache");
    response.setHeader("Expires", "-1");
    response.setHeader("Location", idSiteBuilder.build());

### Consuming responses from the ID Site to your Application

Once the user has logged in, created an account, or verified an account, the ID Site will redirect the user back to your application using the `Callback URI` set on the `ID Site URL Builder`.  Your application needs to have logic to handle the callback and get the information about the user's account.  The Stormpath SDK has APIs to help your application get this information.

To demonstrate how the SDK works, we’ll use an example. Imagine you are  building a Stormtrooper app for managing Stormtrooper equipment— like awesome helmets and blasters. The app is using Stormpath's ID Site for authentication.  The `Callback URI` that was set when configuring the `ID Site URL Builder` is `http://trooperapp.com/authenticate`.  The `/authenticate` endpoint is wired to call a method in your servlet.  The app can use the Stormpath Java SDK and the `Application` object to create an `ID Site Callback Handler`.  The callback handler will allow you to get access to the account and other important properties.

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



