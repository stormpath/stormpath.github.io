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

The PHP SDK can be found on [Github](https://github.com/stormpath/stormpath-sdk-php).

{% docs note %}
The PHP SDK is built upon Zend's note of a Service and is thus only compatible with version *2.2* and higher of the [Zend Framework|http://framework.zend.com/].
{% enddocs %}

***

## Sign Up for Stormpath

1. Fill out and submit the [Stormpath registration form](https://api.stormpath.com/register).  This will send a confirmation email.
2. Click the link in the confirmation email.

***

## <a name="apiKey"></a> Get an API Key

All requests back to Stormpath using the Stormpath SDK must be authenticated with an API Key. To get an API key:

1. Log in to the [Stormpath Admin Console](https://api.stormpath.com) using the email address and password you used to register with Stormpath.

2. In the top-right corner of the resulting page, visit **Settings** > **My Account**.

    <!-- TODO: SCREENSHOT (arrow calling attention to the 'My Accounts' menu item -->

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

In order to add the [Stormpath PHP SDK](https://github.com/stormpath/stormpath-sdk-php) to your application, you'll need to use Composer:

1. Modify your project's "composer.json" to add in the following dependencies:

		"require": {
            "stormpath/sdk": "1.0.*@beta"
        }

2. On your project root, install the SDK with the its dependencies:
    
        $ php composer.phar install

Your project should now be set up to use the Stormpath PHP SDK. For additional details about installing and configuring the PHP SDK, be sure to review the SDK's [README.md file](https://github.com/stormpath/stormpath-sdk-php/blob/master/README.md).

***

## Working with the Stormpath PHP SDK

### Configure your PHP application

1. **Require the Stormpath PHP SDK** via the composer auto loader

    	require 'vendor/autoload.php';
<!-- {.php} -->

2. **Configure the client** using the API key properties file

		\Stormpath\Client::$apiKeyFileLocation = $_SERVER['HOME'] . '/.stormpath/apiKey.properties';
<!-- {.php} -->

3. **List all your applications and directories**

		$tenant = \Stormpath\Resource\Tenant::get();
		foreach($tenant->applications as $app)
		{
		    print $app->name;
		}

		foreach($tenant->directories as $dir)
		{
		    print $dir->name;
		}
<!-- {.php} -->

4. **Get access to the specific application and directory** using a specific href.

		$application = \Stormpath\Resource\Application::get($applicationHref);

		$directory = \Stormpath\Resource\Directory::get($directoryHref);
<!-- {.php} -->

5. **Create an application** and auto create a directory as the account store.

		$application = \Stormpath\Resource\Application::create(
	  		array('name' => 'May Application',
        		'description' => 'My Application Description'),
  			array('createDirectory' => true)
   		);
<!-- {.php} -->

6. **Create an account for a user** on the directory.

		$account = \Stormpath\Resource\Account::instantiate(
		  array('givenName' => 'John',
		        'surname' => 'Smith',
        		'username' => 'johnsmith',
        		'email' => 'john.smith@example.com',
        		'password' => '4P@$$w0rd!'));

		$application->createAccount($account);
<!-- {.php} -->

7. **Update an account**

		$account->givenName = 'Johnathan';
		$account->middleName = 'A.';
		$account->save();
<!-- {.php} -->

8. **Authenticate the Account** for use with an application:

		try {

    		$application->authenticate('johnsmith', '4P@$$w0rd!');

		} catch (\Stormpath\Resource\ResourceError $re)
		{
		    print $re->getStatus();
		    print $re->getErrorCode();
		    print $re->getMessage();
		    print $re->getDeveloperMessage();
		    print $re->getMoreInfo();
		}
<!-- {.php} -->

9. **Send password reset request**

		$application->sendPasswordResetEmail('john.smith@example.com');
<!-- {.php} -->

10. **Create a group** in a directory

		$group = \Stormpath\Resource\Group::instantiate(array('name' => 'Admins'));

		$directory->createGroup($group);
<!-- {.php} -->

11. **Add the account to the group**

		$group->addAccount($account);		
<!-- {.php} -->

12. **Check for account inclusion in group**

		$isAdmin = false;
		$search = array('name' => 'Admins');

		foreach($account->groups->setSearch($search) as $group)
		{
		    // if one group was returned, the account is in
		    // the group based on the search criteria
		    $isAdmin = true;
		}
<!-- {.php} -->


## Next Steps

We hope you have found this Quickstart helpful!

For full coverage of Stormpath's PHP SDK, including how to edit application details, edit accounts, create groups and assign accounts to groups, reset passwords via password reset emails, and more, please see our [PHP Product Guide](http://www.stormpath.com/docs/PHP/product-guide).