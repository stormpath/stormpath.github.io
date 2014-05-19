---
layout: doc
lang: php
description: "7-minute Tutorial for PHP"
title: Stormpath PHP Quickstart
---


Welcome to Stormpath's PHP Quickstart!

This quickstart will get you up and running with Stormpath in about 7 minutes
and give you a good initial feel for the Stormpath Python library.  During this
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

{% docs note %}
Stormpath works with PHP *5.3* and higher.  This documentation covers version
*1.0.0.beta* of our PHP library.
{% enddocs %}

You can install [Stormpath](https://github.com/stormpath/stormpath-sdk-php) using [composer](https://getcomposer.org/).

1. Create a directory for testing Stormpath:

    $ mkdir ~/test
    $ cd ~/test

2. Create a `composer.json` file to specify the correct Stormpath library
   version required:

    {
      "require": {
        "stormpath/sdk": "1.0.*@beta"
      }
    }

3. Run `composer install` to fetch the Stormpath library.


***


## Get an API Key

All requests to Stormpath must be authenticated with an API Key.

1. If you haven't already,
   [Sign up for Stormpath here](https://api.stormpath.com/register).  You'll
   be sent a verification email.

2. Click the link in the verification email.

3. Log in to the [Stormpath Admin Console](https://api.stormpath.com) using
   the email address and password you used to register with Stormpath.

4. Click the **Manage Existing Keys** button in the middle of the page.

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
easily authentication with the Stormpath library.


***


## Create a Client

The first step to working with Stormpath is creating a Stormpath
`Client` using your `apiKey.properties` file.  The `Client` object is what
allows you to communicate with Stormpath.

First, open the PHP shell by running:

    $ php -a

Then, create a new Stormpath `Client` with the following code:

    require 'vendor/autoload.php';
    \Stormpath\Client::$apiKeyFileLocation = $_SERVER['HOME'] .  '/.stormpath/apiKey.properties';

The `Client` instance is an application singleton.  You should reuse this
instance throughout your application code.


***


## Create an Application

Before you can create user Accounts you'll need to create a Stormpath
Application.  An Application in Stormpath is the same thing as a project.  If
you're building a web app named "Lightsabers Galore", you'd want to name your
Stormpath Application "Lightsabers Galore" as well.

You can create an Application using the client you created in the previous step:

    $application = \Stormpath\Resource\Application::create(
        array(
            'name' => 'My Awesome Application',
            'description' => 'Super awesome!',
        ),
        array('createDirectory' => true)
    );

The code above will create a new Application, which we can use later to do stuff
like:

- Create user accounts.
- Log users into their account.
- etc.

{% docs note %}
The only required field when creating an Application is `name`.  Descriptions
are optional!


### Create an account

Now that we've created an `Application`, let's create an `Account` so someone can log in to (i.e. authenticate with) the application. To do so,

    $account = \Stormpath\Resource\Account::instantiate(
        array('givenName' => 'John',
              'surname' => 'Smith',
              'username' => 'johnsmith',
              'email' => 'john.smith@example.com',
              'password' => '4P@$$w0rd!'));

    $application->createAccount($account);

### Authenticate an Account

Now that we have an account we can use, we can log in to the application. But how do we authenticate an account logging in to the application? We use the previously-created application instance as follows:

    $authResult = $application->authenticate('johnsmith', '4P@$$w0rd!');
    $account = $authResult->account;

If the authentication request is successful, the `$authResult` will return the account instance for the authorized account.

### Experiment!

Use the client configuration to interact with tenant data, such as applications, directories, and accounts:

    $tenant = \Stormpath\Resource\Tenant::get();
    foreach($tenant->applications as $app)
    {
        print $app->name;

        foreach($dir->accounts as $acc)
        {
            print $acc->givenName;
        }
    }

    foreach($tenant->directories as $dir)
    {
        print $dir->name;

        foreach($dir->accounts as $acc)
        {
            print $acc->givenName;
        }
    }

***

## Next Steps

We hope you have found this Quickstart helpful!

For full coverage of Stormpath's PHP SDK, including how to edit application details, edit accounts, create groups and assign accounts to groups, resetting passwords via password reset emails, and more, please see our [PHP Product Guide](http://www.stormpath.com/docs/php/product-guide).
