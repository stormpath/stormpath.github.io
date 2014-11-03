---
layout: doc
lang: guides
title: Using Stormpath's ID Site to Host your User Management UI
---

{% docs info %}
  **This feature is currently in Beta.**  If you have any questions, bug reports, or enhancement requests please email support@stormpath.com. 
{% enddocs %}

{% docs info %} 
Currently supported Stormpath SDKs for this feature include: **Java**, **Node.js**, **Python**.  Other language platforms are on their way soon.
{% enddocs %}

In this guide, we discuss how to set up Stormpath to host a set of web pages that enable your applications to quickly and securely offer common identity management functions like login, registration, and password reset.

{% docs tip %}
ID site pages are a convenience feature in Stormpath.  If you prefer to build and host your own pages, you can recreate much of the functionality using Stormpath's SDKs and Core API.
{% enddocs %}

##What is an ID Site?
Stormpath ID Site is a set of hosted and pre-built user interface screens that take care of common identity functions for your applications -- login, registration, and password reset.  ID Site can be accessed via your own custom domain like id.mydomain.com and shared across multiple applications to create centralized authentication if needed.

The screens, and even the functionality, of ID site are completely customizable.  You have full access to the source code of the ID Site screens so you can make simple changes like adding your own logo and changing CSS or more complex changes like adding fields, adding JavaScript code, adding screens, removing screens, and even changing how the screens behave.  

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

### Setting your own Custom Domain Name and SSL certificate

By default, the address of your ID Site is tenant-name.id.stormpath.io. However, you can change the address to a subdomain of your own website, such as id.mysite.com. This is called setting up a custom domain name.

For example, the Stormtrooper equipment application's main website is trooperapp.com. After signing up for Stormpath, the initial address of the ID Site might be something like happy-rebel.id.stormpath.io. You can change the ID Site's address to a subdomain of your company website, like id.trooperapp.com.

The workflow for changing the address consists of the following steps:

+ Get a domain name and a subdomain (if not already done)
+ Make the subdomain an alias of your ID Site on Stormpath
+ Enable the custom domain in Stormpath's ID Site configuration
+ Input SSL information for Stormpath to host

#### Getting a Domain Name and a Subdomain

If not already done, you must register a domain name and add an ID subdomain to it.

{% docs note %}
Working with domain names and subdomains can be confusing because it's something most of us rarely do. Consult your system administrator, if you have one, before proceeding.
{% enddocs %}

+ _Purchase and register a domain name with a domain registrar._ You can purchase and register a domain name from any domain registrar, including GoDaddy, Yahoo! Domains, 1&1, Netregistry, or Register.com. For instructions, see the Help on the registrar's website. 

+ _Create a subdomain for your domain for your ID Site._ See the Help on the registrar's website for instructions on adding a subdomain. You can call the subdomain "id", "login" or something similar. Example: id.trooperapp.com.

#### Making the Subdomain an Alias of your ID Site on Stormpath

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

#### Enabling the Custom Domain in Stormpath's ID Site Configuration

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

More advanced customization can be achieved by forking the [default ID Site source code found on GitHub](https://github.com/stormpath/idsite-src) and then pointing ID Site to your new GitHub repository.  Stormpath infrastructure can detect any changes to a specific branch in your GitHub repository and automatically sync your file to the Stormpath infrastructure. More information on this is included at the [bottom of this guide](#customizing-the-default-id-site)

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

{% docs notes %}
The Stormpath SDK forwards information to the ID Site including a
{% enddocs %}

To build an ID Site URL for redirection, you must ask the Stormpath `Application` object for an `ID Site URL Builder`.  From the builder, you can set important properties to pass information and make sure the ID Site can call back to your application.

To get an `ID Site URL Builder`:
{% codetab id:id-site-builder langs:java node python%}
------
Application application = client.getResource(applicationRestUrl, Application.class);

IdSiteUrlBuilder idSiteBuilder = application.newIdSiteUrlBuilder();
------
client.getApplication(applicationRestUrl, function(err, application) {
  var url = application.createIdSiteUrl({
    callbackUri: 'https://www.mysite.com/dashboard'
  });
});
------
url = app.build_id_site_redirect_url("https://www.mysite.com/dashboard")
------
{% endcodetab %}

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

### Consuming Responses from the ID Site to your Application

Once the user has logged in, created an account, or verified an account, the ID Site will redirect the user along with a security assertion back to your application.  ID Site will use the `Callback URI` you included when you first redirected the user to ID Site.  The Stormpath SDK will verify the cryptographic signature on the assertion and and unpacks the user information. 

For example:
{% codetab id:handle-response langs:java node python%}
------
public void dashboard(HttpServletRequest request, HttpServletResponse response) {
     Application application = client.getResource(applicationRestUrl, Application.class);

     AccountResult accountResult = application.newIdSiteCallbackHandler(request).getAccountResult();

     Account account = accountResult.getAccount();
}   
------
app.get('/dashboard',function(req,res) {
  client.getApplication(applicationRestUrl, function(err, application) {

    application.handleIdSiteCallback(req.url,function(err,idSiteResult) {
        var account = idSiteResult.account;
        // render the user dashboard for this account
    });

  });
});
------
result = app.handle_id_site_callback(url_response) # feed the whole URI to the method (with parameters and all)
if result is not None:
    print result.account
    print result.account.is_new_account # if the user came to the callback uri from the register screen
    print result.state # if any state was set during the creation of the redirect URI
------
{% endcodetab %}

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

## Customizing the Default ID Site

Based on your ID Site requirements, you may need to customize the ID Site's look and feel or use the default ID site as a base for enhancements.  This section will explain how you can leverage the existing Stormpath ID Site source code to make modifications.

{% docs info %}
ID Site Customization requires features that are available on Lite Plans and above.  More information about pricing can be found [here](https://stormpath.com/pricing/)
{% enddocs %}

{% docs info %}
**Prerequisites** Customizing and creating your own ID Site requires that you have already follow the [Using Stormpath's ID Site](/guides/using-id-site).  Having ID Site set up and working with the default Stormpath ID Site is required to work with this guide.

Installation prerequisites include:

+ [NodeJS](http://nodejs.org/download/)
+ [Bower](http://bower.io/)
{% enddocs %}

### Getting Set Up

Stormpath hosts the ID Site's source on [Github](https://github.com/stormpath/idsite-src).  This repository is the development environment for the Stormpath hosted ID Site. You can use this repository to build the same single page application that Stormpath provides, or you can modify it to suit your needs. The single page application uses [AngularJS](https://angularjs.org/) and [Browserify](http://browserify.org/). It is built using [Grunt](http://gruntjs.com/) and Yeoman (http://yeoman.io/).

The ID Site contains all HTML, CSS, JavaScript assets, and scripts needed to build and maintain your own ID Site.  To get started, there are four steps required:

1. Set up a fork of ID Site in Github to clone locally
2. Install dependencies and build the ID Site using grunt
3. Host the built ID Site on Github
4. Configure Stormpath to use your ID Site

#### Set up a Fork of ID Site in Github to Clone Locally

First, it is required to fork Stormpath's ID Site source git repository.  This will allow you to have a fork of the git repository that you can modify when customizing.  To fork a Github repository it is required that you have a Github account.

To fork the ID Site source git repository, click [here](https://github.com/stormpath/idsite-src/fork) and select the destination for the fork.

Once Github forks the repository, you can clone it locally by running this command from the terminal:

    git clone https://github.com/YOUR_USERNAME/idsite-src/


#### Install Dependencies and Build the ID Site Using Grunt 

Once you have a local clone of a fork of the ID Site source repository, you need to install the dependencies required to build and run the ID Site.  To accomplish this, in your terminal:

1. Navigate to the local idsite-src folder
2. Run: `npm install`
3. Run: `bower install`

After installing the dependencies, you can build the site by running:

    grunt build

This will produce a `dist` folder with the compiled and minified ID Site.

#### Host the built ID Site on Github

Once the ID Site is built to the `dist` folder, it needs to be hosted on Github.  This will allow Stormpath to clone and host the ID Site once configured in the Admin Console.

To host the built ID Site on Github:

1. Create a new Github repo by visiting [this link](https://github.com/new)
    * Make sure the git repository is marked as public
    * Once created - note the URL for the git repo (it will end with .git). It will be used in the next couple steps
2. Create a new git repo for the build ID Site
    * Navigate into the `dist` folder
    * Run: `git init` to initialize the git repository
    * Run: `git add .` to add the built files to staging
    * Run: `git commit` to commit these to the repository
3. Create a remote for your `dist` git repo for Github and push your ID Site to Github
    * Run: `git remote add origin YOUR_GIT_REPO_URL`
    * Run: `git push -u origin master`

#### Configure Stormpath to use your ID Site

Once the built ID Site is hosted on Github, you can use the Stormpath [Administrator Console](https://api.stormpath.com) to point to your git repository.   

To update your ID Site configuration to use your fork:

1. Log into the [Stormpath Admin Console](https://api.stormpath.com/login)
2. Click on the ID Site tab
3. Under Git Repository HTTPS URL
    - Click the `Custom` radio button
    - Add your Github repository URL to the textbox.  For ex: `https://github.com/stormpath/my-custom-id-site.git`
4. Scroll to the bottom of the dialog and click `Update`

Once the configuration is updated, Stormpath will clone your repository and host it on Stormpath infrastructure to provide hosting your ID Site.

{% docs note %}
Stormpath can also be pointed to a specific branch to use for the ID Site, by default Stormpath uses the `master` branch.  To configure this, update the `Git Repository Branch Name` property of the ID Site confguration page in the Administrator Console
{% enddocs %}

Once the ID Site configuration is updated, you can view the ID Site by visiting an web application that was set up to use ID Site using the instructions for [setting up an application to use an ID Site](/guides/using-id-site#setting-up-your-application-to-use-id-site)

### Customizing an ID Site

Once Stormpath has been set up to use your own ID site, it is now possible to make modifications to your ID site to meet your requirements. The ID Site repository is an [AngularJS](https://angularjs.org/) application and follows common angular design patterns.

There are three distinct areas where you can customize the ID Site:

+ HTML
+ CSS
+ JavaScript

### Customizing HTML

The ID Site HTML contains multiple HTML assets that provide the markdown for the ID Site.  These can be broken down into two distinct groups, the `master index` and the `views`.

The `master index` location is `idsite-src/app/index.html` and contains the definitions of the individual template views, CSS references, and JavaScript references.  This file would be the location for any global HTML changes to apply to your ID Site.  For example:

+ Modifications of the meta tags
+ Modifications of the favicon
+ Additional JavaScript/CSS assets
+ Additional HTML needed for all views, such as a footer or copyright

The `master index` is already wired for Google Analytics and can quickly be used by adding your Google Analytic's site ID into the script.

    <!-- Google Analytics: change UA-XXXXX-X to be your site's ID -->
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-XXXXX-X');
      ga('send', 'pageview');
    </script>

The `views` location is `idsite-src/app/views` and contains the templates for individual functionality.  These views are loaded at runtime into the main `master index` based on the path accessed on the ID Site. The following views can be modified to effect their distinct functionality and include:

+ `login.html` - The HTML for the login form for the ID Site.  This contains the HTML form that displays all of the fields associated with login.  By default, the root path `/` will display the login page.
+ `registration.html` - The HTML the registration form for the ID Site. This contains the HTML form that displays the fields associated with registration.  By default, the URL path `/register` will display the registration page
+ `forgot.html` - The HTML for the first step of the password reset workflow.  This includes the HTML that displays a form with fields for a end user to input his email address.  By default, the URL path `/forgot` will display the forgot password page
+ `reset.html` - The HTML for the second step of the password reset workflow.  This page is displayed when the user clicks on the password reset link that is sent to the end user's email.  This contains the HTML form to collect the new password and password confirmation.  
+ `unverified.html` - The HTML for the 'check your email' message when a newly created account needs to be verified.
+ `verify.html` - The HTML for the verification message when a user registers for an account and clicks on the email verification link.
+ `error.html` - The HTML for the error page when a fatal error occurs when using the ID Site.  This page is displayed when there is a problem with the redirection from your application to the ID Site
+ `password-error-messages.html` - The HTML template used for displaying password related error messages when validating passwords during registration.  For example, 'Password is too short'.

After making your HTML modifications, you can [update your ID Site](#updating-your-id-site).

### Customizing CSS

Your ID Site's CSS is built using LESS, a dynamic stylesheet language.  LESS is very similar to CSS but has more advanced functionality like variables, mixins, and nesting.  When your ID Site is built using the `build` grunt, the LESS files are built into CSS for the ID Site.

Common CSS customizations include:

+ Modifying colors of text, background, inputs
+ Modifying the sizing of components, including height / width / margins / padding
+ Modifying the position of components and where they render on the page.

The CSS for the site is generated by a set of LESS files, but the main file that holds the ID Site specific CSS is `main.less` in the `idsite-src/app/styles` folder.  This file includes colors, images, borders, positioning, and fonts for the ID Site.

Below are some common areas of `main.less` that you may want to modify for your ID site.

Common variables for input fields on forms:

    @boxBorderRadius: 3px;
    @inputHeight: 45px;
    @gray1: #f6f6f6;
    @baseFontSize: 14px;
    @boxGutter: 30px;

Default font, font size, font color:

    body,div,p,a,label {
      font-family: "Open Sans";
      font-size: @baseFontSize;
      font-weight: 400;
      color: #484848;
    }

Default maximum width of the content on ID Site:

    .container{
      max-width: 620px;
    }

Default style for the green login, sign up, reset password button:

    .btn-sp-green{
      height: 45px;
      line-height: 45px/2;
      padding: 0 40px;
      color: #fff;
      font-size: 17px;
      .flatTwoColorGradient(#42c41a,#2dbd00,#43cd1a,#2ec700);
    }

Once your modifications are made to your ID Site locally, you can [update your changes](#updating-your-id-site).

### Customizing JavaScript

Your ID Site contains JavaScript to handle the client-side logic.  Since your ID Site is a AngularJS application, this includes single-page-application logic such as URL routing, controllers for individual page logic, directives for input validation, and services across controllers for communication to Stormpath.

#### Customizing URL Routing

By default, your ID Site has built in routing so that particular URLs such as `/register` render the correct HTML view template and controller into the `master index`.  This logic is defined in `idsite-src/app/scripts/app.js` using an AngularJS `routeProvider`.

For example, looking at the following snippet from `app.js`: 

      .when('/register', {
        templateUrl: 'views/registration.html',
        controller: 'RegistrationCtrl'
      })

This code instructs the AngularJS application to load a particular template and controller to display the `/register` page.  If you want to modify the name of endpoint `/register` to `/signup` you would change it in `app.js`.

`app.js` also configures where the default route `/` should load and what to load when no route is matched (`otherwise`).

#### Customizing Controllers

A controller is an AngularJS concept that is a constructor that defines initial parameters and behaviors for a view that is loaded into the `master index`.  Each view that is rendered by the ID Site (login, register, forgot password, etc) has a backing controller. 

Your ID Site has the controllers defined in `idsite-src/app/scripts/controllers` and has a naming convention to match the view's name with the controller's name.  For example `/register` route will render a `registration.html` view with a `registration.js` controller.  The logic defined in each controller is needed for the default functionality for the ID Site, but additional functionality can be added as needed.

#### Customizing Input Validation with Directives

Directives are markers on a DOM element that attach a specific set of behaviors in AngularJS.  Your ID Site uses directives for input validation since the behavior for each individual form input can be defined separately. Directives for input validation are defined in `idsite-src/app/scripts/directives` and include:

+ `emailvalidation.js`: Defines validation rules and is attached to the `email` form input on the registration page
+ `namevalidation.js`: Defines validation rules and is attached to the `givenName` and surname form input on the registration page
+ `passwordpolicyvalidation.js`: Defines validation rules and is attached to the `password` form input on the registration page.  These rules are read from the directory's `Password Strength Policy`
+ `validateonblur.js`:  Defines the behavior on when to validate each form element.  By default, each form value is validated on blur, or when the DOM element loses focus.

### Updating your ID Site

Once modifications are made to your ID Site, you will need to rebuild and deploy your changes to Github.

In the terminal, to update your changes:

1. Navigate to the local idsite-src folder
2. Run: `grunt build`
3. Navigate to the `dist` folder
4. Run: `git add .` to add all changes to staging
5. Run: `git commit` to commit your changes to the local git repository
6. Run: `git push -u origin master` to push your changes to Github

Once your changes have been pushed to Github:

1. Login to the [Stormpath Admin Console](https://api.stormpath.com)
2. Navigate to the `ID Site` tab
3. Click the `Sync Now` button next to the `Git Repository Branch Name`

{% docs info %}
To automatically sync your ID Site changes from Github to Stormpath, you can setup the Stormpath Service in Github to handle the sync.  To configure this option, navigate to your Github repository that hosts your ID Site and click on `Settings`.  Under `Webhooks & Services`, click `Add Service`, select Stormpath and follow the instructions in Github.
{% enddocs %}

##  Building an ID Site with stormpath.js

Stormpath provides a library to enable developers to build their own ID Site outside of Stormpath's default AngularJS ID Site.  This is hosted on [Github](https://github.com/stormpath/stormpath.js) with installation and instructions.  This is useful for developers that want to Stormpath to host your login and user management screens but require full control of the site or want to leverage another JavaScript framework for building out their site.

##  Wrapping up

In this guide, we discussed how to set up a Stormpath ID Site as well as how your application can leverage your ID Site to provide common application workflows around user login and registration. This feature is currently in beta. If you have any questions, bug reports, or enhancement requests please email support@stormpath.com.



