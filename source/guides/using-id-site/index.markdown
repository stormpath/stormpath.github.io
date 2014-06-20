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

In this guide, we discuss how to set up Stormpath to host a set of web pages that will allow your applications to leverage Stormpath infrastructure for login, registration, and password reset pages.

## Why should I use Stormpath to host my UI

With a few lines of code in your application, you can quickly and easily leverage Stormpath in your Application to host identity management pages.  These pages can include login, user registration, and password reset.  In Stormpath terms, these pages together are an ID Site.  

Stormpath's vision for this feature is to allow you to be able to quickly wire up your applications to use Stormpath without a development effort around login, registration, forgot password, input validation, and security. Since Stormpath is hosting and managing these ID sites, their is little to no development that needs to occur on UI's related to user sign up and login work flows.

<!--Over time, ID Sites will be enhanced for Single-Sign-On and handle delegated authentication for additional applications.-->

## What is an ID Site?

An ID Site by default consists of set of web pages that allow your end-users to register, login, and reset their passwords.  Hosted on Stormpath infrastructure gives your ID Site, a reliable, fast and inexpensive way to provide this functionality to your applications. ID Sites use best practices in security when communicating between Stormpath REST API and communicating with your application.

Below is the default look and feel for the ID Site:

![](/images/guides/Login.png =700x)

This provides a default ID Site that can be white-labeled for your applications with the source available on [github]().  This ID Site is dynamic, it can detect if your application is configured for Google or Facebook login and display the buttons.  An ID Site can be used for multiple applications, making it possible to provide the same login / registration page for multiple applications.  

To work with an ID Site, you must use a Stormpath SDK to delegate to communicate and redirect the user to the ID Site when needed.  ID Sites enable the following workflow.

1. The user visits your application for the first time, and clicks the login/sign up button
2. The user is redirected to the ID Site using the Stormpath SDK
3. The user either signs up or logs into the ID Site
4. If successful, the ID Site will redirect the user back to your application with the assertion about the user's identity

In other words, ID Sites allow for application-initiated workflows and are used to supplement your application with the functionality that ID Site provides.

## Setting up your ID Site

Setting up your ID Site consists of using the Administrator Console to configure your ID Site.  The ID Site uses a default configuration for testing purposes, but can be fully configured to host customized code and even be hosted through your own domain. 

To set up your ID Site, log into the Administrator Console and:

1. Click on the `ID Site` Tab
2. Add your application location that will process the redirection from the ID Site to the `Authorized Redirect URIs`
3. Click the `Update` button at the bottom of the form

Once an ID Site is configured, a subdomain is set up on stormpath.io that will host the ID Site.  This follows the format of `tenant-name.id.stormpath.io` where tenant-name is the name of your Stormpath Tenant.

For more advance configurations, there are additional properties in the ID Site configuration that can help:

+ Set a Logo to appear at the top of the default ID Site UI
+ Set a custom domain name and SSL certs for the custom domain (for example, if you want to host your ID Site)
+ Set a custom github repo to host your ID Site

## Using the Stormpath SDK Enable your App to use your ID Site

When a user visit your application and needs to login, sign up, or reset their password, you need to leverage the Stormpath Java SDK as a helper to the integration.  The Stormpath Java SDK will allow you to communicate securely to the ID Site, and also allows for taking a valid authentication request from the ID Site and returning an Account for the user in your application.

When integrating an ID Site to your application, you can break down the integration into two steps:

+ Sending a User to the ID Site to Authenticate / Sign up
+ Consuming responses from the ID Site to your Application

### Sending a User to the ID Site to Authenticate / Sign up

When a user wants to login to or register for your site, it is required to use the Stormpath SDK to redirect the user to the ID Site. For example, let's look at a login scenario:

1. You render your application with a login button
2. User clicks the login button which links to `/login`
3. Your application, on the `/login` request:
    1. Use the Stormpath SDK to get the redirection URL got the ID Site
    2. Redirect the user to the ID Site URL

To build an ID Site URL for redirection, you must ask the application for a `ID Site URL Builder`.  From the builder you can set important properties to pass information and make sure the ID Site can call back to your application.

To get an `ID Site URL Builder`:

        Application application = client.getResource(applicationRestUrl, Application.class);

        IdSiteUrlBuilder idSiteBuilder = application.newIdSiteUrlBuilder();

{% docs info %}
**Reminder** - An `Application` is a representation of your real world application.  For more info check out our [Tutorial](https://stormpath.com/tutorial/) or [Product Guide](/java/product-guide/).
{% enddocs %}

The `ID Site URL Builder` will allow you configure the URL to include:

+ `Callback URI` - the required callback URI for your application, it must match a `Authorized Redirect URI` in the Admin Console ID Site settings.  The callback URI will be called when a successful login or register event occurs.  
+ `Path` - an optional path for the ID Site.  The default ID Site does not require a path and will default the the login page.  There are additional pages that you can use the `Path` to get to, this is important if you would like to separate the login button from the register button:
    + `/#/register` - the path that will get the user to the register page
    + `/#/forgot` - the path that will get the user to the forgot password page
+ `State` - an optional string that is can store information that your application needs after the user comes back from the ID Site.  You may need to store information in regards to the page the user was on, or any variables that are important for your application.

Once the parameters are configured on your ID Site URL Builder, you can call the `build` method to get the URL to redirect the user to.

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

To demonstrate how the SDK works, we’ll use an example. We are building a Stormtrooper app for managing Stormtrooper equipment— like awesome helmets and blasters. The app is using Stormpath's ID Site for authentication.  The callback URL that was set for when the user returns to the application is `http://tropperapp.com/authenticate`.  The `/authenticate` endpoint is wired to call a method in the servlet.  The app can use the Stormpath SDK and the `application` to create an `ID Site Callback Handler`.  The callback handler will allow you to get access to the account.

    public void authenticate(HttpServletRequest request, HttpServletResponse response) {
         Application application = client.getResource(applicationRestUrl, Application.class);

         AccountResult accountResult = application.newIdSiteCallbackHandler(request).getAccountResult();

         Account account = accountResult.getAccount();
    }   

The `AccountResult` will be able to give your app the ability to understand:

+ The `Account` for the successful account result
+ A `boolean` that will return true for an newly created account
+ A `String` of the state that was set when using the `ID Site URL Builder`

Once the account is retrieved, you can get access to additional account properties that are important to your app, such as `Groups` or `CustomData`

##  Wrapping up

In this guide, we discussed how to set up a Stormpath ID Site and how your application can leverage your ID Site to provide common application work flows around user login and registration. This feature is currently in beta. If you have any questions, bug reports, or enhancement requests please email support@stormpath.com.



