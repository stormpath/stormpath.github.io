---
layout: doc
lang: nodejs
description: "10-minute Tutorial for Node.js"
image: https://stormpath.com/images/blog/og-node-stormpath.png
title: Stormpath Node.js Quickstart
---

Welcome to the Stormpath Node.js Quickstart!

This quickstart will get you up and running with Stormpath in about 10 minutes and give you a good initial feel for the Stormpath Node.js SDK.  During this quickstart, you will do the following:

 * Install the Stormpath SDK
 * Create an API Key that allows you to make REST API calls with Stormpath
 * Register an Application 
 * Create a User Account
 * Search for a User Account
 * Authenticate a User Account
 
Stormpath also can do a lot more like Groups, Multitenancy, Social Integration, and Security workflows which you can learn more about at the end of this quickstart.  

Let's get started!

***

## Install Stormpath SDK

Navigate to a folder that will include the node app and run

    npm install stormpath --save

This will install the official Stormpath npm module and store the dependency in `package.json`.

***

## Get an API Key

All requests to the Stormpath must be authenticated with an API Key. To get an API key:

1. If you haven't already, [Sign up for Stormpath here](https://api.stormpath.com/register).  You'll be sent a verification email.
1. Click the link in the verification email. 
1. Log in to the [Stormpath Admin Console](https://api.stormpath.com).
1. In the top-right corner of the resulting page, visit **Settings** > **My Account**.
1. On the Account Details page, under **Security Credentials**, click **Create API Key**.

 This will generate your API Key and download it to your computer as an `apiKey.properties` file. If you open the file in a text editor, you will see something similar to the following:

        apiKey.id = 144JVZINOFEBNCMG9EXAMPLE
        apiKey.secret = lWxOiKqKNwJmSldbiSkEbkNjgh2uRSNAb+AEXAMPLE

***

##Configure your Node.js Application

Now that set up is complete, you can start building something.  One of the first things that you need to do is include `stormpath` module in your javascript, like so:

    var stormpath = require('stormpath');

Once this is done, you can initialize a Stormpath `client` based on an API Key ID and Secret.  

    //Generate a Stormpath client based on your API Key and Secret
    var apiKey = new stormpath.ApiKey('YOUR_API_KEY_ID', 'YOUR_API_KEY_SECRET');
    var client = new stormpath.Client({apiKey: apiKey});

A `client` instance is your starting point for all interactions with the Stormpath API - once you have a Client instance, you can do everything else. 

## Create an Application
Before we can create accounts you'll need to have an `Application` and `Directory` in Stormpath.  An application is just Stormpath’s term for a project and a directory is a collection of groups an user accounts.  Applications and directories are decoupled so that you can share directories across your applications. 

If you just signed up for the quickstart you can add an application and directory through the API like so:

    //Some application properties
    var app = {
      name: 'My Awesome App',
      description: 'No, Seriously. It\'s Awesome!'
    };

    //Create the App
    client.createApplication(app, {createDirectory: true} ,function (err, createdApp){
          if (err) throw err;
          app = createdApp;
		  console.log("Application successfully created");
    });

Once the `Application` is created, the function will also automatically create a `Directory` based on the application's name. All new users accounts and groups you create for this application, will be stored in this new directory.  

## Create a User Account
To create an 'Account', you define the account as a JSON object and use the application to create it:

    var account = {
        givenName: 'Joe',
        surname: 'Stormtrooper',
		username: 'tk455',
        email:'stormtrooper@stormpath.com',
        password:'Changeme1',
        customData: {
            favoriteColor: 'White'
        }
    }

    //Create the account
    app.createAccount(account, function(err, account){
        if (err) throw err;
		console.log("Account successfully created");
    });

Stormpath has a standard account format (`givenName`, `surname`, `email`, etc...), but you can also store application specific custom fields in a schema-less `customData` object.

## Search for a User 
Getting accounts from an application is easy, too.  You can ask the application to retrieve accounts based on standard fields by doing:

    app.getAccounts({email:'stormtropper@stormpath.com'}, function(err, accounts){
        if (err) throw err;

        accounts.each(function (err, account, index){
            console.log("Found the user!  Here are the details: \n" + account);
        });
    });

You could also use wild cards such as `{email: *@stormpath.com}` to return all accounts with an email from the stormpath.com domain.

## Authenticate a User 
Once you have accounts in directories that are associated with an application, you can authenticate a user like so:

    app.authenticateAccount({
        username:'tk455',
        password:'Changeme1'
    }, function(err, result){
        if (err) throw err;
        console.log("User successfully authenticated!");
    });

That will output the authenticated account.  From here, you can update account fields, get the groups or roles associated with the account, or even trigger a password reset workflow.

***
##Help Us Spread the Word

Please help us.  If you found this tutorial helpful and think our product is cool, please help spread the word with a quick tweet.

Look! We even make it easy for you with nice buttons. :)

<!-- AddThis Button BEGIN -->
<div class="addthis_toolbox addthis_default_style addthis_32x32_style"
	addthis:title="Just checked out @goStormpath for a new Node.js app. It's awesome!"
	addthis:url="https://stormpath.com">
<a class="addthis_button_twitter" 
	addthis:title="Just checked out @goStormpath for a new Node.js app. It's awesome! #FriendsDontLetFriendBuildAuth"></a>
<a class="addthis_button_preferred_2"></a>
<a class="addthis_button_preferred_3"></a>
<a class="addthis_button_preferred_4"></a>
<a class="addthis_button_compact"></a>
</div>
<script type="text/javascript">var addthis_config = {"data_track_addressbar":true};</script>
<script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-4f5ed709512978e9"></script>
<!-- AddThis Button END -->
<p>
	
***

## Next Steps
We hope you found this Quickstart helpful!

You've only scratched the surface of what you can do with Stormpath.  Want to learn more?  Here are a few other easy guides you can jump into.

* [Build an Express.js + Passport App with Stormpath](https://stormpath.com/blog/build-app-nodejs-express-passport-stormpath/)
* [Official Node.js API Reference Guide](http://docs.stormpath.com/nodejs/api/home)
* [Guide to Building Multitenant Applications](http://docs.stormpath.com/guides/multi-tenant/)
* [Social Login & Integration Guide](http://docs.stormpath.com/guides/social-integrations/)
