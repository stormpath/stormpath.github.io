---
layout: doc
lang: rest
description: "7-minute Tutorial for REST"
image: https://stormpath.com/images/tutorial/rest.png
title: Stormpath REST Quickstart
---


Welcome to Stormpath's REST Quickstart!

This quickstart will get you up and running with Stormpath in about 7 minutes
and give you a good initial feel for the Stormpath REST API.  During this
quickstart, you will do the following:

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
easily authenticate with the Stormpath library.


***
## Create an Application

Before you can create user Accounts you'll need to create a Stormpath
Application.  An Application in Stormpath is the same thing as a project.  If
you're building a web app named "Lightsabers Galore", you'd want to name your
Stormpath Application "Lightsabers Galore" as well.

You can create an Application  by `POST`ing a new Application resource to the `applications` URL:

    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
         -H "Accept: application/json" \
         -H "Content-Type: application/json" \
         -d '{
               "name" : "My Awesome Application"
             }' \
         'https://api.stormpath.com/v1/applications?createDirectory=true'

where:

* `$YOUR_API_KEY_ID` is the `apiKey.id` value in `apiKey.properties` and
* `$YOUR_API_KEY_SECRET` is the `apiKey.secret` value in `apiKey.properties`

Here's an example response to the above REST request:

    {
      "href": "https://api.stormpath.com/v1/applications/aLoNGrAnDoMAppIdHeRe",
      "name": "My Awesome Application",
      "description": null,
      "status": "ENABLED",
      "tenant": {
        "href": "https://api.stormpath.com/v1/tenants/sOmELoNgRaNDoMIdHeRe"
      },
      "accounts": {
        "href": "https://api.stormpath.com/v1/applications/aLoNGrAnDoMAppIdHeRe/accounts"
      },
      "groups": {
        "href": "https://api.stormpath.com/v1/applications/aLoNGrAnDoMAppIdHeRe/groups"
      },
      "loginAttempts": {
        "href": "https://api.stormpath.com/v1/applications/aLoNGrAnDoMAppIdHeR/loginAttempts"
      },
      "passwordResetTokens": {
        "href": "https://api.stormpath.com/v1/applications/aLoNGrAnDoMAppIdHeRe/passwordResetTokens"
      }
    }

Make note of the `accounts` and `loginAttempts` `href` URLs in the above response.  We're going to use those URLs next to create a new account and then authenticate it.

{% docs note %}
The only required field when creating an Application is `name`.  Descriptions
are optional!
{% enddocs %}


***


## Create a User Account

Now that we've created an `Application`, let's create an `Account` so someone can log in to (i.e. authenticate with) the Application.  `POST` a new `Account` resource to the `accounts` `href` value returned in the JSON response that you received when you created your `Application`:

    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
        -H "Accept: application/json" \
        -H "Content-Type: application/json" \
        -d '{
            "givenName": "Joe",  
            "surname": "Stormtrooper",
            "username": "tk421",
            "email": "tk421@stormpath.com",
            "password":"Changeme1",
            "customData": {
                "favoriteColor": "white"
            }
        }' \
    "https://api.stormpath.com/v1/applications/$YOUR_APPLICATION_ID/accounts"

{% docs note %}
Don't forget to change `$YOUR_APPLICATION_ID` in the URL above to match your application's `accounts` `href` URL!
{% enddocs %}

Stormpath Accounts have several basic fields (`givenName`, `surname`, `email`,
etc...), but also support storing schema-less JSON data through the `customData`
field.  `customData` allows you to store any user profile information (*up to
10MB per user!*).

{% docs note %}
The required fields are: `givenName`, `surname`, `email`, and `password`.
{% enddocs %}

This will create the account. Example response:

    {
      "href": "https://api.stormpath.com/v1/accounts/aRaNdOmAcCoUnTId",
      "username": "tk421",
      "email": "tk421@stormpath.com",
      "fullName": "Joe Stormtrooper",
      "givenName": "Joe",
      "middleName": null,
      "surname": "Stormtrooper",
      "status": "ENABLED",
      "customData": {
        "href":"https://api.stormpath.com/v1/accounts/78zeDydHRroJkiAD9XRQ9j/customData"
      },
      "groups": {
        "href":"https://api.stormpath.com/v1/accounts/aRaNdOmAcCoUnTId/groups"
      },
      "groupMemberships": {
        "href":"https://api.stormpath.com/v1/accounts/aRaNdOmAcCoUnTId/groupMemberships"
      },
      "directory": {
        "href":"https://api.stormpath.com/v1/directories/sOmERaNdOmDiReCtORyId"
      },
      "tenant": {
        "href":"https://api.stormpath.com/v1/tenants/sOmERaNdOmTeNaNtId"
      },
      "emailVerificationToken": null
    }


***


## Search for a User Account

Finding user Accounts is also simple.  You can search for Accounts by field:

    curl -u $API_KEY_ID:$API_KEY_SECRET \
        -H "Accept: application/json" \
    "https://api.stormpath.com/v1/applications/$YOUR_APPLICATION_ID/accounts?email=tk421@stormpath.com"


You can also use wild cards such as `{'email': '*@stormpath.com'}` to return
all accounts with a stormpath.com domain.


***


## Authenticate a User Account

Now we have an account that can use your application.  But how do you authenticate an account logging in to the application? You `POST` a `Login Attempt` to your application's `loginAttempts` `href`.

A `Login Attempt` resource has two attributes: `type` and `value`.

The `type` attribute must equal `basic`.  The `value` attribute must equal the result of the following (pseudo code) logic:

    String concatenated = username + ':' + plain_text_password;
    byte[] bytes = concatenated.to_byte_array();
    String value = base64_encode( bytes );

For example, if you used the the `tk421` username and `Changeme1` password above when creating your first account, you might compute the `value` using [OpenSSL](http://www.openssl.org/) this way:

    echo -n "tk421:Changeme1" | openssl base64

This would produce the following Base64 result:

    amxwaWNhcmQ6Q2hhbmdlbWUx

Use the Base64 result to `POST` a `Login Attempt` to your application's `loginAttempts` `href` (the JSON `value` attribute is the Base64 result):

    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
        -H "Accept: application/json" \
        -H "Content-Type: application/json" \
        -d '{
            "type": "basic",
            "value": "amxwaWNhcmQ6Q2hhbmdlbWUx"
        }' \
    "https://api.stormpath.com/v1/applications/$YOUR_APPLICATION_ID/loginAttempts"

{% docs note %}
Don't forget to change `$YOUR_APPLICATION_ID` in the URL above to match your application's `accounts` `href` URL!
{% enddocs %}

If the authentication attempt is successful (the username and password match and were Base64-encoded correctly), a link to the successfully authenticated account will be returned:

    {
      "account": {
        "href": "https://api.stormpath.com/v1/accounts/aRaNdOmAcCoUnTId"
      }
    }

You can use the returned `href` to `GET` the account's details (first name, last name, email, etc).

If the authentication attempt fails, you will see an [error response](/rest/product-guide#errors) instead:

    {
      "status": 400,
      "code": 400,
      "message": "Invalid username or password.",
      "developerMessage": "Invalid username or password.",
      "moreInfo": "mailto:support@stormpath.com"
    }

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
- Plug into your favorite language or web framework.


***


## Next Steps

We hope you found this Quickstart helpful!

You've just scratched the surface of what you can do with Stormpath.  Want to
learn more?  Here are a few other helpful resources you can jump into.

* Dig in deeper with the [Official REST API Product Guide](/rest/product-guide).
* Try out Stormpath in your favorite programming language with our [7-Minute Tutorial](https://stormpath.com/tutorial). 
* Learn to easily partition user data with our [Guide to Building Multitenant Applications](/guides/multi-tenant/).
* Easily support Google and Facebook Login with our new [Social Login & Integration Guide](/guides/social-integrations/).


***


## Help Us Spread the Word

Like Stormpath?  If you enjoyed playing around with our REST API,
please help spread the word with a quick tweet!

<!-- AddThis Button BEGIN -->
<div class="addthis_toolbox addthis_default_style addthis_32x32_style" addthis:title="Checkout @goStormpath, it let's you set up complete user management in your app in minutes."
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
