---
layout: doc
lang: guides
description: Stormpath guide 
title: Using Stormpath for OAuth 2.0 and Access/Refresh Token Management
---

{% docs info %} 
Currently supported Stormpath's REST API.  Support for SDKs and Integrations is coming soon.  Reach out to us on support for an update.
{% enddocs %}

In this guide, we will discuss how to use Stormpath to authenticate your users for an access token, how to manage the tokens in Stormpath, and how to provide token based authentication for your application and API endpoints.

## What is Token Based Authentication?

Token based authentication is a strategy to secure an application based on a security token that is generated for the user on authentication.  Since HTTP is considered __stateless__, if your application authenticates a user (one HTTP request) on the next HTTP request your application won't know who the user is.  This is of course if you pass some information to your application to tie the request to a user. Traditionally, this usually requires states to be stored on the server and a session identifier to be stored on the client.

Token Based Authentication is all about removing the need to store information on the server while giving extra security to keep the token secure on the client.  This help you as a developer build stateless / scalable applications or services.

Stormpath complies with OAuth 2.0 to provide this functionality.

## Why OAuth 2.0?

OAuth 2.0 is an authorization and authentication framework.  OAuth 2.0 provides a protocol to how to interact with a service that can delegate authentication or provide authorization.  OAuth 2.0 is prevalent, across many mobile and web applications today.  If you have ever logged into a website using Facebook or Google, you have used one of OAuth 2.0 many authorization flows. You can read more about the different OAuth 2.0 authorization flows or `grant types` in depth on [Stormpath's blog](https://stormpath.com/blog/what-the-heck-is-oauth/).

Even though, OAuth 2.0 supports many authorization grant types.  Stormpath currently supports:

+ Password Grant Type that grants the ability to get an Access Token based on a login and password
+ Refresh Grant Type that grants the ability to generate another Access Token based on a special Refresh Token
+ Client Credentials Grant Type (which is supported through the [API Key Management feature](/guides/api-key-management/))  that grants the ability to exchange an API Key for the Access Token

To be able to understand how to use Token Based Authentication, we need to talk about the different types of tokens that are available.

## What Tokens are available for Token Based Authentication?

For Token Based Authentication, there are a couple different types of tokens that need to be managed.  These are:

+ `Access Token`
+ `Refresh Token`

The `Access Token` is the token that grants access to a protected resource.  The `Access Token` that Stormpath generates for accounts on authentication is a JSON Web Token, or JWT.  The JWT has security built in to make sure that the `Access Token` is not tampered with on the client, and is only valid for a specified duration.  The `Refresh Token` is a special token that is used to generate additional `Access Token`s.  This allows you to have an short lived `Access Token` without having to collect credentials every single time you need a new `Access Token`. 

## How to use Stormpath for Token Based Authentication

Stormpath can be used to generate, manage, check, and revoke both access and refresh Tokens. 

### Configuration

Stormpath is configurable so you can set the time to live (TTL) for both the Access and Refresh tokens.  This is important for many applications because it gives the ability to define how the tokens expired.  For example, you could decide that your application requires a user to login daily, but the access should only live for 10 minutes.  Or, you could decide that for your application, users should be able to stay longed in for 2 months and the access token expires in an hour. 

Each `Application` in Stormpath has an OAuth Policy where you can define the TTLs for the tokens for that particular application.  The values are stored and set as [`ISO 8601` durations](https://en.wikipedia.org/wiki/ISO_8601#Durationshttps://en.wikipedia.org/wiki/ISO_8601#Durations). By default, an application has a the following TTLs:

+ Access Token: 1 hour
+ Refresh Token: 60 days

To get these values by getting the OAuth Policy for an Application:

{% codetab id:get-oauth-policy langs:curl %}
------
curl -X GET \
     -u $API_KEY_ID:$API_KEY_SECRET \
     -H "Accept: application/json" \
     -H "Content-Type: application/json;charset=UTF-8" \
     "https://api.stormpath.com/v1/applications/$YOUR_APPLICATION_ID/oAuthPolicy"

//returns

{
    "href": "https://api.stormpath.com/v1/applications/5r0klomitodnOCuvESIP5z/oAuthPolicy",
    "tokenEndpoint": { 
            "href": "https://api.stormpath.com/v1/applications/5r0klomitodnOCuvESIP5z/oauth/token"
    },
    "accessTokenTtl": "PT1H",
    "refreshTokenTtl": "P60D"
}

------
{% endcodetab %}

To update the `Access Token` and `Refresh Token` TTL, making a `POST` request to the application's oAuthPolicy with the updated values.  The valid valueFor example, if your application needs to have an shorter lived access and refresh token:

{% codetab id:set-oauth-policy langs:curl %}
------
curl -X GET \
     -u $API_KEY_ID:$API_KEY_SECRET \
     -H "Accept: application/json" \
     -H "Content-Type: application/json;charset=UTF-8" \
     -d '{
            "accessTokenTtl": "PT30M",
            "refreshTokenTtl": "P7D"
        }' \
     "https://api.stormpath.com/v1/applications/$YOUR_APPLICATION_ID/oAuthPolicy"

//returns

{
    "href": "https://api.stormpath.com/v1/applications/5r0klomitodnOCuvESIP5z/oAuthPolicy",
    "tokenEndpoint": { 
            "href": "https://api.stormpath.com/v1/applications/5r0klomitodnOCuvESIP5z/oauth/token"
    },
    "accessTokenTtl": "PT30M",
    "refreshTokenTtl": "P7D"
}

------
{% endcodetab %}

Refresh tokens are optional, if you would like to disable the refresh token from being generated, set a zero duration value (`PT0M`, `PT0S`, etc).

{% docs notes %}

The maximum duration for access and refresh tokens is 180 days (`P180D`).

{% enddocs %}

### Using Stormpath to Generate an OAuth 2.0 Access Tokens

Stormpath can generate Access Tokens using OAuth 2.0 password grant flow.  Stormpath exposes an endpoint off of each Stormpath `Application` to support the OAuth 2.0 protocol:

    https://api.stormpath.com/v1/applications/$YOUR_APPLICATION_ID/oauth/token

This endpoint supports POST operations to generate a token for a valid username, password pair for the application.  This endpoint has the same validation as the `loginAttempt` endpoint.  Meaning that Stormpath will check to make sure that the username and password are valid, that the account is in an [`Account Store`](/rest/product-guide/#account-store-mappings) for the application, and that the account is in an `ENABLED` state.

Your application will act as a proxy to the client and Stormpath API.  For example:

1. The user inputs username and password into a form and clicks submit
2. Your application in turn takes the the username and password and formulates the OAuth 2.0 Access Token request to Stormpath
3. When Stormpath returns with the `Access Token` Response, you can then return the access token and/or the refresh token to the client.

Request:

{% codetab id:get-access-token langs:curl %}
------
    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "grant_type=password&username=tom@stormpath.com&password=Secret1"
        https://api.stormpath.com/v1/applications/$YOUR_APPLICATION_ID/oauth/token
------
{% endcodetab %}

{% docs note %}
It is possible to target token generation against an particular [`Application`'s `Account Store`](/rest/product-guide/#account-store-mappings).  To do so, specify the `Account Store`'s href as a parameter:

    grant_type=password&username=tom@stormpath.com&password=Secret1&accountStore=https://api.stormpath.com/v1/directories/1bcd23ec1d0a8wa6
{% enddocs %}

Response:

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8
    Cache-Control: no-store
    Pragma: no-cache

    {
        "access_token":"2YotnFZFEjr1zCsicMWpAA.adf4661fe6715ed477ZiTtPFMD0DyL6KhEg5RGg954193e68b63036.7ZiTtPFMD0DyL6KhEg5RGg",
        "refresh_token": "JIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxvaG4gRG9lIiwiYWRtaW4iOnRydWV9.eoaDVGTClRdfxUZXiPXqKxpLsts",
        "token_type": "Bearer"
        "expires_in": 3600,
        "stormpath_access_token_href": "https://api.stormpath.com/v1/accessTokens/r0klomitodnOCuvESIP5"
    }

The response is an `OAuth 2.0 Access Token Response` and includes the following:

+ `access_token` - A value denoting the access token for the response, as a JWT
+ `refresh_token` - A value denoting the refresh token that can be used to get refreshed Access Tokens, as a JWT
+ `token_type` - A value denoting the type of token returned.  
+ `expires_in` - A value denoting the time in seconds before the token expires
+ `stormpath_access_token_href` - A value denoting the href location of the token in Stormpath.

### Using Validate Access and Refresh Tokens

Once an `Access Token` has been generated, the client will need to pass the bearer token to your application. 

For example, if you have a route `https://yourapplication.com/secure-resource`, the client would access the resource by passing the access token:

    HTTP/1.1
    GET /secure-resource
    Host: https://yourapplication.com
    Authorization: Bearer 2YotnFZFEjr1zCsicMWpAA.adf4661fe6715ed477ZiTtPFMD0DyL6KhEg5RGg954193e68b63036.7ZiTtPFMD0DyL6KhEg5RGg

Once your application receives the request, the first thing to do is to validate that the token is valid.  There are a couple different ways you can complete this task.

+ [Using Stormpath to Validate the Token](#using-stormpath-to-validate-the-token)
+ [Validate the Token Locally](#validate-the-token-locally)

The benefit of using Stormpath to validate the token through the REST API (or an SDK that is using the REST API) is that Stormpath can validate the token against the state of your application and account.  To illustrate the difference:

Validation Criteria | Locally | Stormpath
:---- | :---- | :---- 
Account is still enabled, and hasn't been deleted | no | yes
Token is expired | yes | yes
Token has been revoked | no | yes
Issuer is not Stormpath | yes | yes
Issuing application is still enabled, and hasn't been deleted | no | yes
Account is still in an Account Store for the issuing application | no | yes

Why is this important?  There are different goals for every application and the level of validation that your application needs may differ.  If you need to validate the state of the account / application or if you need to use  token revocation, then using Stormpath to validate the token is the obvious choice.  This does require an request to the Stormpath REST API.  If you only require that the token isn't expired, you can validate the token locally and minimize the network request to Stormpath.

<a class="anchor" name="using-stormpath-to-validate-the-token"></a>
#### Using Stormpath to Validate Tokens

To see how to validate tokens with the Stormpath REST API, let's go back to the example where a user has already generated an access token. The user has attempted to access a secured resource by passing the access token in the `Bearer` header:

    HTTP/1.1
    GET /secure-resource
    Host: https://yourapplication.com
    Authorization: Bearer 2YotnFZFEjr1zCsicMWpAA.adf4661fe6715ed477ZiTtPFMD0DyL6KhEg5RGg954193e68b63036.7ZiTtPFMD0DyL6KhEg5RGg



<a class="anchor" name="validate-the-token-locally"></a>
#### Validating the Token Locally

### Refreshing Access Tokens

### Using Stormpath to Revoke Access and Refresh Tokens


