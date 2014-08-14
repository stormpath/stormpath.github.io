---
layout: doc
lang: nodejs
description: "10-minute Tutorial for Express"
image: https://stormpath.com/images/tutorial/express.png
title: Stormpath Express Quickstart
---


Welcome to Stormpath's Express Quickstart!

This quickstart will get you up and running with Stormpath in about 10 minutes
and give you a good initial feel for the Stormpath Express library.  During this
quickstart, you will do the following:

 * Install the express-stormpath library.
 * Create an API Key that allows you to make REST API calls with Stormpath.
 * Create a Stormpath Application.
 * Create an Express application.
 * Initialize the Stormpath middleware.
 * Register a new User Account.
 * Logout a user.
 * Force a user to be logged in to view content.
 * Log into your new User account.

Stormpath also can do a lot more (*like Groups, Multitenancy, Social
Integration, and Security workflows*) which you can learn more about at the end
of this quickstart.

Let's get started!


***


## Install the express-stormpath Library

{% docs note %}
express-stormpath only works with Express 4.x currently.
{% enddocs %}

You can install [express-stormpath](https://github.com/stormpath/stormpath-express) using [npm](https://www.npmjs.org/):

    $ npm install express
    $ npm install express-stormpath

You may need to run the above commands with `sudo` depending on your npm setup.


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


## Create a Stormpath Application

When working with Stormpath, you'll need to create an `Application`.  An
`Application` is Stormpath's name for a project.  If you're building a website
named "dronewars.com", you'd probably want to create a Stormpath `Application`
named "dronewars".

To create an `Application`, visit your [Stormpath
Dashboard](https://api.stormpath.com/ui/dashboard) then click the "Applications"
tab at the top of the screen.

Next, click the "Register Application" button.

In the name field, enter the value "Express Test".  You can leave the description
field blank.

Click the "Save" button to create your new `Application`.  This
`Application` will be used through the rest of this quickstart.

Lastly, in your new Application, copy the "REST URL", you will need this later
on.


***


## Create an Express Application

The first step to working with express-stormpath is creating a basic Express app.

Place the code below into a file named `app.js`:

    var express = require('express');

    var app = express();
    app.get('/', function(req, res) {
      res.send('home page!');
    });

    app.get('/secret', function(req, res) {
      res.send('secret page!');
    });

    app.listen(3000);

To start your new Express app, open the terminal and run:

    $ node app.js

You can then test your two predefined routes by visiting both:

- http://localhost:3000 and
- http://localhost:3000/secret

{% docs tip %}
If you want to see all the code from this tutorial in one file, check out this
[Gist on GitHub](https://gist.github.com/rdegges/d5567652a8a43db80563):  [https://gist.github.com/rdegges/d5567652a8a43db80563](https://gist.github.com/rdegges/d5567652a8a43db80563)
{% enddocs %}


***


## Initialize the Stormpath Middleware

The next step is to initialize the Stormpath middleware.  Modify your `app.js`
file to look like the following:

    var express = require('express');
    var stormpath = require('express-stormpath');

    var app = express();
    app.use(stormpath.init(app, {
      apiKeyFile: process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/.stormpath/apiKey.properties',
      secretKey: 'some_random_long_string_here',
      application: 'https://api.stormpath.com/v1/applications/xxx',
    }));

    app.get('/', function(req, res) {
      res.send('home page!');
    });

    app.get('/secret', function(req, res) {
      res.send('secret page!');
    });

    app.listen(3000);

The variables passed into `stormpath.init` tell Stormpath what your credentials
are, as well as which Stormpath Application to use.

Be sure to set `application` to your Stormpath REST URL that you copied down
previously after creating your Stormpath Application.

{% docs note %}
The `secretKey` variable should be set to a long, random string that is hard to
guess.  This variable is used internally to encrypt user sessions -- it is
**critically important** that this value never be made public.
{% enddocs %}


***


## Register a New User

Now that express-stormpath is setup, let's register a new user!

To do this, visit http://localhost:3000/register -- you should see a
registration page that looks like this:

<img class="center-block" src="../../images/flask-registration-page.png" title="Flask Registration Page" alt="Flask Registration Page"/>

Once you're at the registration page, enter your user information and create a
new user account!

By default, express-stormpath ships with a registration and login page, with
sensible defaults.  This behavior is fully customizable.

Once you've created an account, you'll be automatically redirected back to the
home page of your site.

{% docs note %}
You probably noticed that you couldn’t register a user account without
specifying a sufficiently strong password.  This is because, by default,
Stormpath enforces certain password strength rules on your Stormpath
Directories.

If you’d like to change these password strength rules (or disable them), you can
do so easily by visiting the Stormpath dashboard, navigating to your user
Directory, then changing the "Password Strength Policy".
{% enddocs %}


***


## Log out a User

Now that we've created a user, let's log our new user out.  To do this, visit
http://localhost:3000/logout -- you will then be logged out of your account and
returned to them home page once again.

express-stormpath provides a built-in logout view which makes it easy to log users
out.


***


## Create a Restricted View

Next, we'll add authentication enforcement to one of our views.  In your
`app.js` file, modify your `secret` route to look like:

    app.get('/secret', stormpath.loginRequired, function(req, res) {
      res.send('secret page!');
    });

To test this out, restart your express web server then visit
http://localhost:3000/secret -- you should get redirected to a login page that
looks like this:


<img class="center-block" src="../../images/flask-login-page.png" title="Flask Login Page" alt="Flask Login Page"/>


## Log a User Into Their Account

Now that we're at the login page, enter your user credentials, then log in.  You
should now be able to see the `secret` route!

express-stormpath provides a very flexible login view by default, which allows you
to do many things (including social login).


***


## Final Code

In the end, your Express app should look like this:

    var express = require('express');
    var stormpath = require('express-stormpath');

    var app = express();
    app.use(stormpath.init(app, {
      apiKeyFile: process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/.stormpath/apiKey.properties',
      secretKey: 'some_random_long_string_here',
      application: 'https://api.stormpath.com/v1/applications/xxx',
    }));

    app.get('/', function(req, res) {
      res.send('home page!');
    });

    app.get('/secret', stormpath.loginRequired, function(req, res) {
      res.send('secret page!');
    });

    app.listen(3000);


***


## Other Things You Can Do with Stormpath

In addition to user registration and login, Stormpath can do a lot more!

- Create and manage user groups.
- Partition multi-tenant account data.
- Simplify social login with providers like Google and Facebook.
- Manage developer API keys and access tokens.
- Verify new users via email.
- Automatically provide secure password reset functionality.
- Centralize your user store across multiple applications.


***


## Next Steps

We hope you found this Quickstart helpful!

You've just scratched the surface of what you can do with Stormpath.  Want to
learn more?  Here are a few other helpful resources you can jump into.

* Dig in deeper with the [express-stormpath Docs](https://docs.stormpath.com/nodejs/express/).
* Learn how to use our raw [Node API](https://docs.stormpath.com/nodejs/api/home).
* Learn to easily partition user data with our [Guide to Building Multitenant Applications](/guides/multi-tenant/).
