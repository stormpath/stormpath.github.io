---
layout: default
classes_array: [quickstart]
lang: nodejs
description: "10-minute Tutorial to Stormpath in Node.js"
image: https://stormpath.com/images/blog/og-node-stormpath.png
title: Stormpath Node.js Quickstart
---
This quickstart will get you up and running with Stormpath in about 10 minutes and give you a good initial feel for the Stormpath Node.js SDK. 

Let's get started!

***

##  Install the Stormpath <b>npm</b> Module

Once you have an API Key, navigate to a folder that will include the node app and run

    npm install stormpath --save

This will install the official Stormpath npm module and store the dependency in `package.json`.

***

## Get an API Key

All requests to the Stormpath must be authenticated with an API Key. To get an API key:

1. [Sign up for Stormpath here](https://api.stormpath.com/register).  You'll be sent a verification email.
1. Click the link in the verification email. 
1. Log in to the [Stormpath Admin Console](https://api.stormpath.com).
1. In the top-right corner of the resulting page, visit **Settings** > **My Account**.
1. On the Account Details page, under **Security Credentials**, click **Create API Key**.

 This will generate your API Key and download it to your computer as an `apiKey.properties` file. If you open the file in a text editor, you will see something similar to the following:

        apiKey.id = 144JVZINOFEBNCMG9EXAMPLE
        apiKey.secret = lWxOiKqKNwJmSldbiSkEbkNjgh2uRSNAb+AEXAMPLE

***
## Coding Time!

Now that set up is complete, you can start building something.  One of the first things that you need to do is include `stormpath` module in your javascript, like so:

    var stormpath = require('stormpath');

Once this is done, you can initialize a Stormpath `client` based on an API Key ID and Secret.  

    //Generate a Stormpath client based on your API Key and Secret
    var apiKey = new stormpath.ApiKey('YOUR_API_KEY_ID', 'YOUR_API_KEY_SECRET');
    var client = new stormpath.Client({apiKey: apiKey});

A `client` instance is your starting point for all interactions with the Stormpath API - once you have a Client instance, you can do everything else. 

### Create an Application
To be able to start to create accounts, you need to have an `Application` and `Directory` in Stormpath.  If you just signed up for the quickstart you can add (and retrieve, update, or delete) an application and directory from the API like so:

    //Some application properties
    var app = {
      name: 'My Awesome Application!',
      description: 'No, Srsly. It\'s Awesome.'
    };

    //Create the App
    client.createApplication(app, {createDirectory: true} ,function onAppCreated(err, createdApp){
          if (err) throw err;
          app = createdApp;
    });

Once the application is created, it will automatically create a `Directory` resource based on the name of application and set it as the default account store for any new accounts for the application.

### Create a User Account
To create an account, you define the account as a JSON object and use the application to create it:

    var account = {
        givenName: 'Tom',
        surname: 'Abbott',
        email:'stormtrooper@stormpath.com',
        password:'AwesomeSecurePassword1',
        customData: {
            favoriteAnimal: 'Miley Cyrus',
        }
    }

    //Create the account
    app.createAccount(account, function(err, account){
        if (err) throw err;
        accountSuccessfullyCreated(account);
    });

Stormpath has a standard account format (givenName, surname, email, etc...), but you can also store application specific custom fields in a schema-less customData object.

### Search for a User Account
Getting accounts from an application is easy too.  You can ask the application to retrieve accounts based on standard fields by doing:

    app.getAccounts({email:'stormtropper@stormpath.com'}, function(err, accounts){
        if (err) throw err;

        accounts.each(function (err, account, index){
            console.log(account);
        });
    });

You could also use wild cards such as `{email: *@stormpath.com}` to return all accounts with an email from the stormpath.com domain.

You can also do more advance options and method chaining like:

    app.getAccounts().search({surname:'Abbott'})
        .orderBy({givenName:1})
        .exec(function (err, accounts){
            accounts.each(hanndleAccount);
        });

### Authenticate a User Account
Once you have accounts in directories that are associated with an application, you can authenticate a user like so:

    app.authenticateAccount({
        username:'stormtropper@stormpath.com',
        password:'AwesomeSecurePassword1'
    }, function(err, result){
        if (err) throw err;
        result.getAccount(function(err, account){
            console.log(account);
        });
    });

That will output the authenticated account.  From here, you could update account fields, get the groups or roles associated with the account, or even trigger a password reset workflow.

***
<!-- >## Help us spread the word

If you found this tutorial helpful and think our product is cool, please help us out with a quick tweet.

Look! We even make it easy for you with a nice button :)

-->

***
## What's Next

You've just scratched the surface of what you can do in Stormpath.  Want to learn more?  Here are a few other easy guides you can jump into.

* [Build an Express.js + Passport.js App with Stormpath](https://github.com/stormpath/passport-stormpath)
* [Complete Node.js API Reference Guide]((http://docs.stormpath.com/nodejs/api/home))
* [Guide to Building Multitenant Applications](http://docs.stormpath.com/guides/multi-tenant/)
* [Social Login & Integration Guide](http://docs.stormpath.com/guides/social-integrations/)
