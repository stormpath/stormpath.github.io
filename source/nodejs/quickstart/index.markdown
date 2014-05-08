---
layout: doc
lang: nodejs
title: Stormpath Node.js Five Minute API Quickstart
---
This quickstart will get you up and running with Stormpath in about 5 minutes and give you a good initial feel for the Stormpath Node.js SDK. During this quickstart, you will do the following:

* Register for a free Stormpath account
* Create an API Key that allows you to make REST API calls with Stormpath
* Code some basic stuff using Stormpath such as:
    - Account Creation
    - Account Searching
    - Authentication
    - Storing Robust Custom Data

Let's get started!

***

## Sign Up for Stormpath

1. Fill out and submit the [Stormpath registration form](https://api.stormpath.com/register).  This will send a confirmation email.
2. Click the link in the confirmation email.

***

## Get an API Key

All requests to the Stormpath must be authenticated with an API Key. To get an API key:

1. Log in to the [Stormpath Admin Console](https://api.stormpath.com) using the email address and password you used to register with Stormpath.
1. In the top-right corner of the resulting page, visit **Settings** > **My Account**.
1. On the Account Details page, under **Security Credentials**, click **Create API Key**.

 This will generate your API Key and download it to your computer as an `apiKey.properties` file. If you open the file in a text editor, you will see something similar to the following:

        apiKey.id = 144JVZINOFEBNCMG9EXAMPLE
        apiKey.secret = lWxOiKqKNwJmSldbiSkEbkNjgh2uRSNAb+AEXAMPLE

***

##  Install the Stormpath `npm` Module

Once you have an API Key, navigate to a folder that will include the node app and run

    npm install stormpath --save

This will install the official Stormpath npm module and store the dependency in `package.json`.

## Coding Time!

Now that set up is complete, you can start building something.  One of the first things that you need to do is include `stormpath` module in your javascript, like so:

    var stormpath = require('stormpath');

Once this is done, you can initialize a Stormpath `client` based on an API Key ID and Secret.  

    //Generate a Stormpath client based on your API Key and Secret
    var apiKey = new stormpath.ApiKey('YOUR_API_KEY_ID', 'YOUR_API_KEY_SECRET');
    var client = new stormpath.Client({apiKey: apiKey});

A `client` instance is your starting point for all interactions with the Stormpath API - once you have a Client instance, you can do everything else. 

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

## Wrapping Up

That is how you use Stormpath in Node.js in five minutes.  If you want to dig into the SDK further, check out the [Node.js API Guide](http://docs.stormpath.com/nodejs/api/home).  If you are using Express or Passport.js, check out [passport-stormpath](https://github.com/stormpath/passport-stormpath)!