---
layout: doc
lang: guides
title: Integrating Stormpath with Facebook and Google
---

In this guide, we discuss how to set up Stormpath to communicate to Google and Facebook to retrieve user profiles from the social networks and convert them into Stormpath accounts.  

{% docs note %}

Prerequisite:  Complete one of the [Quickstart Guides](http://docs.stormpath.com/home/).  This will get you familiar with Stormpath and will set up an `Application` to use with this guide.

{% enddocs %}

## What is Stormpath? 

Stormpath is a user management API that makes it easy for developers to launch applications with secure, scalable user infrastructure. It automates:

* User Account registration and login
* Authentication and authorization
* Flexible, secure user profile data
* Group and role management, including pre-built Role-Based Access Control (RBAC)
* Best-practice password security and data storage

You access Stormpath via a [beautiful](http://stormpath.com/blog/designing-rest-json-apis) REST+JSON API or our [language-specific SDKs](http://docs.stormpath.com).

##  Why Should I Use Stormpath to Integrate Login with Facebook and Google?

Stormpath makes it easy to connect to Google and Facebook in one simple API call. It's a simple and secure way to retrieve user profiles and convert them into Stormpath accounts, no matter the service you're using. 

From an end-user perspective, it allows them to log into your application by collecting information from these social networks.

As soon as you have an OAuth token from Google or Facebook, you can pass it to Stormpath.  Stormpath will handle validating the token, importing the user profile into a `Directory`, syncing user profile, and can enable you to handle use cases such as:

+ Storing an optional password for an imported Facebook / Google account to support email / password authentication
+ Robust and schema-less user profiles
+ Using the same API, you can read / write information regardless of what social provider they authenticated with.

## How to Integrate Stormpath with Facebook?

After you familiarize yourself with Stormpath with one of the [Quickstart](https://stormpath.com/tutorial/) Guides, integrating Stormpath with Facebook and Google requires the following steps:

+ Creating a Social Directory for Facebook 
+ Mapping the Directory as an Account Store to an Application
+ Accessing an Account with Facebook Tokens

### Creating a Social Directory for Facebook

A `Directory` is a top-level storage containers of `Accounts` in Stormpath. A `Directory` also manages security policies (like password strength) for the `Accounts` it contains.  Facebook Directories are a special type of `Directory` that holds Accounts for Facebook. 

{% docs note %}
Before you can create a Directory for Facebook, it is important that you gather information regarding your application from Facebook.  This information includes Client ID / Client Secret and can be acquired from the developer consoles for [Facebook](https://developers.facebook.com/).
{% enddocs %}

Creating a directory for Facebook require that you provide information from Facebook as a `Provider` [resource](http://docs.stormpath.com/rest/product-guide/#facebook-provider-resource).  This information can be use to create the directories from the [Console](https://api.stormpath.com/ui/directories/create) or the following curl requests:


    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
         -H "Accept: application/json" \
         -H "Content-Type: application/json" \
         -d '{
                "name" : "my-facebook-directory",
                "description" : "A Facebook directory",
                "provider": {
                  "providerId": "facebook",
                  "clientId":"YOUR_FACEBOOK_CLIENT_ID",
                  "clientSecret":"YOUR_FACEBOOK_CLIENT_SECRET"
                }
              }' \
     "https://api.stormpath.com/v1/directories"

Response:

    HTTP/1.1 201 Created
    Location: https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q
    Content-Type: application/json;charset=UTF-8;

    {
      "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q",
      "name" : "my-facebook-directory",
      "description" : "A Facebook directory",
      "status" : "ENABLED",
      "tenant" : {
        "href" : "https://api.stormpath.com/v1/tenants/Gh9238fksJlsieJkPkQuW"
      },
      "accounts" : {
        "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q/accounts"
      },
      "groups" : {
        "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q/groups"
      },
      "provider" : {
        "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q/provider"
      }
    }


### Mapping the Directory as an Account Store to an Application

Once a Facebook `Directory` has been created, it must be mapped to an application as an `Account Store`.  When an Account Store (which can be a `Directory` or `Group`) is mapped to an `Application`, the accounts in the account store are considered the application’s users and they can login to the application. 

Creating an Account Store Mapping can be done through the REST API, SDKs or Admin Console.

#### Admin Console

To manage Account Stores in the Console:

1. Log in to the Stormpath Admin Console
2. Click the *Applications* tab
3. Click the Application's name to which you want to add an Account Store
4. Click the *Account Stores* button in the tab bar
5. Select the Facebook Directory that was created
6. Click *Add Account Store*

#### REST API

Request:

    curl -X POST -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Content-Type: application/json;charset=UTF-8" \
         -d '{
               "application": {
                 "href": "YOUR_APPLICATION_HREF"
               }
               "accountStore": {
                 "href": "YOUR_FACEBOOK_DIRECTORY_HREF"
               }
             }' \
         'https://api.stormpath.com/v1/accountStoreMappings'

Response:

    {
        "href": "https://api.stormpath.com/v1/accountStoreMappings/7Ui2gpn9tV75y3TExAmPLe",
        "accountStore": {
            "href": "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpExAmPLe"
        },
        "application": {
            "href": "https://api.stormpath.com/v1/applications/Uh8FzIouQ9C8EpcExAmPLe"
        },
        "listIndex": 0,
        "isDefaultAccountStore": false,
        "isDefaultGroupStore": false
    }

### Accessing an Account with Facebook Tokens

Once a Facebook Directory is mapped to an application, it is now possible to get an `Account` from Stormpath based on Facebook User Access Tokens.

You need to gather an User Access Token from Facebook before submitting it to Stormpath.  This is possible either by using a [Facebook SDK Library](https://developers.facebook.com/docs/facebook-login/access-tokens/#usertokens), or [Facebook's Graph Explorer](https://developers.facebook.com/tools/explorer) for testing.

Below is sample code using Facebook's Javascript library to get the access token.  

    window.checkFacebookStatus = function () {
        FB.getLoginStatus(function (response) {
            //  {
            //     status: 'connected',
            //     authResponse: {
            //        accessToken: '...',
            //        expiresIn:'...',
            //        signedRequest:'...',
            //        userID:'...'
            //     }
            //  }

            if (response.status === 'connected') {
                alert('Access Token: ' + response.authResponse.accessToken);
            } else {
                alert('Log in first...');
            }

        });
    };

There are also other means of getting the access token from cookies on the server using 3rd party libraries in different languages.

{% docs note %}
It is required that your Facebook application request for the `email` permission from Facebook. If the access token does not grant `email` permissions, you will not be able to get an `Account` with an access token.
{% enddocs %}

Once the `User Access Token` is gathered, you can get or create the `Account` HTTP `POST`ing to the `Application` accounts collection and specifying `providerData`.  The `providerData` JSON object specifies the type of provider and the authorization code as follows:

    {
      "providerId": "facebook",
      "accessToken": "%ACCESS_TOKEN_FROM_FACEBOOK%"
    }

The following is how you use `providerData` to get an `Account` for a given `User Access Token`:

**Example Request**

    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
         -H "Accept: application/json" \
         -H "Content-Type: application/json" \
         -d '{
                "providerData": {
                  "providerId": "facebook",
                  "accessToken": "USER_ACCESS_TOKEN_FROM_FACEBOOK"
                }
              }' \
     "https://api.stormpath.com/v1/applications/YOUR_APP_ID/accounts"

**Example Response**

    HTTP/1.1 201 Created
    Location: https://api.stormpath.com/v1/accounts/m0fw8GvxpM7n3pw6tyw9
    Content-Type: application/json;charset=UTF-8;

    {
        "customData": {
            "href": "https://api.stormpath.com/v1/accounts/m0fw8GvxpM7n3pw6tyw9/customData"
        },
        "directory": {
            "href": "https://api.stormpath.com/v1/directories/U0HJ7YcCeMpRfMcRT8ph"
        },
        "email": "testuser@gmail.com",
        "emailVerificationToken": null,
        "fullName": "Test User",
        "givenName": "Test",
        "groupMemberships": {
            "href": "https://api.stormpath.com/v1/accounts/m0fw8GvxpM7n3pw6tyw9/groupMemberships"
        },
        "groups": {
            "href": "https://api.stormpath.com/v1/accounts/m0fw8GvxpM7n3pw6tyw9/groups"
        },
        "href": "https://api.stormpath.com/v1/accounts/m0fw8GvxpM7n3pw6tyw9",
        "middleName": null,
        "providerData": {
            "href": "https://api.stormpath.com/v1/accounts/m0fw8GvxpM7n3pw6tyw9/providerData"
        },
        "status": "ENABLED",
        "surname": "User",
        "tenant": {
            "href": "https://api.stormpath.com/v1/tenants/GPpLzIzYkOO68I9i4dx"
        },
        "username": "testuser"
    }

{% docs note %}
The HTTP Status code when accessing an account based on a Facebook User Access Token will denote if the account was created (HTTP 201) or if it already existed in Stormpath (HTTP 200)
{% enddocs %}

{% docs note %}
To expand the `providerData` to get the Access Token for the Account in one HTTP request, add `expand=providerData` to the URL query parameters.
{% enddocs %}

Once an `Account` is retrieved, Stormpath maps common fields for the Facebook User to the  Account.  The access token for any additional calls in the `providerData` resource and can be retrieved by:

    GET https://api.stormpath.com/v1/accounts/m0fw8GvxpM7n3pw6tyw9/providerData

The returned `providerData` will include:

    {
      "accessToken": "y29.1.AADN_Xo2hxQflWwsgCSK-WjSw1mNfZiv4", 
      "createdAt": "2014-04-01T17:00:09.154Z", 
      "href": "https://api.stormpath.com/v1/accounts/ciYmtETytH0tbHRBas1D5/providerData", 
      "modifiedAt": "2014-04-01T17:00:09.189Z", 
      "providerId": "facebook"
    }

## How to Integrate Stormpath with Google?

After you familiarize yourself with Stormpath with one of the [Quickstart](docs.stormpath.com) Guides, integrating Stormpath with Google requires the following steps:

+ Creating a Social Directory for Google 
+ Mapping the Directory as an Account Store to an Application
+ Accessing an Account with Google Tokens

### Creating a Social Directory for Google

A `Directory` is a top-level storage containers of `Accounts` in Stormpath. A `Directory` also manages security policies (like password strength) for the `Accounts` it contains.  Google Directories are a special type of `Directory` that holds Accounts for Google. 

{% docs note %}
Before you can create a Directory for Google, it is important that you gather information regarding your application from Google.  This information includes Client ID, Client Secret, Redirect URL and can be acquired from the developer consoles for [Google](https://console.developers.google.com/).
{% enddocs %}

Creating a directory for Google require that you provide information from Google as a `Provider` [resource](http://docs.stormpath.com/rest/product-guide/#google-provider-resource).  This information can be use to create the directories from the [Console](https://api.stormpath.com/ui/directories/create) or the following curl requests:

    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
         -H "Accept: application/json" \
         -H "Content-Type: application/json" \
         -d '{
                "name" : "my-google-directory",
                "description" : "A Google directory",
                "provider": {
                  "providerId": "google",
                  "clientId":"YOUR_GOOGLE_CLIENT_ID",
                  "clientSecret":"YOUR_GOOGLE_CLIENT_SECRET",
                  "redirectUri":"YOUR_GOOGLE_REDIRECT_URI"
                }
              }' \
     "https://api.stormpath.com/v1/directories"

Response:

    HTTP/1.1 201 Created
    Location: https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q
    Content-Type: application/json;charset=UTF-8;

    {
      "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q",
      "name" : "my-google-directory",
      "description" : "A Google directory",
      "status" : "ENABLED",
      "tenant" : {
        "href" : "https://api.stormpath.com/v1/tenants/Gh9238fksJlsieJkPkQuW"
      },
      "accounts" : {
        "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q/accounts"
      },
      "groups" : {
        "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q/groups"
      },
      "provider" : {
        "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q/provider"
      }
    }

### Mapping the Directory as an Account Store to an Application

Once a Google `Directory` has been created, it must be mapped to an application as an `Account Store`.  When an Account Store (which can be a `Directory` or `Group`) is mapped to an `Application`, the accounts in the account store are considered the application’s users and they can login to the application. 

Creating an Account Store Mapping can be done through the REST API, SDKs or Admin Console.

#### Admin Console

To manage Account Stores in the Console:

1. Log in to the Stormpath Admin Console
2. Click the *Applications* tab
3. Click the Application's name to which you want to add an Account Store
4. Click the *Account Stores* button in the tabbar
5. Select the Google Directory that was created
6. Click *Add Account Store*

#### REST API

Request:

    curl -X POST -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Content-Type: application/json;charset=UTF-8" \
         -d '{
               "application": {
                 "href": "YOUR_APPLICATION_HREF"
               }
               "accountStore": {
                 "href": "YOUR_GOOGLE_DIRECTORY_HREF"
               }
             }' \
         'https://api.stormpath.com/v1/accountStoreMappings'

Response:

    {
        "href": "https://api.stormpath.com/v1/accountStoreMappings/7Ui2gpn9tV75y3TExAmPLe",
        "accountStore": {
            "href": "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpExAmPLe"
        },
        "application": {
            "href": "https://api.stormpath.com/v1/applications/Uh8FzIouQ9C8EpcExAmPLe"
        },
        "listIndex": 0,
        "isDefaultAccountStore": false,
        "isDefaultGroupStore": false
    }

### Accessing an Account with Google Tokens

To access or create an account in an already created Google Directory, it is required to gather a Google Authorization Code on behalf of the user.  This requires leveraging Google's [OAuth 2.0 protocol](https://developers.google.com/accounts/docs/OAuth2Login) and the user's consent for your application's permissions.

Generically, this will include embedding a link in your site that will send an authentication request to Google. Once the user has authenticated, Google will redirect the response to your application, including the Authorization Code.  This is documented in detail [here](https://developers.google.com/accounts/docs/OAuth2Login#authenticatingtheuser).

Once the Authorization Code is gathered, you can get or create the `Account` by HTTP `POST`ing to the `Application` accounts collection and specifying the `providerData`.  The `providerData` JSON object specifies the type of provider and the authorization code as follows:

    {
      "providerId": "google",
      "code": "%ACCESS_CODE_FROM_GOOGLE%"
    }

The following is how you use `providerData` to get an `Account` for a given authorization code:

**Example Request**

    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
         -H "Accept: application/json" \
         -H "Content-Type: application/json" \
         -d '{
                "providerData": {
                  "providerId": "google",
                  "code": "YOUR_GOOGLE_AUTH_CODE"
                }
              }' \
     "https://api.stormpath.com/v1/applications/YOUR_APP_ID/accounts"

**Example Response**

    HTTP/1.1 201 Created
    Location: https://api.stormpath.com/v1/accounts/m0fw8GvxpM7n3pw6tyw9
    Content-Type: application/json;charset=UTF-8;

    {
        "customData": {
            "href": "https://api.stormpath.com/v1/accounts/m0fw8GvxpM7n3pw6tyw9/customData"
        },
        "directory": {
            "href": "https://api.stormpath.com/v1/directories/U0HJ7YcCeMpRfMcRT8ph"
        },
        "email": "testuser@gmail.com",
        "emailVerificationToken": null,
        "fullName": "Test User",
        "givenName": "Test",
        "groupMemberships": {
            "href": "https://api.stormpath.com/v1/accounts/m0fw8GvxpM7n3pw6tyw9/groupMemberships"
        },
        "groups": {
            "href": "https://api.stormpath.com/v1/accounts/m0fw8GvxpM7n3pw6tyw9/groups"
        },
        "href": "https://api.stormpath.com/v1/accounts/m0fw8GvxpM7n3pw6tyw9",
        "middleName": null,
        "providerData": {
            "href": "https://api.stormpath.com/v1/accounts/m0fw8GvxpM7n3pw6tyw9/providerData"
        },
        "status": "ENABLED",
        "surname": "User",
        "tenant": {
            "href": "https://api.stormpath.com/v1/tenants/GPpLzIzYkOO68I9i4dx"
        },
        "username": "testuser"
    }

{% docs note %}
The HTTP Status code when accessing an account based on a Google Authorization Code will denote if the account was created (201) or if it already existed in the Google Directory (200)
{% enddocs %}

{% docs note %}
To [expand](#link-expansion) the `providerData` to get the Access Token for the Account in one HTTP request, add `expand=providerData` to the URL query parameters.
{% enddocs %}

Once an `Account` is retrieved, Stormpath maps common fields for the Google User to the  Account.  The access token and the refresh token for any additional calls in the `providerData` resource and can be retrieved by:

    GET https://api.stormpath.com/v1/accounts/m0fw8GvxpM7n3pw6tyw9/providerData

The returned `providerData` will include:

    {
      "accessToken": "y29.1.AADN_Xo2hxQflWwsgCSK-WjSw1mNfZiv4", 
      "createdAt": "2014-04-01T17:00:09.154Z", 
      "href": "https://api.stormpath.com/v1/accounts/ciYmtETytH0tbHRBas1D5/providerData", 
      "modifiedAt": "2014-04-01T17:00:09.189Z", 
      "providerId": "google", 
      "refreshToken": "1/qQTS638g3ArE4U02FoiXL1yIh-OiPmhc"
    }

{% docs note %}
The `accessToken` can also be passed as a field for the `providerData` to access the account once it is retrieved
    POST https://api.stormpath.com/v1/applications/24mp4us71ntza6lBwlu/accounts
    Content-Type: application/json;charset=UTF-8

    {
      providerData: {
        "providerId": "google",
        "accessToken":"y29.1.AADN_Xo2hxQflWwsgCSK-WjSw1mNfZiv4"
      }
    }

{% enddocs %}

{% docs note %}
The `refreshToken` will only be present if your application asked for offline access.  Review Google's documentation for more information regarding OAuth offline access.
{% enddocs %}