---
layout: doc
lang: guides
title: Using Stormpath to Secure and Manage API Services
---
{% docs info %}
 **This feature is currently in Beta.**  If you have any questions, bug reports, or enhancement requests please email support@stormpath.com. 
{% enddocs %}

{% docs info %}
Currently supported Stormpath SDKs for this feature include: **Java**
{% enddocs %}

{% docs note %}

Prerequisite:  Complete one of the [Quickstart Guides](http://docs.stormpath.com/home/).  This will get you familiar with Stormpath and will set up an `Application` to use with this guide.

{% enddocs %}

In this guide, we discuss how to set up Stormpath to manage and authenticate API Keys and Tokens for developers that are using your API Services.  Stormpath provides not only the user management piece around API Keys, but also allows you to associate permissions and custom data with the accounts for advanced use-cases.  

## What is Stormpath? 

Stormpath is a user management API that makes it easy for developers to launch applications and APIs with secure, scalable user infrastructure. It automates:

* User Account registration and login
* Authentication and authorization
* Flexible, secure user profile data
* Group and role management, including pre-built Role-Based Access Control (RBAC)
* Best-practice password security and data storage

You access Stormpath via a [beautiful](http://stormpath.com/blog/designing-rest-json-apis) REST+JSON API or our [language-specific SDKs](http://docs.stormpath.com).

## Why should I use Stormpath to Secure my API?

Stormpath makes it easy to secure your REST API by using best practices in  security. Stormpath provides an end-to-end solution for creating/managing accounts, reseting passwords, creating / managing API Keys , and generating OAuth 2.0 bearer tokens to support Access Token authentication.  Using one of the Stormpath SDKs and a few lines of code, you can quickly verify API Key and Secret and access the account associated with the API Key.

In the next sections, we will explain how to get set up and use Stormpath for API Key Management and Authentication. 

----

## How do I use Stormpath for API Key / Secret Management?

After you familiarize yourself with Stormpath with one of the [Quickstart](docs.stormpath.com) Guides, using Stormpath for API Key management is as simple as:

+ Creating Accounts in Stormpath
+ Creating and Managing API Keys for Accounts
+ Using an SDK to Authenticate and Generate Tokens for Securing your API

The general workflow here is when a user signs up for your API, and an account is created in Stormpath.  When the user logs into your API console, you can create, update, and delete API keys for your API using Stormpath.  When the developer sends their API key and secret to the your API, you can use Stormpath to return the account associated with the request keys

## Creating Accounts in Stormpath for your Developers

To start creating and authenticating API Keys in Stormpath, there needs to be accounts that represent the people that are developing against your API in Stormpath.  Accounts can represent your end users (developers), but they can also be used to represent services, daemons, processes, or any “entity” that needs to login to a Stormpath-enabled application. This will allow Stormpath to keep information about the `Account` such as email, password, and give the ability to generate API Keys and Secrets that are tied to a specific developer account.  

Accounts can be registered or created for a specific `Application`.  This will automatically add them to an account store that has access to the application. 

Registering an Account in Stormpath would occur when a developer signs up for your API.  Below is an example on how to create an account for an application:

    //Create the account object
    Account account = client.instantiate(Account.class);

    //Set the account properties
    account.setGivenName("Joe");
    account.setSurname("Stormtrooper");
    account.setUsername("tk421"); //optional, defaults to email if unset
    account.setEmail("tk421@stormpath.com");
    account.setPassword("Changeme1");
    CustomData customData = account.getCustomData();
    customData.put("favoriteColor", "white");

    //Create the account using the existing Application object
    application.createAccount(account);

## Creating and Managing API Keys / Secret Pairs for Accounts

After a developer has registered for your API, and has an account in Stormpath, they will need to generate an API Key to be used when accessing your API.  Each account will have an `apiKeys` property that will contain a collection of API Keys for an account.  This collection can be used for management of API Keys or displaying the API Keys to the owner of an `Account` on a website. 

### Creating API Keys for an Account

Creating an API Key is as simple as calling a method on the account.  This will create a new API Key (id and secret) that will be associated with the `Account`.  

    APIKey apiKey = account.createApiKey();

    String apiKeyId = apikey.getId();
    String apiKeySecret = apikey.getSecret();

The `ApiKey` returned will have the following properties:

Attribute | Description | Type | Valid Value
:----- | :----- | :---- | :----
`id` | The unique identifier for the API Key | String | <span>--</span>
`secret` | The name of the tenant. Unique across all tenants. | String | --
`status` | Human readable tenant key. Unique across all tenants. | ApiKeyStatus | ApiKeyStatus.ENABLED, ApiKeyStatus.DISABLED, 
`account` | A link to the ApiKey's applications. | Account | <span>--</span>
`tenant` | A link to the ApiKey's directories. | Tenant | <span>--</span>


After the API Key is created, you will need to deliver the API Key ID and Secret to the developer so they can start using them to access your API securely.  In most cases, this is done by displaying the API keys on a web page.  

## Using an SDK to Authenticate and Generate Tokens for Securing your API

Once API Keys have been created for accounts, your developers can use these keys to integrate with your API.  Stormpath provides SDK support to make this simple. Using the SDK, you can enable your API to accept the newly created keys, use best practices for security, and provide accountability / traceability of the clients using your API.

When a developer makes a call to your API, they will use the API Key and Secret that was created for them.  Using best practices, these will be passed in the `Authorization` header of the request and use HTTPS.

Stormpath supports two `Authorization` methods, Basic and Bearer (OAuth 2.0 client-credentials grant type).  In this section we will discuss the strategies and best practices using these authorization methods.

### How API Key and Token Authentication Works

Stormpath makes it simple to authenticate an API request. When you [retrieve an application](http://docs.stormpath.com/java/product-guide/#applications), you ask the `Application` to authenticate the `HttpServletRequest`.  Using  HTTP authorization headers, Stormpath can understand what type of authentication is occurring and can quickly decide if the authentication request is successful or not.  An example, if your API supports both Basic and OAuth 2.0, the Stormpath SDK will take the full request, read the authorization header data and provide the right type of authentication.

Consider that we are building a stormtrooper API for managing stormtrooper equipment.  We want to secure this by requiring that a developer using the API will pass the API Key and Secret base64 encoded in the authorization header. The developer request would resemble the following:

    GET /stormtroopers/tk421/equipment 
    Accept: application/json
    Authorization: Basic MzRVU1BWVUFURThLWDE4MElDTFVUMDNDTzpQSHozZitnMzNiNFpHc1R3dEtOQ2h0NzhBejNpSjdwWTIwREo5N0R2L1g4
    Host: api.stormtrooperapp.com

In the simplest form, the Stormpath Java SDK would authentication a request as follows:

    public void getEquipment(HttpServletRequest request, HttpServletResponse response) {
        Application application = client.getResource(applicationRestUrl, Application.class);

        ApiAuthenticationResult result = (ApiAuthenticationResult) application.authenticate(request).execute();

        //Get any account properties as needed
        String email = result.getAccount().getEmail();

        //Get any api key properties as needed
        String apiKeyId = result.getApiKey().getId();

        //Return what you need to return in the response
        handleEquipmentRequest(response);
    }

There are some important classes for providing `Basic` authentication for API Keys and Secrets include `ApiAuthenticationResult` and `ApiKey`.

`ApiAuthenticationResult` is a subclass of `AuthenticationResult` and will provide properties and methods for retrieving the authenticated `Account` and `ApiKey` for a successful authentication request.  Your API will use this information to provide context associated with who is calling your API.  This becomes important when your API has generic endpoints that return different information based on the callee, such as a call to `/my-equipment` that would return the stormtrooper equipment for the authenticated account.

The Stormpath SDK will provide a caching layer that will cache the API Key securely with the secret encrypted.  This caching layer is important for performance.  To reduce the network traffic to Stormpath and to provide fast response times for your API, Stormpath will use the cache entry for API Key and Secret authentication when possible.

### Exchanging API Keys for OAuth 2.0 Tokens

Stormpath Java SDK will enable your API to support OAuth 2.0 Bearer Tokens as a means of authentication. Stormpath explicitly supports OAuth 2.0 client credential grant type.  This workflow is represented as:

     +---------+                                  +---------------+
     |         |                                  |               |
     |         |>--- 1. Client Authentication --->| Authorization |
     | Client  |                                  |     Server    |
     |         |<--- 2. -- Access Token ---------<|               |
     |         |                                  |               |
     +---------+                                  +---------------+

 
1.  The client authenticates with the authorization server and requests an access token from the token endpoint.
2.  The authorization server authenticates the client, and if valid issues an access token.

Stormpath in this case is acting as the Authorization Server and will authenticate the client based on the API Key ID and Secret.  This allows you to generate an Access Token for a successful authentication result. 

Going back to the Stormtrooper equipment API example.  The Stormtrooper equipment app would require that a developer integrating to their API would need to call a REST endpoint to exchange a valid API Key and Secret for an Access Token.  The API Key and Secret would need to be base64 encoded in the request. An example of the REST call: 

    POST /oauth/token
    Accept: application/json
    Authorization: Basic MzRVU1BWVUFURThLWDE4MElDTFVUMDNDTzpQSHozZitnMzNiNFpHc1
    Content-Type: application/x-www-form-urlencoded
    Host: api.stormtrooperapp.com

    {
      "grant_type": "client_credentials"
    }

The important item to note here is that this request explicitly states that the grant type for the OAuth Access Token Request.  Stormpath only support client credential grant type for exchanging API Keys for Access Tokens.

Below is sample code to show how you would handle the request with the Stormpath Java SDK and return to the client a token that they requested:

    public void postOAuthToken(HttpServletRequest request, HttpServletResponse response) {
        Application application = client.getResource(applicationRestUrl, Application.class);

        BasicOAuthAuthenticationResult result = (BasicOAuthAuthenticationResult) application.authenticate(request).execute();

        TokenResponse token = result.getTokenResponse();

        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");

        response.getWriter().print(token.toJson());
        response.getWriter().flush();
    }

The response back to the requesting client:

    HTTP 200 OK
    Content-Type: application/json

    {
       "access_token":"7FRhtCNRapj9zs.YI8MqPiS8hzx3wJH4.qT29JUOpU64T",
       "token_type":"bearer",
       "expires_in":3600
    }

Important classes for exchanging an API Key and Secret for an Access Token are `BasicOAuthAuthenticationResult` and `TokenResponse`.

`BasicOAuthAuthenticationResult` is a subclass of `ApiAuthenticationResult` that has an additional getter for the `TokenResponse`.

The `TokenResponse` contains properties associated with the generated token for an authenticated request.  This includes the Access Token, expiration, and token type.  This allows the client to decide if they can use the token. `TokenRepsonse` as a utility method `toJson()` which will return JSON representation of the token that conforms to OAuth 2.0 specification.

### Using OAuth as Authentication for your REST API

After you have configured and can return an OAuth Access Token a developer using your API service, they can start using the OAuth Access Token to validate authentication to your service.

Stormpath requires that the developer send the Access Token in the Authorization header of the request.  

For example, consider that we are building a stormtrooper API for managing stormtrooper equipment.  We want to secure this by requiring that a developer using the API exchange his API Key and Secret for an Access Token and then pass the Access Token to gain access to API calls. 

The developer request would resemble the following:

    GET /stormtroopers/tk421/equipment 
    Accept: application/json
    Authorization: Bearer 7FRhtCNRapj9zsYI8MqPiS8hzx3wJH4qT29JUOpU64T
    Host: api.stormtrooperapp.com

The important item to note here is that the Access Token is passed to your API in the Authorization header, using the Bearer method.

In the simplest form, the Stormpath Java SDK would authentication a request as follows:

    public void getEquipment(HttpServletRequest request, HttpServletResponse response) {
        Application application = client.getResource(applicationRestUrl, Application.class);

        OauthAuthenticationResult result = (OauthAuthenticationResult) application.authenticateOauth(request).execute();

        ApiKey apiKey = result.getApiKey();
        Account account = result.getAccount();

        //Return what you need to return in the response
        handleEquipmentRequest(response);
    }


`OauthAuthenticationResult` is a subclass of `ApiAuthenticationResult` that will give you access to methods to get the `Account`, `ApiKey` and the scope (if set).

### Customizing Time-to-live and Scope for OAuth API Authentication 

Exchanging API Keys for OAuth 2.0 Tokens can be customized to increase / decrease the TTL of the token or allow the client integrating with your API to request an optional scope for the Access Token. 

Using Stormpath will automatically set a time-to-live (TTL) of one hour (3600 seconds) and does not embed scope into the OAuth 2.0 Access Token.  These are both customizable using the Stormpath Java SDK.

#### Time-to-live

When an API Key is exchanged for a Access Token, the Access Token has a time-to-live in relation to when the it was created.

Customizing the TTL is as simple as specifying the TTL when authenticating for OAuth.

    result = application.authenticateOauth(request).withTtl(7200).execute();

{% docs note %}
When modifying the TTL, it is important that you understand the TTL in relation to Stormpath's SDK caching TTL.  Since the cache TTL is configured during the Stormpath SDK client initialization, it is important that it is greater than the TTL that you set for the Access Token.  This will ensure that the Access Token is not invalidated by the cache TTL.
{% enddocs %}

#### Scope

When exchanging a API Key for an Access Token, the client requesting the Access Token may request additional permissions for the Access Token.  This is called scope in OAuth.  For example, in our stormtrooper equipment REST API, a client may request for a 'view_others_equipment' scope, which will allow a client to view other stormtroopers equipment other than his own.

{% docs note %}

Scopes are defined by the API and are application specific, They are usually described to clients integrating with the API through documentation. For example, Facebook and Heroku both use OAuth, but have different scopes for their OAuth Tokens.  You would not expect clients integrating with Heroku to ask for a post_to_my_wall scope.

{% enddocs %}

The authorization server, will make the final decision if the scope will be granted in the token, and the Stormpath SDK gives you the tools to make the decision in code.

To illustrate how this happens, let's look at the following request for an Access Token:

    POST /oauth/token
    Accept: application/json
    Authorization: Basic MzRVU1BWVUFURThLWDE4MElDTFVUMDNDTzpQSHozZitnMzNiNFpHc1R3dEtOQ2h0NzhBejNpSjdwWTIwREo5N0R2L1g4
    Content-Type: application/x-www-form-urlencoded
    Host: api.stormtrooperapp.com

    {
      "grant_type": "client_credentials",
      "scope": "view_others_equipment admin"
    }

We know that this is a request for an Access Token, because the client included a grant_type parameter.  They also requested that the Access Token be granted the scopes of `view_others_equipment` and `admin`.  Note that scope is space-delimited.

When the API exchanges the API Key for an Access Token, you can specify a `ScopeFactory` that will help you create an Access Token with the correct scopes.

For example:

    public void processOAuthTokenRequest(HttpServletRequest request, HttpServletResponse response) {
        Application application = client.getResource(applicationRestUrl, Application.class);

        ScopeFactory scopeFactory = new ScopeFactory(){
              public Set<String> createScope(AuthenticationResult result, Set<String> requestedScopes) {

                //Initialize an empty set, and get the account
                HashSet<String> returnedScopes = new HashSet<String>();
                Account account = result.getAccount();

                //For each request scope, we want to compare it to see if the account has a group of the same name
                for(String scope: requestedScopes){
                  if(account.isMemberOfGroup(scope)){
                    returnedScopes.add(scope);
                  }
                }

                return returnedScopes;
              }
            };

        BasicOAuthAuthenticationResult result;
        result = (BasicOAuthAuthenticationResult) application.authenticateOauth(request).using(scopeFactory)execute();

        TokenResponse token = result.getTokenResponse();

        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");

        response.getWriter().print(token.toJson());
        response.getWriter().flush();
    }


In the code above, we validate that the account is included in a `Group` with the same name as the scope.  This is one way you can verify the scope requested, but your application may have another means to verify the requested scope.

If the `Account` is a member of a `Group` named 'admin' and 'view_others_equipment', the response for the above code would return the granted scopes to the client:

    HTTP 200 OK
    Content-Type: application/json

    {
       "access_token":"7FRhtCNRapj9zsYI8MqPiS8hzx3wJH4qT29JUOpU64T",
       "token_type":"bearer",
       "scope": "view_others_equipment admin",
       "expires_in":3600
    }

The default `ScopeFactory` used does not include any scope, so if you need to include Scope in the Access Token, you must implement how to validate the requested scope.

When this token is used in a resulting request, such as:

    GET /stormtroopers/tk329/equipment 
    Accept: application/json
    Authorization: Bearer 7FRhtCNRapj9zsYI8MqPiS8hzx3wJH4qT29JUOpU64T
    Content-Type: application/json
    Host: api.stormtrooperapp.com

You can retrieve the granted scopes from the token when having the SDK authenticate the request:

    public void getEquipment(HttpServletRequest request, HttpServletResponse response) {
        Application application = client.getResource(applicationRestUrl, Application.class);

        OauthAuthenticationResult result = (OauthAuthenticationResult) application.authenticateOauth(request).execute();

        if(result.getScopes().contains("admin")){
          //This authentication result includes the scope for admin, let's do something special...
          handleEquipmentRequestForAdmin(response);
        } else{

          //Return what you need to return in the response
          handleEquipmentRequest(response);
        }
    }

### Stormpath Authentication Result Visitor 

When asking the `Application` to authenticate an API authentication request, the return type of a successful authentication request will vary based on the request headers.  This includes:

1. `ApiAuthenticationResult` - Authorization header is present, with the `Basic` method and the base64 encoded API_KEY_ID:API_KEY_SECRET.
2. `BasicOauthAuthenticationResult` - HTTP Method is `POST`. Authorization header is present, with the `Basic` method and the base64 encoded API_KEY_ID:API_KEY_SECRET.  Content-type is set to `x-www-form-urlencoded`.
3. `OauthAuthenticationResult` - Authorization header is present, with the `Bearer` method and the OAuth 2.0 Access Token retrieved from the Stormpath SDK in a previous request.

Because of this, Stormpath has the ability to use a [visitor pattern](http://en.wikipedia.org/wiki/Visitor_pattern) to handle the different types of `AuthenticationResult`.  This becomes important if your API needs to support multiple Authorization methods (Basic and OAuth), or if your handles multiple types of authentication in the same place.

When asking an `Application` to authenticate a result, a successful request will return a `AuthenticationResult`.  In the code samples in this article, we have casted the `AuthenticationResult` directly, but the `AuthenticationResult` has the ability to accept a visitor.  Stormpath provides an `AuthenticationResultVisitorAdapter` which will throw exceptions for any method not overridden.


    AuthenticationResult authResult = application.authenticate(request).execute();

    authResult.accept(new AuthenticationResultVisitorAdapter() {

      public void visit(ApiAuthenticationResult result) {
          Account account = result.getAccount();
          ApiKey apiKey = result.getApiKey();   
      }

      public void visit(OauthAuthenticationResult result) {
          Account account = result.getAccount();
          Set<String> scope = result.getScope();
          
      }

      public void visit(BasicOauthAuthenticationResult result) {
          TokenResponse tokenResponse = result.getTokenResponse();
      }
    });









