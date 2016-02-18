---
layout: doc
lang: guides
description: Stormpath guide
title: Using Stormpath for OAuth 2.0 and Access/Refresh Token Management
---

{% docs info %}
Currently supported in Stormpath's REST API.  Support for SDKs and Integrations is coming soon.  Reach out to us on support for an update.
{% enddocs %}

In this guide, we will discuss how to use Stormpath to authenticate your users for an `OAuth 2.0 Access Token`, and how to manage these tokens in Stormpath.

## What is Token Based Authentication?

Token based authentication is a strategy to secure an application based on a security token that is generated for the user on authentication.  Since HTTP is considered __stateless__, if your application authenticates a user (one HTTP request) on the next request your application won't know who the user is.  This is why many applications today pass some information to tie the request to a user. Traditionally, this information usually requires state to be stored on the server and a session identifier to be stored on the client.

Token Based Authentication is all about removing the need to store information on the server while giving extra security to keep the token secure on the client.  This help you as a developer build stateless / scalable applications or services.

Stormpath complies with OAuth 2.0 to provide this functionality.

## Why OAuth 2.0?

OAuth 2.0 is an authorization framework and provides a protocol to how to interact with a service that can delegate authentication or provide authorization.  OAuth 2.0 is prevalent across many mobile and web applications today.  If you have ever logged into a website using Facebook or Google, you have used one of OAuth 2.0 many authorization flows. You can read more about the different OAuth 2.0 authorization flows or `grant types` in depth on [Stormpath's blog](https://stormpath.com/blog/what-the-heck-is-oauth/).

Even though, OAuth 2.0 supports many authorization grant types.  Stormpath currently supports:

+ Password Grant Type that grants the ability to get an Access Token based on a login and password
+ Refresh Grant Type that grants the ability to generate another Access Token based on a special Refresh Token
+ Client Credentials Grant Type (which is supported through the [API Key Management feature](/guides/api-key-management/)) that grants the ability to exchange an API Key for the Access Token

To be able to understand how to use Token Based Authentication, we need to talk about the different types of tokens that are available.

## What Tokens are available for Token Based Authentication?

For Token Based Authentication, there are a couple different types of tokens that need to be managed.  These are:

+ `Access Token`
+ `Refresh Token`

The `Access Token` is the token that grants access to a protected resource.  The `Access Token` that Stormpath generates for accounts on authentication is a JSON Web Token, or JWT.  The JWT has security built in to make sure that the `Access Token` is not tampered with on the client, and is only valid for a specified duration.  The `Refresh Token` is a special token that is used to generate additional `Access Token`s.  This allows you to have an short lived `Access Token` without having to collect credentials every single time you need a new `Access Token`.

When using OAuth 2.0, the `Access Token` and `Refresh Token` are returned in the same response during the token exchange, this is called an `Access Token Response`.

## How to use Stormpath for Token Based Authentication

Stormpath can be used to generate, manage, check, and revoke both access and refresh Tokens. Before diving in, let's talk about configuration.

### Configuration

Stormpath is configurable so you can set the time to live (TTL) for both the access and refresh tokens.  This is important for many applications because it gives the ability to define how the tokens expired.  For example, you could decide that your application requires a user to login daily, but the access should only live for 10 minutes.  Or, you could decide that for your application, users should be able to stay longed in for 2 months and the access token expires in an hour.

Each `Application` in Stormpath has an `oAuthPolicy` link where the TTLs for the tokens for a particular application are kept.

    {
        "href": "https://api.stormpath.com/v1/applications/1p4R1r9UBMQz0eSFC6XZE6",
        ...
        "name": "My Application",
        "oAuthPolicy": {
            "href": "https://api.stormpath.com/v1/oAuthPolicies/5r0klomitodnOCuvESIP5z"
        }
    }

The values are stored and set as [`ISO 8601` durations](https://en.wikipedia.org/wiki/ISO_8601#Durationshttps://en.wikipedia.org/wiki/ISO_8601#Durations). The following durations are supported:

+ Seconds, for example `PT300S`
+ Minutes, for example `PT60M`
+ Hours, for example `PT24H`
+ Days, for example `P7D`
+ Weeks, for example `P4W`

By default, an `Application` has a the following TTLs:

+ Access Token: 1 hour (`PT1H`)
+ Refresh Token: 60 days (`PT60D`)

To get these values, you can query the `OAuth Policy` for an Application:


{% codetab id:get-oauth-policy langs:java curl node php ruby python%}
------
Application application = client.getResource(applicationHref, Application.class);
OauthPolicy oauthPolicy = application.getOauthPolicy();
------
curl -X GET \
     -u $API_KEY_ID:$API_KEY_SECRET \
     -H "Accept: application/json" \
     -H "Content-Type: application/json;charset=UTF-8" \
     "https://api.stormpath.com/v1/oAuthPolicies/5r0klomitodnOCuvESIP5z"

------
application.getOAuthPolicy(function(err, policy) {
  console.log('policy:', policy);
});
------
$oauthPolicy = $application->oauthPolicy;

//Return Type: Stormpath\Resource\OauthPolicy
------
oauth_policy = application.auth_policy
# returns Stormpath::Resource::OauthPolicy instance
------
application = client.applications.get(application_href)
application.oauth_policy
------
{% endcodetab %}

Response:

    {
        "href": "https://api.stormpath.com/v1/oAuthPolicies/5r0klomitodnOCuvESIP5z",
        "tokenEndpoint": {
                "href": "https://api.stormpath.com/v1/applications/5r0klomitodnOCuvESIP5z/oauth/token"
        },
        "accessTokenTtl": "PT1H",
        "refreshTokenTtl": "P60D"
    }

To update the `Access Token` and `Refresh Token` TTL, making a `POST` request to the application's oAuthPolicy with the updated values.  The valid valueFor example, if your application needs to have an shorter lived access and refresh token:

{% codetab id:set-oauth-policy langs:java curl node php ruby python%}
------
oauthPolicy.setAccessTokenTtl("P8D");
oauthPolicy.setRefreshTokenTtl("PT2M");
oauthPolicy.save();
------
curl -X GET \
     -u $API_KEY_ID:$API_KEY_SECRET \
     -H "Accept: application/json" \
     -H "Content-Type: application/json;charset=UTF-8" \
     -d '{
            "accessTokenTtl": "PT30M",
            "refreshTokenTtl": "P7D"
        }' \
     "https://api.stormpath.com/v1/oAuthPolicies/5r0klomitodnOCuvESIP5z"

------
application.getOAuthPolicy(function(err, policy) {
  policy.accessTokenTtl = 'PT30M';
  policy.refreshTokenTtl = 'P7D';
  policy.save(function(err, updatedPolicy) {
    console.log(updatedPolicy);
  });
------
$oauthPolicy = $application->oauthPolicy;
$oauthPolicy->accessTokenTtl = 'PT1H';
$oauthPolicy->refreshTokenTtl = 'P7D';
$oauthPolicy->save();
------
oauth_policy = application.oauth_policy
oauth_policy.access_token_ttl = 'PT1H'
oauth_policy.refresh_token_ttl = "P60D"
oauth_policy.save
------
oauth_policy.access_token_ttl = 'P8D'
oauth_policy.refresh_token_ttl = 'PT2M'
oauth_policy.save()
------
{% endcodetab %}

Response:

    {
        "href": "https://api.stormpath.com/v1/applications/5r0klomitodnOCuvESIP5z/oAuthPolicy",
        "tokenEndpoint": {
                "href": "https://api.stormpath.com/v1/applications/5r0klomitodnOCuvESIP5z/oauth/token"
        },
        "accessTokenTtl": "PT30M",
        "refreshTokenTtl": "P7D"
    }

Refresh tokens are optional, if you would like to disable the refresh token from being generated, set a zero duration value (`PT0M`, `PT0S`, etc).

{% docs notes %}

The maximum duration for access and refresh tokens is 180 days (`P180D`).

{% enddocs %}

### Using Stormpath to Generate an OAuth 2.0 Access Tokens

Stormpath can generate Access Tokens using OAuth 2.0 password grant flow.  Stormpath exposes an endpoint off of each Stormpath `Application` to support the OAuth 2.0 protocol:

    https://api.stormpath.com/v1/applications/$YOUR_APPLICATION_ID/oauth/token

This endpoint supports POST operations to generate a token for a valid username and password for the application.  This endpoint has the same validation as the `loginAttempt` endpoint.  Meaning that Stormpath will check to make sure that the username and password are valid, that the account is in an [`Account Store`](/rest/product-guide/#account-store-mappings) for the application, and that the account is in an `ENABLED` state.

Your application will act as a proxy to the Stormpath API.  For example:

1. The user inputs username and password into a form and clicks submit
2. Your application in turn takes the the username and password and formulates the OAuth 2.0 Access Token request to Stormpath
3. When Stormpath returns with the `Access Token Response`, you can then return the access token and/or the refresh token to the client.

Once your application receives the username and password for the user, you can request an for an `Access Token`.

Request:

{% codetab id:get-access-token langs:java curl node php ruby python%}
------
PasswordGrantRequest passwordGrantRequest = Oauth2Requests.PASSWORD_GRANT_REQUEST.builder()
  .setLogin("username@test.com")
  .setPassword("Password1!")
  .build();
OauthGrantAuthenticationResult oauthGrantAuthenticationResult = Authenticators.PASSWORD_GRANT_AUTHENTICATOR
  .forApplication(application)
  .authenticate(passwordGrantRequest);
------
curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "grant_type=password&username=tom@stormpath.com&password=Secret1"
    https://api.stormpath.com/v1/applications/$YOUR_APPLICATION_ID/oauth/token
------
var authenticator = new stormpath.OAuthAuthenticator(application);
  authenticator.authenticate({
    body: {
      grant_type: 'password',
      username: 'user@someemaildomain.com',
      password: '0wootIFY0!'
    }
  }, function(err, result){
    console.log(result.accessTokenResponse);
  });
------
$passwordGrant = new \Stormpath\Oauth\PasswordGrantRequest($_REQUEST['username'], $_REQUEST['password']);

$auth = new \Stormpath\Oauth\PasswordGrantAuthenticator($application);
$result = $auth->authenticate($passwordGrant);

//Return Type: Stormpath\Oauth\OauthGrantAuthenticationResult
------
pasword_grant = Stormpath::Oauth::PasswordGrantRequest.new(username, password)
result = application.authenticate_oauth(password_grant)
# returns Stormpath::Oauth::AccessToken instance
------
authenticator = PasswordGrantAuthenticator(application)
oauth_grant_authentication_result = authenticator.authenticate('username@test.com', 'Password1!')
------
{% endcodetab %}

{% docs note %}
It is possible to target token generation against a particular [`Application`'s `Account Store`](/rest/product-guide/#account-store-mappings).  To do so, specify the `Account Store`'s href as a parameter:

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

### Validating Access Tokens

Once an `Access Token` has been generated, the client will need to pass the bearer token to your application.

For example, if you have a route `https://yourapplication.com/secure-resource`, the client would access the resource by passing the access token:

    HTTP/1.1
    GET /secure-resource
    Host: https://yourapplication.com
    Authorization: Bearer 2YotnFZFEjr1zCsicMWpAA.adf4661fe6715ed477ZiTtPFMD0DyL6KhEg5RGg954193e68b63036.7ZiTtPFMD0DyL6KhEg5RGg

Once your application receives the request, the first thing to do is to validate that the token is valid.  There are different ways you can complete this task.

+ [Using Stormpath to Validate the Token](#using-stormpath-to-validate-the-token)
+ [Validate the Token Locally](#validate-the-token-locally)

The benefit of using Stormpath to validate the token through the REST API (or an SDK that is using the REST API) is that Stormpath can validate the token against the state of your application and account.  To illustrate the difference:

Validation Criteria | Locally | Stormpath
:---- | :---- | :----
Token hasn't been tampered with | yes | yes
Token hasn't expired | yes | yes
Token hasn't been revoked | no | yes
Account hasn't been disabled, and hasn't been deleted | no | yes
Issuer is Stormpath | yes | yes
Issuing application is still enabled, and hasn't been deleted | no | yes
Account is still in an account store for the issuing application | no | yes

Why is this important?  There are different goals for every application and the level of validation that each application needs may differ.  If you need to validate the state of the account / application or if you need to use  token revocation, then using Stormpath to validate the token is the obvious choice.  This does require an request to the Stormpath REST API.  If you only require that the token has not expired and has not been tampered with, you can validate the token locally and minimize the network request to Stormpath.

<a class="anchor" name="using-stormpath-to-validate-the-token"></a>
#### Using Stormpath to Validate Tokens

To see how to validate tokens with the Stormpath REST API, let's go back to the example where a user has already generated an access token. The user then attempts to access a secured resource by passing the access token in the `Bearer` header:

    HTTP/1.1
    GET /secure-resource
    Host: https://yourapplication.com
    Authorization: Bearer 2YotnFZFEjr1zCsicMWpAA.adf4661fe6715ed477ZiTtPFMD0DyL6KhEg5RGg954193e68b63036.7ZiTtPFMD0DyL6KhEg5RGg

The `Authorization` header specifies the `Bearer` token.  This token can be validated by a `HTTP GET` to your Stormpath `Application`'s `authTokens` endpoint:

    https://api.stormpath.com/v1/applications/$YOUR_APPLICATION_ID/authTokens/

Request:

{% codetab id:validate-token langs:java curl node php ruby python %}
------
JwtAuthenticationRequest jwtRequest = Oauth2Requests.JWT_AUTHENTICATION_REQUEST.builder()
  .setJwt(oauthGrantAuthenticationResult.getAccessTokenString())
  .build();
JwtAuthenticationResult jwtAuthenticationResult = Authenticators.JWT_AUTHENTICATOR
  .forApplication(application)
  .authenticate(jwtRequest);
------
curl -X GET --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
    https://api.stormpath.com/v1/applications/$YOUR_APPLICATION_ID/authTokens/2YotnFZFEjr1zCsicMWpAA.adf4661fe6715ed477ZiTtPFMD0DyL6KhEg5RGg954193e68b63036.7ZiTtPFMD0DyL6KhEg5RGg
------
var authenticator = new stormpath.OAuthAuthenticator(application);
authenticator.authenticate({
  headers: { authorization: 'Bearer: ' + token }
}, function(err, result) {
  result.getAccount(function(err, account) {
    console.log(account);
  });
});
------
 // You can pass in a JWT into the `verify` method as a string.  If not, it will look in the HTTP_AUTHORIZATION header for one, and then COOKIE with a name of access_token

$result = (new \Stormpath\Oauth\VerifyAccessToken($application))->verify();

// Return Type: Stormpath\Resource\AccessToken
------
Stormpath::Oauth::VerifyAccessToken.new(application).verify(authorization_token)
# returns Stormpath::Oauth::VerifyToken instance
------
authenticator = JwtAuthenticator(application)
jwt_authentication_result = authenticator.authenticate(oauth_grant_authentication_result.access_token.token)
------
{% endcodetab %}

If the access token can be validated, Stormpath will return a 302 to the ` Access Token` resource

Response:

    HTTP/1.1 302 Location Found
    Location: https://api.stormpath.com/v1/accessTokens/jr1zCsicMWpA661fe6715ed477ZiTtPFtPFMD0D

The location of the `Access Token` resource can be directly retrieved via to get information about the `Token`, `Account`, and `Application`.

Attribute | Description | Type | Valid Value
:----- | :----- | :---- | :----
`href` | The token's fully qualified URL | String | --
`account` | A link to the `Account` that the `Token` is associated with | Link | --
`application` | A link to the `Application` that the `Token` is associated with | Link | --
`jwt` | The compact JWT for the token | String | --
`expandedJwt` | The expanded JWT, this will describe the header, claims, and signature for the token. | --
`tenant` | A link to the `Tenant` that the `Token` is associated with | Link | --

To get the `Access Token`, follow the `302 Redirect` or issue a `GET` to the the resource href.

Request:

{% codetab id:get-access-token langs:java curl python %}
------
AccessToken accessToken = client.getDataStore().getResource(accessTokenHref, AccessToken.class);
------
curl -X GET --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
    https://api.stormpath.com/v1/accessTokens/74Zd80iW0cOhotjXH4GqM7
------
jwt_authentication_result.account
jwt_authentication_result.application
jwt_authentication_result.jwt
jwt_authentication_result.expanded_jwt
------
{% endcodetab %}

Response:

    {
        "account": {
            "href": "https://api.stormpath.com/v1/accounts/7NZxVy5rUS7Wg5vNSsTUac"
        },
        "application": {
            "href": "https://api.stormpath.com/v1/applications/1p4R1r9UBMQz0eSFC6XZE6"
        },
        "createdAt": "2015-06-24T21:42:27.535Z",
        "expandedJwt": {
            "claims": {
                "exp": 1435183947,
                "iat": 1435182147,
                "iss": "https://api.stormpath.com/v1/applications/1p4R1r9UBMQz0eSFC6XZE6",
                "jti": "74Zd80iW0cOhotjXH4GqM7",
                "rti": "zxRTYcdBDiTFQmNIVudTv",
                "sub": "https://api.stormpath.com/v1/accounts/7NZxVy5rUS7Wg5vNSsTUac"
            },
            "header": {
                "alg": "HS256",
                "kid": "78Z49RZ9M5GZLSUMXPN0HLU8K"
            },
            "signature": "qVmTZwkqXOvko5nOelIYfkq8gzIppLBNbPy64XW-WqQ"
        },
        "href": "https://api.stormpath.com/v1/accessTokens/74Zd80iW0cOhotjXH4GqM7",
        "jwt": "eyJraWQiOiI3OFo0OVJaOU01R1pMU1VNWFBOMEhMVThLIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiI3NFpkODBpVzBjT2hvdGpYSDRHcU03IiwiaWF0IjoxNDM1MTgyMTQ3LCJpc3MiOiJodHRwczovL3N0YWdpbmctYXBpLWIuc3Rvcm1wYXRoLmNvbS92MS9hcHBsaWNhdGlvbnMvMXA0UjFyOVVCTVF6MGVTRkM2WFpFNiIsInN1YiI6Imh0dHBzOi8vc3RhZ2luZy1hcGktYi5zdG9ybXBhdGguY29tL3YxL2FjY291bnRzLzdOWnhWeTVyVVM3V2c1dk5Tc1RVYWMiLCJleHAiOjE0MzUxODM5NDcsInJ0aSI6Inp4UlRZY2RCRGlURlFtTklWdWRUdiJ9.qVmTZwkqXOvko5nOelIYfkq8gzIppLBNbPy64XW-WqQ",
        "tenant": {
            "href": "https://api.stormpath.com/v1/tenants/1nxg7TyvjHucV2p7z214Fa"
        }
    }

{% docs note %}
If you need to get the `Account` and/or `Application` information with the `Access Token`, you can use [expansion](http://docs.stormpath.com/rest/product-guide/#link-expansion).  For example:

    https://api.stormpath.com/v1/accessTokens/jr1zCsicMWpA661fe6715ed477ZiTtPFtPFMD0D?expand=account,application
{% enddocs %}


<a class="anchor" name="validate-the-token-locally"></a>
#### Validating the Token Locally

To see how to validate tokens locally, let's go back to the example where a user has already generated an access token. The user then attempts to access a secured resource by passing the access token in the `Bearer` header:

    HTTP/1.1
    GET /secure-resource
    Host: https://yourapplication.com
    Authorization: Bearer 2YotnFZFEjr1zCsicMWpAA.adf4661fe6715ed477ZiTtPFMD0DyL6KhEg5RGg954193e68b63036.7ZiTtPFMD0DyL6KhEg5RGg

The `Authorization` header specifies the `Bearer` token.  This token is a JSON Web Token (JWT) that has been digitally signed with the Stormpath `API Key` Secret that was used to [generate the token](#using-stormpath-to-generate-an-oauth-20-access-tokens).  This means that you can use a JWT library to validate the token locally if necessary.

To use a JWT library to validate the token:

{% codetab id:get-access-token langs:java node php ruby python %}
------
JwtAuthenticationRequest jwtRequest = Oauth2Requests.JWT_AUTHENTICATION_REQUEST.builder()
  .setJwt(oauthGrantAuthenticationResult.getAccessTokenString())
  .build();
JwtAuthenticationResult jwtAuthenticationResult = Authenticators.JWT_AUTHENTICATOR
  .forApplication(application)
  .withLocalValidation()
  .authenticate(jwtRequest);
------
// This sample uses NJWT a Node JWT Library (https://github.com/jwtk/jjwt)

var nJwt = require('nJwt');

var bearerToken = "eyJraWQiOiI0TElJMTM3MVRZUkxWVUU5QjJSVU1JRDMwIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiIyZHk1a09HTVBGd3FPR3VLVnZscWpKIiwiaWF0IjoxNDM1MTY2NDQxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvdjEvYXBwbGljYXRpb25zLzNBZ2ExdWZHbFhnVGJLUWZvdmt5ZjMiLCJzdWIiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvdjEvYWNjb3VudHMvMWVQQmdWa3hDVm1meVJRYzV0UVpDRCIsImV4cCI6MTQzNTE2NzA0MSwicnRpIjoiMmRzTkUyRExRWkpnTE9MRzhwclJsaCJ9.fq-6BUHM5MBOoas2EGZepEib6RTwh6V6MnbDLe8rThs";

nJwt.verify(bearerToken, "$STORMPATH_API_KEY_SECRET", function(err, verifiedJwt) {
    if(err){
        console.log(err); // Token has expired, has been tampered with, etc
    }else{
        console.log(verifiedJwt); // Will contain the header and body
    }
});

------
// You can pass in a JWT into the `verify` method as a string.  If not, it will look in the HTTP_AUTHORIZATION header for one, and then COOKIE with a name of access_token

$result = (new \Stormpath\Oauth\VerifyAccessToken($application))->withLocalValidation->verify();
------
require(‘jwt’)

begin
    verified_jwt = JWT.decode(token, stormpath_api_key_secret)
rescue JWT::InvalidJtiError => error
    # handle error
end
------
authenticator = JwtAuthenticator(application)
jwt_authentication_result = authenticator.authenticate(oauth_grant_authentication_result.access_token.token, local_validation=True)
------
{% endcodetab %}

### Refreshing Access Tokens

Passing access tokens allows access to resources in your application.  But what happens when the `Access Token` expires?  You could require the user to authenticate again, or use the `Refresh Token` to get a new `Access Token` without requiring credentials.

{% docs warning %}
If using a `Refresh Token` in a web application, it is important NOT to expose the refresh token through javascript.
{% enddocs %}

To get a new `Access Token` to for a `Refresh Token`, you must first make sure that the [application has been configured](#configuration) to generate a `Refresh Token` in the `OAuth 2.0 Access Token Response`.

Once your application has a `Refresh Token`, you can pass the token to your Stormpath Application's `tokenEndpoint` using the `refresh_token` OAuth 2.0 grant type.


{% codetab id:refresh-access-token langs:java curl node php ruby python %}
------
RefreshGrantRequest refreshRequest = Oauth2Requests.REFRESH_GRANT_REQUEST.builder()
  .setRefreshToken(oauthGrantAuthenticationResult.getRefreshTokenString())
  .build();
OauthGrantAuthenticationResult result = Authenticators.REFRESH_GRANT_AUTHENTICATOR
  .forApplication(application)
  .authenticate(refreshRequest);
------
curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "grant_type=refresh_token&refresh_token=$REFRESH_TOKEN"
    https://api.stormpath.com/v1/applications/$YOUR_APPLICATION_ID/oauth/token
------
var authenticator = new stormpath.OAuthAuthenticator(application);
authenticator.authenticate({
  body: {
    grant_type: 'refresh_token',
    refresh_token: 'YOUR_REFRESH_TOKEN_JWT'
  }
}, function(err, result) {
  console.log(result.accessTokenResponse);
});
------
$refreshGrant = new \Stormpath\Oauth\RefreshGrantRequest($_REQUEST['refresh_token']);

$auth = new \Stormpath\Oauth\RefreshGrantAuthenticator($application);
$result = $auth->authenticate($refreshGrant);

// Return Type: Stormpath\Oauth\OauthGrantAuthenticationResult
------
refresh_grant = Stormpath::Oauth::RefreshGrantRequest.new(refresh_token)
result = application.authenticate_oauth(refresh_grant)
# returns Stormpath::Oauth::AccessToken instance
------
authenticator = RefreshGrantAuthenticator(application)
result = authenticator.authenticate(oauth_grant_authentication_result.refresh_token)
------
{% endcodetab %}

Response:

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8
    Cache-Control: no-store
    Pragma: no-cache

    {
        "access_token":"2YotnFZFEjr1zCsicMWpAA.adf4661fe6715ed477ZiTtPFMD0DyL6KhEg5RGg954193e68b63036.7ZiTtPFMD0DyL6KhEg5RGg",
        "refresh_token": "$REFRESH_TOKEN",
        "token_type": "Bearer"
        "expires_in": 3600,
        "stormpath_access_token_href": "https://api.stormpath.com/v1/accessTokens/r0klomitodnOCuvESIP5"
    }

When Stormpath generates a new `Access Token` for a `Refresh Token` it does not generate or modify the expiration time of the `Refresh Token`.  This means that once the Refresh Token expires, the user must authenticate again to get a new `Access Token` and `Refresh Token`

### Using Stormpath to Revoke Access and Refresh Tokens

Using `Access Token`s and `Refresh Token`s can control the access to your application. In some cases it is needed to revoke these tokens.  This is important under a couple different scenarios:

+ The user has explicitly logged out, and your application needs to revoke their access, requiring authentication again
+ The application, device, client has been compromised and you need to revoke tokens for an account.

When [validating the tokens with Stormpath](#using-stormpath-to-validate-the-token), Stormpath will validate that the token has not been revoked before returning successfully.  Revoking tokens in Stormpath is as simple as deleting the token resource.

To get the token resource href to delete the access tokens / refresh tokens for an account, you can get the [collection](http://docs.stormpath.com/rest/product-guide/#collection-resources) from the account's `accessTokens` and `refreshTokens` collection:

    {
        "accessTokens": {
            "href": "https://.stormpath.com/v1/accounts/7NZxVy5rUS7Wg5vNSsTUac/accessTokens"
        },
        ...
        "refreshTokens": {
            "href": "https://.stormpath.com/v1/accounts/7NZxVy5rUS7Wg5vNSsTUac/refreshTokens"
        },
        ...
        "username": "tom@stormpath.com"
    }

The `accessTokens` and `refreshTokens` links on an account that be queried for a particular application.  This is accomplished by passing the Application's href as a query parameter

For example:

{% codetab id:get-tokens-for-account langs:curl python %}
------
curl -X GET --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
    https://.stormpath.com/v1/accounts/7NZxVy5rUS7Wg5vNSsTUac/accessTokens?application.href=https://api.stormpath.com/v1/applications/1p4R1r9UBMQz0eSFC6XZE6
------
application.auth_tokens
------
{% endcodetab %}

Response:

    {
        "href": "https://api.stormpath.com/v1/accounts/7NZxVy5rUS7Wg5vNSsTUac/accessTokens",
        "items": [
            {
                "account": {
                    "href": "https://api.stormpath.com/v1/accounts/7NZxVy5rUS7Wg5vNSsTUac"
                },
                "application": {
                    "href": "https://api.stormpath.com/v1/applications/1p4R1r9UBMQz0eSFC6XZE6"
                },
                "createdAt": "2015-06-24T21:36:52.684Z",
                "expandedJwt": {
                    "claims": {
                        "exp": 1435183612,
                        "iat": 1435181812,
                        "iss": "https://api.stormpath.com/v1/applications/1p4R1r9UBMQz0eSFC6XZE6",
                        "jti": "zxa7fCzt2etCTce2RWIv5",
                        "rti": "zxRTYcdBDiTFQmNIVudTv",
                        "sub": "https://api.stormpath.com/v1/accounts/7NZxVy5rUS7Wg5vNSsTUac"
                    },
                    "header": {
                        "alg": "HS256",
                        "kid": "78Z49RZ9M5GZLSUMXPN0HLU8K"
                    },
                    "signature": "da8G6xRUVird3MnG8HYTleDtXbwhqUfFK8KUvK8HDYI"
                },
                "href": "https://api.stormpath.com/v1/accessTokens/zxa7fCzt2etCTce2RWIv5",
                "jwt": "eyJraWQiOiI3OFo0OVJaOU01R1pMU1VNWFBOMEhMVThLIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJ6eGE3ZkN6dDJldENUY2UyUldJdjUiLCJpYXQiOjE0MzUxODE4MTIsImlzcyI6Imh0dHBzOi8vc3RhZ2luZy1hcGktYi5zdG9ybXBhdGguY29tL3YxL2FwcGxpY2F0aW9ucy8xcDRSMXI5VUJNUXowZVNGQzZYWkU2Iiwic3ViIjoiaHR0cHM6Ly9zdGFnaW5nLWFwaS1iLnN0b3JtcGF0aC5jb20vdjEvYWNjb3VudHMvN05aeFZ5NXJVUzdXZzV2TlNzVFVhYyIsImV4cCI6MTQzNTE4MzYxMiwicnRpIjoienhSVFljZEJEaVRGUW1OSVZ1ZFR2In0.da8G6xRUVird3MnG8HYTleDtXbwhqUfFK8KUvK8HDYI",
                "tenant": {
                    "href": "https://api.stormpath.com/v1/tenants/1nxg7TyvjHucV2p7z214Fa"
                }
            },
            {
                "account": {
                    "href": "https://api.stormpath.com/v1/accounts/7NZxVy5rUS7Wg5vNSsTUac"
                },
                "application": {
                    "href": "https://api.stormpath.com/v1/applications/1p4R1r9UBMQz0eSFC6XZE6"
                },
                "createdAt": "2015-06-24T21:42:27.535Z",
                "expandedJwt": {
                    "claims": {
                        "exp": 1435183947,
                        "iat": 1435182147,
                        "iss": "https://api.stormpath.com/v1/applications/1p4R1r9UBMQz0eSFC6XZE6",
                        "jti": "74Zd80iW0cOhotjXH4GqM7",
                        "rti": "zxRTYcdBDiTFQmNIVudTv",
                        "sub": "https://api.stormpath.com/v1/accounts/7NZxVy5rUS7Wg5vNSsTUac"
                    },
                    "header": {
                        "alg": "HS256",
                        "kid": "78Z49RZ9M5GZLSUMXPN0HLU8K"
                    },
                    "signature": "qVmTZwkqXOvko5nOelIYfkq8gzIppLBNbPy64XW-WqQ"
                },
                "href": "https://api.stormpath.com/v1/accessTokens/74Zd80iW0cOhotjXH4GqM7",
                "jwt": "eyJraWQiOiI3OFo0OVJaOU01R1pMU1VNWFBOMEhMVThLIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiI3NFpkODBpVzBjT2hvdGpYSDRHcU03IiwiaWF0IjoxNDM1MTgyMTQ3LCJpc3MiOiJodHRwczovL3N0YWdpbmctYXBpLWIuc3Rvcm1wYXRoLmNvbS92MS9hcHBsaWNhdGlvbnMvMXA0UjFyOVVCTVF6MGVTRkM2WFpFNiIsInN1YiI6Imh0dHBzOi8vc3RhZ2luZy1hcGktYi5zdG9ybXBhdGguY29tL3YxL2FjY291bnRzLzdOWnhWeTVyVVM3V2c1dk5Tc1RVYWMiLCJleHAiOjE0MzUxODM5NDcsInJ0aSI6Inp4UlRZY2RCRGlURlFtTklWdWRUdiJ9.qVmTZwkqXOvko5nOelIYfkq8gzIppLBNbPy64XW-WqQ",
                "tenant": {
                    "href": "https://api.stormpath.com/v1/tenants/1nxg7TyvjHucV2p7z214Fa"
                }
            }
        ],
        "limit": 25,
        "offset": 0,
        "size": 2
    }

{% docs note %}
Querying the account's `accessTokens` or `refreshTokens` by `Application` href is optional.  If you would like to get tokens across all applications, do not include the `application.href` query parameter.
{% enddocs %}

To revoke the tokens, you iterate over the collection, collect the href for the token and issue a `HTTP Delete`

For example:

{% codetab id:delete-access-token langs:java curl node php ruby python %}
------
AccessToken accessToken = oauthGrantAuthenticationResult.getAccessToken();
accessToken.delete();
------
curl -X DELETE --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
    https://api.stormpath.com/v1/accessTokens/74Zd80iW0cOhotjXH4GqM7
------
token.delete(function(err) { console.log('deleted token'); });
------
$token = AccessToken::get($tokenHref);
$token->delete();
------
Stormpath::Resource::AccessToken.get href
access_token.delete
------
jwt_authentication_result.delete()
------
{% endcodetab %}

Response:

    HTTP/1.1 204 No Content

When the token is deleted from Stormpath, attempting to validate the the deleted token in Stormpath will return the following error:

    {
        "code": "404",
        "status": "10013",
        "message": "Token is invalid",
        "developerMessage": "Token does not exist. This can occur if the token has been manually deleted, or if the token has expired and removed by Stormpath"
    }

## Wrapping it up

In this guide, we discussed how to set up and use Stormpath to generate and manage OAuth 2.0 Access Tokens and Refresh Tokens. If you have any questions, bug reports, or enhancement requests please email support@stormpath.com.
