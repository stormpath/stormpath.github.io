---
layout: doc
lang: guides
title: Using Stormpath to Secure and Manage API Services
---

<!-- this should be an Octopress include -->
{% docs info %}
 **This feature is currently in Beta.**  If you have any questions, bug reports, or enhancement requests please email support@stormpath.com. 
{% enddocs %}

{% docs info %}
Currently supported Stormpath SDKs for this feature include: **Java**
{% enddocs %}

In this guide, we discuss how to set up Stormpath to manage and authenticate API Keys and Tokens for developers that are using your API Services.  Stormpath provides not only the user management piece around API Keys, but also allows you to associate permissions and custom data with the accounts for advanced use-cases.  

## Why should I use Stormpath to Secure my API?
With few lines of code, you can quickly and easily lock down your own APIs with OAuth-based authentication and secure API key management.   

Stormpath offers a complete solution that securely and easily helps you manage developer accounts, create and manage API Keys, and generate OAuth 2.0 bearer tokens to support Access Token authentication.   

Stormpath features include:
<!--TODO-->

In the next sections, we will explain how to get set up and use Stormpath for API Key Management and Authentication. 

----

## First, some terminology
Throughout this document we will use the following words with very specific meanings.  

**Admin** or **Administrator** - Someone on your team who has access to the Stormpath API and/or Adminstration Console.  In turn, they will typically have the ability to create and manage user accounts, applications, API keys, etc.

**Developer** - A consumer of your API.  When you are generating and distributing API keys for your API, they are going to your customers' developers.

**Bearer Token**

**OAuth 2.0 Access Token**

**API Keys**

**API**

## How do I use Stormpath for API Key Management?

If you haven't already, you should first familiarize your self with Stormpath basics in one of our [7-Minute Tutorials](https://stormpath.com/tutorial/).

In order to implement API Key management with Stormpath you'll need to do the following:

+ Create an User Account for your Developers 
+ Create and Manage API Keys for the Developers' Accounts
+ Using the Stormpath SDK to Authenticate and Generate Tokens for your API

## Create an Account in Stormpath for your Developers

First, you will need user accounts in Stormpath to represent the people that are developing against your API.  Accounts can not only represent Developers, but also can be used to represent services, daemons, processes, or any “entity” that needs to login to a Stormpath-secured API. 

By assigning API keys directly to a User Account, as opposed to a general organization-wide set of keys, you get full traceability and accountability back to the specific individual in the event of an accident or breach on their end.

Stormpath `Accounts` can be used to keep a variety of Developer information including name, email address, password, and any other custom data you would like to store. 

You will mostly likely create a Stormpath Account when a Developer signs up for access to your API.  Below is an example of how to create a user account in code:

    //Create the account object
    Account account = client.instantiate(Account.class);

    //Set the account properties
    account.setGivenName("Joe");
    account.setSurname("Stormtrooper");
    account.setEmail("tk421@stormpath.com");
    account.setPassword("Changeme1");
    CustomData customData = account.getCustomData();
    customData.put("favoriteColor", "white");

    //Create the account using the existing Application object.
    application.createAccount(account);

{% docs info %}
**Reminder** - An `Application` is a representation of your real world application.  In this case, it will be your application that is exposing an API.  For more info check out our [Tutorial](https://stormpath.com/tutorial/) or [Product Guide](/java/product-guide/).
{% enddocs %}

## Create and Manage API Keys for an Account
After you create an account for a developer, you will need to generate an API Key (or multiple) to be used when accessing your API.  Each account will have an `apiKeys` property that will contains a collection of their API Keys and there will also be a list of API keys on a account's profile in the Stormpath Admin Console.  You will be able to both create and manage keys in both.

{% docs tip %}
The `apiKeys` collection can be used to easily display the API Keys back to the Developer in your application's UI in addition to general purpose API key management.
{% enddocs %}

Let's start with creating APIs keys for an Account

### Creating API Keys for an Account

Creating an API Key is a simple method call on the `Account`.  The method will create a new API Key (id and secret) associated with that `Account` and later accessible via the account's `apiKeys` property.

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

### Manage API Keys for an Account
<!-- TODO -->

## Using the Stormpath SDK to Authenticate and Generate Tokens for your API

The Stormpath SDK does all the heavy lifting for you in your application.  It automatically processes authentications via HTTP Basic or OAuth 2.0.  In addition, the SDK will handle more advance OAuth 2.0 features like _scope_ and _time-to-live_.  

Specifically, Stormpath supports two HTTP `Authorization` methods, Basic and Bearer (OAuth 2.0 client-credentials grant type).  In this section we will discuss the strategies and best practices using these authorization methods.

### How API Key and Token Authentication Works
All authentication attempts in Stormpath start with the `Application` object in the SDK.  You will likely have initialized the `Application` during startup.

The `Application` object in Java has an `authenticate` method that takes an `HttpServletRequest` as a parameter.  Using  HTTP authorization headers, Stormpath can understand what type of authentication is occurring (Basic vs Bearer) and can quickly decide if the authentication request is successful or not.  For example, if your API supports both Basic and OAuth 2.0, the Stormpath SDK will take the full request, read the authorization header data and provide the right type of authentication.

To demonstrate how the SDK works, we'll use an example.  We are building a Stormtrooper API for managing Stormtrooper equipment-- like awesome helmets and blasters.  In order to secure our API, a developer must base64 encode their API Key and Secret and then pass the encoded data in the authorization header. 

The developer request would look something like this (using HTTP Basic authentication):

    GET /stormtroopers/tk421/equipment 
    Accept: application/json
    Authorization: Basic MzRVU1BWVUFURThLWDE4MElDTFVUMDNDTzpQSHozZitnMzNiNFpHc1R3dEtOQ2h0NzhBejNpSjdwWTIwREo5N0R2L1g4
    Host: api.trooperapp.com

Alternatively, the developer could have sent the same request using an OAuth 2.0 Access Token (aka Bearer Token).  More on this later. <!-- link to appropriate place -->   

In the simplest form, the Stormpath Java SDK would authenticate the above request (Basic or Bearer) as follows:

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

The above code has some classes we want to highlight-- `ApiAuthenticationResult` and `ApiKey`.

`ApiAuthenticationResult` is a subclass of `AuthenticationResult` and will provide properties and methods for retrieving the authenticated `Account` and `ApiKey` for a successful authentication request.  Your API will use this information to provide context associated with who is calling your API.  This becomes important when your API has generic endpoints that return different information based on the caller.  In our Stormtrooper Equipment API, a call to `/my-equipment` would return the equipment for the authenticated account.

The SDK provides a caching layer to ensure fast response times in your API by reducing network traffic to the Stormpath service. The caching layer will cache the API Key securely with the Secret encrypted. Stormpath will use the cache entry for API Key and Secret authentication when possible.

### Exchanging API Keys for OAuth 2.0 Tokens

Stormpath SDK will enable your API to support OAuth 2.0 Bearer Tokens as a means of authentication. Stormpath explicitly supports OAuth 2.0 client credential grant type.  This workflow is represented as:

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

Going back to the Stormtrooper Equipment API example.  The app would require that a developer call a REST endpoint to exchange a valid API Key and Secret for an Access Token.  The REST endpoint could be something like `/oauth/token`. The API Key and Secret would need to be base64 encoded in the request. An example of the REST call: 

    POST /oauth/token
    Accept: application/json
    Authorization: Basic MzRVU1BWVUFURThLWDE4MElDTFVUMDNDTzpQSHozZitnMzNiNFpHc1
    Content-Type: application/x-www-form-urlencoded
    Host: api.trooperapp.com

    {
      "grant_type": "client_credentials"
    }

The request will need to explicitly state the grant type for the OAuth Access Token Request.  Stormpath only supports client credential grant type for exchanging API Keys for Access Tokens.

Below is sample code to show how you would handle the request with the Stormpath SDK and return an access token to the client:

    public void postOAuthToken(HttpServletRequest request, HttpServletResponse response) {
        Application application = client.getResource(applicationRestUrl, Application.class);

        //Getting the authentication result
        BasicOAuthAuthenticationResult result = (BasicOAuthAuthenticationResult) application.authenticate(request).execute();

        //Get the token response from the result which includes 
        //information about the Access Token
        TokenResponse token = result.getTokenResponse();

        //Prepares the response back to the caller
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");

        //Output the json of the Access Token
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

The `TokenResponse` contains properties associated with the generated token for an authenticated request.  This includes the Access Token, expiration, and token type.  This allows the client to decide if they can use the token. `TokenRepsonse` has a utility method `toJson()` which will return the JSON representation of the token that conforms to OAuth 2.0 specification.

### Using OAuth as Authentication for your REST API

After you return an OAuth Access Token to a developer using your API service, they can start using the OAuth Access Token to validate authentication to your service.

Stormpath requires that the developer send the Access Token in the Authorization header of the request.  

Again, the Stormtrooper Equipment API example.  We will require that a developer exchange his API Key and Secret for an Access Token and then pass the Access Token in future requests to gain access to your API. 

The developer request would look something like this:

    GET /stormtroopers/tk421/equipment 
    Accept: application/json
    Authorization: Bearer 7FRhtCNRapj9zsYI8MqPiS8hzx3wJH4qT29JUOpU64T
    Host: api.trooperapp.com

The Access Token needs to be passed to your API in the Authorization header, using the Bearer method.

In the simplest form, the Stormpath SDK would authenticate a request as follows:

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

Exchanging API Keys for OAuth 2.0 Tokens can be customized to increase or decrease the time-to-live (TTL) of the token or allow the client integrating with your API to request an optional scope for the Access Token. 

Using Stormpath will automatically set a TTL of one hour (3600 seconds) and does not embed scope into the OAuth 2.0 Access Token.  These are both customizable using the Stormpath SDK.

#### Time-to-live

When an API Key is exchanged for a Access Token, the Access Token has a time-to-live in relation to when the it was created.

Customizing the TTL is easy.  Just specify the TTL when exchanging the API keys for an OAuth token.

    result = application.authenticateOauth(request).withTtl(7200).execute();

{% docs note %}
When modifying the TTL, it is important that you understand the TTL in relation to Stormpath's SDK caching TTL.  Since the cache TTL is configured during the Stormpath SDK client initialization, it is important that it is greater than the TTL that you set for the Access Token.  This will ensure that the Access Token is not invalidated by the cache TTL.
{% enddocs %}

#### Scope

When exchanging a API Key for an Access Token, the client may request additional permissions for the Access Token.  This is called scope in OAuth.  For example, in our Stormtrooper Equipment API, a client may request for a `view_others_equipment` scope, which will allow a client to view other stormtroopers equipment other than his own.

{% docs note %}

Scopes are defined by the API and are application specific. They are usually described to clients integrating with the API through documentation. For example, Facebook and Heroku both use OAuth, but have different scopes for their OAuth Tokens.  You would not expect clients integrating with Heroku to ask for a `post_to_my_wall` scope.

{% enddocs %}

Using the Stormpath SDK will give you the tools to make the final decision if the scope will be granted in the token. To illustrate how this happens:

    POST /oauth/token
    Accept: application/json
    Authorization: Basic MzRVU1BWVUFURThLWDE4MElDTFVUMDNDTzpQSHozZitnMzNiNFpHc1R3dEtOQ2h0NzhBejNpSjdwWTIwREo5N0R2L1g4
    Content-Type: application/x-www-form-urlencoded
    Host: api.trooperapp.com

    {
      "grant_type": "client_credentials",
      "scope": "view_others_equipment admin"
    }

We know that this is a request for an Access Token, because the client included a grant_type parameter.  They also requested that the Access Token be granted the scopes of `view_others_equipment` and `admin`.  Note that scope is space-delimited.

When the API exchanges the API Key for an Access Token, you can specify a `ScopeFactory` that will help you create an Access Token with the correct scopes.

For example:

    public void processOAuthTokenRequest(HttpServletRequest request, HttpServletResponse response) {
        Application application = client.getResource(applicationRestUrl, Application.class);

        //Build a scope factory
        ScopeFactory scopeFactory = new ScopeFactory(){
              public Set<String> createScope(AuthenticationResult result, Set<String> requestedScopes) {

                //Initialize an empty set, and get the account
                HashSet<String> returnedScopes = new HashSet<String>();
                Account account = result.getAccount();

                //For each request scope, we want to compare it to see if the account has a group in Stormpath of the same name
                for(String scope: requestedScopes){
                  if(account.isMemberOfGroup(scope)){
                    returnedScopes.add(scope);
                  }
                }

                return returnedScopes;
              }
            };

        //Authenticate the request with ScopeFactory
        BasicOAuthAuthenticationResult result;
        result = (BasicOAuthAuthenticationResult) application.authenticateOauth(request).using(scopeFactory)execute();

        //Get the token response for an authenticated request
        TokenResponse token = result.getTokenResponse();

        //Build the response
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");

        //Include the access token and respond to caller
        response.getWriter().print(token.toJson());
        response.getWriter().flush();
    }


In the code above, we validate that the account is included in a `Group` with the same name as the scope.  This is one way you can verify the scope requested, but your application may have another means to verify the requested scope.

If the `Account` is a member of a `Group` named `admin` and `view_others_equipment`, the response for the above code would return the granted scopes to the client:

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
    Host: api.trooperapp.com

You can retrieve the granted scopes from the token when having the SDK authenticate the request:

    public void getEquipment(HttpServletRequest request, HttpServletResponse response) {
        //
        Application application = client.getResource(applicationRestUrl, Application.class);

        //
        OauthAuthenticationResult result = (OauthAuthenticationResult) application.authenticateOauth(request).execute();

        //Checking if the Access Token includes the 'admin' scope
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

<!-- add grant type to #2 -->

As a result, Stormpath has the ability to use a [visitor pattern](http://en.wikipedia.org/wiki/Visitor_pattern) to handle the different types of `AuthenticationResult`.  This becomes important if your API needs to support multiple Authorization methods (Basic and Bearer), or if you handle multiple types of authentication in the same place.

When asking an `Application` to authenticate a result, a successful request will return a `AuthenticationResult`.  In the code samples in this guide, we have casted the `AuthenticationResult` directly, but the `AuthenticationResult` has the ability to accept a visitor.  Stormpath provides an `AuthenticationResultVisitorAdapter` which will throw exceptions for any method not overridden.

<!--comment this shit! -->

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

<!-- wrap it up -->
<!-- include the support shit -->







