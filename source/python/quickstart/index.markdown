---
layout: doc
lang: python
description: "7-minute Tutorial for Python"
image: https://stormpath.com/images/tutorial/python.png
title: Stormpath Python Quickstart
---


Welcome to Stormpath's Python Quickstart!

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
Stormpath works with Python 2.7, and 3.2+.
{% enddocs %}

You can install [Stormpath](https://github.com/stormpath/stormpath-sdk-python) using [pip](http://pip.readthedocs.org/en/latest/):

    $ pip install -U stormpath

If that doesn't work, try this instead:

    $ easy_install -U stormpath

Or, you can
[download the source code (ZIP)](https://github.com/stormpath/stormpath-sdk-python/zipball/master),
extract it, then run:

    $ python setup.py install

You may need to run the above commands with `sudo` depending on your Python
setup.


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
[Client](/python/product-guide#client) using your `apiKey.properties` file.
The `Client` object is what allows you to communicate with Stormpath.

First, open the Python shell by running:

    $ python

Then, create a new Stormpath client with the following code:

    >>> from os.path import expanduser
    >>> from stormpath.client import Client
    >>> client = Client(api_key_file_location=expanduser('~/.stormpath/apiKey.properties'))

The `client` instance is intended to be an application singleton.  You should
reuse this instance throughout your application code.  You *should not*
create multiple `Client` instances as it could negatively affect caching.

{% docs tip %} 
If you want to see all the code from this tutorial in one file, check out this [Gist on GitHub](https://gist.github.com/rdegges/1155b9e3fc3432c0f7b2#file-quickstart-py):  [https://gist.github.com/rdegges/1155b9e3fc3432c0f7b2#file-quickstart-py](https://gist.github.com/rdegges/1155b9e3fc3432c0f7b2#file-quickstart-py)
{% enddocs %}


***


## Create an Application

Before you can create user Accounts you'll need to create a Stormpath
Application.  An Application in Stormpath is the same thing as a project.  If
you're building a web app named "Lightsabers Galore", you'd want to name your
Stormpath Application "Lightsabers Galore" as well.

You can create an Application using the client you created in the previous step:

    >>> application = client.applications.create({
    >>>    'name': 'My Awesome Application',
    >>>    'description': 'Super awesome!',
    >>> }, create_directory=True)

The code above will create a new Application, which we can use later to do stuff
like:

- Create user accounts.
- Log users into their account.
- etc.

{% docs note %}
The only required field when creating an Application is `name`.  Descriptions
are optional!
{% enddocs %}


***


## Create a User Account

Now that we've created an Application, let's create a user Account!  To do
this, you'll need to use your application (*created in the previous step*):

    >>> account = application.accounts.create({
    >>>     'given_name': 'Joe',
    >>>     'surname': 'Stormtrooper',
    >>>     'username': 'tk421',
    >>>     'email': 'tk421@stormpath.com',
    >>>     'password': 'Changeme1',
    >>>     'custom_data': {
    >>>         'favorite_color': 'white',
    >>>     },
    >>> })

Stormpath Accounts have several basic fields (`given_name`, `surname`, `email`,
etc...), but also support storing schema-less JSON data through the `custom_data`
field.  `custom_data` allows you to store any user profile information (*up to
10MB per user!*).

{% docs note %}
The required fields are: `given_name`, `surname`, `email`, and `password`.
{% enddocs %}

Once you've created an Account, you can access the Account's data by referencing
the attribute names, for instance:

    >>> account.given_name
    u'Joe'
    >>> account.custom_data['favorite_color']
    u'white'


***


## Search for a User Account

Finding user Accounts is also simple.  You can search for Accounts by field:

    >>> for account in application.accounts.search({'email': 'tk421@stormpath.com'}):
    ...     print account.given_name, account.surname
    ...
    Joe Stormtrooper

You can also use wild cards such as `{'email': '*@stormpath.com'}` to return
all accounts with a stormpath.com domain.


***


## Authenticate a User Account

Authenticating users is equally simple -- you can specify either a `username` or
`email` address, along with a `password`:

    >>> account = application.authenticate_account('tk421@stormpath.com', 'Changeme1').account
    >>> account.given_name
    'Joe'
    >>> account = application.authenticate_account('tk421', 'Changeme1').account
    >>> account.given_name
    'Joe'

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
- Plug into your favorite web framework (*like Flask!*).


***


## Next Steps

We hope you found this Quickstart helpful!

You've just scratched the surface of what you can do with Stormpath.  Want to
learn more?  Here are a few other helpful resources you can jump into.

* Dig in deeper with the [Official Python Product Guide](/python/product-guide).
* Use Stormpath and Flask to build an awesome web app with the [Flask Documentation](http://flask-stormpath.readthedocs.org/en/latest/).
* [Build a Flask app in 30 minutes](https://stormpath.com/blog/build-a-flask-app-in-30-minutes/).
* Learn to easily partition user data with our [Guide to Building Multitenant Applications](/guides/multi-tenant/).
* Easily support Social Login with [Google](/python/product-guide/#integrating-with-google) and [Facebook](/python/product-guide#integrating-with-facebook) integrations in Python.


***


## Help Us Spread the Word

Like Stormpath?  If you enjoyed playing around with our new Python library,
please help spread the word with a quick tweet!

<!-- AddThis Button BEGIN -->
<div class="addthis_toolbox addthis_default_style addthis_32x32_style" addthis:title="Checkout @goStormpath, it let's you set up complete user management in your Python app in minutes."
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
