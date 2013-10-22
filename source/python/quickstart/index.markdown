---
layout: doc
lang: python
title: Stormpath Python Quickstart
---

Welcome to Stormpath's Python SDK Quickstart!

This quickstart will get you up and running with Stormpath in about 10 minutes and give you a good initial feel for the Stormpath Python SDK.  During this quickstart, you will do the following:

* Register for a free Stormpath account
* Create an API Key that allows you to make REST API calls with Stormpath
* Register an application with Stormpath so you can automate that application's user management and authentication needs
* Create an account that can log in to the application
* Authenticate an account with the application

With Stormpath, you can offload repetitive security-sensitive logic to Stormpath and get back to building your application's core functionality.  Never worry about storing passwords again!

The Python SDK can be found on [Github](https://github.com/stormpath/stormpath-sdk-python).

{% docs note %}
This SDK is compatible with the 2.7 or 3.2 and later versions of Python.
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

## Add the Stormpath Python SDK to your Project

Add the [Stormpath Python SDK](https://github.com/stormpath/stormpath-sdk-python) using pip:

    $ pip install stormpath-sdk --pre

Don't have pip installed? Try installing it, by running this from the command line:

    $ curl https://raw.github.com/pypa/pip/master/contrib/get-pip.py | python

Or, you can [download the source code (ZIP)](https://github.com/stormpath/stormpath-sdk-python/zipball/master "stormpath-sdk
source code") for `stormpath-sdk`, and then run:

    $ python setup.py install

You may need to run the above commands with `sudo`. 

***

## Working with the Stormpath Python SDK

### Configure your Python application

Create a Stormpath SDK [`Client`](http://www.stormpath.com/docs/python/product-guide#Client) instance based on your API key. The client instance is your starting point for all operations with the Stormpath service. For example:

    from stormpath.client import Client
    ...

    api_key_file = "/home/myhomedir/.stormpath/apiKey.properties"
    my_client = Client(api_key_file_location=api_key_file)

The `Client` instance is intended to be an application singleton. You should reuse this instance throughout your application code. You *should not* create multiple Client instances as it could negatively affect caching.

### Register your application with Stormpath

Registering an application with Stormpath allows that application to use Stormpath for its user management and authentication needs. Use the `client` "applications.create" method to create a new `Application` resource as follows:

    application = my_client.applications.create({
            "name": "My Test Python App",
            "description": "Test app crated via Python application",
        }, create_directory=True)

Once the application is created, it will automatically create a `Directory` resource based on the name of application and set it as the default account store. New accounts will be created in the default account store.

### Create an account 

Now that we've created an `Application`, let's create an `Account` so someone can log in to (i.e. authenticate with) the application. To do so, use the `application` "accounts.create" of your existing application instance to set the values and create the account as follows:

    account = application.accounts.create({
                "given_name": "Jean-Luc",
                "surname": "Picard",
                "username": "jlpicard",
                "email": "capt@enterprise.com",
                "password":"Changeme1"
              })

### Authenticate an Account

Now we have an account that can use your application.  But how do you authenticate an account logging in to the application? You use the application instance and an `AuthenticationRequest` as follows:

    account = application.authenticate_account("USERNAME", "PASSWORD")

If the authentication request is successful, an `Account` resource will be returned for the authorized account.

### Experiment! 

Use the client instance to interact with your tenant data, such as applications, directories, and accounts:

    from stormpath.client import Client

    my_client = Client(api_key_file_location="$HOME/.stormpath/apiKey.properties")

    for application in my_client.applications:
        print("Application: ", application.name)

    for directory in my_client.directories:
        print("Directory:", directory.name)

***

## Next Steps

We hope you have found this Quickstart helpful!

For full coverage of Stormpath's Python SDK, including how to edit application details, edit accounts, create groups and assign accounts to groups, resetting passwords via password reset emails, and more, please see our [Python Product Guide](http://www.stormpath.com/docs/python/product-guide).