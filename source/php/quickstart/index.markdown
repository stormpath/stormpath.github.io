---
layout: doc
lang: php
title: Stormpath PHP Quickstart
---

Welcome to Stormpath's PHP SDK Quickstart!

This quickstart will get you up and running with Stormpath in about 10 minutes and give you a good initial feel for the Stormpath PHP SDK.  During this quickstart, you will do the following:

* Register for a free Stormpath account
* Create an API Key that allows you to make REST API calls with Stormpath
* Register an application with Stormpath so you can automate that application's user management and authentication needs
* Create an account that can log in to the application
* Authenticate an account with the application

With Stormpath, you can offload repetitive security-sensitive logic to Stormpath and get back to building your application's core functionality.  Never worry about storing passwords again!

The Stormpath PHP SDK can be found on [Github](https://github.com/stormpath/stormpath-sdk-php).

{% docs note %}
The PHP SDK is compatible with PHP version *5.3* and higher. The sample codes of this documentation are based on version *1.0.0.beta* of the PHP SDK.
{% enddocs %}

***

## Sign Up for Stormpath

1. Fill out and submit the [Stormpath registration form](https://api.stormpath.com/register).  This will send a confirmation email.
2. Click the link in the confirmation email.

## <a name="apiKey"></a> Get an API Key

All requests back to Stormpath using the Stormpath SDK must be authenticated with an API Key. To get an API key:

1. Log in to the [Stormpath Admin Console](https://api.stormpath.com) using the email address and password you used to register with Stormpath.

2. In the top-right corner of the resulting page, visit **Settings** > **My Account**.

    <!-- TODO: SCREENSHOT (arrow calling attention to the 'My Accounts' menu item)   -->

3. On the Account Details page, under **Security Credentials**, click **Create API Key**.

    <!-- TODO: SCREENSHOT (arrow calling attention to the 'Create API Key' button) -->

    This will generate your API Key and download it to your computer as an `apiKey.properties` file. If you open the file in a text editor, you will see something similar to the following:

        apiKey.id = 144JVZINOF5EBNCMG9EXAMPLE
        apiKey.secret = lWxOiKqKPNwJmSldbiSkEbkNjgh2uRSNAb+AEXAMPLE

4. Save this file in a secure location, such as your home directory in a hidden `.stormpath` directory. For example:

        $HOME/.stormpath/apiKey.properties

5. Also change the file permissions to ensure only you can read this file. For example, on \*nix operating systems:

        $ chmod go-rwx $HOME/.stormpath/apiKey.properties

***

## Add the Stormpath PHP SDK to your Project

Configure the stormpath/sdk dependency in your `composer.json` file:

    "require": {
        "stormpath/sdk": "1.0.*@beta"
    }

If you still haven't, install composer:

    curl -s http://getcomposer.org/installer

Install the [Stormpath PHP SDK](https://github.com/stormpath/stormpath-sdk-php) on your application root using:

    php composer.phar install

***

## Working with the Stormpath PHP SDK

### Configure your PHP application

Configure a Stormpath SDK [`Client`](http://www.stormpath.com/docs/php/product-guide#Client) based on your API key. The `Client` is your starting point for all operations with the Stormpath service. For example:

    require 'vendor/autoload.php';
    ...

    \Stormpath\Client::$apiKeyFileLocation = $_SERVER['HOME'] . '/.stormpath/apiKey.properties';

The `Client` instance that will be generated from here is a singleton that will be used to interact with Stormpath.

### Register your application with Stormpath

Registering an application with Stormpath allows that application to use Stormpath for its user management and authentication needs. Use the `create` method of the `Application` resource class as follows:

    $application = \Stormpath\Resource\Application::create(
      array('name' => 'My Application',
            'description' => 'My Application Description'),
      array('createDirectory' => true));

Once the application is created, it will automatically create a `Directory` resource based on the name of the application and set it as the default account store. New accounts will be created in the default account store.

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
