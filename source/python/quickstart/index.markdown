---
layout: doc
lang: python
description: "10-minute Tutorial for Python"
image: https://stormpath.com/images/tutorial/python.png
title: Stormpath Python Quickstart
---

Welcome to Stormpath's Python Library Quickstart!

This quickstart will get you up and running with Stormpath in about 10 minutes
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

Install [Stormpath](https://github.com/stormpath/stormpath-sdk-python) using [pip](http://pip.readthedocs.org/en/latest/):

    $ pip install stormpath

Don't have pip installed?  Try this instead:

    $ easy_install stormpath

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

4. In the top-right corner of the resulting page, visit **Settings** >
   **My Account**.

5. On the Account Details page, under **Security Credentials**, click
   **Create API Key**.

   This will generate your API Key and download it to your computer as an
   `apiKey.properties` file.  If you open the file in a text editor, you will
   see something similar to the following:

        apiKey.id = 144JVZINOF5EBNCMG9EXAMPLE
        apiKey.secret = lWxOiKqKPNwJmSldbiSkEbkNjgh2uRSNAb+AEXAMPLE

6. Save this file in a secure location, such as your home directory, in a
   hidden `.stormpath` directory. For example:

        $HOME/.stormpath/apiKey.properties

5. Change the file permissions to ensure only you can read this file.  For
   example, on \*nix operating systems:

        $ chmod go-rwx $HOME/.stormpath/apiKey.properties

The `apiKey.properties` file holds your API key information, and can be used to
easily authentication with the Stormpath library.

***


## Configure your Python Application

Create a Stormpath [Client](/python/product-guide#Client) using your
`apiKey.properties` file.  The `Client` instance is what communicates with
Stormpath.  For example:

    from os.path import expanduser
    from stormpath.client import Client

    client = Client(api_key_file_location=expanduser('~/.stormpath/apiKey.properties'))

The `client` instance is intended to be an application singleton.  You should
reuse this instance throughout your application code.  You *should not*
create multiple `Client` instances as it could negatively affect caching.


***


## Register Your Application with Stormpath

Before you can store user accounts you'll need to have an `Application` and
`Directory` in Stormpath.  An Application is just Stormpath’s term for a
project, and a Directory is a collection of unique user accounts.

Applications and Directories are decoupled, so you can share Directories
across your Applications.  This is useful for more complex authentication
scenarios (*like single sign on*).

You can create an Application and Directory together for convenience:

    application = client.applications.create({
        'name': 'My Awesome Application',
        'description': 'Super awesome!',
    }, create_directory=True)

The code above will create a new Application, then create a new Directory of the
same name (*if your Application is named "test" your Directory will be named
"test Directory"*).  The new Directory will then be bound to your Application,
so that all new users created in your Application will be stored in this
Directory.


***


## Create a User Account

Now that we've created an Application, let's create a user Account so someone
can log into (*i.e. authenticate with*) the Application.  To do this, use your
Client:

    account = application.accounts.create({
        'given_name': 'Joe',
        'surname': 'Stormtrooper',
        'username': 'tk455',
        'email': 'stormtrooper@stormpath.com',
        'password': 'Changeme1',
        'custom_data': {
            'favorite_color': 'white'
        },
    })

Stormpath Accounts have several basic fields (`given_name`, `surname`, `email`,
etc...), but also support variable JSON data through the `custom_data` field.

{% docs note %}
The required fields are: `given_name`, `surname`, `email`, and `password`.
{% enddocs %}


***


## Search for a User Account

Finding user Accounts is also simple.  You can search for accounts by field:

    application.accounts.search({'email': 'stormtrooper@stormpath.com'})

You can also use wild cards such as `{'email': '*@stormpath.com'}` to return
all accounts with a stormpath.com domain.


***


## Authenticate a User Account

Authenticating users is simple:

    account = application.authenticate_account('username_or_email', 'password')

If the authentication request is successful, an `Account` resource will be
returned.


***


## Help Us Spread the Word

Like Stormpath?  If you enjoyed playing around with our new Python library,
please help spread the word with a quick tweet!

<!-- AddThis Button BEGIN -->
<div class="addthis_toolbox addthis_default_style addthis_32x32_style" addthis:title="Just checked out @goStormpath for a new Python app. It's awesome!" addthis:url="https://stormpath.com">
  <a class="addthis_button_twitter" addthis:title="Just checked out @goStormpath for a new Python app. It's awesome!"></a>
  <a class="addthis_button_preferred_2"></a>
  <a class="addthis_button_preferred_3"></a>
  <a class="addthis_button_preferred_4"></a>
  <a class="addthis_button_compact"></a>
</div>
<script type="text/javascript">var addthis_config = {"data_track_addressbar":true};</script>
<script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-4f5ed709512978e9"></script>
<!-- AddThis Button END -->


***


## Next Steps

We hope you have found this Quickstart helpful!

You've just scratched the surface of what you can do with Stormpath.  Want to
learn more?  Here are a few other helpful resources you can jump into.

* [Flask Documentation](http://flask-stormpath.readthedocs.org/en/latest/)
* [Build a Flask app in 30 minutes](https://stormpath.com/blog/build-a-flask-app-in-30-minutes/)
* [Official Python Product Guide](http://docs.stormpath.com/python/product-guide)
* [Guide to Building Multitenant Applications](http://docs.stormpath.com/guides/multi-tenant/)
* [Social Login & Integration Guide](http://docs.stormpath.com/guides/social-integrations/)
