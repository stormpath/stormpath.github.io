---
layout: doc
lang: nodejs
description: "7-minute Tutorial for Node.js"
image: https://stormpath.com/images/blog/og-node-stormpath.png
title: Stormpath Node.js Quickstart
---


Welcome to Stormpath's Node.js Quickstart!

This quickstart will get you up and running with Stormpath in about 7 minutes
and give you a good initial feel for the Stormpath Node.js library.  During this
quickstart, you will do the following:

 * Install the Stormpath library.
 * Create an API Key that allows you to make REST API calls with Stormpath.
 * Register an Application.
 * Create a User Account.
 * Search for a User Account.
 * Authenticate a User Account.

Stormpath also can do a lot more (*like Groups, Multitenancy, Social
Integration, and Security workflows*) which you can learn more about at the end
of this quickstart.

Let's get started!


***


## Install the Stormpath Library


You can install [Stormpath](https://github.com/stormpath/stormpath-sdk-node)
using [npm](https://www.npmjs.org/package/stormpath):

    npm install stormpath

This will install the Stormpath library.

{% docs note %}
When installing Stormpath via `npm`, the library will only be accessible in the
current directory -- if you'd like Stormpath to be available anywhere, you can
run `npm install -g stormpath` to install it globally.
{% enddocs %}


***


## Get an API Key

All requests to Stormpath must be authenticated with an API Key.

1. If you haven't already,
   [Sign up for Stormpath here](https://api.stormpath.com/register).  You'll
   be sent a verification email.

2. Click the link in the verification email.

3. Log in to the [Stormpath Admin Console](https://api.stormpath.com) using
   the email address and password you used to register with Stormpath.

4. Click the **Create API Key** or **Manage Existing Keys** button in the middle of the page.

5. Under **Security Credentials**, click **Create API Key**.

   This will generate your API Key and download it to your computer as an
   `apiKey.properties` file.  If you open the file in a text editor, you will
   see something similar to the following:

        apiKey.id = 144JVZINOF5EBNCMG9EXAMPLE
        apiKey.secret = lWxOiKqKPNwJmSldbiSkEbkNjgh2uRSNAb+AEXAMPLE

6. Save this file in a secure location, such as your home directory, in a
   hidden `.stormpath` directory. For example:

        $ mkdir ~/.stormpath
        $ mv ~/Downloads/apiKey.properties ~/.stormpath/

5. Change the file permissions to ensure only you can read this file.  For
   example:

        $ chmod go-rwx ~/.stormpath/apiKey.properties

The `apiKey.properties` file holds your API key information, and can be used to
easily authenticate with the Stormpath library.


***


## Create a Client

The first step to working with Stormpath is creating a Stormpath
Client using your `apiKey.properties` file.  The `Client` object is what allows
you to communicate with Stormpath.

First, open the node shell by running:

    $ node

Then, create a new Stormpath client with the following code:

    var stormpath = require('stormpath');
    var client = null;
    var homedir = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME;
    var keyfile = homedir + '/.stormpath/apiKey.properties';
    stormpath.loadApiKey(keyfile, function apiKeyFileLoaded(err, apiKey) {
      if (err) throw err;
      client = new stormpath.Client({apiKey: apiKey});
    });

{% docs tip %}
If you want to see all the code from this tutorial in one file, check out this [Gist](https://gist.github.com/rdegges/13ceb8ef0abb7bd7ae60#file-quickstart-js).
{% enddocs %}

***


## Retrieve your Application

Before you can create user Accounts you'll need to retrieve your Stormpath
Application.  An Application in Stormpath is the same thing as a project. If
you're building a web app named "Lightsabers Galore", you'd want to name your
Stormpath Application "Lightsabers Galore" as well.  By default, your Stormpath
account will have an application already created for you to use.  We will use
this application for the quickstart. 

You can retrieve your `Application` using the client you created in the
previous step:

    client.getApplications({name:'My Application'}, function(err, applications){
        if (err) throw err;

        app = applications.items[0];

    });

The code above will retrieve your example `Application`, which we can use later
to do stuff like:

- Create user accounts.
- Log users into their account.
- etc.


***


## Create a User Account

Now that we've created an `Application`, let's create a user `Account`!  To do
this, you'll need to use your application (*created in the previous step*):

    var account = {
      givenName: 'Joe',
      surname: 'Stormtrooper',
      username: 'tk421',
      email: 'tk421@stormpath.com',
      password: 'Changeme1',
      customData: {
        favoriteColor: 'white',
      },
    };
    app.createAccount(account, function(err, account) {
      if (err) throw err;
    });

Stormpath accounts have several basic fields (`givenName`, `surname`, `email`,
etc...), but also support storing schema-less JSON data through the `customData` field.  `customData` allows you to store any user profile information (*up to
10MB per user!*).

{% docs note %}
The required fields are: `givenName`, `surname`, `email`, and `password`.
{% enddocs %}

Once you've created an `Account`, you can access the account's data by referencing the attribute names, for instance:

    account['givenName']
    account['customData']['favoriteColor']


***


## Search for a User Account

Finding user accounts is also simple.  You can search for accounts by field:

    app.getAccounts({email: 'tk421@stormpath.com'}, function(err, accounts) {
      if (err) throw err;
      accounts.each(function (err, account, index) {
        console.log(account.givenName + " " + account.surname);
      });
    });

You can also use wild cards such as `{email: '*@stormpath.com'}` to return
all accounts with a stormpath.com domain.


***


## Authenticate a User Account

Authenticating users is equally simple -- you can specify either a `username` or
`email` address, along with a `password`:

    //using username and password
    app.authenticateAccount({
      username: 'tk421',
      password: 'Changeme1',
    }, function (err, result) {
      if (err) throw err;
      account = result.account;
    });
    account.givenName

    //using email and password
    app.authenticateAccount({
      username: 'tk421@stormpath.com',
      password: 'Changeme1',
    }, function (err, result) {
      if (err) throw err;
      account = result.account;
    });
    account.givenName

If the authentication request is successful, an `Account` resource will be
returned.

{% docs note %}
This is typically only done when a user logs into a web app -- we're just
showing this example to illustrate how it works.
{% enddocs %}


***


## Other Things You Can Do with Stormpath

In addition to user registration and login, Stormpath can do a lot more!

- Create and manage user groups.
- Partition multi-tenant SaaS account data.
- Simplify social login with providers like Google and Facebook.
- Manage developer API keys and access tokens.
- Verify new users via email.
- Automatically provide secure password reset functionality.
- Centralize your user store across multiple applications.
- Plug into your favorite web framework (*like express!*).


***


## Next Steps

We hope you found this Quickstart helpful!

You've just scratched the surface of what you can do with Stormpath.  Want to
learn more?  Here are a few other helpful resources you can jump into.

* Dig in deeper with the [Official Node.js Guide](/nodejs/api/home).
* Use Stormpath and Express to build an awesome web app with the [Express.js + Passport App Guide](https://stormpath.com/blog/build-app-nodejs-express-passport-stormpath/).
* Learn to easily partition user data with our [Guide to Building Multitenant SaaS Applications](/guides/multi-tenant/).
* Easily support Google and Facebook Login with our new [Social Login & Integration Guide](/guides/social-integrations/).

