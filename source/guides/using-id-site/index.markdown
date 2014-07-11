---
layout: doc
lang: guides
title: Using Stormpath's ID Site to Host your User Management UI
---

{% docs info %}
  **This feature is currently in Beta.**  If you have any questions, bug reports, or enhancement requests please email support@stormpath.com. 
{% enddocs %}

{% docs info %} 
Currently supported Stormpath SDKs for this feature include: **Java**.  Other language platforms are on their way soon.
{% enddocs %}

In this guide, we discuss how to set up Stormpath to host a set of web pages that enable your applications to quickly and securely offer common identity management functions like login, registration, and password reset.

{% docs tip %}
ID site pages are a convenience feature in Stormpath.  If you prefer to build and host your own pages, you can recreate much of the functionality using Stormpath's SDKs and Core API.
{% enddocs %}

##What is an ID Site?
Stormpath ID Site is a set of hosted and pre-built user interface screens that take care of common identity functions for your applications -- login, registration, and password reset.  ID Site can be accessed via your own custom domain like id.mydomain.com and shared across multiple applications to create centralized authentication if needed.

The screens, and even the functionality, of ID site are completely customizable.  You have full access to the source code of the ID Site screens so you can make simple changes like adding your own logo and changing CSS or more complex changes like adding fields, adding javascript code, adding screens, removing screens, and even changing how the screens behave.  

## Why should I use Stormpath ID Site?

Building, securing, and maintaining identity screens for your users is time consuming, full of security concerns, and often more complex than many developers estimate.  Stormpath ID Site gives you and your development team peace of mind that you will have best in class user security quickly and easily, with very little code-- minimizing risk to your project timeline. 

Stormpath ID Site fully decouples your identity screens from your applications, making it incredibly easy to provide the same login / registration pages for multiple applications -- achieving centralized user management and authentication with a clean and easy user experience.

## How does ID Site Work?
To demonstrate how the SDK works, we’ll use an example. Imagine you are building a Stormtrooper application for managing Stormtrooper equipment — like awesome helmets and blasters. The application is trooperapp.com and is using Stormpath ID Site for login and registration.

Once trooperapp.com is rendered by the browser, login and registration buttons are available for the unauthenticated user.  Clicking on these buttons will call your server-side application at specific endpoints.  For illustration, the login button will invoke `/login` and registration will invoke `/register`. Your application using the Stormpath SDK will securely redirect the user to the ID Site along with a cryptographically signed JSON Web Token (JWT) that includes information like the `Callback URI`, `Path` to a specific ID Site page, and any `State` you think is important for your application.

On the ID Site, the user will enter their data and complete the appropriate action, like login.  ID Site will automatically detect any Workflow or Social Login configurations set in Stormpath and show the appropriate buttons, messaging, and behavior.

After the user has logged in successfully, they will be redirected back to your application's `Callback URI`.  For illustration purposes, this could be `http://trooperapp.com/handle-id-site-redirect`.  When the ID Site redirects back to your application, it will pass a secure JWT that represents the account in Stormpath.  Using the Stormpath SDK, your application will handle the request to `/handle-id-site-redirect`, validate that the JWT is correct, and return an `Account Result`. The `Account Result` will include the Stormpath `Account` object and additional information, such as any state that was passed by your application or if the account returned is newly created.

<!-- When a user wants to login to or register for your application, your application will redirect them to your ID Site.  On your ID Site, the user will enter their data and complete the appropriate action, like login.  ID Site will automatically detect any Workflow or Social Login configurations you have set in Stormpath and show the appropriate buttons, messaging, and behavior.

On a Login, your ID Site will validate the user's credentials and create a security assertion that will be sent back to your application letting your application know that the current user is authenticated and should be trusted.  That security assertion is cryptographically signed by Stormpath using a shared secret known by your application.  This means that only Stormpath and your application can understand the assertion, thwarting certain attack vectors including [man-in-the-middle attacks](http://en.wikipedia.org/wiki/Man-in-the-middle_attack). 

Once your application receives the security assertion, your application will use the Stormpath SDK to verify and unpack the user data.  --> 

![](/images/docs/ID-diagram.png)

<!-- sequence diagram -->

## Setting up your ID Site
Your ID Site uses a default configuration for testing purposes, but can be fully configured to host customized code or to use your own custom domain.  

To set up your ID Site, log into the [Administrator Console](https://api.stormpath.com) and:

1. Click on the `ID Site` Tab
2. Add your application URLs that will be allowed process the callbacks from the ID Site to the `Authorized Redirect URIs` property.  These URLs will be hosted by your application and will use the Stormpath SDK to process the security assertions about the user that ID Site sends back.
3. Click the `Update` button at the bottom of the page

<!-- I feel like we really need to better explain Authorized Redirect URIs.  With an example perhaps. -->

<!-- screen shot -->

Once you configure your ID site, a default subdomain will be created on `stormpath.io`.  The default ID Site URL follows the format of `tenant-name.id.stormpath.io` where tenant-name is the name of your Stormpath `Tenant`.

{% docs warning %}
Your ID Site URL can only be accessed via a redirect from a Stormpath enabled application because ID Site expects a cryptographically signed token with specific data in it.  Simply visiting your ID Site URL in a browser will give you an error.
{% enddocs %}

For more advanced configurations, there are additional properties in the ID Site configuration that can help:

+ Set a Logo to appear at the top of the default ID Site
+ Set a custom domain name (like id.mydomain.com) and SSL certificate to host your ID Site from your domain, securely
+ Set a custom GitHub repo to host your ID Site (to host custom code)

<!-- I feel like we need to talk about this more -->

### Setting your own custom domain name and SSL certificate

By default, the address of your ID Site is tenant-name.id.stormpath.io. However, you can change the address to a subdomain of your own website, such as id.mysite.com. This is called setting up a custom domain name.

For example, the Stormtrooper equipment application's main website is trooperapp.com. After signing up for Stormpath, the initial address of the ID Site might be something like happy-rebel.id.stormpath.io. You can change the ID Site's address to a subdomain of your company website, like id.trooperapp.com.

The workflow for changing the address consists of the following steps:

+ Get a domain name and a subdomain (if not already done)
+ Make the subdomain an alias of your ID Site on Stormpath
+ Enable the custom domain in Stormpath's ID Site configuration
+ Input SSL information for Stormpath to host

#### Getting a domain name and a subdomain

If not already done, you must register a domain name and add an ID subdomain to it.

{% docs note %}
Working with domain names and subdomains can be confusing because it's something most of us rarely do. Consult your system administrator, if you have one, before proceeding.
{% enddocs %}

+ _Purchase and register a domain name with a domain registrar._ You can purchase and register a domain name from any domain registrar, including GoDaddy, Yahoo! Domains, 1&1, Netregistry, or Register.com. For instructions, see the Help on the registrar's website. 

+ _Create a subdomain for your domain for your ID Site._ See the Help on the registrar's website for instructions on adding a subdomain. You can call the subdomain "id", "login" or something similar. Example: id.trooperapp.com.

#### Making the subdomain an alias of your ID Site on Stormpath

The next step is to make your subdomain an alias of your ID Site on Stormpath. An alias is simply an alternate address for a website. For example, you can make the addresses "id.trooperapp.com" and "happy-rebel.id.stormpath.io" interchangeable as far as web browsers are concerned.

{% docs note%}
Consult your system administrator, if you have one, before proceeding.
{% enddocs %}

To make your subdomain an alias of your ID Site website on Stormpath, you must use your domain registrar's tools and UI.  These steps will generally include:

+ Log in to your domain registrar's control panel.
+ Look for the option to change DNS records.
+ Locate or create the CNAME records for your domain.
+ Point the CNAME record from your subdomain (ex. "id" or "login") to your ID Site subdomain (ex. happy-rebel.id.stormpath.io)

{% docs note %}
It takes time for changes to the DNS system to be implemented. Typically, it can take anywhere from a few hours to a day, depending on your Time To Live (TTL) settings in the registrar's control panel. In the example above, the TTL is 14,400 seconds, or 4 hours.
{% enddocs%}

#### Enabling the custom domain in Stormpath's ID Site configuration

After making your subdomain an alias of your support ID Site on Stormpath, you must enable a custom domain in the Stormpath. If you omit this step, your subdomain will point to a error page rather than your ID Site.

To set up a custom domain on ID Site, log into the [Administrator Console](https://api.stormpath.com) and:

1. Click on the `ID Site` Tab
2. Click the `Custom` option under `Domain Name`
3. Type in the subdomain for your ID Site (ex: id.trooperapp.com)
4. Click the `Update` button at the bottom of the page

#### Setting up SSL on your ID Site 

Since Stormpath is hosting the ID Site under your custom subdomain, to secure it using SSL you must provide the SSL certificate information to Stormpath. Creating SSL certificates is an involved task which requires working with a certificate authority such as Verisign and includes:

1. Generating a certificate request (CSR) with a Distinguished Name (DN) that matches your subdomain (ex. id.trooperapp.com)
2. Provide the CSR file to a certificate authority such as Verisign. The certificate authority generates a SSL certificate and gives it to you so that it can be installed on Stormpath's servers. 

Once the SSL certificate is retrieved from the certificate authority, you can log into the [Administrator Console](https://api.stormpath.com) and configure SSL by:

1. Click on the `ID Site` Tab
2. Open the zip to retrieve your .pem file if needed.
3. Copy the text for the SSL certificate and Private Key to the appropriate text boxes on the `ID Site` Tab
4. Click the `Update` button at the bottom of the page

When the ID Site is updated, the SSL information is uploaded to Stormpath and will update your ID Site automatically.

### Customizing ID Site look, feel, and behavior
Your ID Site can be customized to have your own look and feel. Simple customization, like adding a logo, can be done via Stormpath's Admin Console.

Below is the default look and feel for your ID Site:

![](/images/guides/Login.png =700x) 

More advanced customization can be achieved by forking the [default ID Site source code found on GitHub](https://github.com/stormpath/idsite-src) and then pointing ID Site to your new GitHub repository.  Stormpath infrastructure can detect any changes to a specific branch in your GitHub repository and automatically sync your file to the Stormpath infrastructure.

<!-- anything we want to add here? Angular SPA? Stormpath.js? Fluffy kittens, rainbows, and unicorns? -->

## Setting up your Application to use ID Site

In order to set up your application to use ID Site, you will need to install the Stormpath SDK and register the application in Stormpath.  The Stormpath SDK and hosted ID Site will do most of the work for your application, including signing and unpacking secure communication between themselves.  With the SDK installed, you will need to implement two steps: 

+ Send a User to the ID Site to Login, Register, etc.
+ Consume responses from the ID Site to your Application

### Sending a User to the ID Site to Authenticate / Sign up

When a user wants to login to or register for your application, you will need to redirect them to your ID Site. The Stormpath SDK will generate a secure URL for the HTTP redirect on your application's behalf and include data needed by ID Site. 

A typical set of steps in your application are as follows:

1. You render your application with a login button
2. The user clicks the login button which will send a request to your server
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

    response.setStatus(HTTPServletResponse.SC_FOUND);
    response.setHeader("Cache-control", "no-cache, no-store");
    response.setHeader("Pragma", "no-cache");
    response.setHeader("Expires", "-1");
    response.setHeader("Location", idSiteBuilder.build());

<!-- do we want to include the example? -->
<!-- 
To demonstrate how the SDK works, we’ll use an example. Imagine you are  building a Stormtrooper application for managing Stormtrooper equipment— like awesome helmets and blasters. The application is using Stormpath's ID Site for authentication.
-->

### Consuming responses from the ID Site to your Application

Once the user has logged in, created an account, or verified an account, the ID Site will redirect the user along with a security assertion back to your application.  ID Site will use the `Callback URI` you included when you first redirected the user to ID Site.  The Stormpath SDK will verify the cryptographic signature on the assertion and and unpacks the user information. 

For example:

    public void authenticate(HttpServletRequest request, HttpServletResponse response) {
         Application application = client.getResource(applicationRestUrl, Application.class);

         AccountResult accountResult = application.newIdSiteCallbackHandler(request).getAccountResult();

         Account account = accountResult.getAccount();
    }   

The `AccountResult` will be able to give your application the ability to understand:

+ The `Account` for the successful account result
+ A `boolean` that will return true for a newly created account
+ A `String` of the state that was set when using the `ID Site URL Builder`

Once the account is retrieved, you can get access to additional account properties that are important to your application, such as `Groups` or `CustomData`

<!-- 
## Notes on security
A major feature of ID Site is security.  With ID Site:

All user authentication is handled on a Stormpath hosted ID Site to Stormpath directly.  So there are no additional hops to secure

Communication between ID site and Stormpath is using one time use tokens.  So no replay attacks.  

Info being sent from ID site back to your app is being signed that only your app and id site have shared secret.  All of this is transparent to the developer its all handled by the sdk.

ALl comm is over SSL.  Host their SSL -->

##  Wrapping up

In this guide, we discussed how to set up a Stormpath ID Site as well as how your application can leverage your ID Site to provide common application workflows around user login and registration. This feature is currently in beta. If you have any questions, bug reports, or enhancement requests please email support@stormpath.com.



