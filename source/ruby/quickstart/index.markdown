---
layout: doc
lang: ruby
description: "7-minute Tutorial for Ruby"
image: https://stormpath.com/images/tutorial/ruby.png
title: Stormpath Ruby Quickstart
---


Welcome to Stormpath's Ruby Quickstart!

This quickstart will get you up and running with Stormpath in about 7 minutes
and give you a good initial feel for the Stormpath Ruby library.  During this
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


## Install the Stormpath Gem

{% docs note %}
The Ruby SDK is compatible with Ruby *1.9.3* and higher.
{% enddocs %}

You can install [Stormpath](https://github.com/stormpath/stormpath-sdk-ruby)
using [RubyGems](https://rubygems.org/):

    $ gem install stormpath-sdk --pre


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
[Client](/ruby/product-guide#client) using your `apiKey.properties` file.
The `Client` object is what allows you to communicate with Stormpath.

First, open the Ruby shell by running:

    $ irb

Then, create a new Stormpath `Client` with the following code:

    require "stormpath-sdk"
    client = Stormpath::Client.new api_key_file_location: File.join(ENV['HOME'], '.stormpath', 'apiKey.properties')

The `Client` instance is intended to be an application singleton.  You should
reuse this instance throughout your application code.  You *should not*
create multiple `Client` instances as it could negatively affect caching.


***


## Retrieve your Application

Before you can create user Accounts you'll need to retrieve your Stormpath
Application.  An Application in Stormpath is the same thing as a project. If
you're building a web app named "Lightsabers Galore", you'd want to name your
Stormpath Application "Lightsabers Galore" as well.  By default, your Stormpath account will have an application already created for you to use.  We will use this application for the quickstart. 

You can retrieve your example `Application` using the client you created in the previous step:

    
    applications = client.applications.search name: 'My Application'
    application = applications.each.next

The code above will retrieve your example `Application`, which we can use later to do stuff like:

- Create user accounts.
- Log users into their account.
- etc.


***


## Create a User Account

Now that we've created an `Application`, let's create a user `Account`!  To do
this, you'll need to use your `Application` (*created in the previous step*):

    account = application.accounts.create({
        given_name: 'Joe',
        surname: 'Stormtrooper',
        username: 'tk421',
        email: 'tk421@stormpath.com',
        password: 'Changeme1',
        custom_data: {
            favorite_color: 'white',
        },
    })

Stormpath accounts have several basic fields (`given_name`, `surname`, `email`,
etc...), but also support storing schema-less JSON data through the `custom_data`
field.  `custom_data` allows you to store any user profile information (*up to
10MB per user!*).

{% docs note %}
The required fields are: `given_name`, `surname`, `email`, and `password`.
{% enddocs %}

Once you've created an `Account`, you can access the account's data by
referencing the attribute names, for instance:

    account.given_name
    account.custom_data['favorite_color']


***


## Authenticate a User Account

Authenticating users is equally simple -- you can specify either a `username` or
`email` address, along with a `password`:

    auth_request = Stormpath::Authentication::UsernamePasswordRequest.new 'tk421@stormpath.com', 'Changeme1'
    auth_result = application.authenticate_account auth_request
    account = auth_result.account
    puts account.given_name + " successfully authenticated!"

    auth_request = Stormpath::Authentication::UsernamePasswordRequest.new 'tk421', 'Changeme1'
    auth_result = application.authenticate_account auth_request
    account = auth_result.account
    puts account.given_name + " successfully authenticated!"

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


***


## Next Steps

We hope you found this Quickstart helpful!

You've just scratched the surface of what you can do with Stormpath.  Want to
learn more?  Here are a few other helpful resources you can jump into.

* Dig in deeper with the [Official Ruby Product Guide](/ruby/product-guide).
* Learn to easily partition user data with our [Guide to Building Multitenant SaaS Applications](/guides/multi-tenant/).

