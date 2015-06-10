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

### What is Token Based Authentication?

Token based authentication is a strategy to secure an application based on a security token that is generated for the user on authentication.  Since HTTP is considered __stateless__, if your application authenticates a user (one HTTP request) on the next HTTP request your application won't know who the user is.  This is of course if you pass some information to your application to tie the request to a user. Traditionally, this usually requires states to be stored on the server and a session identifier to be stored on the client.

Token Based Authentication is all about removing the need to store information on the server while giving extra security to keep the token secure on the client.  This help you as a developer build stateless / scalable applications or services.

Stormpath complies with OAuth 2.0 to provide this functionality.

### Why OAuth 2.0?

OAuth 2.0 is an authorization and authentication framework.  OAuth 2.0 provides a protocol to how to interact with a service that can delegate authentication or provide authorization.  OAuth 2.0 is prevalent, across many mobile and web applications today.  If you have ever logged into a website using Facebook or Google, you have used one of OAuth 2.0 many authorization flows. You can read more about the different OAuth 2.0 authorization flows or `grant types` in depth on [Stormpath's blog](https://stormpath.com/blog/what-the-heck-is-oauth/).

Even though, OAuth 2.0 supports many authorization grant types.  Stormpath currently supports:

+ Password Grant Type that grants the ability to get an Access Token based on a login and password
+ Refresh Grant Type that grants the ability to generate another Access Token based on a special Refresh Token
+ Client Credentials Grant Type (which is supported through the [API Key Management feature](/guides/api-key-management/))  that grants the ability to exchange an API Key for the Access Token

To be able to understand how to use Token Based Authentication, we need to talk about the different types of tokens that are available.

### What Tokens are available for Token Based Authentication?

For Token Based Authentication, there are a couple different types of tokens that need to be managed.  These are:

+ `Access Token`
+ `Refresh Token`

The `Access Token` is the token that grants access to a protected resource.  The `Access Token` that Stormpath generates for accounts on authentication is a JSON Web Token, or JWT.  This JWT has security built in to make sure that the `Access Token` is not tampered with on the client, and is only valid for a specific duration.  The `Refresh Token` is a special token that is used to generate additional `Access Token`s.  This allows you to have an short lived `Access Token` without having to collect credentials every single time you need a new `Access Token`

### How to use Stormpath for Token Based Authentication

Stormpath can be used to generate, manage, check, and revoke both access and refresh Tokens. But, before we start...

#### Configuration

Stormpath is configurable so you can set the time to live (TTL) for both the Access and Refresh tokens.  This is important for many applications because it gives the ability to define how the tokens expired.  For example, you could decide that your application requires a user to login daily, but the access should only live for 10 minutes.  Or, you could decide that for your application, users should be able to stay longed in for 2 months and the access token expires in an hour. 

Each `Application` in Stormpath has an OAuth Policy where you can define the TTLs for the tokens for that particular application.  By default, an application has a the following TTLs:

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

To update the `Access Token` and `Refresh Token` TTL, making a `POST` request to the application's oAuthPolicy with the updated values.  For example, if your application needs to b:

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
    "accessTokenTtl": "PT1H",
    "refreshTokenTtl": "P60D"
}

------
{% endcodetab %}



### Can I Modify the Time to Live for the Token?



