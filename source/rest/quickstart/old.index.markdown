---
layout: doc
lang: rest
title: Stormpath REST API Quickstart
---

# Stormpath REST API Quickstart

Welcome to Stormpath's REST API Quickstart!

This quickstart will get you up and running with Stormpath in about 10 minutes and give you a good initial feel for the Stormpath REST API.  During this quickstart you will:

* register for a free Stormpath account
* create an API Key that allows you to make REST API calls with Stormpath
* register an application with Stormpath so you can automate that application's user management and authentication needs.
* create an account that can login to the application.
* login the account to the application.

With Stormpath, you can offload repetitive security-sensitive logic to Stormpath and get back to building your application's core functionality.  Never worry about storing passwords again!

## Sign Up for Stormpath

1. Fill out and submit the [Stormpath registration form](https://api.stormpath.com/register).  This will send a confirmation email.
2. Click the link in the confirmation email.

##<a name="apiKey"></a> Get an API Key

All requests to the Stormpath REST API must be authenticated with an API Key. To get an API key:

1. Log in to the [Stormpath Admin Console](https://api.stormpath.com) using the email address and password you used to register with Stormpath.

2. In the top-right corner of the resulting page, visit **Settings** > **My Account**.

    <!-- TODO: SCREENSHOT (arrow calling attention to the 'My Accounts' menu item)   -->

3. On the Account Details page, under **Security Credentials**, click **Create API Key**.

    <!-- TODO: SCREENSHOT (arrow calling attention to the 'Create API Key' button) -->

    This will generate your API Key and download it to your computer as an `apiKey.properties` file. If you open the file in a text editor, you will see something similar to the following:

        apiKey.id = 144JVZINOF5EBNCMG9EXAMPLE

        apiKey.secret = lWxOiKqKPNwJmSldbiSkEbkNjgh2uRSNAb+AEXAMPLE
    {: .ini}

4. Save this file in a secure location, such as your home directory in a hidden `.stormpath` directory. For example:

        $HOME/.stormpath/apiKey.properties
    {: .bash}

5. Also change the file permissions to ensure only you can read this file. For example, on \*nix operating systems:

        $ chmod go-rwx $HOME/.stormpath/apiKey.properties
    {: .bash}

## Register an Application with Stormpath

Registering an application with Stormpath allows that application to use Stormpath for its user management and authentication needs.  You register an Application with Stormpath simply by `POST`ing a new Application resource to the `applications` URL:

    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
         -H "Accept: application/json" \
         -H "Content-Type: application/json" \
         -d '{
               "name" : "My first application!"
             }' \
         'https://api.stormpath.com/v1/applications?createDirectory=true'
{: .bash}

where:

* `$YOUR_API_KEY_ID` is the `apiKey.id` value in `apiKey.properties` and
* `$YOUR_API_KEY_SECRET` is the `apiKey.secret` value in `apiKey.properties`

This will create your application.  Here's an example response:

    {
      "href": "https://api.stormpath.com/v1/applications/aLoNGrAnDoMAppIdHeRe",
      "name": "My first application!",
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

## Create an Account

Now that we've created an `Application`, let's create an `Account` so someone can login to (i.e. authenticate with) the Application.  `POST` a new `Account` resource to the `accounts` `href` value returned in the JSON response that you received when you created your `Application`:

    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
         -H "Accept: application/json" \
         -H "Content-Type: application/json" \
         -d '{
               "givenName": "Jean-Luc",
               "surname": "Picard",
               "username": "jlpicard",
               "email": "capt@enterprise.com",
               "password":"Changeme1"
             }' \
         "https://api.stormpath.com/v1/applications/$YOUR_APPLICATION_ID/accounts"
{: .bash}

<div class="docs-note"> Don't forget to change `$YOUR_APPLICATION_ID` in the URL above to match your application's `accounts` `href` URL! </div>

This will create the account. Example response:

    {
      "href": "https://api.stormpath.com/v1/accounts/aRaNdOmAcCoUnTId",
      "username": "jlpicard",
      "email": "capt@enterprise.com",
      "fullName": "Jean-Luc Picard",
      "givenName": "Jean-Luc",
      "middleName": null,
      "surname": "Picard",
      "status": "ENABLED",
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

## Login an Account

Now we have an account that can use your application.  But how do you authenticate an account logging in to the application? You `POST` a `Login Attempt` to your application's `loginAttempts` `href`.

A `Login Attempt` resource has two attributes: `type` and `value`.

The `type` attribute must equal `basic`.  The `value` attribute must equal the result of the following (pseudo code) logic:

    String concatenated = username + ':' + plain_text_password;
    byte[] bytes = concatenated.to_byte_array();
    String value = base64_encode( bytes );
{: .ruby}

For example, if you used the the `jlpicard` username and `Changeme1` password above when creating your first account, you might compute the `value` using [OpenSSL](http://www.openssl.org/) this way:

    echo -n "jlpicard:Changeme1" | openssl base64
{: .bash}

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

<div class="docs-note"> Don't forget to change `$YOUR_APPLICATION_ID` in the URL above to match your application's `accounts` `href` URL! </div>

If the authentication attempt is successful (the username and password match and were Base64-encoded correctly), a link to the successfully authenticated account will be returned:

    {
      "account": {
        "href": "https://api.stormpath.com/v1/accounts/aRaNdOmAcCoUnTId"
      }
    }

You can use the returned `href` to `GET` the account's details (first name, last name, email, etc).

If the authentication attempt fails, you will see an [error response](product-guide#Errors) instead:

    {
      "status": 400,
      "code": 400,
      "message": "Invalid username or password.",
      "developerMessage": "Invalid username or password.",
      "moreInfo": "mailto:support@stormpath.com"
    }

## Next Steps

We hope you have found this Quickstart helpful!

For full coverage of Stormpath's REST API, including how to edit application details, edit accounts, create groups and assign accounts to groups, resetting passwords via password reset emails, and more, please see our [REST API Product Guide](http://www.stormpath.com/docs/rest/product-guide)
