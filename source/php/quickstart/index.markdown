---
layout: doc
lang: php
description: "7-minute Tutorial for PHP"
image: https://stormpath.com/images/tutorial/php.png
title: Stormpath PHP Quickstart
---


Welcome to Stormpath's PHP Quickstart!

This quickstart will get you up and running with Stormpath in about 7 minutes
and give you a good initial feel for the Stormpath PHP library.  During this
quickstart, you will do the following:

 * Install the Stormpath library.
 * Create an API Key that allows you to make REST API calls with Stormpath.
 * Register an Application.
 * Create a User Account.
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

2. Create a `composer.json` file to specify the correct Stormpath library version required:

        {
          "require": {
            "stormpath/sdk": "1.0.*@beta"
          }
        }
	

3. If you still haven’t, install composer:
  
	    curl -sS https://getcomposer.org/installer | php	


4. Install the Stormpath PHP SDK on your application root using:

	    php composer.phar install


{% docs tip %}
If you are unable to use Composer, please refer to the [Library's Readme](https://github.com/stormpath/stormpath-sdk-php#download-the-source-code) for instructions on downloading the source code.
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

Before you can create user accounts you'll need to create a Stormpath
`Application`.  An `Application` in Stormpath is the same thing as a project.
If you're building a web app named "Lightsabers Galore", you'd want to name
your Stormpath `Application` "Lightsabers Galore" as well.

You can create an `Application` using the client you created in the previous
step:

    $application = \Stormpath\Resource\Application::create(
        array(
            'name' => 'My Awesome Application-PHP',
            'description' => 'Super awesome!',
        ),
        array('createDirectory' => true)
    );

The code above will create a new `Application`, which we can use later to do
stuff like:

- Create user accounts.
- Log users into their account.
- etc.

{% docs note %}
The only required field when creating an Application is `name`.  Descriptions
are optional!
{% enddocs %}


***


## Create a User Account

Now that we've created an Application, let's create a user `Account`!  To do
this, you'll need to use your `Application` (*created in the previous step*):

    $account = \Stormpath\Resource\Account::instantiate(
        array(
            'givenName' => 'Joe',
            'surname' => 'Stormtrooper',
            'username' => 'tk421',
            'email' => 'tk421@stormpath.com',
            'password' => 'Changeme1',
        )
    );
    $application->createAccount($account);

Stormpath Accounts have several basic fields (`given_name`, `surname`, `email`,
etc...).

{% docs note %}
The required fields are: `given_name`, `surname`, `email`, and `password`.
{% enddocs %}

Once you've created an Account, you can access the Account's data by referencing
the attribute names, for instance:

    echo "Hi, " . $account->givenName . " " . $account->surname . "\n";


***


## Authenticate a User Account

Authenticating users is equally simple -- you can specify either a `username` or
`email` address, along with a `password`:

    $authResult = $application->authenticate('tk421', 'Changeme1');
    $account = $authResult->account;
	echo $account->givenName . " " . $account->surname . " Successfully Authenticated \n";

    $authResult = $application->authenticate('tk421@stormpath.com', 'Changeme1');
    $account = $authResult->account;
	echo $account->givenName . " " . $account->surname . " Successfully Authenticated \n";

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
- Partition multi-tenant account data.
- Simplify social login with providers like Google and Facebook.
- Manage developer API keys and access tokens.
- Verify new users via email.
- Automatically provide secure password reset functionality.
- Centralize your user store across multiple applications.
- Plug into your favorite web framework (*like Symfony!*).


***


## Next Steps

We hope you found this Quickstart helpful!

You've just scratched the surface of what you can do with Stormpath.  Want to
learn more?  Here are a few other helpful resources you can jump into.

* Dig in deeper with the [Official PHP Product Guide](/php/product-guide).
* Learn to easily partition user data with our [Guide to Building Multitenant Applications](/guides/multi-tenant/).


***


## Help Us Spread the Word

Like Stormpath?  If you enjoyed playing around with our new PHP library,
please help spread the word with a quick tweet!

<!-- AddThis Button BEGIN -->
<div class="addthis_toolbox addthis_default_style addthis_32x32_style" addthis:title="Checkout @goStormpath, it let's you set up complete user management in your PHP app in minutes."
addthis:url="https://stormpath.com">
  <a class="addthis_button_twitter"></a>
  <a class="addthis_button_preferred_2"></a>
  <a class="addthis_button_preferred_3"></a>
  <a class="addthis_button_preferred_4"></a>
  <a class="addthis_button_compact"></a>
</div>
<script type="text/javascript">var addthis_config = {"data_track_addressbar":true};</script>
<script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-4f5ed709512978e9"></script>
<!-- AddThis Button END -->
<p>
