---
layout: doc
lang: rest
title: Stormpath REST API Product Guide
---

Stormpath is a User Management API that reduces development time with instant-on, scalable user infrastructure. Stormpath’s intuitive API and expert support make it easy for developers to authenticate, manage and secure users and roles in any application.

To get started with the basics of Stormpath quickly, check out the [REST API Quickstart Guide](/rest/quickstart). For a more complete understanding and reference of the full Stormpath service, read on.

***

## What is Stormpath?

Stormpath is the first easy, secure user management and authentication service for developers.

Fast and intuitive to use, Stormpath enables plug-and-play security and accelerates application development on any platform.

Built for developers, it offers an easy API, open source SDKs, and an active community. The flexible cloud service can manage millions of users with a scalable pricing model that is ideal for projects of any size.

By offloading user management and authentication to Stormpath, developers can bring new applications to market faster, reduce development and operations costs, and protect their users with best-in-class security.

### Overview

<img src="http://www.stormpath.com/sites/default/files/docs/Architecture.png" alt="High-level Architecture" title="High-level Architecture" width="700" height="430">

Stormpath is a REST API service.  You use a REST client (or one of our open-source language-specific SDKs) inside your application to communicate with the Stormpath API. Stormpath's API allows you to offload user management and authentication by helping you do the following:

* Account registration, complete with sending welcome emails
* Account email verification (send email -> user clicks a link -> their account is verified and they can login)
* Secure password storage with continuously updated cryptography best practices
* Password reset (send email -> user clicks a link -> sets new password -> account password encrypted and stored securely)
* Account login (aka authentication)
* Seamless integration with LDAP and Active Directory - you'll never have to worry about integrating your application with them again
* A complete administrative user interface to allow you to manage your applications, directories, accounts and groups
* And more...

When building your applications in the past, how much time have you spent writing some or all of this functionality?  It is quite a large amount of work, and this logic has nothing to do with why you're writing your application!  But you need it, and you need it to be secure.

By offloading all of this effort to Stormpath, a service with deep security roots, you can quickly get back to writing your actual application and never worry about password attacks again.

<a class="anchor" name="core"></a>
### Core Concepts 

Stormpath has five core concepts, and everything else in the Stormpath REST API exists to support them:

* Applications
* Directories
* Groups
* Accounts
* Tenants

These resources and their relationships are manageable by the REST API as described in this document, but you may also manage them via the [Stormpath Admin Console](https://api.stormpath.com) user interface.

**Applications**

An [Application](#applications) is a real-world software application that communicates with Stormpath to offload user management, authentication, and security workflows.  Each application that communicates with Stormpath is represented within Stormpath so you may manage its security needs.

You can assign one or more Directories and/or Groups to an Application.  Accounts within assigned directories and groups may login to the application.

**Directories**

A [Directory](#directories) is a top-level storage container of Accounts and Groups.  A Directory also manages security policies (like password strength) for the Accounts it contains.  Stormpath supports two types of Directories: natively hosted 'Cloud' directories that originate in Stormpath and 'Mirror' directories that act as secure mirrors or replicas of existing directories outside of Stormpath, for example LDAP or Active Directory servers.

Directories can be used to cleanly manage segmented account populations - for example, you might use one Directory for company employees and another Directory for customers, each with its own security policies.

**Groups**

A [Group](#groups) is a uniquely named collection of Accounts within a Directory.  Each Group within a Directory must have a unique name and may contain Accounts within their own Directory.  Groups are mostly used for security and access control, often called Role-Based Access Control.  For example, you might only show a particular user interface button if an Account is in the 'Administrators' Group.

It might be helpful to note that Stormpath does not have an explicit Role concept - you use Stormpath Groups as Roles for Role-Based Access Control.

**Accounts**

An [Account](#accounts) is a unique identity within a Directory, with a unique username and/or email address. An account can log in to applications using either the email address or username associated with it. Accounts can represent people end-users, but they can also be used to represent services, machines, or any 'entity' that needs to login to a Stormpath-enabled application.

**Tenants**

Stormpath is a [multi-tenant](http://en.wikipedia.org/wiki/Multitenancy) software service. When you [sign up for Stormpath](https://api.stormpath.com/register), a private data 'space', called a `Tenant`, is created for you.  This private [tenant space](#tenants) contains all of the data you own, including your applications, directories, accounts and groups and more.  The `Tenant` concept is mostly 'behind the scenes' and you don't need to use it all that often, but sometimes it is necessary or useful to use directly.

***

## REST API General Concepts

<a class="anchor" name="base-url"></a>
### Base URL

All URLs referenced in the API documentation begin with the following base URL:

    https://api.stormpath.com/v1

<a class="anchor" name="authentication"></a>
### Authentication

Every request to the Stormpath REST API must be authenticated with an API key over HTTPS. HTTP is not supported. If you want to make a REST request to Stormpath, we assume you have already:

1. [Signed up for Stormpath](https://api.stormpath.com/register).
2. [Obtained your API key](/console/product-guide#!ManageAPIkeys).

When you have an API key, you can choose one of two ways to authenticate with Stormpath:

* [HTTP Basic Authentication](#authentication-basic)
* [Digest Authentication](#authentication-digest)

**Security Notice**

Any account that can access the Stormpath application within the Stormpath Admin Console has full administrative access to your Stormpath data and settings, including access to the REST API if they have an API Key.

Assign user accounts to Stormpath, through [account stores](#account-store-mappings), wisely.

**HTTPS**

To help ensure data security, only secure (HTTPS) communication is allowed when communicating with the Stormpath API servers. Standard HTTP is not supported.

<a class="anchor" name="authentication-basic"></a>
#### Basic Authentication over HTTPS

Most clients (including web browsers) show a dialog or prompt for you to provide a username and password for HTTP Basic Authentication.

When using an API key with basic authentication, the `API key id` is the username and the `API key secret` is the password:

    HTTP basic username: apiKey.id value
    HTTP basic password: apiKey.secret value

For example, if using curl:

    curl -u $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
         -H "Accept: application/json" \
         -L https://api.stormpath.com/v1/tenants/current
<!-- {: .bash} -->

or perhaps [httpie](https://github.com/jkbr/httpie) (which assumes application/json by default):

    http -a $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET https://api.stormpath.com/v1/tenants/current
<!-- {: .bash} -->

<a class="anchor" name="authentication-digest"></a>
#### Digest Authentication Over HTTPS

Stormpath also supports a more secure authentication scheme known as digest authentication. This approach computes a [cryptographic digest](http://en.wikipedia.org/wiki/Cryptographic_hash_function) of the request and sends the digest value along with the request. If the transmitted digest matches what the Stormpath API server computes for the same request, the request is authenticated.

This technique is especially secure because the API key secret is *never transmitted outside of the application*, making it extremely difficult for anything (or anyone) outside of the application to interfere with a request or see the secret.

We recommend using digest authentication whenever possible because it is inherently more secure. However, due to its complexity, it might not be feasible for some projects.

All Stormpath SDKs (currently [Java](/java/product_guide), [Ruby](/ruby/product_guide), [PHP](/php/product_guide), and [Python](/python/product_guide)) use this more secure digest authentication so we recommend that you use the SDKs whenever possible. However, if we do not yet have an SDK for your programming language, you should use basic authentication over HTTPS.

Finally, if you would like to use Stormpath digest authentication in a programming language that Stormpath does not yet support, you can attempt to port the algorithm to that language. You can try to replicate the algorithm and use Stormpath existing code as examples to help:

* Java: [Sauthc1Signer](https://github.com/stormpath/stormpath-sdk-java/blob/master/impl/src/main/java/com/stormpath/sdk/impl/http/authc/Sauthc1Signer.java) (the **sign** method)
* Ruby: [Sauthc1Signer](https://github.com/stormpath/stormpath-sdk-ruby/blob/master/lib/stormpath-sdk/http/authc/sauthc1_signer.rb) (the **sign_request** method)
* PHP: [Sauthc1Signer](https://github.com/stormpath/stormpath-sdk-php/blob/master/src/Stormpath/Http/Authc/Sauthc1Signer.php) (the **signRequest** method)
* Python: [Sauthc1Signer](https://github.com/stormpath/stormpath-sdk-python/blob/master/stormpath/auth.py) (the **__call__** method)

If you port the algorithm to other languages, please let us know. We are happy to help. Email us at <support@stormpath.com> and we will help as best as we can.

{% docs info %}
The Stormpath `SAuthc1` digest algorithm is NOT the same as [RFC 2617](http://www.ietf.org/rfc/rfc2617.txt "RFC 2617") HTTP digest authentication. The Stormpath `SAuthc1` digest-based authentication scheme is more secure than standard HTTP digest authentication.
{% enddocs %}

<a class="anchor" name="resource-format"></a>
### Resource Format

The Stormpath REST API currently only supports JSON resource representations. If you would like other formats supported, please email us at <support@stormpath.com> to let us know!


<a class="anchor" name="resource-create"></a>
### Creating Resources

You create a resource by submitting an HTTP `POST` to a resource URI. Any POST body must be represented as JSON.

**Request**

Requests that contain body content must specify the HTTP `Content-Type` header with a value of `application/json`.

An example **Create POST Request**:

    curl -X POST \
         -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         -H "Content-Type: application/json;charset=UTF-8" \
         -d '{
               "name": "Desired name",
               "description": "Desired description",
               "status": "enabled"
             }` \
         "https://api.stormpath.com/v1/tenants/$YOUR_TENANT_ID/applications"
<!-- {: .bash} -->

**Response**

Create `POST` responses contain:

Item | Description
:---- | :----
HTTP Status Code | The code indicates general success or failure of the request.
HTTP Headers | Various response headers are set relevant to the particular request.
Response Body | Successful requests contain the created entity resource representation, while failed requests show an [error representation](#errors).

Possible **Create POST Response Status Codes** include:

Response Code | Description
:----------------------- | :-----
`201 CREATED` | The request was successful, we created a new resource, and the response body contains the representation. The `Location` header contains the new resource's canonical URI.
`400 BAD REQUEST` | The data given in the `POST` or `PUT` failed validation. Inspect the response body for details.
`401 UNAUTHORIZED` | Authentication credentials are required to access the resource. All requests must be authenticated.
`403 FORBIDDEN` | The supplied authentication credentials are not sufficient to access the resource.
`404 NOT FOUND` | We could not locate the resource based on the specified URI.
`405 METHOD NOT ALLOWED` | `POST` is not supported for the resource.
`409 CONFLICT` | You cannot create or update a resource because another resource already exists or conflicts with one you are submitting.
`415 UNSUPPORTED MEDIA TYPE` | You did not specify the request `Content-Type` header to have a value of `application/json`.  Only `application/json` is currently supported.
`429 TOO MANY REQUESTS` | Your application is sending too many simultaneous requests.
`500 SERVER ERROR` | We could not create or update the resource. Please try again.
`503 SERVICE UNAVAILABLE` | We are temporarily unable to service the request. Please wait for a bit and try again.

Example **Create POST Response**:

    HTTP/1.1 201 Created
    Location: https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA
    Content-Type: application/json;charset=UTF-8;

    {
      "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA",
      "name": "Desired name",
      "description": "Desired description",
      "status": "ENABLED",
      "tenant": {
        "href": "https://api.stormpath.com/v1/tenants/cJoiwcorTTmkDDBsf02AbA"
      },
      "accounts": {
        "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/accounts"
      },
      "groups": {
        "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/groups"
      },
      "loginAttempts": {
        "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/loginAttempts"
      },
      "accountStoreMappings": {
        "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/accountStoreMappings"
      },
      "defaultAccountStoreMapping": {
        "href": "https://api.stormpath.com/v1/accountStoreMappings/7bKZXzXxHFrVeNOExAmPlE"
      },
      "defaultGroupStoreMapping": {
        "href": "https://api.stormpath.com/v1/accountStoreMappings/7bKZXzXxHFrVeNOExAmPlE"
      },
      "passwordResetTokens": {
        "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/passwordResetTokens"
      },
    }
<!-- {: .http} -->

<a class="anchor" name="resource-retrieve"></a>
### Retrieving Resources

**Request**

You can retrieve a resource representation by `GET`ting its url.

An example API `GET`:

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         -L https://api.stormpath.com/v1/tenants/current
<!-- {: .bash} -->

**Response**

`GET` responses contain:

Item | Description
:---- | :----
HTTP Status Code | The code indicates general success or failure of the request.
HTTP Headers | Various response headers are set relevant to the particular request.
Response Body | Successful requests contain the requested entity resource representation, while failed requests show an [error representation](#errors).

Possible **GET Response Status Codes** include:

Response Code | Description
:----------------------- | :----
`200 OK` | The request was successful and the response body contains the representation requested.
`302 FOUND` | A common redirect response; you can `GET` the representation at the URI in the `location` response header.
`304 NOT MODIFIED` | Your client's cached version of the representation is still up to date.
`401 UNAUTHORIZED` | Authentication credentials are required to access the resource. All requests must be authenticated.
`403 FORBIDDEN` | The supplied authentication credentials are not sufficient to access the resource.
`404 NOT FOUND` | We could not locate the resource based on the specified URI.
`429 TOO MANY REQUESTS` | Your application is sending too many simultaneous requests.
`500 SERVER ERROR` | We could not return the representation due to an internal server error.
`503 SERVICE UNAVAILABLE` | We are temporarily unable to service the request. Please wait for a bit and try again.

An example **API GET Response**:

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
      "href": "https://api.stormpath.com/v1/tenants/cJoiwcorTTmkDDBsf02AbA",
      "name": "My Tenant",
      "key": "myTenant"
    }


<a class="anchor" name="resource-update"></a>
### Updating Resources

If you want to update a resource, submit an HTTP `POST` to a resource URI. Any `POST` body must be represented as JSON. You can submit one or more attributes of a resource, but at least one attribute must be specified.

**Request**

Requests that contain body content must specify the HTTP `Content-Type` header with a value of `application/json`.

An example **Update (HTTP POST) request**, updating a single attribute:

    curl -X POST \
         -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         -H "Content-Type: application/json;charset=UTF-8" \
         -d '{
               "name": "New name"
             }' \
         "https://api.stormpath.com/v1/applications/$APPLICATION_ID"
<!-- {: .bash} -->

Notice that the post body in this particular example contains only a single JSON name/value pair, although application resources have multiple name/value pairs.

Updates enable updating one or more resource attribute values. At least one resource attribute value must be specified.

**Response**

Update `POST` responses contain:

Item | Description
:---- | :----
HTTP Status Code | The code indicates general success or failure of the request.
HTTP Headers | Various response headers are set relevant to the particular request.
Response Body | Successful requests contain the updated entity resource representation, while failed requests show an [error representation](#errors).

Possible **Update POST Response Status Codes** include:

Response Code | Description
:----------------------- | :----
`200 OK` | The request was successful, we updated the resource, and the response body contains the resource full representation.
`400 BAD REQUEST` | The data given in the POST request body failed validation. Inspect the response body for details.
`401 UNAUTHORIZED` | The supplied credentials, if any, are not sufficient to create or update the resource.
`403 FORBIDDEN` | The supplied authentication credentials are not sufficient to access the resource.
`404 NOT FOUND` | We could not locate the resource based on the specified URI.
`405 METHOD NOT ALLOWED` | POST is not supported for the resource.
`409 CONFLICT` | You cannot create or update a resource because another resource already exists or conflicts with one you are submitting.
`415 UNSUPPORTED MEDIA TYPE` | You did not specify the request `Content-Type` header to have a value of `application/json`.  Only `application/json` is currently supported.
`429 TOO MANY REQUESTS` | Your application is sending too many simultaneous requests.
`500 SERVER ERROR` | We could not create or update the resource. Please try again.
`503 SERVICE UNAVAILABLE` | We are temporarily unable to service the request. Please wait for a bit and try again.

Example **Update POST response**:

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
      "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA",
      "name": "New name",
      "description": "Really. The best application ever.",
      "status": "ENABLED",
      "tenant": {
        "href": "https://api.stormpath.com/v1/tenants/cJoiwcorTTmkDDBsf02AbA"
      },
      "accounts": {
        "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/accounts"
      },
      "groups": {
        "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/groups"
      },
      "loginAttempts": {
        "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/loginAttempts"
      },
      "accountStoreMappings": {
        "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/accountStoreMappings"
      },
      "defaultAccountStoreMapping": {
        "href": "https://api.stormpath.com/v1/accountStoreMappings/7bKZXzXxHFrVeNOExAmPlE"
      },
      "defaultGroupStoreMapping": {
        "href": "https://api.stormpath.com/v1/accountStoreMappings/7bKZXzXxHFrVeNOExAmPlE"
      },
      "passwordResetTokens": {
        "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/passwordResetTokens"
      },
    }
<!-- {: .http} -->

<a class="anchor" name="resource-delete"></a>
### Deleting Resources

To delete a resource, make an HTTP `DELETE` request to the resource URL. Note that not all Stormpath REST API resources support delete.

**Request**

An example **DELETE request**:

    curl -X DELETE -u $API_KEY_ID:$API_KEY_SECRET "https://api.stormpath.com/v1/applications/$APPLICATION_ID"
<!-- {: .bash} -->

**Response**

Possible **DELETE Response Status Codes** include:

Response Code | Description
:----------------------- | :----
`204 NO CONTENT` | The request was successful; the resource was deleted. The deleted resource representation will not be returned.
`401 UNAUTHORIZED` | The supplied credentials, if any, are not sufficient to create or update the resource.
`403 FORBIDDEN` | The supplied authentication credentials are not sufficient to access the resource.
`404 NOT FOUND` | We could not locate the resource based on the specified URI.
`405 METHOD NOT ALLOWED` | DELETE is not supported for the resource.
`429 TOO MANY REQUESTS` | Your application is sending too many simultaneous requests.
`500 SERVER ERROR` | We could not create or update the resource. Please try again.
`503 SERVICE UNAVAILABLE` | We are temporarily unable to service the request. Please wait for a bit and try again.

Example **DELETE response**:

    HTTP/1.1 204 No Content
<!-- {: .http} -->

<a class="anchor" name="http-method-overloading"></a>
### HTTP Method Overloading

The Stormpath REST API uses HTTP `GET`, `POST`, `PUT`, and `DELETE` methods. Because some HTTP clients do not support PUT and DELETE methods, you can simulate them by sending a POST request to a resource endpoint with a **`_method`** query string parameter. The parameter value can be DELETE (`_method=DELETE`) or PUT (`_method=PUT`).

For example, if you want to delete a particular application resource, you would ordinarily execute an HTTP `DELETE` request:

    curl -X DELETE -u $API_KEY_ID:$API_KEY_SECRET "https://api.stormpath.com/v1/applications/$APPLICATION_ID"
<!-- {: .bash} -->

But if your HTTP client only supports GET and POST, you can send a POST request with the `_method` query string parameter:

    curl -X POST -u $API_KEY_ID:$API_KEY_SECRET "https://api.stormpath.com/v1/applications/$APPLICATION_ID?_method=DELETE"
<!-- {: .bash} -->

<a class="anchor" name="errors"></a>
### Errors

REST API responses indicating an error or warning are represented by a proper response HTTP status code (403, 404, etc). Additionally, a response body is provided containing the following information:

Attribute | Description | Type
:----- | :----- | :----
<a class="anchor" name="errors-status"></a>`status` | The corresponding HTTP status code. | Integer
<a class="anchor" name="errors-code"></a>`code` | A [Stormpath-specific error code](http://docs.stormpath.com/errors) that can be used to obtain more information. | Integer
<a class="anchor" name="errors-message"></a>`message` | A simple, easy to understand message that you can show directly to your application end-user. | String
<a class="anchor" name="errors-developer-message"></a>`developerMessage` | A clear, plain text explanation with technical details that might assist a developer calling the Stormpath API. | String
`moreInfo` | A fully qualified URL that may be accessed to obtain more information about the error. | String

**Example**

Example request for a resource that does not exist:

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         https://api.stormpath.com/v1/applications/thisApplicationDoesNotExist
<!-- {: .bash} -->

Example response:

    HTTP/1.1 404 Not Found

    {
      "status": 404,
      "code": 404,
      "message": "Oops! The application you specified cannot be found.",
      "developerMessage": "The specified Application cannot be found. If you accessed this url via a stale href reference, it might be helpful to acquire the tenant's Application Collection Resource to obtain the current list of applications.",
      "moreInfo": "http://docs.stormpath.com/errors/404"
    }
<!-- {: .http} -->

#### Error Code Reference

The [Stormpath Error Code Reference](http://docs.stormpath.com/errors) provides the list of all Stormpath-specific error codes and their meanings.

<a class="anchor" name="collections"></a>
### Collection Resources

A `Collection Resource` is a resource containing other resources. It is known as a Collection _Resource_ because it is itself a first class resource - it has its own attributes similar to any other resource in addition to the instances it contains.

If you want to interact with multiple resources, you must do so with a Collection Resource. Collection Resources also support additional behavior specific to collections, such as [pagination](#pagination), [sort ordering](#sorting), and [searching](#search).

**Collection Resource Attributes**

Attribute | Description | Type
:----- | :----- | :----
`href` | The fully qualified location URI of the Collection Resource. | String
<a id="collections-offset"></a>`offset`| The zero-based starting index in the entire collection of the first item to return. The default value is `0`. This is a [pagination](#pagination)-specific attribute. | Integer
<a id="collections-limit"></a>`limit` | The maximum number of collection items to return for a single request. Minimum value is `1`. The maximum value is `100` and the default value is `25`. This is a [pagination](#pagination)-specific attribute. | Integer
<a id="collections-items"></a>`items` | An array containing the current page of resources. The size of this array can be less than the requested `limit`. For example, if the limit requested is greater than the maximum allowed or if the response represents the final page in the total collection and the item count of the final page is less than the `limit`. This is a [pagination](#pagination)-specific attribute. | Array

**Request**

To acquire a Collection Resource, submit an HTTP `GET` to the Collection Resource URI.

<a class="anchor" name="pagination"></a>
### Pagination


If a Collection Resource represents a large enough number of resource instances, it will not include them all in a single response. Instead a technique known as _pagination_ is used to break up the results into one or more pages of data. You can request additional pages as separate requests.

<a class="anchor" name="pagination-query-parameters"></a>
#### Query Parameters

There are two optional query parameters that may be specified to control pagination:

- [offset](#collections-offset): The zero-based starting index in the entire collection of the first item to return. Default is <code>0</code>.
- [limit](#collections-limit): The maximum number of collection items to return for a single request. Minimum value is <code>1</code>. Maximum value is <code>100</code>. Default is <code>25</code>.

**Example Collection Resource Request**

An example `GET` request for a Collection Resource using pagination:

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/tenants/$TENANT_ID/applications?offset=10&limit=40"
<!-- {: .bash} -->

This example requests a tenant's `applications` Collection Resource from the server with page results starting at index 10 (the 11th element), with a maximum of 40 total elements.

**Example Collection Resource Response**

    HTTP/1.1 200 OK

    {
      "href": "https://api.stormpath.com/v1/tenants/cJoiwcorTTmkDEXAMPLE/applications?offset=10&limit=40"
      "offset": 10,
      "limit": 40,
      "items" : [
        {
          ... Application 10's name/value pairs ...
        },
        ...,
        {
          ... Application 49's name/value pairs ...
        }
      ]
    }

<a class="anchor" name="sorting"></a>
### Sorting

A request for a Collection Resource can contain an optional `orderBy` query parameter. The query parameter value is a [URL-encoded](http://en.wikipedia.org/wiki/Percent-encoding "HTML URL Encoding") comma-delimited list of ordering statements.

For example, a sorted request (where `%2C` is the URL encoding for the comma character) might look like this:

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         https://api.stormpath.com/v1/accounts?orderBy=orderStatement1%2CorderStatement2%2C...%2CorderStatementN
<!-- {: .bash} -->

When URL-decoded, the URL looks like this:

    https://api.stormpath.com/v1/accounts?orderBy=orderStatement1,orderStatement2,...,orderStatementN

Each `orderStatement` is defined as follows:

`orderStatement ::= sortableAttributeName optionalAscendingOrDescendingStatement`

where:

- `sortableAttributeName` is the name of a sortable attribute of a resource in the `items` array. Sortable attributes are primitives (non-complex and non-link) attributes, such as integers and strings.
- `optionalAscendingOrDescendingStatement` is composed of the following:
    - a space character (`%20` URL encoded) followed by:
    - the token `asc` (ascending) or `desc` (descending)

If the `optionalAscendingOrDescendingStatement` parameter is not included (the query parameter value is a sortable attribute name only), `asc` is assumed by default.

For example, to get all accounts of an application and order the results by `surname` ascending and then `givenName` descending:

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/applications/someRandomId/accounts?orderBy=surname%2CgivenName%20desc"
<!-- {: .bash} -->

Which, if URL decoded, the URL would look like this:

    https://api.stormpath.com/v1/applications/someRandomId/accounts?orderBy=surname,givenName desc

Notice the `surname` order statement does not specify `asc` or `desc`, implying `asc` by default.

<a class="anchor" name="search"></a> 
### Search

You can search for specific resources within a Collection Resource by using certain query parameters to specify your search criteria.

There are currently two different types of searches that might be performed: a generic [Filter](#search-filter)-based search and a more targeted [Attribute](#search-attribute)-based search. Both options support result [ordering](#sorting), [pagination](#pagination), and [link expansion](#links-expansion).

{% docs info %}
Currently, a REST search request must be targeted at resources of the same type. For example, a search can be performed across accounts or groups, but not both at the same time. 

Because the Stormpath REST API always represents one or more resources of the same type as a Collection Resource, a REST search is always sent to a Collection Resource endpoint.
{% enddocs %}

<a class="anchor" name="search-filter"></a>
#### Filter Search

A filter search consists of specifying a `q` query parameter and a corresponding search value on a Collection Resource URL:

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/someCollection?q=some+criteria"
<!-- {: .bash} -->

For example, to search across an application's accounts for any account that has a searchable attribute containing the text 'Joe':

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
        "https://api.stormpath.com/v1/applications/someAppId/accounts?q=Joe"
<!-- {: .bash} -->

**Matching Logic**

If the entered criteria, through a case-_insensitive_ comparison, exists within (or is equal to) any viewable attribute on an instance in the collection, that instance is included in the query results. Only instances visible to the current caller (owned by the caller's tenant), are returned in the query results.

For example, consider the following query:

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/accounts?q=Joe"
<!-- {: .bash} -->

This returns all accounts where:

- Each account is owned by the caller's [tenant](#tenants)
- The account `givenName` equals or contains 'joe' (case insensitive) OR
- The account `surname` equals or contains 'joe' (case insensitive) OR
- The account `email` equals or contains 'joe' (case insensitive) OR
- ... etc ...

In other words, each attribute comparison is similar to a 'like' operation in traditional RDBMS contexts. For example, if SQL was used to execute the query, it might look like this:

    select * from my_tenant_accounts where
        (lower(givenName) like '%joe%' OR
         lower(surname) like '%joe%' OR
         lower(email) like '%joe%' OR ... );

<a class="anchor" name="search-attribute"></a>
#### Attribute Search

Attribute-based search is the ability to find resources based on full and partial matching of specific individual resource attributes:

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/someCollection?anAttribute=someValue&anotherAttribute=anotherValue"
<!-- {: .bash} -->

For example, to search an application's accounts for an account with a `givenName` of `Joe`:

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/applications/someAppId/accounts?givenName=Joe"
<!-- {: .bash} -->

**Matching Logic**

Attribute-based queries use standard URI query parameters and function as follows:

- Each query parameter name is the same name of a searchable attribute on an instance in the [Collection Resource](#collections).
- A query parameter value triggers one of four types of matching criteria:
    - No asterisk at the beginning or end of the value indicates a direct case-insensitive match.
    - An asterisk only at the beginning of the value indicates that the case-insensitive value is at the end.
    - An asterisk only at the end of the value indicates that the case-insensitive value is at the beginning.
    - An asterisk at the end AND at the beginning of the value indicates the value is contained in the string.

For example, consider the following query:

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/accounts?givenName=Joe&middleName=*aul&surname=*mit*&email=joePaul*&status=disabled"
<!-- {: .bash} -->

This returns all accounts where:

- Each account is owned by the caller [tenant](#tenants).
- The account `givenName` is equal to 'Joe' (case insensitive) AND
- The account `middleName` ends with 'aul' (case insensitive) AND
- The account `surname` equals or contains 'mit' (case insensitive) AND
- The account `email` starts with with 'joePaul' (case insensitive) AND
- The account `status` equals 'disabled' (case insensitive).

{% docs note %}
For resources with a `status` attribute, status query values **must be the exact value**. For example, `enabled` or `disabled` must be passed and fragments such as `ena`, `dis`, `bled` are not acceptable.
{% enddocs %}

<a class="anchor" name="links"></a>
### Links

REST resources that reference other resources, such as an account referencing its parent directory, represent the references as a _Link_ object.

A `Link` is an object nested within an existing resource representation that has, at a minimum, an `href` attribute.

The `href` attribute is the fully qualified location URI of the linked resource.

Example Link in `JSON`:

    {
      "href": "https://api.stormpath.com/v1/directories/S2HZc7gXTumVYEXAMPLE"
    }

This JSON object structure is called a link as it provides a similar functionality to more familiar HTML Anchors, often called hyperlinks or just 'links' for short.

The following example `account` resource has four links - `groups`, `groupMemberships`, `directory`, and `tenant`:

    {
      "href": "https://api.stormpath.com/v1/accounts/ZugcG3JHQFOTKGEXAMPLE",
      "username": "lonestarr",
      "email": "lonestarr@druidia.com",
      "fullName": "Lonestarr Schwartz",
      "givenName": "Lonestarr",
      "middleName": "",
      "surname": "Schwartz",
      "status": "ENABLED",
      "emailVerificationToken": null,
      "groups": {
        "href": "https://api.stormpath.com/v1/accounts/ZugcG3JHQFOTKGEXAMPLE/groups"
      },
      "groupMemberships": {
        "href": "https://api.stormpath.com/v1/accounts/ZugcG3JHQFOTKGEXAMPLE/groupMemberships"
      },
      "directory": {
        "href": "https://api.stormpath.com/v1/directories/S2HZc7gXTumVYEXAMPLE"
      },
      "tenant": {
        "href": "https://api.stormpath.com/v1/tenants/wGbGaSNuTUix9EXAMPLE"
      },
    }

When encountering a link object, you can use the link `href` attribute to interact with that resource as necessary.

<a class="anchor" name="links-expansion"></a>
### Link Expansion

When requesting a resource you might want the Stormpath API server to return not only that resource, but also one or more of its linked resources. Link expansion allows you to retrieve related resources in a single request to the server instead of having to issue multiple separate requests.

#### `expand` Query Parameter

For example, to retrieve an account and its parent directory, instead of issuing two requests (one for the account and another for its directory) add an `expand` query parameter with a value of `directory` to the resource URI.

For example:

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/accounts/$ACCOUNT_ID?expand=directory"

Response:

    {
        "href": "https://api.stormpath.com/v1/accounts/ZugcG3JHQFOTKGEXAMPLE",
        "username": "lonestarr",
        "email": "lonestarr@druidia.com",
        "fullName": "Lonestarr Schwartz",
        "givenName": "Lonestarr",
        "middleName": "",
        "surname": "Schwartz",
        "status": "ENABLED",
        "emailVerificationToken": null,
        "groups": {
            "href": "https://api.stormpath.com/v1/accounts/ZugcG3JHQFOTKGEXAMPLE/groups"
        },
        "groupMemberships": {
            "href": "https://api.stormpath.com/v1/accounts/ZugcG3JHQFOTKGEXAMPLE/groupMemberships"
        },
        "directory": {
            "href": "https://api.stormpath.com/v1/directories/S2HZc7gXTumVYEXAMPLE",
            "name": "Spaceballs",
            "description": "",
            "status": "ENABLED",
            "accounts": {
                "href":"https://api.stormpath.com/v1/directories/S2HZc7gXTumVYEXAMPLE/accounts"
            },
            "groups": {
                "href":"https://api.stormpath.com/v1/directories/S2HZc7gXTumVYEXAMPLE/groups"
            },
            "tenant":{
                "href":"https://api.stormpath.com/v1/tenants/wGbGaSNuTUix9EXAMPLE"
            }
        },
        "tenant": {
            "href": "https://api.stormpath.com/v1/tenants/wGbGaSNuTUix9EXAMPLE"
        }
    }

Notice that the account's `directory` attribute is no longer a link; it has been _expanded_ in-line and included in the response body.

You can use this technique to reduce the number of round-trip communication requests to Stormpath API server, enhancing the performance of your application.

#### Expandable Attributes

Most link attributes are expandable. Check the resource's specific documentation to see which of its link attributes are expandable.

#### Expansion Depth Limit

It is currently only possible to expand a resource's immediate links. It is not currently possible to expand links of links.

For example, it would not be possible to return an account with its directory expanded and also the directory's groups expanded as well. Link expansion is currently only possible one level 'deep'.

If you have a critical need of multi-depth expansion, please contact us at <support@stormpath.com> and submit a feature request.

#### Expanding Multiple Links

You can specify more than one link attribute by specifying a comma-delimited list of attribute names to expand.

For example, to expand the example account's `directory` and `tenant` links, execute the following `GET` request:

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/accounts/$ACCOUNT_ID?expand=directory,tenant"
<!-- {: .bash} -->

#### Expanding Collection Links

It is possible to expand links to Collection Resources as well.  You can additionally provide pagination parameters to control the paged output of the expanded collection.

For example, to expand the above account's groups (starting at the first group - index 0) and limiting to 10 results total, you can specify the `groups` attribute name followed `offset` and/or `limit` parameters enclosed in parenthesis. For example:

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/accounts/$ACCOUNT_ID?expand=groups(offset:0,limit:10)"
<!-- {: .bash} -->

The `offset` and `limit` values are enclosed in parenthesis and delimited by the colon `:` character.

{% docs note %}
If you specify parenthesis for a collection expansion, you **must** specify an `offset` value or a `limit` value or both. Parenthesis without an `offset` or `limit` is a query syntax error and should be fixed. For example, `?expand=groups()` is invalid and should be changed to only `?expand=groups`.
{% enddocs %}

If you expand a Collection Resource and you do not specify parenthesis with an offset or limit (for example `?expand=groups`), the default [pagination](#pagination) values are used automatically.

#### Expansion Combinations

Finally, it should be noted that you can expand both standard (non-collection) links and collection links in the same `expand` directive. For example:

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/accounts/$ACCOUNT_ID?expand=directory,groups(offset:0,limit:10)"
<!-- {: .bash} -->

You can combine the two techniques to more precisely customize your desired output.

***

<a class="anchor" name="tenants"></a> 
## Tenants

Stormpath is a [multi-tenant](http://en.wikipedia.org/wiki/Multitenancy) software service. When you [sign up for Stormpath](https://api.stormpath.com/register), a private data 'space' is created for you.  This space is represented as a `Tenant` resource in the Stormpath REST API.

It might help to think of a tenant as a Stormpath customer.  As a Stormpath tenant (customer), you own your `Tenant` resource and everything in it - applications, directories, accounts, groups, and so on.

In the Stormpath REST API specifically, your `Tenant` resource can be thought of as your global starting point.  You can access everything in your Tenant space by accessing your Tenant resource first and then interacting with its other linked resources (applications collection, directories collection, etc).

<a class="anchor" name="tenant-resource"></a> 
### Tenant Resource

<a class="anchor" name="tenant-resource-uri"></a> 
#### Resource URI

    /v1/tenants/:tenantId

<a class="anchor" name="tenant-resource-attributes"></a>
#### Tenant Resource Attributes

Attribute | Description | Type | Valid Value
:----- | :----- | :---- | :----
<a class="anchor" name="tenant-resource-href"></a>`href` | The tenant resource's fully qualified URL. | String | <span>--</span>
<a class="anchor" name="tenant-resource-name"></a>`name` | The name of the tenant. Unique across all tenants. | String | 1 < N <= 255 characters
<a class="anchor" name="tenant-resource-key"></a>`key` | Human readable tenant key. Unique across all tenants. | String | 1 < N <= 63 characters, no whitespace, lower-case a-z and dash '-' characters only, cannot start or end with a dash '-' character.
<a class="anchor" name="tenant-resource-applications"></a>`applications` | A link to the tenant's applications. | link | <span>--</span>
<a class="anchor" name="tenant-resource-directories"></a>`directories` | A link to the tenant's directories. | link | <span>--</span>

For Tenants, you can:

* [Retrieve a tenant](#tenant-retrieve)
* [Retrieve the current tenant](#tenant-current)
* [Access a tenant's applications](#tenant-applications)
* [Access a tenant's directories](#tenant-directories)

<!-- TODO: We do not want users to update their Tenant information yet: * [Update (HTTP `POST`) a tenant resource](#UpdateTenantResource) -->

"Create" and "Delete" Tenant operations are currently not supported via the REST API. If you require this functionality, please email <support@stormpath.com> and request it.

<a class="anchor" name="tenant-retrieve"></a>
### Retrieve a Tenant

Execute a `GET` request with the tenant URI to retrieve the `Tenant` resource.  You may only retrieve your own Tenant: every API Key that executes REST requests is associated with a Tenant, and the request caller may only retrieve the Tenant corresponding to the API Key used.

If you do not have your Tenant's specific URI handy, you can always retrieve your Tenant using the [current Tenant alias URI](#tenant-current).

**Example Request**

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/tenants/$TENANT_ID"
<!-- {: .bash} -->

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
      "href": "https://api.stormpath.com/v1/tenants/cJoiwcorTTmkDDBsf02AbA",
      "name": "My Tenant",
      "key": "myTenant",
      "applications": {
        "href": "https://api.stormpath.com/v1/tenants/cJoiwcorTTmkDDBsf02AbA/applications"
      },
      "directories": {
        "href": "https://api.stormpath.com/v1/tenants/cJoiwcorTTmkDDBsf02AbA/directories"
      }
    }

<a class="anchor" name="tenant-current"></a>
### Retrieve the Current Tenant

Because a REST caller can retrieve one and only one `Tenant` resource, it is often more convenient not to be concerned with the Tenant-specific URL is when performing a request, and instead use a simpler permanent alias.

You can request the `current` Tenant resource, and the API server will automatically issue a `302` redirect to the `Tenant` resource corresponding to the currently executing API caller. In other words, this endpoint redirects the API caller to their own Tenant's URI.

**Example Request**

    curl -u $API_KEY_ID:$API_KEY_SECRET -H "Accept: application/json" -L https://api.stormpath.com/v1/tenants/current
<!-- {: .bash} -->

**Example Response**

    HTTP/1.1 302 Moved Temporarily
    Location: https://api.stormpath.com/v1/tenants/cJoiwcorTTmkDExaMpLe
    Expires: 0
    Cache-Control: no-cache, no-store, must-revalidate, max-age=0, proxy-revalidate, no-transform
    Pragma: no-cache

Most REST libraries and web browsers will automatically issue a request for the resource in the `Location` header.  If you do not see this, just execute a `GET` request to that `Location` and you will see your `Tenant` resource.

<!-- TODO: re-enable after AM-1903 is complete:
<a class="anchor" name="tenant-update"></a>
### Update a Tenant {#tenant-update}  <-- FYI, this type or anchor tag doesn't work.

If you want to update one or more attribute of your `Tenant` resource, execute an HTTP `POST` request to the tenant URI.  Unspecified attribute are not changed. At least one attribute must be specified.

**Optional Attributes**

* [name](#Tname)

**Example Request**

    POST https://api.stormpath.com/v1/tenants/WpM9nyZ2TbaEzfbRvLk9KA

    {
      "name": "New Name"
    }

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8

    {
      "href": "https://api.stormpath.com/v1/tenants/cJoiwcorTTmkDDBsf02AbA",
      "name": "New Name",
      "key": "my-existing-key",
      "applications": {
        "href": "https://api.stormpath.com/v1/tenants/cJoiwcorTTmkDDBsf02AbA/applications"
      },
      "directories": {
        "href": "https://api.stormpath.com/v1/tenants/cJoiwcorTTmkDDBsf02AbA/directories"
      }
    }

-->

<a class="anchor" name="tenant-applications"></a>
### Tenant Applications

A `Tenant` has one or more [Applications](#applications) registered with Stormpath.  Each registered application may communicate with Stormpath to simplify and automate its user management and authentication needs.

**Tenant Applications Collection Resource URI**

    /v1/tenants/:tenantId/applications

<a class="anchor" name="tenant-applications-list"></a>
#### List Tenant Applications

You can list your tenant's applications by sending a `GET` request to your tenant's `applications` Collection Resource `href` URL.  The response is a [paginated](#pagination) list of tenant applications.

You may also use collection [pagination](#pagination) and [sort ordering](#sorting) query parameters to customize the paginated response.

**Example Request**

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/tenants/$TENANT_ID/applications"
<!-- {: .bash} -->

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8

    {
      "href": "https://api.stormpath.com/v1/tenants/cJoiwcorTTmkDDBsf02AbA/applications",
      "offset": 0,
      "limit": 25,
      "items" : [
        {
          "href" : "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA"
          ... remaining Application name/value pairs ...
        },
        {
          "href" : "https://api.stormpath.com/v1/applications/aLlyOUrBAse34js9hjiH9j"
          ... remaining Application name/value pairs ...
        },
        {
          "href" : "https://api.stormpath.com/v1/applications/Xhf0a9HLA02djsdP90dsQ2"
          ... remaining Application name/value pairs ...
        },
      ]
    }

<a class="anchor" name="tenant-applications-search"></a>
#### Search Tenant Applications

You may search for applications by sending a `GET` request to your tenant's `applications` Collection Resource `href` URL using [search query parameters](#search).  Any matching applications within your tenant will be returned as a [paginated](#pagination) list.

##### Searchable Application Attributes

The following application attributes are searchable via [filter](#search-filter) and [attribute](#search-attribute) searches:

* `name`
* `description`
* `status`

In addition to the the [search query parameters](#search), you may also use [pagination](#pagination) and [sorting](#sorting) query parameters to customize the paginated response.  For example:

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/tenants/$TENANT_ID/applications?q=foo&orderBy=name&offset=0&limit=50"
<!-- {: .bash} -->

#### Working With Tenant Applications

Application resources supports the full suite of CRUD commands and other interactions.  Please see the [Applications section](#applications) for more information.

<a class="anchor" name="tenant-directories"></a>
### Tenant Directories

A `Tenant` has one or more [Directories](#directories) that contain accounts and groups.  Accounts may login to [applications](#applications) and groups can be used for access control within applications.

**Tenant Directories Collection Resource URI**

    /v1/tenants/:tenantId/directories

<a class="anchor" name="tenant-directories-list"></a>
#### List Tenant Directories

You can list your tenant's directories by sending a `GET` request your tenant's `directories` Collection Resource `href` URL.  The response is a [paginated](#pagination) list of your tenant's  directories.

You may also use collection [pagination](#pagination) and [sort ordering](#sorting) query parameters to customize the paginated response.

**Example request**

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/tenants/$TENANT_ID/directories"
<!-- {: .bash} -->

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
      "href": "https://api.stormpath.com/v1/tenants/Gh9238fksJlsieJkPkQuW/directories"
      "offset": 0,
      "limit": 25,
      "items" : [
        {
          "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q"
          ... remaining Directory name/value pairs ...
        },
        {
          "href" : "https://api.stormpath.com/v1/directories/lIKeabOss8w9fJf0fJfb34"
          ... remaining Directory name/value pairs ...
        },
        {
          "href" : "https://api.stormpath.com/v1/directories/Hfjks7kj9sfKfh9fhsPifa"
          ... remaining Directory name/value pairs ...
        }
      ]
    }

<a class="anchor" name="tenant-directories-search"></a>
#### Search Tenant Directories

You may search for directories by sending a `GET` request to your tenant's `directories` Collection Resource `href` URL using [search query parameters](#search).  Any matching directories with your tenant will be returned as a [paginated](#pagination) list.

##### Searchable Directory Attributes

The following [directory attributes](#directory) are searchable via [filter](#search-filter) and [attribute](#search-attribute) searches:

* `name`
* `description`
* `status`

In addition to the the [search query parameters](#search), you may also use [pagination](#pagination) and [sorting](#sorting) query parameters to customize the paginated response.  For example:

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/tenants/$TENANT_ID/directories?q=foo&orderBy=name&offset=0&limit=50"
<!-- {: .bash} -->

#### Working With Tenant Directories

Directory resources support the full suite of CRUD commands and other interactions. Please see the [Directories section](#directories) for more information.

***

<a class="anchor" name="applications"></a>
## Applications

An application in Stormpath represents any real world piece of software that communicates with Stormpath to offload its user management and authentication needs.  The application can be anything that can make a REST API call - a web application that you are writing, a web server like Apache or Nginx, a Linux operating system, etc - basically anything that a user can login to.  A [tenant](#tenants) administrator can register one or more applications with Stormpath.

You control who may login to an application by assigning (or 'mapping') one or more directories or groups (generically called [account stores](#account-store-mappings)) to an application.  The accounts in these associated directories or groups (again, _account stores_) collectively form the application's user base. These accounts are considered the application's users and they can login to the application.  Therefore, you can control user population that may login to an application by managing which [account stores](#account-store-mappings) are assigned to the application.

Even the Stormpath Admin Console and API is represented as an Application (named `Stormpath`), so you can control who has administrative access to your Stormpath [tenant](#tenants) by managing the `Stormpath` application's associated account stores.

<a class="anchor" name="application"></a>
### Application Resource

An individual `application` resource may be accessed via its Resource URI:

**Resource URI**

    /v1/applications/:applicationId

<a class="anchor" name="application-attributes"></a>
**Resource Attributes**

Attribute | Description | Type | Valid Value
:----- | :----- | :---- | :----
`href` | The application's fully qualified URL. | String | <span>--</span>
<a class="anchor" name="application-name"></a>`name` | The name of the application.  Must be unique across all applications within a [tenant](#tenants). | String | 1 <= N <= 255 characters. Unique within a tenant
<a class="anchor" name="application-description"></a>`description` | A description of the application. For example, providing the application's homepage URL might be helpful. | String | 0 <= N <= 4000 chars
<a class="anchor" name="application-status"></a>`status` | `enabled` applications allow accounts to login. `disabled` applications prevent accounts from logging in.  Newly created applications are `enabled` by default. | enum | `enabled`, `disabled`
<a class="anchor" name="application-tenant"></a>`tenant` | A link to the tenant that owns the application. | link | <span>--</span>
<a class="anchor" name="application-passwordResetTokens"></a>`passwordResetTokens` | A link to the application's password reset tokens collection, used in [password reset workflows](#application-password-reset). | link | <span>--</span>
<a class="anchor" name="application-loginAttempts"></a>`loginAttempts` | A link to to the application's login attempts collection.  When an account [attempts to login to an application](#workflow-login-attempt), the login attempt is submitted to this linked resource. | link | <span>--</span>
<a class="anchor" name="application-accounts-collection"></a>`accounts` | A link to all accounts that may login to the application.  This is an aggregate view of all accounts in the application's [assigned account stores](#account-store-mappings). | link | <span>--</span>
<a class="anchor" name="application-groups-attrib"></a>`groups` | A link to all groups that are accessible to the application for authorization (access control) needs.  This is an aggregate view of all groups in the application's [assigned account stores](#account-store-mappings). | link | <span>--</span>
<a class="anchor" name="application-accountStoreMappings"></a>`accountStoreMappings` | A link to the collection of all [account store mappings](#account-store-mappings) that represent the application.  The accounts and groups within the mapped account stores are obtainable by the `accounts` and `groups` links respectively. | link | <span>--</span>
<a class="anchor" name="application-defaultAccountStoreMapping"></a>`defaultAccountStoreMapping` | A link to the account store mapping that reflects the [default account store](#account-store-mapping-default-account-store) where the application will store newly created accounts.  (A POST to `/v1/applications/:applicationId/accounts` will result in storing the new account in the default account store). A `null` value disables the application from directly creating new accounts. | link | `null` or link
<a class="anchor" name="application-defaultGroupStoreMapping"></a>`defaultGroupStoreMapping` | A link to the account store mapping that reflects the [default group store](#account-store-mapping-default-group-store) where the application will store newly created groups.  (A POST to `/v1/applications/:applicationId/groups` will result in storing the new group in the default group store). A `null` value disables the application from directly creating new groups. | link | `null` or link

For Applications, you can:

* [Locate an application's REST URL](#application-url)
* [Create an application](#application-create) (aka Register an Application with Stormpath)
* [Retrieve an application](#application-retrieve)
* [Update an application](#application-update)
    * [Enable an application](#application-enable) to allow logins
    * [Disable an application](#application-disable) to prevent logins
* [Delete an application](#application-delete)
* [List applications](#applications-list)
* [Search applications](#applications-search)
* [Work with application accounts](#application-accounts)
* [Work with application groups](#application-groups)
* [Work with application account store mappings](#application-account-store-mappings)

<a class="anchor" name="application-url"></a>
### Locate an Application's REST URL

When communicating with the Stormpath REST API, you might need to reference an application using its REST URL or `href`.

In order to locate an application's `href`, you'll need to first [search](#search) for the tenant for the specific application using some information that you have available.

For example, if you want to find the `href` for an application named "My Application", you'll need to search the tenant for the "My Application" `application` resource:

**Example Request**

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/tenants/23mq7BPIxNgPUPZDwj04SZ/applications?name=My%20Application"

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8

    {
        "href": "https://api.stormpath.com/v1/tenants/23mq7BPIxNgPUPZDwj04SZ/applications",
        "offset": 0,
        "limit": 25,
        "items": [
          {
            "href": "https://api.stormpath.com/v1/applications/3hFENJHLaH1Vy4GSbscrtv"
            "name": "My Application"
            ... remaining Application name/value pairs ...
          }
        ]
    }

If you know the name exactly, you can use an [attribute search](#search-attribute) (e.g., `name=`) or, if you only know a small part, you can use a [filter search](#search-filter) (e.g., `q=My`) to narrow the results.

<a class="anchor" name="application-create"></a>
### Create an Application (aka Register an Application with Stormpath)

For an application to communicate with Stormpath, you must first register it with Stormpath.

You register an application with Stormpath by simply creating a new `application` resource.  This is performed by submitting an HTTP `POST` request to the `/v1/applications` endpoint.  This will create a new `Application` instance within the caller's tenant.

When you submit the `POST`, at least the `name` attribute must be specified, and it must be unique compared to all other applications in your tenant.  The `description` and `status` attribute are optional.

**Required Attribute**

* [name](#application-name) - must be unique compared to all other applications in your tenant.

**Optional Attributes**

* [description](#application-description)
* [status](#application-status) - if unspecified, the default is `enabled`.

**Example Request**

    POST https://api.stormpath.com/v1/applications
    Content-Type: application/json;charset=UTF-8

    {
      "name": "Best application ever",
      "description": "Really. The best application ever.",
      "status": "enabled"
    }

**Example Response**

    HTTP/1.1 201 Created
    Location: https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA
    Content-Type: application/json;charset=UTF-8;

    {
      "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA",
      "name": "Best application ever",
      "description": "Really. The best application ever.",
      "status": "ENABLED",
      "tenant": {
        "href": "https://api.stormpath.com/v1/tenants/cJoiwcorTTmkDDBsf02AbA"
      },
      "accounts": {
        "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/accounts"
      },
      "groups": {
        "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/groups"
      },
      "passwordResetTokens" : {
        "href" : "http://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/passwordResetTokens"
      }
    }

You may use the response's `Location` header or the top-level `href` attribute to further interact with your new `application` resource.

{% docs note %}
By default, no accounts may login to a newly created application, and the new application cannot create accounts or groups immediately.  Applications must first be associated with one or more [account stores](#account-store-mappings) to enable this behavior.

Account store association however is mostly used for more complex applications.  If you want to create an application quickly and enable this additional behavior immediately, use the `createDirectory` query parameter as discussed next.
{% enddocs %}

<a class="anchor" name="application-create-with-directory"></a>
#### Create an Application and Directory

The above Create Application POST request assumes you will later assign [account stores](#account-store-mappings) to the application so accounts may log in to the application.  This means that, by default, no one can login to a newly created application, nor can the application create new accounts or new groups directly.  For this additional functionality, one or more account stores must be associated with the application.

For many use cases, that is unnecessary work.  If you want to associate the Application with a new Directory automatically so you can start creating accounts and groups for the application immediately (without having to map other [account stores](#account-store-mappings), you can use the `createDirectory` query parameter.

##### createDirectory=true

When sending the `POST` request, you can append a `createDirectory=true` query parameter name/value pair to the POST URL:

    POST https://api.stormpath.com/v1/applications?createDirectory=true
    Content-Type: application/json;charset=UTF-8

    {
        "name": "My new app"
    }

This request will:

1. Create the application.
2. Create a brand new Directory and automatically name the directory based on the application.  The generated name will reflect the new application's name as best as is possible, guaranteeing that it is unique compared to any of your existing directories.
3. Set the new Directory as the application's initial [account store](#account-store-mappings).
4. Enable the new Directory as the application's [default account store](#application-defaultAccountStoreMapping), ensuring any new accounts created directly by the application are stored in the new Directory.
5. Enable the new Directory as the application's [default group store](#application-defaultGroupStoreMapping), ensuring any new groups created directly by the application are stored in the new Directory.

This allows you to create accounts and groups directly via the application's `/accounts` and `/groups` endpoints respectively immediately, without having to go through an account store mapping exercise.

##### createDirectory=a+custom+name

If you want to automatically create a Directory for your application, and you also want to manually specify the new Directory's name, instead of using a `true` value as the query parameter value, you can specify a String name instead:

    POST https://api.stormpath.com/v1/applications?createDirectory=My+App+Directory
    Content-Type: application/json;charset=UTF-8

    {
        "name": "My new app"
    }

this request will:

1. Create the application.
2. Create a brand new Directory and automatically set the Directory's name to be your specified text value (e.g. 'My App Directory' in the example above). **HOWEVER**: If the directory name you choose is already in use by another of your existing directories, the request will fail.  You will either need to choose a different directory name or specify `true` and let Stormpath generate an unused unique name for you.
3. Set the new Directory as the application's initial [account store](#account-store-mappings).
4. Enable the new Directory as the application's [default account store](#application-defaultAccountStoreMapping), ensuring any new accounts created directly by the application are stored in the new Directory.
5. Enable the new Directory as the application's [default group store](#application-defaultGroupStoreMapping), ensuring any new groups created directly by the application are stored in the new Directory.

{% docs note %}
Automatically creating a directory when creating an application *does not* make that Directory private or restrict usage to only that application. The created directory is no different than any other directory. The `createDirectory` query parameter exists as a convenience to reduce the number of steps you would have had to execute otherwise.

If you delete an application, you must manually delete any auto-created directory yourself.  There is no shortcut to delete an auto-created directory.  This is to ensure safety in case the directory might be used by other applications.
{% enddocs %}

<a class="anchor" name="application-retrieve"></a>
### Retrieve an Application

After you have created an application, you may retrieve its contents by sending a `GET` request to the application's URL returned in the `Location` header or `href` attribute.

If you don't have the application's URL, you can find it by [looking it up in the Stormpath Admin Console](/console/product-guide#!LocateAppURL) or by [searching your tenant's applications](#tenant-applications-search) for the application and then using its `href`.

**Example Request**

    GET https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
      "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA",
      "name": "Best application ever",
      "description": "Really. The best application ever.",
      "status": "ENABLED",
      "tenant": {
        "href": "https://api.stormpath.com/v1/tenants/cJoiwcorTTmkDDBsf02AbA"
      },
      "accounts": {
        "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/accounts"
      },
      "groups": {
        "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/groups"
      },
      "passwordResetTokens" : {
        "href" : "http://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/passwordResetTokens"
      }
    }

<a class="anchor" name="application-resources-expand"></a>
#### Expandable Resources

When retrieving an application, you can also retrieve one or more of its linked resources by [expanding them in-line](#links-expansion) using the `expand` query parameter.

The following `Application` attributes are expandable:

* `tenant`
* `accounts`
* `groups`

Also, because `accounts` and `groups` are [Collection Resources](#collections) themselves, you can additionally control [pagination](#pagination) for either expanded collection.  For example:

    GET https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA?expand=tenant,accounts(offset:0,limit:50)

See the [Link Expansion](#links-expansion) section for more information on expanding link attributes.

<a class="anchor" name="application-update"></a>
### Update an Application

Submit an HTTP `POST` to an application's `href` when you want to change one or more specific application attributes. Unspecified attributes are not changed, but at least one attribute must be specified.

**Updatable Application Attributes**

* [name](#application-name)
* [description](#application-description)
* [status](#application-status)

**Example Request**

    POST https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA
    Content-Type: application/json;charset=UTF-8

    {
      "description": "A new description."
    }

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
      "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA",
      "name": "Best application ever",
      "description": "A new description.",
      "status": "enabled",
      "tenant": {
        "href": "https://api.stormpath.com/v1/tenants/cJoiwcorTTmkDDBsf02AbA"
      },
      "accounts": {
        "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/accounts"
      },
      "groups": {
        "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/groups"
      },
      "passwordResetTokens" : {
        "href" : "http://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/passwordResetTokens"
      }
    }

<a class="anchor" name="application-enable"></a>
#### Enable an Application

Enabled applications allow associated accounts to login.  Disabled applications prevent logins.  When you create an application, it is `enabled` by default.

You can enable an application (and thereby allow associated accounts to login) by setting the `status` attribute to equal `ENABLED`.  For example:

**Example Request**

    POST https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA
    Content-Type: application/json;charset=UTF-8

    {
      "status": "ENABLED"
    }

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
      "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA",
      "name": "Best application ever",
      "description": "A new description.",
      "status": "ENABLED",
      "tenant": {
        "href": "https://api.stormpath.com/v1/tenants/cJoiwcorTTmkDDBsf02AbA"
      },
      "accounts": {
        "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/accounts"
      },
      "groups": {
        "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/groups"
      },
      "passwordResetTokens": {
        "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/passwordResetTokens"
      }
    }

<a class="anchor" name="application-disable"></a>
#### Disable an Application

Disabled applications prevent associated accounts from logging in.  When you create an application, it is `enabled` by default.

If you want to prevent logins for an application - for example, maybe you are undergoing maintenance and don't want accounts to login during this time - you can disable the application.

You can disable an application (and thereby prevent associated accounts from logging in) by setting the `status` attribute to equal `DISABLED`.  For example:

**Example Request**

    POST https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA
    Content-Type: application/json;charset=UTF-8

    {
      "status": "DISABLED"
    }

**Example Response**

    HTTP/1.1 200 OK
     Content-Type: application/json;charset=UTF-8;

     {
       "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA",
       "name": "Best application ever",
       "description": "A new description.",
       "status": "DISABLED",
       "tenant": {
         "href": "https://api.stormpath.com/v1/tenants/cJoiwcorTTmkDDBsf02AbA"
       },
       "accounts": {
         "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/accounts"
       },
       "groups": {
         "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/groups"
       },
       "passwordResetTokens": {
         "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/passwordResetTokens"
       }
     }

<a class="anchor" name="application-delete"></a>
### Delete an Application

You can delete an application ('unregister it') by sending an HTTP `DELETE` request to the application's `href` URL.

{% docs warning %}
Deleting an application completely erases the application and any of its related data from Stormpath.
{% enddocs %}

We recommend that you [disable an application](#application-disable) instead of deleting it if you anticipate that you might use the application again or if you want to retain its data for historical reference.

If you wish to delete an application:

**Example Request**

    DELETE https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA

**Example Response**

    HTTP/1.1 204 No Content

{% docs info %}
The `Stormpath` console application cannot be deleted.
{% enddocs %}

<a class="anchor" name="applications-list"></a>
### List Applications

You may list your tenant's applications as described in [List Tenant Applications](#tenant-applications-list).

<a class="anchor" name="applications-search"></a>
### Search Applications

You may search for applications as described in [Search Tenant Applications](#tenant-applications-search).

<a class="anchor" name="application-accounts"></a>
### Application Accounts

An application's account base is the collection of all [accounts](#accounts) that are accessible to that application.

You define an application's account base by assigning one or more [directories](#directories) (or [groups](#groups) within directories) to that application; by association, **any accounts within assigned directories (or groups) may login to the application**.

In this way, applications do not have _direct_ accounts of their own (accounts are 'owned' by [directories](#directories)) - accounts are instead _made available to_ applications based on associations with directories or groups within directories.

This is a powerful feature within Stormpath that allows you to segment account populations and control how accounts may use one or more applications.  For example, you might have an "Employees" directory and a "Customers" directory, which are two very different account populations that may or may not have access to the same applications.

**The aggregate collection of all accounts across all assigned directories or groups is the application's effective account base.**

However, many applications do not need this feature.  The most common use case in Stormpath is to create an application and a single directory solely for the purpose of that application's needs.  This is a totally valid approach and a good idea when starting with Stormpath.  However, rest assured that you have the flexibility to control your account populations in convenient ways as you expand to use Stormpath for any of your other applications. We'll cover directory and group associations for login more in-depth later.

**Application Accounts Collection Resource URI**

    /v1/applications/:applicationId/accounts

Applications additionally support the following account-specific functionality:

* [Register A New Application Account](#application-account-register)
    * and optionally specify your own [account-specific custom data](#application-account-register-with-customData)
* [Verify An Application Account's Email Address](#application-verify-email)
* [Log In (Authenticate) an Application Account](#application-account-authc)
* [Reset An Application Account's Password](#application-password-reset)
* [List an Application's Accounts](#application-accounts-list)
* [Search an Application's Accounts](#application-accounts-search)

<a class="anchor" name="application-account-register"></a>
#### Register a New Application Account

If your application wants to register a new account, you create a new `account` resource on the application's `accounts` endpoint.

`POST` the [account resource attributes](#account-resource) required and any additional ones you desire.

**Example Request**

    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
         -H "Accept: application/json" \
         -H "Content-Type: application/json" \
         -d '{
             "username" : "jlpicard",
             "email" : "capt@enterprise.com",
             "givenName" : "Jean-Luc",
             "middleName" : "",
             "surname" : "Picard",
             "password" : "uGhd%a8Kl!"
             "status" : "ENABLED",
         }' \
     "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/accounts"

The response will contain the newly saved resource:

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
      "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA",
      "username" : "jlpicard",
      "email" : "capt@enterprise.com",
      "fullName" : "Jean-Luc Picard",
      "givenName" : "Jean-Luc",
      "middleName" : "",
      "surname" : "Picard",
      "status" : "ENABLED",
      "customData": {
        "href": "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/customData"
      },
      "groups" : {
        "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/groups"
      },
      "groupMemberships" : {
        "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/groupMemberships"
      },
      "directory" : {
        "href" : "https://api.stormpath.com/v1/directories/1FaQ6kZxTL4DVJXWeXtUh7"
      },
      "tenant" : {
        "href" : "https://api.stormpath.com/v1/tenants/Ad8mIcavSty7XzD-xZdP3g"
      },
      "emailVerificationToken" : null
    }

**How does this work?**

As we [said previously](#application-accounts), an Application does not 'own' accounts of its own - it has access to accounts in one or more directories or groups and the directories actually own the accounts.  So how are we able to create a new account based on only the application?

The `v1/applications/:applicationId/accounts` URI is a convenience: when you `POST` a new `account` resource, Stormpath will automatically route that creation request to a [designated directory or group assigned to the Application](#application-defaultAccountStoreMapping).  The account is then persisted in that directory or group and then made immediately available to the application.

Stormpath uses a generic term, _Account Store_, to generically refer to either a directory or a group since they are both containers for (store) accounts.

For most applications that have only a single assigned _account store_ (again, a directory or group), the account is persisted in that account store immediately - the application developer does not even really need to know that Stormpath automates this.

However, applications that map more than one account store to define their account population have the option of specifying _which_ of those mapped account stores should receive newly created accounts.  You can choose a [_default_ account store](#application-defaultAccountStoreMapping).  If you do not choose one, the first one in the list of mapped account stores is the default location to store new accounts.  We'll talk about setting the default account store and managing an application's assigned account stores later in [Application Account Store Mappings](#application-account-store-mappings).

<a class="anchor" name="application-account-register-with-customData"></a>
##### Register a New Application Account with your own Custom Data

When you create an application account, in addition to Stormpath's account attributes, you may also specify [your own custom data](#custom-data) by including a `customData` JSON object:

    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
         -H "Accept: application/json" \
         -H "Content-Type: application/json" \
         -d '{
                 "username" : "jlpicard",
                 "email" : "capt@enterprise.com",
                 "givenName" : "Jean-Luc",
                 "middleName" : "",
                 "surname" : "Picard",
                 "password" : "uGhd%a8Kl!"
                 "status" : "ENABLED",
                 "customData": {
                     "rank": "Captain",
                     "birthDate": "2305-07-13",
                     "birthPlace": "La Barre, France",
                     "favoriteDrink": "Earl Grey tea"
                 }
             }' \
         "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/accounts"

Once created, you can further modify the custom data - delete it, add and remove attributes, etc as necessary.  See the [custom data](#custom-data) section for more information and customData requirements/restrictions.

<a class="anchor" name="application-welcome-email"></a>
##### Send a Welcome Email

Stormpath makes it easy to send a welcome email to the person associated with a newly created account.

When you create a new `account` resource, it is stored in a Directory. If the account is created in a directory with [Account Registration](#application-account-register) enabled, Stormpath will automatically send the welcome email to the account's email address on your behalf.

The email will be shown as coming from your email address, and you don't have to worry about email servers or how to send the email yourself.  You can customize the email template to say whatever you like.

By association then, if you add an account to your application programmatically or through the Stormpath Admin Console, and that account is stored in a directory with this feature enabled, Stormpath will send a welcome email to that account email address.

This workflow is disabled by default on Directories, but you can enable it easily in the Stormpath Admin Console UI. Refer to the [Stormpath Admin Console product guide](https://stormpath.com/docs/console/product-guide#!ManageWorkflowAutomation) for complete instructions.

<a class="anchor" name="application-verify-email"></a>
#### Verify An Account's Email Address

This workflow allows you to send a welcome email to a newly registered account and optionally verify that they own the email addressed used during registration.

The email verification workflow involves changes to an account at an application level, and as such, this workflow relies on the `account` resource as a starting point. For more information on working with these workflows via REST after they have already been configured, refer to the [Working With Accounts](#account-verify-email) section of this guide.
This workflow is disabled by default for accounts, but you can enable it easily in the Stormpath Admin Console UI. Refer to the [Stormpath Admin Console product guide](https://stormpath.com/docs/console/product-guide#!ManageWorkflowAutomation) for complete instructions.

{% docs note %}
Workflows are only available on cloud directories and only configurable using the Stormpath Admin Console. They are not currently configurable via the REST API. Also, the Stormpath Administrator directory's automated workflows cannot be altered.
{% enddocs %}

<a class="anchor" name="application-account-authc"></a>
#### Log In (Authenticate) an Account

You may authenticate an account by `POST`ing a `loginAttempt` resource to the application's login attempts endpoint:

<a class="anchor" name="application-log-in-attempt-uri"></a>
**Application Login Attempt Collection Resource URI**

    /v1/applications/:applicationId/loginAttempts

<a class="anchor" name="application-log-in-attempt-attributes"></a>
**Login Attempt Resource Attributes**

Attribute | Description | Type | Valid Value
:----- | :----- | :---- | :----
<a class="anchor" name="login-attempt-type"></a>`type` | The type of the login attempt. The only currently supported type is `basic`. Additional types will likely be supported in the future. | Enum | basic
<a class="anchor" name="login-attempt-value"></a>`value` | The Base64 encoded username:plaintextPassword pair. For example, for username `jsmith` or email `jsmith@email.com` and plaintext password `mySecretPassword` this `value` attribute would be set to the following computed result: `base64_encode("jsmith:mySecretPassword");` </p> The `base64_encode` method call is only an example. You will need to use the Base64 encoding method is available to you in your chosen programming language and/or software frameworks. | String | Base64 encoded String
<a class="anchor" name="login-attempt-accountStore"></a>`accountStore` | An optional link to the application's accountStore (directory or group) that you are certain contains the account attempting to login.  <p>Specifying this attribute can speed up logins if you know exactly which of the application's assigned account stores contains the account: Stormpath will not have to [iterate over the assigned account stores](#workflow-login-attempt) to find the account to authenticate it.  This can speed up logins significantly if you have many account stores (> 15) assigned to the application.</p> This is an optional attribute. | link | --

**Execute Account Login Attempt (HTTP POST)**

An HTTP `POST` authenticates an associated application account. Only HTTP `POST` is supported.

The `POST` body must be a JSON object with the Login Attempt Resource Attributes (`type` and `value`).

The `type` attribute must equal `basic`.  You compute the `value` using the following (pseudo code) logic:

    String concatenated = username_or_email + ':' + plain_text_password
    byte[] bytes = concatenated.to_byte_array()
    String value = base64_encode( bytes )

For example, if the username is `jsmith` and the password is `changeme`, you can compute the `value` using [OpenSSL](http://www.openssl.org/):

    $ echo -n "jsmith:changeme" | openssl enc -base64
    anNtaXRoOmNoYW5nZW1l

Place the result in the request body as the `value` JSON attribute, for example:

**Example Request**

    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{
           "type": "basic",
           "value": "anNtaXRoOmNoYW5nZW1l"
         }' \
     "https://api.stormpath.com/v1/applications/$YOUR_APPLICATION_ID/loginAttempts"

If the login attempt is successful, a `200 OK` response is returned with a [link](#links) to the successfully authenticated account:

**Example Login Attempt Success Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
      "account": {
        "href" : "https://api.stormpath.com/v1/accounts/5BedLIvyfLjdKKEEXAMPLE"
      }
    }

If the login attempt fails, a `400 Bad Request` is returned with an [error payload](#errors) explaining why the attempt failed:

**Example Login Attempt Failure Response**

    HTTP/1.1 400 Bad Request
    Content-Type: application/json;charset=UTF-8;

    {
      "status": 400,
      "code": 400,
      "message": "Invalid username or password.",
      "developerMessage": "Invalid username or password.",
      "moreInfo": "mailto:support@stormpath.com"
    }

If you desire to target a specific accountStore, then include the reference in the request.  For example:

**Example Request with AccountStore**

    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{
           "type": "basic",
           "value": "anNtaXRoOmNoYW5nZW1l"
           "accountStore": {
                 "href": "https://api.stormpath.com/v1/groups/$YOUR_GROUP_ID"
           }
         }' \
     "https://api.stormpath.com/v1/applications/$YOUR_APPLICATION_ID/loginAttempts"

If the login attempt is successful, a `200 OK` response is returned with a [link](#links) to the successfully authenticated account:

**Example Login Attempt with AccountStore Success Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
      "account": {
        "href" : "https://api.stormpath.com/v1/accounts/5BedLIvyfLjdKKEEXAMPLE"
      }
    }

If the login attempt fails, a `400 Bad Request` is returned with an [error payload](#errors) explaining why the attempt failed:

**Example Login Attempt with AccountStore Failure Response**

    HTTP/1.1 400 Bad Request
    Content-Type: application/json;charset=UTF-8;

    {
      "status" : 400,
      "code" : 5114,
      "message" : "Oops! We encountered an unexpected error.  Please contact support and explain what you were doing at the time this error occurred.",
      "developerMessage" : "The specified application account store reference is invalid: the specified account store is not one of the application's assigned account stores.  Targeted authentication attempts must target one of the application's existing assigned account stores.",
      "moreInfo" : "https://www.stormpath.com/docs/errors/5114"
    }

If you want the actual account object returned from a successful authentication attempt, then you can [expand the account in-line](#links-expansion) using the `expand` query parameter.  For example:

**Example Request with Account Expansion**

    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{
           "type": "basic",
           "value": "anNtaXRoOmNoYW5nZW1l"
         }' \
     "https://api.stormpath.com/v1/applications/$YOUR_APPLICATION_ID/loginAttempts?expand=account"

If the login attempt is successful, a `200 OK` response is returned with the successfully authenticated account:

**Example Response with Account Expansion**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
      "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA",
      "username" : "jsmith",
      "email" : "jsmith@mailinator.com",
      "fullName" : "John Smith",
      "givenName" : "John",
      "middleName" : "",
      "surname" : "Smith",
      "status" : "ENABLED",
      "customData": {
        "href": "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/customData"
      },
      "groups" : {
        "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/groups"
      },
      "groupMemberships" : {
        "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/groupMemberships"
      },
      "directory" : {
        "href" : "https://api.stormpath.com/v1/directories/1FaQ6kZxTL4DVJXWeXtUh7"
      },
      "tenant" : {
        "href" : "https://api.stormpath.com/v1/tenants/Ad8mIcavSty7XzD-xZdP3g"
      },
      "emailVerificationToken" : null
    }

<a class="anchor" name="application-password-reset"></a>
#### Reset An Account's Password

Stormpath has a comprehensive mechanism for secure password reset, as well.

##### Understanding The Password Reset Workflow

In Stormpath, the model used for password reset is based the common standard of sending an email to the address associated with the account. This email contains a verification link with a limited-life token. The end-user clicks this link and is redirected to either your own or a Strompath-owned password reset page where he or she can enter a new password.

{% docs note %}
At no point is the user shown, or does Stormpath have access to, the original password once it has been hashed during account creation. The only ways to change an account password through Stormpath once an account has been created are to allow the user to update it (without seeing the original value) after being authenticated or to use the password reset workflow.
{% enddocs %}

<a class="anchor" name="password-reset-base-URL"></a>
###### The Password Reset Base URL

It is also expected that the directory's Password Reset workflow's `Password Reset Base URL` has been set to a URL that will be processed by your own application web server. This URL should be free of any query parameters, as the Stormpath back-end will append on to the URL a parameter used to verify the email. If this URL is not set, a default Stormpath-branded page will appear which allows the user to complete the workflow.

{% docs note %}
The `Account Verification Base URL` defaults to a Stormpath API Sever URL which, while it is functional, is a Stormpath API server web page.  Because it will likely confuse your application end-users if they see a Stormpath web page, we strongly recommended that you specify a URL that points to your web application. Moreover, when specifying the Base URL, ensure it is a Base URL without query parameters
{% enddocs %}

<a class="anchor" name="applications-account-password-reset"></a>
##### Trigger The Password Reset Email (Create A Token)

In order to reset an account's password, you'll need to create a `passwordResetToken`. In order to generate these tokens, you must retrieve an email address from the user and pass it along with the request.

Generating a `passwordResetToken` will inform Stormpath that you wish to initiate a password reset for a particular account. In addition, creating a new password reset token will automatically send a password reset email to the provided email address if and only if that address corresponds with an account listed in the application's [account stores](#account-store-mappings).

The application password reset tokens endpoint supports the password reset workflow for an account in the application's assigned [account stores](#account-store-mappings).

**Password Reset Tokens Collection Resource URI**

    /v1/applications/:applicationId/passwordResetTokens

**Resource Attributes**

Attribute | Description | Type | Valid Value
:----- | :----- | :---- | :----
<a class="anchor" name="password-reset-url"></a>`href` | Fully qualified URL of the password reset token resource. | String | <span>--</span>
<a class="anchor" name="password-reset-email"></a>`email` | Email address of the account for which the password reset will occur. | String | Valid email address. Required.
<a class="anchor" name="password-reset-acount"></a>`account` | A link to the account for which the password reset will occur. | Link | Cannot set in a request. Returned in a response only.

The application password reset tokens endpoint supports the password reset workflow for an account in the application assigned [account stores](#account-store-mappings).

Creating a new password reset token automatically sends a password reset email to the destination email address if that address corresponds to an account listed in the application [account stores](#account-store-mappings).

A successful HTTP `POST` sends a password reset email to the first discovered account associated with the corresponding application. The email recipient can then click a password reset URL in the email to reset their password in a web form.

The `POST` body must be a JSON object with a single email attribute:

**Example Request**

    POST https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/passwordResetTokens
    Content-Type: application/json;charset=UTF-8

    {
      "email": "john.smith@stormpath.com"
    }

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
      "href" : "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/passwordResetTokens/j6HqguWPSBSXM2xmcOUShw"
      "email" : "john.smith@stormpath.com"
      "account" : {
        "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02bAb"
      }
    }

A `200 OK` response indicates that a password reset email will be sent as soon as possible to the email specified.

If the password reset token creation fails, a `400 Bad Request` is returned with an [error payload](#errors) explaining why the attempt failed:

**Example Password Reset Token Creation Failure Response**

    HTTP/1.1 404 Not Found
    Content-Type: application/json;charset=UTF-8;

    {
      status: 404
      code: 404
      message: "The requested resource does not exist."
      developerMessage: "The requested resource does not exist."
      moreInfo: "mailto:support@stormpath.com"
    }

At this point, an email will be built using the [password reset base URL](#password-reset-base-URL) specified in the Stormpath Admin Console.

In a real-world implementation, you must build an end-point in your application that is designed to accept a request with the query string parameter "sptoken", which is the token value generated for the user. This token is then used to verify the reset request before updating the account accordingly.

<a class="anchor" name="password-reset-token-retrieve"></a>
##### Validate A Password Reset Request (Validate A Token)

Once you've successfully generated a token for a password request, you'll need to consume it to allow the user to change his or her password. To do this, Stormpath sends an email (that you can customize) to the user with a link and a verification token in the format that follows:

    http://yoursite.com/path/to/reset/page?sptoken=$TOKEN

Once the user clicks this browser, your controller should retrieve the token from the query string and check it against the Stormpath API.

Retrieving a token resource successfully using an `HTTP GET` indicates that the token is valid. Thus, to validate a token, you call to the `passwordResetTokens` end point and specify the token captured from the query string as the specific resource to request:

**Example GET Request**

    GET https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/passwordResetTokens/j6HqguWPSBSXM2xmcOUShw

**Example Success Response (if token is valid)**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
      "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/passwordResetTokens/j6HqguWPSBSXM2xmcOUShw",
      "email": "john.smith@stormpath.com",
      "account": {
          "href": "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02bAb"
      }
    }

If the password reset token is invalid - it never existed or has expired - a `404 Not Found` response is returned.

**Example Error Response**

     HTTP/1.1 404 Not Found
     Content-Type: application/json;charset=UTF-8;

       {
         "status": 404,
         "code": 404,
         "message": "The requested resource does not exist.",
         "developerMessage": "The requested resource does not exist.",
         "moreInfo": "mailto:support@stormpath.com"
      }

After a successfully `GET` with the query string token, you'll receive back an Account `href`. Use this `href` to target the specific account resouce for which you want to set a new password. You do this just like any other [account update](#account-update), by specifying the attribute to update and calling the update request.

<a class="anchor" name="application-accounts-list"></a>
#### List Application Accounts

You can list your application's accounts by sending a `GET` request to your application's `accounts` Collection Resource `href` URL.  The response is a [paginated](#pagination) list of application accounts.

You may also use collection [pagination](#pagination) and [sort ordering](#sorting) query parameters to customize the paginated response.

**Example Request**

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/applications/$APPLICATION_ID/accounts"
<!-- {: .bash} -->

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8

    {
      "href": "https://api.stormpath.com/v1/applications/cJoiwcorTTmkDDBsf02AbA/accounts",
      "offset": 0,
      "limit": 25,
      "items" : [
        {
          "href" : "https://api.stormpath.com/v1/accounts/WpM9nyZ2TbaEzfbRvLk9KA"
          ... remaining Account name/value pairs ...
        },
        {
          "href" : "https://api.stormpath.com/v1/accounts/aLlyOUrBAse34js9hjiH9j"
          ... remaining Account name/value pairs ...
        },
        {
          "href" : "https://api.stormpath.com/v1/accounts/Xhf0a9HLA02djsdP90dsQ2"
          ... remaining Account name/value pairs ...
        },
      ]
    }

<a class="anchor" name="application-accounts-search"></a>
#### Search Application Accounts

You may search for directories by sending a `GET` request to your application's `accounts` Collection Resource `href` URL using [search query parameters](#search).  Any matching directories with your tenant will be returned as a [paginated](#pagination) list.

##### Searchable Account Attributes

The following [account attributes](#account-resource) are searchable via [filter](#search-filter) and [attribute](#search-attribute) searches:

* `givenName`
* `middleName`
* `surname`
* `username`
* `email`

In addition to the [search query parameters](#search), you may also use [pagination](#pagination) and [sorting](#sorting) query parameters to customize the paginated response.  For example:

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/applications/$APPLICATION_ID/accounts?q=foo&orderBy=surname&offset=0&limit=50"
<!-- {: .bash} -->

#### More Account Functionality

Account CRUD and other behavior that is not application-specific is covered in the main [Accounts section](#accounts).

<a class="anchor" name="application-groups"></a>
### Application Groups

As we've seen with [application accounts](#application-accounts), applications themselves also do not have _direct_ groups of their own.  Like accounts, groups are 'owned' by [directories](#directories) and instead _made available to_ applications.

This means an application's collection of groups is _virtual_.  This virtual collection is an aggregate 'view' of all groups that are:

1. directly assigned to the application as an [account store](#account-store-mappings)
2. in a directory that is assigned to the application as an [account store](#account-store-mappings)

This is a powerful and convenient feature: as you add or remove account stores from an application to control its user population, you automatically 'bring in' any groups that may be assigned to your user accounts.  You can interact with this collection, like [search it](#application-groups-search) or [add groups to it](#application-group-register), like you would a normal group collection.

You can then reference these groups in the application's source code to check group membership and perform Role Based Access Control (RBAC).  For example, you might have an "Admin" group and a "User" group which would enable very different functionality in your application when a user account is associated with one group or the other.

{% docs info %}
Most application developers do not need to be aware that an application's `groups` collection is virtual.  The most common case in Stormpath for simpler apps is to just [create an application with its own directory](#application-create-with-directory) for its own needs.  Used this way, the application's and the directory's accounts and groups are the same.  

But it is nice to know that you can customize the application's account population with other directories or groups in the future if you need to do so.
{% enddocs %}

**Application Groups Collection Resource URI**

    /v1/applications/:applicationId/groups

Applications additionally support the following group-specific functionality:

* [Create A New Application Group](#application-groups-create)
* [List an Application's Groups](#application-groups-list)
* [Search an Application's Groups](#application-groups-search)

<a class="anchor" name="application-groups-create"></a>
#### Create a New Application Group

If your application wants to create a new group, POST the [group resource attributes](#group) application’s `groups` endpoint.

**Example Request**

    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
         -H "Accept: application/json" \
         -H "Content-Type: application/json" \
         -d '{
           "name": "Jedi High Council"
           "description": "Elected leaders of the Jedi Order."
           "status": "ENABLED"
         }' \
      "https://api.stormpath.com/v1/applications/bckhcGMXQDujIXpbCDRb2Q/groups"

**Example Response**

    HTTP/1.1 201 Created
    Location: https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ
    Content-Type: application/json;charset=UTF-8;
    
    {
      "href" : "https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ",
      "name" : "Jedi High Council",
      "description" : "Elected leaders of the Jedi Order.",
      "status" : "ENABLED",
      "directory" : {
        "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q"
      },
      "tenant" : {
        "href" : "https://api.stormpath.com/v1/tenants/Gh9238fksJlsieJkPkQuW"
      },
      "accounts" : {
        "href" : "https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ/accounts"
      }
    }

**How does this work?**

As we [mentioned above](#application-groups), an Application does not 'own' groups of its own - it has access to groups directly (or indirectly) assigned to it.  So how are we able to create a new group based on only the application?

The `v1/applications/:applicationId/groups` URI is a convenience: when you `POST` a new `group` resource, Stormpath will automatically route that creation request to a [designated directory assigned to the Application](#application-defaultGroupStoreMapping).  The group is then persisted in that directory and then made immediately available to the application.

For most applications that have only a single assigned account store, the group is persisted in that account store immediately - the application developer does not even really need to know that Stormpath automates this.

However, applications that are assigned more than one account store have the option of specifying _which_ of those mapped account stores should receive newly created groups.  You can choose a [_default_ group store](#application-defaultGroupStoreMapping).  If you do not choose one, the first one in the list of mapped account stores is the default location to store newly created groups.  We'll talk about setting the default group store and managing an application's assigned account stores later in [Application Account Store Mappings](#application-account-store-mappings).

<a class="anchor" name="application-groups-create-with-customData"></a>
##### Create a New Application Group with your own Custom Data

When you create an application group, in addition to Stormpath's group attributes, you may also specify [your own custom data](#custom-data) by including a `customData` JSON object:

    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
         -H "Accept: application/json" \
         -H "Content-Type: application/json" \
         -d '{
                 "name" : "Jedi High Council",
                 "description": "Elected leaders of the Jedi Order",
                 "status": "ENABLED",
                 "customData": {
                     "Headquarters": "High Council Chamber, High Council Tower, Jedi Temple, Coruscant",
                     "Affiliation": "Jedi Order",
                 }
             }' \
         "https://api.stormpath.com/v1/applications/bckhcGMXQDujIXpbCDRb2Q/groups"

Once created, you can further modify the custom data - delete it, add and remove attributes, etc as necessary.  See the [custom data](#custom-data) section for more information and customData requirements/restrictions.

<a class="anchor" name="application-groups-list"></a>
#### List Application Groups

You can list your application's groups by sending a `GET` request to your application's `groups` Collection Resource `href` URL.  The response is a [paginated](#pagination) list of application groups.

You may also use collection [pagination](#pagination) and [sort ordering](#sorting) query parameters to customize the paginated response.

**Example Request**

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/applications/$APPLICATION_ID/groups"
<!-- {: .bash} -->

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8

    {
      "href": "https://api.stormpath.com/v1/applications/cJoiwcorTTmkDDBsf02AbA/groups",
      "offset": 0,
      "limit": 25,
      "items" : [
        {
          "href" : "https://api.stormpath.com/v1/groups/WpM9nyZ2TbaEzfbRvLk9KA"
          ... remaining Group name/value pairs ...
        },
        {
          "href" : "https://api.stormpath.com/v1/groups/aLlyOUrBAse34js9hjiH9j"
          ... remaining Group name/value pairs ...
        },
        {
          "href" : "https://api.stormpath.com/v1/groups/Xhf0a9HLA02djsdP90dsQ2"
          ... remaining Group name/value pairs ...
        },
      ]
    }

<a class="anchor" name="application-groups-search"></a>
#### Search Application Groups

You may search for groups by sending a `GET` request to your application's `groups` Collection Resource `href` URL using [search query parameters](#search).  Any matching groups within your application will be returned as a [paginated](#pagination) list.

##### Searchable Group Attributes

The following [account attributes](#account-resource) are searchable via [filter](#search-filter) and [attribute](#search-attribute) searches:

* `name`
* `description`

In addition to the [search query parameters](#search), you may also use [pagination](#pagination) and [sorting](#sorting) query parameters to customize the paginated response.  For example:

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/applications/$APPLICATION_ID/groups?q=foo&orderBy=name&offset=0&limit=50"
<!-- {: .bash} -->

#### More Group Functionality

Group CRUD and other behavior that is not application-specific is covered in the main [Groups section](#groups).

<a class="anchor" name="application-account-store-mappings"></a>
### Application Account Store Mappings

Stormpath uses the term _Account Store_ to generically refer to either a [group](#groups) or a [directory](#directories), since they both contain (store) accounts.

An application's `accountStoreMappings` collection, then, reflects all [groups](#groups) and [directories](#directories) that are assigned to that application for the purpose of providing accounts that may login to the application.  This is a powerful feature in Stormpath that allows you to control which account populations may login to an application.

However, many applications do not need this feature.  The most common use case in Stormpath is to create an application and a single directory solely for the purpose of that application's needs.  This is a valid approach and a good idea when starting with Stormpath.  However, rest assured that you have the flexibility to control your account populations in convenient ways as you expand to use Stormpath for any of your other applications.

You define and modify an application's account store mappings by creating, modifying or deleting [Account Store Mapping](#account-store-mappings) resources.

**Application Account Store Mappings Collection Resource URI**

    /v1/applications/:applicationId/accountStoreMappings

<a class="anchor" name="application-account-store-mappings-list"></a>
#### List Application Account Store Mappings

You can list an application's assigned account stores by sending a `GET` request to the application's `accountStoreMappings` Collection Resource `href` URL.  The response is a [paginated](#pagination) list of application account store mappings.

You may also use collection [pagination](#pagination) and [sort ordering](#sorting) query parameters to customize the paginated response.

**Example Request**

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/applications/$APPLICATION_ID/accountStoreMappings"
<!-- {: .bash} -->

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8

    {
      "href": "https://api.stormpath.com/v1/applications/5D26Bl8lHTct1FDCHrltc3/accountStoreMappings",
      "offset": 0,
      "limit": 25,
      "items" : [
        {
          "href" : "https://api.stormpath.com/v1/accountStoreMappings/XpM9nyZ2TbaEzfbRvLk9KA"
          ... remaining Account Store Mapping name/value pairs ...
        },
        {
          "href" : "https://api.stormpath.com/v1/accountStoreMappings/aLlyOUrBAse34js9hjiH9j"
          ... remaining Account Store Mapping name/value pairs ...
        },
        {
          "href" : "https://api.stormpath.com/v1/accountStoreMappings/Xhf0a9HLA02djsdP90dsQ2"
          ... remaining Account Store Mapping name/value pairs ...
        },
      ]
    }

***

<a class="anchor" name="account-store-mappings"></a>
## Account Store Mappings

_Account Store_ is a generic term for either a [Directory](#directories) or a [Group](#groups).  Directories and Groups are both are considered "account stores" because they both contain, or 'store', Accounts. An _Account Store Mapping_, then, represents an Account Store mapped (assigned) to an Application.

In Stormpath, you control who may login to an application by associating (or 'mapping') one or more account
stores to an application.  All of the accounts across all of an application's assigned account stores form the application's
effective _user base_; those accounts may login to the application.  If no account stores are assigned to an application, no accounts will be able to login to the application.

You control which account stores are assigned (mapped) to an application, and the order in which they are consulted during a login attempt, by manipulating an application's `AccountStoreMapping` resources.

<a class="anchor" name="workflow-login-attempt"></a> 
**How Login Attempts Work**

When an account tries to login to your application, you submit a request to your application's `/loginAttempts` endpoint.  Stormpath then consults the application's assigned account stores _in the order that they are assigned to the application_.  When a matching account is discovered in a mapped account store, it is used to verify the authentication attempt and all subsequent account stores are ignored.  In other words, accounts are matched for application login based on a 'first match wins' policy.

Let's look at an example to illustrate this behavior.  Assume that two account stores, a 'Customers' directory and an 'Employees' directory have been assigned (mapped) to a 'Foo' application, in that order.

The following flow chart shows what happens when an account attempts to login to the Foo application:

<img src="http://www.stormpath.com/sites/default/files/docs/LoginAttemptFlow.png" alt="Account Stores Diagram" title="Account Stores Diagram" width="650" height="500">

As you can see, Stormpath tries to find the account in the 'Customers' directory first because it has a higher _priority_ than the 'Employees' directory.  If not found, the 'Employees' directory is tried next as it has a lower priority.

You can assign multiple account stores to an application, but only one is required to enable login for an application.  Assigning multiple account stores (directories or groups) to an application, as well as configuring their priority, allows you precise control over the account populations that may login to your various applications.

### Account Store Mapping Resource

An individual `accountStoreMapping` resource may be accessed via its Resource URI:

<a class="anchor" name="account-store-mapping-url"></a>
**Resource URI**

    /v1/accountStoreMappings/:accountStoreMappingId

<a class="anchor" name="account-store-mapping-resource-attributes"></a>
**Resource Attributes**

Attribute | Description | Type | Valid Value
:----- | :----- | :---- | :----
`href` | The account store mapping resource's fully qualified location URI. | String | <span>--</span>
<a id="account-store-application"></a>`application` | A link to the mapping's Application. Required. | link | <span>--</span>
<a id="account-store-accountStore"></a>`accountStore` | A link to the mapping's account store (either a Group or Directory) containing accounts that may login to the `application`.  Required. | link | <span>--</span>
<a id="list-index"></a>`listIndex` | The order (priority) when the associated `accountStore` will be consulted by the `application` during an authentication attempt.  This is a zero-based index; an account store at `listIndex` of `0` will be consulted first (has the highest priority), followed the account store at `listIndex` `1` (next highest priority), etc.  Setting a negative value will default the value to `0`, placing it first in the list.  A `listIndex` of larger than the current list size will place the mapping at the end of the list and then default the value to `(list size - 1)`. | Integer | 0 <= N < list size
<a id="account-store-mapping-resource-is-default-account-store"></a>`isDefaultAccountStore` | A `true` value indicates that new accounts [created by the application](#application-account-register) will be automatically saved to the mapping's `accountStore`. A `false` value indicates that new accounts created by the application will not be saved to the `accountStore`. | boolean | `true`,`false`
<a id="account-store-mapping-resource-is-default-group-store"></a>`isDefaultGroupStore` | A `true` value indicates that new groups created by the `application` will be automatically saved to the mapping's `accountStore`. A `false` value indicates that new groups created by the application will not be saved to the `accountStore`. **This may only be set to `true` if the `accountStore` is a Directory.  Stormpath does not currently support Groups storing other Groups.** | boolean | `true`,`false`

For Account Store Mappings, you may:

* [Locate an account store mapping's REST URL](#account-store-mapping-url)
* [Create an account store mapping](#account-store-mapping-create)
* [Retrieve an account store mapping](#account-store-mapping-retrieve)
* [Update an account store mapping](#account-store-mapping-update)
    * [Set the login priority](#account-store-mapping-update-priority) of an assigned account store
    * [Set the default account store](#account-store-mapping-default-account-store) for new accounts created by an application
    * [Set the default group store](#account-store-mapping-default-group-store) for new groups created by an application
* [Delete an account store mapping](#account-store-mapping-delete)
* [List an application's assigned account stores](#account-store-mapping-list)

<a class="anchor" name="account-store-mapping-url"></a>
### Locate an Account Store Mapping's REST URL

You locate an Account Store Mapping's `href` by [listing an Application's associated Account Store Mappings](#application-account-store-mappings-list).  Within the list, find the `AccountStoreMapping` you need - it will have a unique `href` property.

<a class="anchor" name="account-store-mapping-create"></a>
### Create an Account Store Mapping

In order for accounts in a Directory or Group to be able to login to an application, you must associate or 'map' the Directory or Group to the Application.  You do this by creating a new `AccountStoreMapping` resource that references both the account store and application.

You do this by `POST`ing a new `AccountStoreMapping` resource to the `/v1/accountStoreMappings` URI. You must specify the application and the account store via their respective `href`s.

**Required Attributes**

* [application](#account-store-application) (a link)
* [accountStore](#account-store-accountStore) (a link)

**Optional Attributes**

* [listIndex](#list-index)
* [isDefaultAccountStore](#account-store-mapping-resource-is-default-account-store) - if unspecified, the default is `false`
* [isDefaultGroupStore](#account-store-mapping-resource-is-default-group-store) - if unspecified, the default is `false`

**Example Request**

    curl -X POST -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Content-Type: application/json;charset=UTF-8" \
         -d '{
               "application": {
                 "href": "https://api.stormpath.com/v1/applications/Uh8FzIouQ9C8EpcExAmPLe"
               }
               "accountStore": {
                 "href": "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpExAmPLe"
               },
               "isDefaultAccountStore": true,
               "isDefaultGroupStore": true
             }' \
         'https://api.stormpath.com/v1/accountStoreMappings'

**Example Response**

    {
        "href": "https://api.stormpath.com/v1/accountStoreMappings/7Ui2gpn9tV75y3TExAmPLe",
        "accountStore": {
            "href": "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpExAmPLe"
        },
        "application": {
            "href": "https://api.stormpath.com/v1/applications/Uh8FzIouQ9C8EpcExAmPLe"
        },
        "listIndex": 0,
        "isDefaultAccountStore": true,
        "isDefaultGroupStore": true
    }

You may use the response's `Location` header or the top-level `href` attribute to further interact with your new `AccountStoreMapping` resource.

<a class="anchor" name="account-store-mapping-retrieve"></a>
### Retrieve An Account Store Mapping

After you have created an account store mapping, you may retrieve its contents by sending a `GET` request to the account store mapping's URL returned in the `Location` header or `href` attribute.

If you don't have the account store mapping's URL, you can find it in the [application's account store mappings list](#account-store-mapping-list).

**Example Request**

    GET https://api.stormpath.com/v1/accountStoreMappings/7Ui2gpn9tV75y3TExAmPLe

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
        "href": "https://api.stormpath.com/v1/accountStoreMappings/7Ui2gpn9tV75y3TExAmPLe",
        "accountStore": {
            "href": "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpExAmPLe"
        },
        "application": {
            "href": "https://api.stormpath.com/v1/applications/Uh8FzIouQ9C8EpcExAmPLe"
        },
        "listIndex": 0,
        "isDefaultAccountStore": true,
        "isDefaultGroupStore": true
    }

<a class="anchor" name="account-store-mapping-resources-expand"></a>
#### Expandable Resources

When retrieving an Account Store Mapping, you can also retrieve one or more of its linked resources by [expanding them in-line](#links-expansion) using the `expand` query parameter.

The following `AccountStoreMapping` attributes are expandable:

* `accountStore`
* `application`

See the [Link Expansion](#links-expansion) section for more information on expanding link attributes.

<a class="anchor" name="account-store-mapping-update"></a>
### Update An Account Store Mapping

Submit an HTTP `POST` to an accountStoreMapping's `href` when you want to change one or more of the account store mapping's attributes. Unspecified attributes are not changed, but at least one attribute must be specified.

**Updatable Application Attributes**

* [listIndex](#list-index)
* [isDefaultAccountStore](#account-store-mapping-resource-is-default-account-store)
* [isDefaultGroupStore](#account-store-mapping-resource-is-default-group-store)

**Example Request**

    curl -X POST -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Content-Type: application/json;charset=UTF-8" \
         -d '{
               "isDefaultAccountStore": true,
             }' \
         'https://api.stormpath.com/v1/accountStoreMappings/7Ui2gpn9tV75y3TExAmPLe'

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
        "href": "https://api.stormpath.com/v1/accountStoreMappings/7Ui2gpn9tV75y3TExAmPLe",
        "accountStore": {
            "href": "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpExAmPLe"
        },
        "application": {
            "href": "https://api.stormpath.com/v1/applications/Uh8FzIouQ9C8EpcExAmPLe"
        },
        "listIndex": 0,
        "isDefaultAccountStore": true,
        "isDefaultGroupStore": true
    }

<a class="anchor" name="account-store-mapping-update-priority"></a>
#### Set the Login Priority of an Assigned Account Store

As we've [shown previously](#workflow-login-attempt), an account trying to login to an application will be matched to the application's account stores based on the list order they are assigned to the application.  The account store at list index 0 has the highest priority, the account store at list index 1 has the next highest priority, and so on.  When an account is discovered in an account store, the login attempt occurs and returns immediately.  All remaining account stores are not checked.

If you wish to change an account store's login priority for an application, you simply:

1. Find the `accountStoreMapping` resource in the application's `accountStoreMappings` [collection](#collections) that reflects the `accountStore` that you wish to re-prioritize.
2. Issue a `POST` update request to that `AccountStoreMapping`'s `href` with a new `listIndex` value.

**Example Request**

For example, assume that the account store represented by mapping https://api.stormpath.com/v1/accountStoreMappings/dRvH4y0nT6uNl6gExAmPLe has a list index of `0` (first in the list), and we wanted to lower its priority to `1` (second in the list):

    curl -X POST -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Content-Type: application/json;charset=UTF-8" \
         -d '{
               "listIndex": 1
             }' \
         'https://api.stormpath.com/v1/accountStoreMappings/dRvH4y0nT6uNl6gExAmPLe'

**Example Response**

    {
        "href": "https://api.stormpath.com/v1/accountStoreMappings/dRvH4y0nT6uNl6gExAmPLe",
        "accountStore": {
            "href": "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpExAmPLe"
        },
        "application": {
            "href": "https://api.stormpath.com/v1/applications/Uh8FzIouQ9C8EpcExAmPLe"
        },
        "listIndex": 1,
        "isDefaultAccountStore": true,
        "isDefaultGroupStore": true
    }

<a class="anchor" name="account-store-mapping-default-account-store"></a>
#### Set The Default Account Store for new Application Accounts

Applications cannot store Accounts directly - Accounts are always stored in an Account Store (a Directory or Group).  Therefore, if you would like an application to be able to create new accounts, you must specify which of the application's associated account stores should store the application's newly created accounts.  This designated account store is called the application's _default account store_.

You specify an application's default account store by setting the AccountStoreMapping's `isDefaultAccountStore` attribute to equal `true`.  You can do this when you create the `accountStoreMapping` resource.  Or if the resource has already been created:

1. Find the `accountStoreMapping` resource in the Application's `accountStoreMappings` [collection](#collections) that reflects the `accountStore` you wish to be the application's default account store.
2. Issue a `POST` update request to that AccountStoreMapping's `href` with `isDefaultAccountStore` set to `true`.

**Example Request**

    curl -X POST -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Content-Type: application/json;charset=UTF-8" \
         -d '{
               "isDefaultAccountStore": true
             }' \
         'https://api.stormpath.com/v1/accountStoreMappings/dRvH4y0nT6uNl6gExAmPLe'

Now, any time a new account is created by `POST`ing to the application's `https://api.stormpath.com/v1/applications/$APPLICATION_ID/accounts` URI, the account will actually be created in the designated default account store.

**Directory vs Group?**

If the application's default account store is a:

* directory: the account will be created in the directory
* group: the account will be created in the group's directory first, then assigned to the group automatically.

{% docs note %}
Only one of an application's mapped account stores may be the default account store.

In addition, setting an AccountStoreMapping's `isDefaultAccountStore` value to `true` will automatically set the application's other AccountStoreMappings' `isDefaultAccountStore` values to `false`. HOWEVER:

Lastly, note that setting an AccountStoreMapping's `isDefaultAccountStore` value to `false` **WILL NOT** automatically set another AccountStoreMapping's `isDefaultAccountStore` to `true`.  You are responsible for explicitly setting `isDefaultAccountStore` to `true` if you want the application to be able to create new accounts.
{% enddocs %}

{% docs warning %}
If none of the application's AccountStoreMappings are designated as the default account store, the application _WILL NOT_ be able to create new accounts.

Also note that Mirrored directories or groups within Mirrored directories are read-only; they cannot be set as an application's default account store.  Attempting to set `isDefaultAccountStore` to `true` on an AccountStoreMapping that reflects a mirrored directory or group will result in an error response.
{% enddocs %}

<a class="anchor" name="account-store-mapping-default-group-store"></a>
#### Set The Default Group Store for new Application Groups

Applications cannot store Groups directly - Groups are always stored in a Directory.  Therefore, if you would like an application to be able to create new groups, you must specify which of the application's associated account stores should store the application's newly created groups.  This designated store is called the application's _default group store_.

You specify an application's default group store by setting the `AccountStoreMapping`'s `isDefaultGroupStore` attribute to equal `true`.  You can do this when you create the `accountStoreMapping` resource, or if the resource has already been created:

1. Find the `accountStoreMapping` resource in the Application's `accountStoreMappings` [collection](#collections) that reflects the `accountStore` you wish to be the application's default group store.
2. Issue a `POST` update request to that `AccountStoreMapping`'s `href` with `isDefaultGroupStore` set to `true`.

**Example Request**

    curl -X POST -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Content-Type: application/json;charset=UTF-8" \
         -d '{
               "isDefaultGroupStore": true
             }' \
         'https://api.stormpath.com/v1/accountStoreMappings/dRvH4y0nT6uNl6gExAmPLe'

Now, any time a new group is created by `POST`ing to the application's `https://api.stormpath.com/v1/applications/$APPLICATION_ID/groups` URI, the group will actually be created in the designated default group store.

{% docs note %}
Only one of an application's mapped account stores may be the default group store.
 
Also, note that setting an AccountStoreMapping's `isDefaultGroupStore` value to `true` will automatically set the application's other AccountStoreMappings' `isDefaultGroupStore` values to `false`. HOWEVER:

Lastly, setting an AccountStoreMapping's `isDefaultGroupStore` value to `false` **WILL NOT** automatically set another AccountStoreMapping's `isDefaultGroupStore` to `true`.  You are responsible for explicitly setting `isDefaultGroupStore` to `true` if you want the application to be able to create new groups.
{% enddocs %}

{% docs warning %}

If no `AccountStoreMapping` is designated as the default group store, the application _WILL NOT_ be able to create new groups.

Also, note that Stormpath does not currently support storing groups within groups.  Therefore `isDefaultGroupStore` can only be set to `true` when the AccountStoreMapping's `accountStore` is a Directory.  Attempting to set `isDefaultGroupStore` to `true` on an AccountStoreMapping that reflects a group will result in an error response.

Lastly, note that mirrored directories are read-only; they cannot be set as an application's default group store. Attempting to set `isDefaultGroupStore` to `true` on an AccountStoreMapping that reflects a mirrored directory will result in an error response.
{% enddocs %}

<a class="anchor" name="account-store-mapping-delete"></a>
### Delete an Account Store Mapping

You remove an assigned account store from an application by `DELETE`ing the `accountStoreMapping` resource that links the accountStore and the application together.  This removes the possibility of the accounts in the associated account store from being able to login to the application.

{% docs info %}
Deleting an `accountStoreMapping` resource *does not* delete either the account store or the application resources themselves - only the association between the two.
{% enddocs %}

{% docs note %}
Deleting an account store mapping will remove the ability for accounts in the account store from authenticating with the application unless they are associated with an account store that is still mapped to the application. Be careful when removing mappings.

Also, note that if no `AccountStoreMapping` is designated as the default group store, the application _WILL NOT_ be able to create new groups.
{% enddocs %}

**Example Request**

For example, to delete the application-accountStore association we created in the above previous example:

    curl -X DELETE -u $API_KEY_ID:$API_KEY_SECRET \
         'https://api.stormpath.com/v1/accountStoreMappings/7Ui2gpn9tV75y3TExAmPLe'

**Example Response**

    HTTP/1.1 204 No Content

<a class="anchor" name="account-store-mapping-list"></a>
### List Account Store Mappings

You can list an applications's mapped account stores by issuing a `GET` request to the application's `accountStoreMappings` `href` URI.

The response is a paginated list of `accountStoreMapping` resources.  You may use collection [pagination](#pagination) query parameters to customize the paginated response.

**Example Request**

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/applications/3hFENJHLaH1Vy4GSbscrtv/accountStoreMappings"

**Example Response**

    {
       "href":"https://api.stormpath.com/v1/applications/3hFENJHLaH1Vy4GSbscrtv/accountStoreMappings",
       "offset":0,
       "limit":25,
       "items":[
          {
             "href":"https://api.stormpath.com/v1/accountStoreMappings/3hGLY9yHEqYraR0cXJUDPD",
             "listIndex":0,
             "isDefaultAccountStore":true,
             "isDefaultGroupStore":true,
             "application":{
                "href":"https://api.stormpath.com/v1/applications/3hFENJHLaH1Vy4GSbscrtv"
             },
             "accountStore":{
                "href":"https://api.stormpath.com/v1/directories/3hFN1PriI5xvv76jLoEXL5"
             }
          },
          ... remaining AccountStoreMappings ...
       ]
    }

***

<a class="anchor" name="directories"></a>
## Directories

A Directory is a top-level storage containers of Accounts and Groups. A Directory also manages security policies (like password strength) for the Accounts it contains. Stormpath supports two types of Directories:

1. Natively hosted ‘Cloud’ directories that originate in Stormpath and
2. ‘Mirror’ directories that act as secure mirrors or replicas of existing directories outside of Stormpath, for example LDAP or Active Directory servers.

Directories can be used to cleanly manage segmented account populations.  For example, you might use one Directory for company employees and another Directory for customers, each with its own security policies.  You can [associate directories to applications](#account-store-mappings) (or groups within a directory) to allow its accounts to login to applications.

<a class="anchor" name="directory"></a>
### Directory Resource

An individual `directory` resource may be accessed via its Resource URI:

**Resource URI**

    /v1/directories/:directoryId

<a id="directory-attributes"></a> 
**Resource Attributes**

Attribute | Description | Type | Valid Value
:----- | :----- | :---- | :----
`href` | The resource fully qualified location URI | String | <span>--</span>
<a id="directory-resource-name"></a>`name` | Name of the directory. Must be unique within a [tenant](#tenants). | String | 1 < N <= 255 characters
<a id="directory-resource-description"></a>`description` | The description of the directory. | String | 0 < N <= 1000 characters
<a id="directory-resource-status"></a>`status` | Enabled directories can be used as account stores for applications. Disabled directories cannot be used for login. | Enum | `enabled`,`disabled`
<a class="anchor" name="directory-resource-accounts"></a>`accounts` | A link to the accounts owned by the directory. | Link | <span>--</span>
<a class="anchor" name="directory-resource-groups"></a>`groups` | A link to the groups owned by the directory. | Link | <span>--</span>
<a class="anchor" name="directory-resource-tenant"></a>`tenant` | A link to the owning tenant. | Link | <span>--</span>

Within Stormpath, there are two types of directories you can implement:

* A <strong>Cloud</strong> directory, also known as Stormpath-managed directories, which are hosted by Stormpath and use the Stormpath data model to store account and group information. This is the default and most common type of directory in Stormpath.
* A <strong>Mirrored</strong> directory, which is a Stormpath-hosted directory populated with data pushed from your existing LDAP/AD directory using a Stormpath synchronization agent. All user management is done on your existing LDAP/AD directory, but the cloud mirror can be accessed through the Stormpath APIs on your modern applications.

    * Agent directories cannot be created using the API.
    * You can specify various LDAP/AD object and attribute settings of the specific LDAP/AD server for accounts and groups.
    * If the agent status is `Online`, but you are unable to see any data when browsing your LDAP/AD mapped directory, it is likely that your object and filters are configured incorrectly.

You can add as many directories of each type as you require. Changing group memberships, adding accounts, or deleting accounts in directories affects ALL applications to which the directories are mapped as [account stores](#account-store-mappings)</a>.

LDAP/AD accounts and groups are automatically deleted when:

* The backing object is deleted from the LDAP/AD directory service.
* The backing LDAP/AD object information no longer matches the account filter criteria configured for the agent.
* The LDAP/AD directory is deleted.

For directories, you can:

* [Locate a directory's REST URL](#locate-a-directorys-rest-url)
* [Create a directory](#directory-create)
    * [Create a cloud directory](#create-a-cloud-directory)
    * [Create a mirrored (LDAP) directory](#directories-mirrored)
    * [Associate directories with applications](#associate-directories-with-applications)
* [Retrieve a directory](#directory-retrieve)
* [Update a directory](#directory-update)
    * [Enable or disable a directory](#enable-or-disable-a-directory)
    * [Update agent configuration](#update-agent-configuration)
* [Delete a directory](#directory-delete)
* [List directories](#directory-list)
* [Search directories](#directory-search)
* [Work with directories](#directory-workflows)
    * [Enforce Account Password Restrictions](#directories-password-restrictions)
    * [Register A New Account](#directories-reg)
    * [Verify An Account's Email Address](#directories-verify-email)
    * [Reset An Account's Password](#directories-password-reset)
* [Work with directory groups](#directory-groups)
* [Work with directory accounts](#directory-accounts)

<a class="anchor" name="locate-a-directorys-rest-url"></a>
### Locate a Directory's REST URL

When communicating with the Stormpath REST API, you might need to reference a directory directly using its REST URL or `href`.

There are multiple ways to find a directory `href` depending on what information you have available:

* Retrieve a full list of directories from the tenant
* Retrieve an application's `accountStoreMappings` and extract the directories iteratively
* Retrieve an account and determine its directory

In all cases, the process is fundamentally the same. Consider the first case as example. In order to locate a directory's `href`, you'll need to first search the tenant for the specific directory using some information that you have available. If you want to find the `href` for a directory with the name "My Directory", you'll need to search the tenant for the "test" application object:

**Example Request**

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/directories/"

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8

    [8]
    {
        -0: {
              href: "https://api.stormpath.com/v1/directories/5D1bvO5To6KQBaGFh793Zz"
              name: "My Directory"
              ... remaining Directory name/value pairs ...

      }
    }

If you know the name exactly, you can use an [attribute search](#search-attribute) (e.g., "name=") or, if you only know a small part, you can use a [filter search](#search-filter) (e.g., "q=My") to narrow down the selection.

<a class="anchor" name="directory-create"></a>
### Create a Directory

To create a directory to store user accounts, you must know which type of directory service to use.

You can create a:

* Cloud directory, which is hosted by Stormpath and uses the Stormpath data model to store account and group information. This is the most common type of directory in Stormpath.

**OR**

* Mirrored directory, which uses a synchronization agent for your existing LDAP/AD directory. All user account management is done on your existing LDAP/AD directory with the Stormpath agent mirroring the primary LDAP/AD server.

<a class="anchor" name="create-a-cloud-directory"></a>
#### Create a Cloud Directory

To create a new `directory` resource within the caller tenant:

**Resource URI**

    /v1/directories

**Required Attribute**

* [name](#directory-resource-name)

**Optional Attributes**

* [description](#directory-resource-description)
* [status](#directory-resource-status)

**Example Request**

    POST https://api.stormpath.com/v1/directories
    Content-Type: application/json;charset=UTF-8

    {
      "name" : "Captains",
      "description" : "Captains from a variety of stories"
    }

**Example Response**

    HTTP/1.1 201 Created
    Location: https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q
    Content-Type: application/json;charset=UTF-8;

    {
      "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q",
      "name" : "Captains",
      "description" : "Captains from a variety of stories",
      "status" : "enabled",
      "tenant" : {
        "href" : "https://api.stormpath.com/v1/tenants/Gh9238fksJlsieJkPkQuW"
      },
      "accounts" : {
        "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q/accounts"
      },
      "groups" : {
        "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q/groups"
      }
    }

<a class="anchor" name="directories-mirrored"></a>
#### Create a Mirrored (LDAP/AD) Directory

Mirrored directories, after initial configuration, are accessible through the Agents tab of the directory.

To create an LDAP/AD mirrored directory, you must log in to the Stormpath Admin Console.

For more information on setting up a Mirrored Directory and using the Stormpath Admin Console, refer to the [Stormpath Admin Console product guide](/console/product-guide#!CreateDir).

<a class="anchor" name="associate-directories-with-applications"></a>
#### Associate Directories with Applications

In order to associate a directory with an application, you'll need to create an [Account Store Mapping](#account-store-mappings). An account store mapping associates an account store (such as a directory or a group) with an application.

HTTP `POST` against the account store mapping end-point with the directory and application `href` in order to create an association.

**Example Request**

    curl -X POST -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Content-Type: application/json;charset=UTF-8" \
         -d '{
               "application": {
                 "href": "https://api.stormpath.com/v1/applications/Uh8FzIouQ9C8EpcExAmPLe"
               }
               "accountStore": {
                 "href": "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpExAmPLe"
               },
               "isDefaultAccountStore": true,
               "isDefaultGroupStore": true
             }' \
         'https://api.stormpath.com/v1/accountStoreMappings'

**Example Response**

    {
        "href": "https://api.stormpath.com/v1/accountStoreMappings/7Ui2gpn9tV75y3TExAmPLe",
        "accountStore": {
            "href": "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpExAmPLe"
        },
        "application": {
            "href": "https://api.stormpath.com/v1/applications/Uh8FzIouQ9C8EpcExAmPLe"
        },
        "listIndex": 0,
        "isDefaultAccountStore": true,
        "isDefaultGroupStore": true
    }

For more information on Account Store Mappings, refer to the [Account Store Mapping](#account-store-mappings) section.

<a class="anchor" name="directory-retrieve"></a>
### Retrieve a Directory

HTTP `GET` returns a representation of a `directory` resource that includes the resource attributes.

**Example Request**

    GET https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
      "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q",
      "name" : "Captains",
      "description" : "Captains from a variety of stories",
      "status" : "enabled",
      "accounts" : {
        "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q/accounts"
      },
      "groups" : {
        "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q/groups"
      },
      "tenant" : {
        "href" : "https://api.stormpath.com/v1/tenants/Gh9238fksJlsieJkPkQuW"
      }
    }

<a class="anchor" name="directory-resources-expand"></a>
#### Expandable Resources

When retrieving a directory, you can also retrieve one or more of its linked resources by [expanding them in-line](#links-expansion) using the `expand` query parameter.

The following `Directory` attributes are expandable:

* `accounts`
* `groups`
* `tenant`

Also, because `accounts`, `groups`, and the `tenant` are [Collection Resources](#collections) themselves, you can additionally control [pagination](#pagination) for either expanded collection. For example:

    GET https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q?expand=tenant,groups(offset:0,limit:50),accounts(offset:0,limit:50)

See the [Link Expansion](#links-expansion) section for more information on expanding link attributes.

<a class="anchor" name="directory-update"></a>
### Update a Directory

Use HTTP `POST` when you want to change one or more specific attributes of a `directory` resource. Unspecified attributes will not be changed, but at least one attribute must be specified.

**Optional Attributes**

* [name](#directory-resource-name)
* [description](#directory-resource-description)
* [status](#directory-resource-status)

**Example Request**

    POST https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q
    Content-Type: application/json;charset=UTF-8

    {
      "name" : "Captains",
    }

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
      "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q",
      "name" : "Captains",
      "description" : "Captains from a variety of stories",
      "status" : "enabled",
      "tenant" : {
        "href" : "https://api.stormpath.com/v1/tenants/Gh9238fksJlsieJkPkQuW"
      },
      "accounts" : {
        "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q/accounts"
      },
      "groups" : {
        "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q/groups"
      }
    }

<a class="anchor" name="enable-or-disable-a-directory"></a>
#### Enable Or Disable a Directory

A directory has two statuses: enabled and disabled. An enabled directory allows the groups and accounts to log into any applications for which the directory is defined as an account store while a disabled directory does not.

To enable or disable a directory, use HTTP `POST` to set the `status` to either `ENABLED` or `DISABLE`.

**Example Request**

    POST https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q
     Content-Type: application/json;charset=UTF-8

     {
       "status" : "ENABLED",
     }

<a class="anchor" name="update-agent-configuration"></a>
#### Update Agent Configuration

A [Directory Agent](#directory-agent) is a Stormpath software application installed on your corporate network to securely synchronize an on-premise directory, such as LDAP or Active Directory, into a Stormpath cloud directory. This is critical part of [a mirrored directory](#directories-mirrored).

You can modify an agent configuration going through the "Directories" or "Agent" tabs on the Stormpath Admin Console. For more information on administering Mirrored Directory agents, refer to the [Stormpath Admin Console product guide](https://stormpath.com/docs/console/product-guide#!UpdateAgent).

<a class="anchor" name="directory-delete"></a>
### Delete a Directory

Deleting a directory completely erases the directory and all group and account data from Stormpath.

We recommend that you disable a directory rather than delete it, in case an associated application contains historical data associated with accounts in the directory.

The Stormpath Administrators directory cannot be deleted.

To delete a directory:

**Example Request**

    DELETE https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q

**Example Response**

    HTTP/1.1 204 No Content

{% docs warning %}
You cannot delete a directory that is still associated with an application and thus you cannot delete a directory that is marked as the "Default Account Store" or contains a "Default Group" doing so will result in a 400 Bad Request error
{% enddocs %}

**Example Error Response**

    {
      status: 400
      code: 400
      message: "Directory is referenced by 1 Application(s) and may not be deleted until those applications are disassociated"
      developerMessage: "Directory is referenced by 1 Application(s) and may not be deleted until those applications are disassociated"
      moreInfo: "mailto:support@stormpath.com"
    }

<a class="anchor" name="directory-list"></a>
### List Directories

To list directories:

**Example Request**

    GET https://api.stormpath.com/v1/tenants/fRlKUJtWRHes4q6M2_TX5w/directories

**Example Response**

    HTTP/1.1 200 OK
     Content-Type: application/json;charset=UTF-8;

     {
       "href": "https://api.stormpath.com/v1/tenants/fRlKUJtWRHes4q6M2_TX5w/directories"
       "offset": 0,
       "limit": 25,
       "items" : [
         {
           "href" : "https://api.stormpath.com/v1/directories/Wp831krnTZm81wVZni6Jtw",
           "name" : "My directory",
           "description" : "My directory description",
           "status" : "ENABLED",
           "accounts" : {
             "href" : "https://api.stormpath.com/v1/directories/Wp831krnTZm81wVZni6Jtw/accounts"
           },
           "groups" : {
             "href" : "https://api.stormpath.com/v1/directories/Wp831krnTZm81wVZni6Jtw/groups"
           },
           "tenant" : {
             "href" : "https://api.stormpath.com/v1/tenants/fRlKUJtWRHes4q6M2_TX5w"
           }
         },
         ... additional Directory resources ...
       ]
     }

<a class="anchor" name="directory-search"></a>
### Search Directories

Directory attributes supported for search include:

* name
* description
* status

**Searchable Directory Collection Resources**

Directory Collection Resource | Search Functionality
:----- | :-----
/v1/tenants/:tenantId/directories | A search across directories owned by the specified tenant. |

<a class="anchor" name="work-with-directories"></a>
### Work With Directories

From a directory you can do things like enforce account password restrictions, register new accounts and groups, configure the account email verification workflow, configure the account password reset workflow, among other functionalities. Read below to find more information about these features.

<a class="anchor" name="directories-account-password-policy"></a><a class="anchor" name="directories-password-restrictions"></a>
### Account Password Policy

Directories can be configured to enforce specific restrictions on passwords for accounts associated with, such as requiring at least one or more non-alphanumeric characters.

With Stormpath's Cloud directories, you can configure custom restrictions for the passwords on accounts associated with that directory. You can specify the following elements in your directory's password requirements:

* Min characters
* Max characters
* Mandatry characters
  * Lower case alphabetical
  * Uppercase case alphabetical
  * Numeric
  * Punctuation
  * Special characters (e.g., é)

By default, passwords must be of mixed case, include at least one number, and be between 8 and 100 characters in length.

More information about configuring a cloud directory's password restrictions can be found in the [Stormpath Admin Console product guide](http://stormpath.com/docs/console/product-guide#!CreateDir).

{% docs note %}
Workflows are only available on cloud directories and only configurable using the Stormpath Admin Console.  They are not currently configurable via the REST API. Also, the Stormpath Administrator directory's automated workflows cannot be altered.
{% enddocs %}

<a class="anchor" name="directories-reg"></a>
### Register A New Account

This workflow allows you to create an account at an application level rather than at a directory level. The application will populate the directory set as the default account store.

This workflow relies on the `account` resource as a starting point. For more information on working with these workflows via REST after they have already been configured, refer to the [Working With Applications](#application-account-register) section of this guide.
This workflow is disabled by default for accounts, but you can enable it easily in the Stormpath Admin Console UI. Refer to the [Stormpath Admin Console product guide](https://stormpath.com/docs/console/product-guide#!ManageWorkflowAutomation) for complete instructions.

{% docs note %}
Workflows are only available on cloud directories and only configurable using the Stormpath Admin Console. They are not currently configurable via the REST API. Also, the Stormpath Administrator directory's automated workflows cannot be altered.
{% enddocs %}

<a class="anchor" name="accounts-workflow"></a>
### Work With Accounts

If you want to learn about other account functionalities, such as [verify an email address](#account-verify-email), [log in (authenticate) an account](#accounts-authenticate) and [reset an account password](#accounts-reset), read the instructions below.

<a class="anchor" name="directories-verify-email"></a>
### Verify An Account's Email Address

This workflow allows you to send a welcome email to a newly registered account and optionally verify that they own the email addressed used during registration.

The email verification workflow involves changes to an account at an application level, and as such, this workflow relies on the `account` resource as a starting point. For more information on working with these workflows via REST after they have already been configured, refer to the [Working With Accounts](#account-verify-email) section of this guide.
This workflow is disabled by default for accounts, but you can enable it easily in the Stormpath Admin Console UI. Refer to the [Stormpath Admin Console product guide](https://stormpath.com/docs/console/product-guide#!ManageWorkflowAutomation) for complete instructions.

{% docs note %}
Workflows are only available on cloud directories and only configurable using the Stormpath Admin Console. They are not currently configurable via the REST API. Also, the Stormpath Administrator directory's automated workflows cannot be altered.
{% enddocs %}

<a class="anchor" name="directories-password-reset"></a>
This is a self-service password reset workflow.  The account is sent an email with a secure link.  The person owning the account can click on the link and be shown a password reset form to reset their password.  This is strongly recommended to reduce support requests to your application team as well as to reduce your exposure to account passwords for added security.

The password reset workflow involves changes to an account at an application level, and as such, this workflow relies on the `application` resource as a starting point. For more information on working with this workflow via REST after they have already been configured, refer to the [Working With Applications](#application-password-reset) section of this guide.

This workflow is disabled by default for accounts, but you can enable it easily in the Stormpath Admin Console UI. Refer to the [Stormpath Admin Console product guide](https://stormpath.com/docs/console/product-guide#!ManageWorkflowAutomation) for complete instructions.

{% docs note %}
Workflows are only available on cloud directories and only configurable using the Stormpath Admin Console.  They are not currently configurable via the REST API. Also, the Stormpath Administrator directory's automated workflows cannot be altered.
{% enddocs %}

<a class="anchor" name="directory-groups"></a>
### Directory Groups

The `Groups` Collections for a `Directory` Resource Collection Resource represents all groups owned by a specific directory.

**Directory Groups Collection Resource URI**

    /v1/directories/:directoryId/groups

#### List Directory Groups

You can list your directory's groups by sending a `GET` request to your directory's `groups` Collection Resource `href` URL.  The response is a [paginated](#pagination) list of directory groups.

You may also use collection [pagination](#pagination) and [sort ordering](#sorting) query parameters to customize the paginated response.

**Example Request**

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/directories/$DIRECTORY_ID/groups"
<!-- {: .bash} -->

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8

    {
      "href": "https://api.stormpath.com/v1/directories/5D1bvO5To6KQBaGFh793Zz/groups",
      "offset": 0,
      "limit": 25,
      "items" : [
        {
          "href" : "https://api.stormpath.com/v1/groups/WpM9nyZ2TbaEzfbRvLk9KA"
          ... remaining Group name/value pairs ...
        },
        {
          "href" : "https://api.stormpath.com/v1/groups/aLlyOUrBAse34js9hjiH9j"
          ... remaining Group name/value pairs ...
        },
        {
          "href" : "https://api.stormpath.com/v1/groups/Xhf0a9HLA02djsdP90dsQ2"
          ... remaining Group name/value pairs ...
        },
      ]
    }

#### Search Directory Groups

You may search for groups by sending a `GET` request to your directory's `groups` Collection Resource `href` URL using [search query parameters](#search). Any matching groups within your directory will be returned as a [paginated](#pagination) list.

##### Searchable Group Attributes

The following [account attributes](#account-resource) are searchable via [filter](#search-filter) and [attribute](#search-attribute) searches:

* `name`
* `description`

In addition to the [search query parameters](#search), you may also use [pagination](#pagination) and [sorting](#sorting) query parameters to customize the paginated response.  For example:

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/directories/$DIRECTORY_ID/groups?q=foo&orderBy=name&offset=0&limit=50"
<!-- {: .bash} -->

#### Working With Directory Groups

Group resources support the full suite of CRUD commands and other interactions. Please see the [Groups section](#groups) for more information.

<a class="anchor" name="directory-accounts"></a>
### Directory Accounts

The `Accounts` Collection for a `Directory` Resource Collection Resource represents all accounts owned by a specific directory.

**Directory Accounts Collection Resource URI**

    /v1/directories/:directoryId/accounts

#### List Directory Accounts

You can list your directory's accounts by sending a `GET` request to your directory's `groups` Collection Resource `href` URL. The response is a [paginated](#pagination) list of directory groups.

You may also use collection [pagination](#pagination) and [sort ordering](#sorting) query parameters to customize the paginated response.

**Example Request**

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/directories/$DIRECTORY_ID/groups"
<!-- {: .bash} -->

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8

    {
      "href": "https://api.stormpath.com/v1/directories/5D1bvO5To6KQBaGFh793Zz/groups",
      "offset": 0,
      "limit": 25,
      "items" : [
        {
          "href" : "https://api.stormpath.com/v1/groups/WpM9nyZ2TbaEzfbRvLk9KA"
          ... remaining Group name/value pairs ...
        },
        {
          "href" : "https://api.stormpath.com/v1/groups/aLlyOUrBAse34js9hjiH9j"
          ... remaining Group name/value pairs ...
        },
        {
          "href" : "https://api.stormpath.com/v1/groups/Xhf0a9HLA02djsdP90dsQ2"
          ... remaining Group name/value pairs ...
        },
      ]
    }

#### Search Directory Accounts

You may search for accounts by sending a `GET` request to your directory's `account` Collection Resource `href` URL using [search query parameters](#search). Any matching groups within your directory will be returned as a [paginated](#pagination) list.

##### Searchable Account Attributes

The following [account attributes](#account-resource) are searchable via [filter](#search-filter) and [attribute](#search-attribute) searches:

* `username`
* `email`
* `givenName`
* `middleName`
* `surname`

In addition to the [search query parameters](#search), you may also use [pagination](#pagination) and [sorting](#sorting) query parameters to customize the paginated response.  For example:

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/directories/$DIRECTORY_ID/accounts?q=foo&orderBy=surname&offset=0&limit=50"
<!-- {: .bash} -->

#### Working With Directory Accounts

Account resources support the full suite of CRUD commands and other interactions. Please see the [Accounts section](#accounts) for more information.

***

<a class="anchor" name="groups"></a>
## Groups

Groups are collections of accounts within a directory that are often used for authorization and access control to the application. In Stormpath, the term group is synonymous with [role](#role).

You manage LDAP/AD groups on your primary LDAP/AD installation. LDAP/AD accounts and groups are automatically deleted when:

* The backing object is deleted from the LDAP/AD directory service.
* The backing LDAP/AD object information no longer matches the account filter criteria configured for the agent.
* The LDAP/AD directory is deleted.

<a class="anchor" name="group"></a>
### Group Resource

**Resource URI**

    /v1/groups/:groupId

**Resource Attributes**

Attribute | Description | Type | Valid Value
:----- | :----- | :---- | :----
`href` | The resource fully qualified location URI | String | <span>--</span>
<a id="group-resource-name"></a>`name` | The name of the group. Must be unique within a directory. | String | 1 < N <= 255 characters
<a id="group-resource-description"></a>`description` | The description of the group. | String | 1 < N <= 1000 characters
<a id="group-resource-status"></a>`status` | Enabled groups are able to authenticate against an application. Disabled groups cannot authenticate against an application. | Enum  |`enabled`,`disabled`
<a id="group-resource-custom-data"></a>`customData` | A link to the group's [customData](#group-custom-data) resource that you can use to store your own group-specific custom fields. | Link | <span>--</span>
<a class="anchor" name="group-resource-tenant"></a>`tenant` | The tenant that owns the directory containing this group. | Link | <span>--</span>
<a class="anchor" name="directory-resource-directory"></a>`directory` | A link to the directory resource that the group belongs to. | Link | <span>--</span>
<a class="anchor" name="directory-resource-accounts"></a>`accounts` | A link to the accounts that are contained within this group. | Link | <span>--</span>

With groups, you can:

* [Locate a group's REST URL](#group-url)
* [Create a group](#group-create)
* [Retrieve a group](#group-retrieve)
* [Update a group](#group-update)
    * [Enable a group](#group-enable)
    * [Disable a group](#group-disable)
* [Delete a group](#group-delete)
* [Manage your own custom group data](#group-custom-data)
* [List groups](#groups-list)
* [Search groups](#groups-search)
* [Access a group's accounts](#group-accounts)
* [Manage a group's account memberships](#group-account-memberships)

<a class="anchor" name="group-url"></a>
### Locate a Group's REST URL

When communicating with the Stormpath REST API, you might need to reference a group directly using its REST URL or `href`.

There are multiple ways to find a group `href` depending on what information you have available:

* Retrieve a group from a specific directory
* Retrieve a group from a specific account's `groupMemberships`.
* Retrieve a group from the application's full list of groups

In all cases, the process is fundamentally the same. Consider the first case as example.

In order to locate a group's `href`, you'll need to first search the tenant for the specific group using some information that you have available.

For example, if you want to find the `href` for a group with the name "My Group", you'll need to search the directory for the "My Group" `group` resource:

**Example Request**

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/directories/5D1bvO5To6KQBaGFh793Zz/groups?name=My%20GROUP"

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8

    {
        href: "https://api.stormpath.com/v1/directories/5D1bvO5To6KQBaGFh793Zz/groups"
        offset: 0
        limit: 25
        items: [1]
          0:  {
            href: "https://api.stormpath.com/v1/groups/cquoM06qa6pTkk1h2xOeJ"
            name: "My Group"
            ... remaining Account name/value pairs ...
    }

If you know the name exactly, you can use an [attribute search](#search-attribute) (e.g., "name=") or, if you only know a small part, you can use a [filter search](#search-filter) (e.g., "q=My") to narrow down the selection.

<a class="anchor" name="group-create"></a>
### Create a Group

To create a new `group` resource instance in a specified directory which is accessible to the application:

**Resource URI**

    /v1/directories/:directoryId/groups

**Required Attributes**

* [name](#group-resource-name)

**Optional Attributes**

* [description](#group-resource-description)
* [status](#group-resource-status)

**Example Request**

    POST https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q/groups
    Content-Type: application/json;charset=UTF-8

    {
      "name" : "Aquanauts",
      "description" : "Sea Voyagers",
      "status" : "enabled"
    }

**Example Response**

    HTTP/1.1 201 Created
    Location: https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ
    Content-Type: application/json;charset=UTF-8;

    {
      "href" : "https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ",
      "name" : "Aquanauts",
      "description" : "Sea Voyagers",
      "status" : "enabled",
      "directory" : {
        "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q"
      },
      "tenant" : {
        "href" : "https://api.stormpath.com/v1/tenants/Gh9238fksJlsieJkPkQuW"
      },
      "accounts" : {
        "href" : "https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ/accounts"
      }
    }

This creates a new group in the application group creation acceptable designated directory. The group data POSTed is the same required for the existing directory-specific group creation endpoint.

If there is no acceptable designated directory account store, the REST API error code [5102](/errors#5102) is returned:

    {
      "status": 409,
      "code": 5102,
      "message": "Oops! We encountered an unexpected error.  Please contact support and explain what you were doing at the time this error occurred.",
      "developerMessage": "No account store assigned to this application has been configured as the default storage location for newly created groups.  To fix this problem: in the application's 'account stores' configuration, specify the account store that will be used to store newly created groups."
      "moreInfo": "http://docs.stormpath.com/errors/5102"
    }

<a class="anchor" name="group-retrieve"></a>
### Retrieve a Group

HTTP `GET` returns a representation of a `group` resource that includes the resource attributes.

**Example Request**

    GET https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
      "href" : "https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ",
      "name" : "Aquanauts",
      "description" : "Sea Voyagers",
      "status" : "enabled",
      "directory" : {
        "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q"
      },
      "tenant" : {
        "href" : "https://api.stormpath.com/v1/tenants/Gh9238fksJlsieJkPkQuW"
      },
      "accounts" : {
        "href" : "https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ/accounts"
      }
    }

<a class="anchor" name="group-resources-expand"></a>
#### Expandable Resources

When retrieving an application, you can also retrieve one or more of its linked resources by [expanding them in-line](#links-expansion) using the `expand` query parameter.

The following `Groups` attributes are expandable:

* `tenant`
* `directory`
* `accounts`

Also, because `accounts` is a [Collection Resources](#collections) itself, you can additionally control [pagination](#pagination) for either expanded collection.  For example:

    GET https://api.stormpath.com/v1/groups/WpM9nyZ2TbaEzfbRvLk9KA?expand=tenant,directory,accounts(offset:0,limit:50)

See the [Link Expansion](#links-expansion) section for more information on expanding link attributes.

<a class="anchor" name="group-update"></a>
### Update a Group

Use HTTP `POST` when you want to change one or more specific attributes of a `group` resource. Unspecified attributes are not changed, but at least one attribute must be specified.

**Optional Attributes**

* [name](#group-resource-name)
* [description](#group-resource-description)
* [status](#group-resource-status)

Here are some account update examples:

* [Simple Update Group Example](#account-update-simple)
* [Enable a Group](#group-enable)
* [Disable a Group](#group-disable)
* [Update a Group and its Custom Data simultaneously](#update-custom-data-embedded)

<a class="anchor" name="group-update-simple"></a>
**Example Request**

    POST https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ
    Content-Type: application/json;charset=UTF-8

    {
      "description" : "Sea Voyagers"
    }

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
      "href" : "https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ",
      "name" : "Aquanauts",
      "description" : "Sea Voyagers",
      "status" : "enabled",
      "directory" : {
        "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q"
      },
      "tenant" : {
        "href" : "https://api.stormpath.com/v1/tenants/Gh9238fksJlsieJkPkQuW"
      },
      "accounts" : {
        "href" : "https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ/accounts"
      }
    }

<a class="anchor" name="group-enable"></a>
#### Enable a Group

If the group is contained within an *enabled directory where the directory is defined as an account store*, then enabling the group allows all accounts contained within the group (membership list) to log in to any applications for which the directory is defined as an account store.

If the group is contained within an *disabled directory where the directory is defined as an account store*, the group members are not be able to log in to any applications for which the directory is defined as an account store.

If the group is defined as an account store, then enabling the group allows accounts contained within the group (membership list) to log in to any applications for which the group is defined as an account store.

To enable a group:

**Example Request**

    POST https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ
     Content-Type: application/json;charset=UTF-8

     {
       "status" : "ENABLED"
     }

**Example Response**

    HTTP/1.1 200 OK
     Content-Type: application/json;charset=UTF-8;

     {
       "href" : "https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ",
       "name" : "Aquanauts",
       "description" : "Sea Voyagers",
       "status" : "enabled",
       "directory" : {
     "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q"
       },
       "tenant" : {
     "href" : "https://api.stormpath.com/v1/tenants/Gh9238fksJlsieJkPkQuW"
       },
       "accounts" : {
     "href" : "https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ/accounts"
       }
     }

<a class="anchor" name="group-disable"></a>
#### Disable a Group

If a group is explicitly set as an application account store, then disabling that group prevents any of its user accounts from logging into that application but retains the group data and memberships. You would typically disable a group if you must shut off a group of user accounts quickly and easily.

If the group is contained within a directory defined as an account store, disabling the group prevents group members from logging in to any applications for which the directory is defined as an account store.

To disable a group:

**Example Request**

    POST https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ
     Content-Type: application/json;charset=UTF-8

     {
       "status" : "DISABLED"
     }

**Example Response**

    HTTP/1.1 200 OK
     Content-Type: application/json;charset=UTF-8;

     {
       "href" : "https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ",
       "name" : "Aquanauts",
       "description" : "Sea Voyagers",
       "status" : "disabled",
       "directory" : {
         "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q"
       },
       "tenant" : {
         "href" : "https://api.stormpath.com/v1/tenants/Gh9238fksJlsieJkPkQuW"
       },
       "accounts" : {
         "href" : "https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ/accounts"
       }
     }

<a class="anchor" name="group-delete"></a>
### Delete a Group

Deleting a cloud directory group erases the group and all its membership relationships. User accounts that are members of the group will not be deleted.

We recommend that you disable an group rather than delete it, if you believe you might need to retain the user data or application connection.

To delete a cloud directory group:

**Example Request**

    DELETE https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ

**Example Response**

    HTTP/1.1 204 No Content

### Group Custom Data

While Stormpath's default Group attributes are useful to many applications, you might want to add your own custom data to a Stormpath group.  If you want, you can store all of your custom group information in Stormpath so you don't have to maintain another separate database to store your specific group data.

Please see the [custom data section](#custom-data) for more information and requirements/restrictions for creating, retrieving, updating and deleting group custom data. 

<a class="anchor" name="groups-list"></a>
### List Groups

#### Application Groups

The application groups endpoint is a [Collection Resource](#collections) representing all application-accessible groups. A group is accessible to an application if it, or its directory, is assigned to the application as an account store.

    /v1/applications/:applicationUid/groups

HTTP GET returns a paginated list of links for groups accessible to an application.

**Example request:**

    GET https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/groups

**Example response:**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
      "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/groups"
      "offset": 0,
      "limit": 25,
      "items" : [
        {
          "href" : "https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ"
          "name": "Red Shirts",
          ... remaining Group key/value pairs ...
        },
        {
          "href" : "https://api.stormpath.com/v1/groups/sUcKIttrebEcKhgU86Kl0u"
          "name": "Science Officers",
          ... remaining Group key/value pairs ...
        },
        {
          "href" : "https://api.stormpath.com/v1/groups/Yu8ihas7HOpjHs3uhd7jGd"
          "name": "Security Team",
          ... remaining Group key/value pairs ...
        }
      ]
    }

##### Account Groups

The account `groups` resource is a [Collection Resource](#collections) representing all account-associated groups. A group is associated with an account when an account has been assigned to that group as a member.

    /v1/accounts/:accountUid/groups

HTTP GET returns a paginated list of links for groups for which an account is a member.

**Example Request**

    GET https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/groups

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
      "href": "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/groups"
      "offset": 0,
      "limit": 25,
      "items" : [
        {
          "href" : "https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ"
          "name": "Red Shirts",
          ... remaining Group key/value pairs ...
        },
        {
          "href" : "https://api.stormpath.com/v1/groups/sUcKIttrebEcKhgU86Kl0u"
          "name": "Science Officers",
          ... remaining Group key/value pairs ...
        },
        {
          "href" : "https://api.stormpath.com/v1/groups/Yu8ihas7HOpjHs3uhd7jGd"
          "name": "Security Team",
          ... remaining Group key/value pairs ...
        }
      ]
    }

##### Directory Groups

The directory `groups` resource is a [Collection Resource](#collections) representing all directory-associated groups. Groups are defined as a subset of members in a directory.

    /v1/directories/:directoryUid/groups

HTTP GET returns a paginated list of links for groups for which an account is a member.

**Example Request**

    GET https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q/groups

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
      "href": "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q/groups"
      "offset": 0,
      "limit": 25,
      "items" : [
        {
          "href" : "https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ"
          "name": "Red Shirts",
          ... remaining Group key/value pairs ...
        },
        {
          "href" : "https://api.stormpath.com/v1/groups/sUcKIttrebEcKhgU86Kl0u"
          "name": "Science Officers",
          ... remaining Group key/value pairs ...
        },
        {
          "href" : "https://api.stormpath.com/v1/groups/Yu8ihas7HOpjHs3uhd7jGd"
          "name": "Security Team",
          ... remaining Group key/value pairs ...
        }
      ]
    }

<a class="anchor" name="groups-search"></a>
### Search Groups

Group attributes supported for search:

* name
* description
* status

**Searchable Group Collection Resources**

Group Collection Resource | Search Functionality
:----- | :-----
/v1/directories/:directoryId/groups | A search across groups in the specified directory.
/v1/applications/:applicationId/groups | A search across groups accessible to the specified application.
/v1/accounts/:accountId/groups    | A search across groups assigned to the specified account.

<a class="anchor" name="group-accounts"></a>
### Group Accounts

The Group `accounts` Collection for a `Group` Resource represents all accounts that are members of a specific group.

**Group Accounts Collection Resource URI**

    /v1/groups/:groupId/accounts

<a class="anchor" name="group-accounts-search"></a>
#### Search Group Accounts

You may search for directories by sending a `GET` request to your application's `accounts` Collection Resource `href` URL using [search query parameters](#search).  Any matching directories with your tenant will be returned as a [paginated](#pagination) list.

##### Searchable Account Attributes

The following [account attributes](#account-resource) are searchable via [filter](#search-filter) and [attribute](#search-attribute) searches:

* `givenName`
* `middleName`
* `surname`
* `username`
* `email`

In addition to the [search query parameters](#search), you may also use [pagination](#pagination) and [sorting](#sorting) query parameters to customize the paginated response.  For example:

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/groups/$GROUP_ID/accounts?q=foo&orderBy=surname&offset=0&limit=50"
<!-- {: .bash} -->

<a class="anchor" name="working-with-group-accounts"></a>
#### Working With Group Accounts

Account resources support the full suite of CRUD commands and other interactions. Please see the [Accounts section](#accounts) for more information.

<a class="anchor" name="group-account-memberships"></a>
### Account Memberships

The `accountMemberships` Collection for a `group` Resource represents all account memberships where a specific group is a member. In this case, Account Memberships are simply an alternative, context-specific name for [Group Memberships](#group-memberships).

**Account Memberships Collection Resource URI**

    /v1/groups/:groupId/accountMemberships

#### List Account Memberships

`HTTP GET` returns a Collection Resource containing the group memberships to which a specific group is a member.

**Example Request**

    GET https://api.stormpath.com/v1/groups/smJGMBMpQ_-FKvMgCRTdVA/accountMemberships

**Example Response**

    HTTP/1.1 200 OK
         Content-Type: application/json;charset=UTF-8;

    {
        "href" : "https://api.stormpath.com/v1/groups/smJGMBMpQ_-FKvMgCRTdVA/accountMemberships",
        "offset" : 0,
        "limit" : 25,
        "items": [ {
              "href" : "https://api.stormpath.com/v1/groupMemberships/1u86fpQxJkFTfQHm1Hnhpb",
              "account" : {
                    "href" : "https://api.stormpath.com/v1/accounts/gSraAOpFS-Savh3h6gFDzQ"
            },
            "group" : {
                  "href" : "https://api.stormpath.com/v1/groups/smJGMBMpQ_-FKvMgCRTdVA"
            }
        }, {
            "href" : "https://api.stormpath.com/v1/groupMemberships/249Up9ojT6NUNEYocdG4Dj",
            "account" : {
                  "href" : "https://api.stormpath.com/v1/accounts/k8idbaXRTSKncv3VLffDNw"
            },
            "group" : {
                  "href" : "https://api.stormpath.com/v1/groups/smJGMBMpQ_-FKvMgCRTdVA"
            }
        } ]
    }

<a class="anchor" name="working-with-group-account-memberships"></a>
#### Working With Account Memberships

`Account Membership` is a context-specific alias for a `Group Membership`.  Group Membership resources support the full suite of CRUD commands and other interactions. Please see the [Group Memberships section](#group-memberships) for more information.

***

<a class="anchor" name="group-memberships"></a>
## Group Memberships

A Group Membership resource represents the link between an [account](#accounts) and a [group](#groups). When an account is associated with a group or a group is associated with an account, a group membership is created. 

<a class="anchor" name="group-membership-resource"></a>
### Group Membership Resource

**Resource URI**

    v1/groupMemberships/:groupMembershipId

<a class="anchor" name="group-membership-resource-attributes"></a>
**Resource Attributes**

Attribute | Description | Type | Valid Value
:----- | :----- | :---- | :----
<a class="anchor" name="group-membership-href"></a>`href` | The resource fully qualified location URI. | String | —
<a class="anchor" name="group-membership-account"></a>`account` | A link to the account of the group membership. | Link | —
<a class="anchor" name="group-membership-group"></a>`group` | A link to the group of the group membership. | Link | —

For group memberships, you can:

* [Locate a group membership's REST URL](#group-membership-url)
* [Create a group membership](#group-membership-create)
* [Retrieve a group membership](#group-membership-retrieve)
* [Delete a group membership](#group-membership-delete)
* [List group membership resources](#group-memberships-list)

<a class="anchor" name="group-membership-url"></a>
### Locate a Group Membership's REST URL

When communicating with the Stormpath REST API, you might need to reference a group membership using the REST URL or `href`.

There are multiple ways to find a group membership's `href` depending on what information you have available:

* Retrieve a full list of group memberships for an account
* Retrieve a full list of group members (as group membership pairings) for a group

In all cases, the process is fundamentally the same. Consider the first case as example. If you want to find a specific `href` for a group mapping on a specific account,  you'll need to search the group memberships for the associated `account` resource:

**Example Request**

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/accounts/2dgfmriyAP238bkRB6ISmB/groupMemberships"

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8

    {
        href: "https://api.stormpath.com/v1/accounts/2dgfmriyAP238bkRB6ISmB/groupMemberships"
        offset: 0
        limit: 25
        items: [1]
          0:  {
            href: "https://api.stormpath.com/v1/groupMemberships/2et4tXeMFFiMiZWUOIvWzj"
          - account: {
                href: "https://api.stormpath.com/v1/accounts/2dgfmriyAP238bkRB6ISmB"
            }
          - group: {
                href: "https://api.stormpath.com/v1/groups/cquoM06qa6pTkk1h2xOeJ"
              }
          }
    }

If you know the name exactly, you can use an [attribute search](#search-attribute) (e.g., "name=") or, if you only know a small part, you can use a [filter search](#search-filter) (e.g., "q=My") to narrow down the selection.

<a class="anchor" name="group-membership-create"></a>
### Create a Group Membership

To create a group membership you need the account and the group href.

**Example Request**

    POST https://api.stormpath.com/v1/groupMemberships
        Content-Type: application/json;charset=UTF-8

    {
      "account" : {
          "href" : "https://api.stormpath.com/v1/accounts/gSraAOpFS-Savh3h6gFDzQ"
       },
       "group" : {
           "href" : "https://api.stormpath.com/v1/groups/smJGMBMpQ_-FKvMgCRTdVA"
       }
    }

**Example Response**

    HTTP/1.1 201 Created
        Location: https://api.stormpath.com/v1/groupMemberships/57YZCqrNgrzcIGYs1PfP4F
        Content-Type: application/json;charset=UTF-8;

    {
      "href" : "https://api.stormpath.com/v1/groupMemberships/57YZCqrNgrzcIGYs1PfP4F",
      "account" : {
          "href" : "https://api.stormpath.com/v1/accounts/gSraAOpFS-Savh3h6gFDzQ"
       },
       "group" : {
           "href" : "https://api.stormpath.com/v1/groups/smJGMBMpQ_-FKvMgCRTdVA"
       }
    }

<a class="anchor" name="group-membership-retrieve"></a>
### Retrieve a Group Membership

HTTP GET returns a representation of a `groupMembership` resource that includes the account and the group hrefs.

**Example Request**

    GET https://api.stormpath.com/v1/groupMemberships/249Up9ojT6NUNEYocdG4Dj

**Example Response**

    HTTP/1.1 200 OK
         Content-Type: application/json;charset=UTF-8;

    {
     "href" : "https://api.stormpath.com/v1/groupMemberships/249Up9ojT6NUNEYocdG4Dj",
     "account" : {
       "href" : "https://api.stormpath.com/v1/accounts/k8idbaXRTSKncv3VLffDNw"
       },
      "group" : {
        "href" : "https://api.stormpath.com/v1/groups/smJGMBMpQ_-FKvMgCRTdVA"
       }
    }

<a class="anchor" name="group-membership-resources-expand"></a>
#### Expandable Resources

When retrieving an application, you can also retrieve one or more of its linked resources by [expanding them in-line](#links-expansion) using the `expand` query parameter.

The following `Application` attributes are expandable:

* `account`
* `group`

See the [Link Expansion](#links-expansion) section for more information on expanding link attributes.

<a class="anchor" name="group-membership-delete"></a>
### Delete a Group Membership

Deleting a group membership completely erases the `groupMembership` resource from Stormpath. This operation does not delete the group or the account involved in the group membership, only the association between them.

**Example Request**

    DELETE https://api.stormpath.com/v1/groupMemberships/57YZCqrNgrzcIGYs1PfP4F

**Example Response**

    HTTP/1.1 204 No Content

<a class="anchor" name="group-memberships-list"></a>
### List Group Memberships

You can list group memberships by [account](#group-membership-by-account) or [group](#account-membership-by-group).

<a class="anchor" name="group-membership-by-account"></a>
#### List Group Memberships For An Account

The account `groupMemberships` endpoint is a [Collection Resource](#collections) representing all group memberships where the account is involved.

    /v1/accounts/:accountId/groupMemberships

`HTTP GET` returns a paginated list of the group memberships where the account is involved.

**Example Request**

    GET https://api.stormpath.com/v1/accounts/MvdTIJakRO2Ry8c5z5itWw/groupMemberships

**Example Response**

    HTTP/1.1 200 OK
         Content-Type: application/json;charset=UTF-8;

    {
        "href" : "https://api.stormpath.com/v1/accounts/MvdTIJakRO2Ry8c5z5itWw/groupMemberships",
        "offset" : 0,
        "limit" : 25,
        "items" : [ {
              "href" : "https://api.stormpath.com/v1/groupMemberships/36KuRJcsfiHZjCR0Trv4yJ",
              "account" : {
                    "href" : "https://api.stormpath.com/v1/accounts/MvdTIJakRO2Ry8c5z5itWw"
            },
            "group" : {
                  "href" : "https://api.stormpath.com/v1/groups/tKP_30-9TcCneD3ktBwcig"
            }
        }, {
            "href" : "https://api.stormpath.com/v1/groupMemberships/1kjD3owGFAAzoGhFsO1oLz",
            "account" : {
                  "href" : "https://api.stormpath.com/v1/accounts/MvdTIJakRO2Ry8c5z5itWw"
            },
            "group" : {
                  "href" : "https://api.stormpath.com/v1/groups/smJGMBMpQ_-FKvMgCRTdVA"
            }
        } ]
    }

<a class="anchor" name="account-membership-by-group"></a>
#### List Account Memberships For A Group

The group `accountMemberships` endpoint is a [Collection Resource](#collections representing all group memberships where the group is involved.

    /v1/groups/:groupId/accountMemberships

List Group Group Memberships (HTTP GET)

`HTTP GET` returns a paginated list of the group memberships where the group is involved.

**Example Request**

    GET https://api.stormpath.com/v1/groups/smJGMBMpQ_-FKvMgCRTdVA/accountMemberships

**Example Response**

    HTTP/1.1 200 OK
         Content-Type: application/json;charset=UTF-8;

    {
        "href" : "https://api.stormpath.com/v1/groups/smJGMBMpQ_-FKvMgCRTdVA/accountMemberships",
        "offset" : 0,
        "limit" : 25,
        "items" : [
          {
              "href" : "https://api.stormpath.com/v1/groupMemberships/1u86fpQxJkFTfQHm1Hnhpb",
              "account" : {
                  "href" : "https://api.stormpath.com/v1/accounts/gSraAOpFS-Savh3h6gFDzQ"
              },
              "group" : {
                  "href" : "https://api.stormpath.com/v1/groups/smJGMBMpQ_-FKvMgCRTdVA"
              }
          },
          {
              "href" : "https://api.stormpath.com/v1/groupMemberships/249Up9ojT6NUNEYocdG4Dj",
              "account" : {
                  "href" : "https://api.stormpath.com/v1/accounts/k8idbaXRTSKncv3VLffDNw"
              },
              "group" : {
                  "href" : "https://api.stormpath.com/v1/groups/smJGMBMpQ_-FKvMgCRTdVA"
              }
          }
        ]
    }

***

<a class="anchor" name="accounts"></a>
## Accounts

An Account is a unique identity within a Directory, with a unique username and/or email address. An account can log in to applications using either the email address or username associated with it. Accounts can represent your end users (people), but they can also be used to represent services, daemons, processes, or any "entity" that needs to login to a Stormpath-enabled application.  Additionally, an account may only exist in a single directory and may be in multiple groups owned by that directory.  Accounts may not be assigned to groups within other directories.

It should be noted that the words 'User' and 'Account' usually mean the same thing, but there is a subtle difference that can be important at times:

- An Account is a unique identity within a Directory.
- When an account is granted access to an application (by [mapping a Directory or Group](#account-store-mappings) that contains the account to the application), it becomes a 'User' of that application.

Therefore an Account can be called a 'User' of an application if/when it can login to the application.

#### LDAP/AD Accounts

It should be noted that Accounts that originate in LDAP or Active Directory (AD) are mirrored in Stormpath, and they are special: you cannot create, update or delete Accounts that originate in an LDAP mirrored directory - you can only read them or use them for login.  This is because LDAP is the source of 'truth' and Stormpath does not (currently) have write-access to LDAP installations.

You manage LDAP/AD accounts on your primary LDAP/AD installation. LDAP/AD accounts and groups are automatically deleted when:

* The backing object is deleted from the LDAP/AD directory service.
* The backing LDAP/AD object information no longer matches the account filter criteria configured for the agent.
* The LDAP/AD directory is deleted.

An account is a unique identity within a directory. An account can exist in only a single directory but can be a part of multiple groups owned by that directory.

<a class="anchor" name="account"></a>
### Account Resource

**Resource URI**

    /v1/accounts/:accountId

**Resource Attributes**

Attribute | Description | Type | Valid Value
:----- | :----- | :---- | :----
`href` | The resource fully qualified location URI | String | <span>--</span>
<a id="username"></a>`username` | The username for the account. Must be unique across the owning directory. If not specified, the username will default to the email field. | String | 1 < N <= 255 characters
<a id="email"></a>`email` | The email address for the account. Must be unique across the owning directory. | String | 1 < N <= 255 characters
<a id="password"></a>`password` | The password for the account. Only include this attribute if setting or changing the account password. | String | 1 < N <= 255 characters
<a id="fullName"></a>`fullName` | The full name for the account holder. This is a computed attribute based on the `givenName`, `middleName` and `surname` attributes. It cannot be modified. To change this value, change one of the three respective attributes to trigger a new computed value.| String | <span>--</span>
<a id="givenName"></a>`givenName` | The given (first) name for the account holder. | String | 1 < N <= 255 characters
<a id="middleName"></a>`middleName` | The middle (second) name for the account holder. | String | 1 < N <= 255 characters
<a id="surname"></a>`surname` | The surname (last name) for the account holder. | String | 1 < N <= 255 characters
<a id="status"></a>`status` | `enabled` accounts are able to login to their assigned [applications](#Applications), `disabled` accounts may not login to applications, `unverified` accounts are disabled and have not verified their email address. | Enum | `enabled`,`disabled`,`unverified`
<a id="account-resource-custom-data"></a>`customData` | A link to the account's [customData](#custom-data) resource that you can use to store your own account-specific custom fields. | Link | <span>--</span>
<a id="account-resource-groups"></a>`groups` | A link to the [groups](#Groups) that the account belongs to. | Link | <span>--</span>
<a id="account-resource-group-memberships"></a>`groupMemberships` | A link to the group memberships that the account belongs to. | Link | <span>--</span>
<a id="account-resource-directory"></a>`directory` | A link to the account's directory. | Link | <span>--</span>
<a id="account-resource-tenant"></a>`tenant` | A link to the tenant that owns the account's directory. | Link | <span>--</span>
<a id="account-resource-emailVerificationToken"></a>`emailVerificationToken` | A link to the account's email verification token.  This will only be set if the account needs to be verified. | Link | <span>--</span>

For accounts, you can:

* [Locate an account's REST URL](#accounts-url)
* [Create an account](#account-create)
* [Retrieve an account](#account-retrieve)
* [Update an account](#account-update)
    * [Assign accounts to groups](#account-add-group)
    * [Remove accounts from groups](#account-remove-group)
    * [Enable or Disable an account](#account-enable)
* [Delete an accounts](#account-delete)
* [Manage account-specific custom data](#custom-data)
* [List accounts](#accounts-list)
    * [List application accounts](#accounts-application-accounts-list)
    * [List group members](#accounts-application-group-members)
    * [List directory members](#accounts-application-directory-accounts)
* [Search accounts](#search-accounts)
* [Work with accounts](#accounts-workflow)
    * [Verify an account's email address](#account-verify-email)
    * [Log in (authenticate) an account](#accounts-authenticate)
    * [Reset an account password](#accounts-reset)
* [Access an account's groups](#account-groups)
* [Manage an account's group memberships](#account-group-memberships)

<a class="anchor" name="accounts-url"></a>
### Locate an Account's REST URL

In order to locate an account's REST URL, you'll need to first search for the account via either an [application](#application) or a [directory](#directory) resource using specific information you have available.

For example, if you want to find the `href` for an account with the username "test" across an application, you'll need to search the application for the "test" account object:

**Example Request**

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/applications/5D1THHV76HO0EXPyxBXO8p/accounts?username=test"

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8

    {
      "href": "https://api.stormpath.com/v1/applications/5D1THHV76HO0EXPyxBXO8p/accounts?username=test",
      "offset": 0,
      "limit": 25,
      "items" : [
        {
          "href" : "https://api.stormpath.com/v1/accounts/WpM9nyZ2TbaEzfbRvLk9KA",
          "username" : "test"
          ... remaining Account name/value pairs ...
        },
      ]
    }

If you know the username exactly, you can use an [attribute search](#search-attribute) (e.g., "username=") or, if you only know a small part, you can use a [filter search](#search-filter) (e.g., "q=test") to narrow down the selection.

<a class="anchor" name="account-create"></a>
### Create an Account

Because Accounts are 'owned' by Directories, you create new accounts by adding them to a Directory.  You can add an account to a directory directly or you can indirectly add an account to a Directory by [registering an Account with an Application](#application-account-register)

This section will show examples using a Directory `/accounts` href, but they will function the same if you use an Application's `/accounts` href as well.

{% docs note %}
You may only create accounts for Stormpath-manageed 'Cloud' directories.  Mirrored accounts from LDAP or Active Directory must be created in the LDAP/AD server and they will be reflected in Stormpath accordingly.  You cannot manually create accounts in a Mirrored directory.
{% enddocs %}

**Directory Accounts Resource URI**

    /v1/directories/:directoryId/accounts

**Required Attributes**

* [email](#email)
* [password](#password) (see note below)
* [givenName](#givenName)
* [surname](#surname)

**Optional Attributes**

* [username](#username)
* [middleName](#middleName)
* [status](#status)
* [customData](#account-resource-custom-data)

{% docs note %}
The password in the request is being sent to Stormpath as plain text. This is one of the reasons why Stormpath only allows requests via HTTPS. Stormpath implements the latest password hashing and cryptographic best-practices that are automatically upgraded over time so the developer does not have to worry about this. Stormpath can only do this for the developer if Stormpath receives the plaintext password so we can hash it using these techniques.
  
Plaintext passwords also allow Stormpath to [enforce password restrictions](#directories-password-restrictions) in a configurable manner (e.g., you can configure your directories to reject passwords without mixed case and non-alphanumeric characters.)

Most importantly, Stormpath does not persist nor relay plaintext passwords in any circumstances.

On the client side, then, you do not need to worry about salting or storing passwords at any point; you need only pass them to Stormpath for hashing, salting, and persisting with the appropriate HTTPS API call (e.g., [Create An Account](#account-create) or [Update An Account](#account-update)).
{% enddocs %}

Here are some account creation examples:

* [Simple Create Account Example](#account-create-simple)
* [Create an Account with Custom Data](#account-create-with-custom-data)
* [Create an Account and suppress registration emails](#account-create-no-email)

<a class="anchor" name="account-create-simple"></a>
Simple creation request:

**Example Request**

    POST https://api.stormpath.com/v1/directories/WpM9nyZ2TbaEzfbRvLk9KA/accounts
    Content-Type: application/json;charset=UTF-8
    
    {
      "username" : "jlpicard",
      "email" : "capt@enterprise.com",
      "givenName" : "Jean-Luc",
      "surname" : "Picard",
      "password" : "uGhd%a8Kl!"
    }

**Example Response**

    HTTP/1.1 201 Created
    Location: https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA
    Content-Type: application/json;charset=UTF-8;
    
    {
      "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA",
      "username" : "jlpicard",
      "email" : "capt@enterprise.com",
      "fullName" : "Jean-Luc Picard",
      "givenName" : "Jean-Luc",
      "middleName" : "",
      "surname" : "Picard",
      "status" : "UNVERIFIED",
      "customData": {
        "href": "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/customData" 
      },
      "groups" : {
        "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/groups"
      },
      "groupMemberships" : {
        "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/groupMemberships"
      },
      "directory" : {
        "href" : "https://api.stormpath.com/v1/directories/WpM9nyZ2TbaEzfbRvLk9KA"
      },
      "tenant" : {
        "href" : "https://api.stormpath.com/v1/tenants/Ad8mIcavSty7XzD-xZdP3g"
      },
      "emailVerificationToken" : {
        "href" : "https://api.stormpath.com/v1/accounts/emailVerificationTokens/4VQxTP5I7Xio03QJTOwQy1"
      }
    }

<a class="anchor" name="account-create-with-custom-data"></a>
#### Create Directory Account with Custom Data
In addition to the Stormpath account attributes, you may also specify [your own custom data](#account-custom-data) by including a 'customData' JSON object:

    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
         -H "Accept: application/json" \
         -H "Content-Type: application/json" \
         -d '{
                 "username" : "jlpicard",
                 "email" : "capt@enterprise.com",
                 "givenName" : "Jean-Luc",
                 "middleName" : "",
                 "surname" : "Picard",
                 "password" : "uGhd%a8Kl!"
                 "status" : "ENABLED",
                 "customData": {
                     "rank": "Captain",
                     "birthDate": "2305-07-13",
                     "birthPlace": "La Barre, France",
                     "favoriteDrink": "Earl Grey tea"
                 }
             }' \
         "https://api.stormpath.com/v1/directories/WpM9nyZ2TbaEzfbRvLk9KA/accounts"

Once created, you can further modify the custom data resource: delete it, add and remove attributes, etc as necessary.  See the [account custom data](#account-custom-data) section for more information on custom data and custom data restrictions.

<a class="anchor" name="account-create-no-email"></a>
#### Create Directory Account and Suppress Registration Email

If you want to create a directory account and you want to override the directory's account registration workflow email settings, you can specify a `registrationWorkflowEnabled=false` query parameter:

    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
         -H "Accept: application/json" \
         -H "Content-Type: application/json" \
         -d '{
               "username" : "jlpicard",
               "email" : "capt@enterprise.com",
               "givenName" : "Jean-Luc",
               "middleName" : "",
               "surname" : "Picard",
               "password" : "uGhd%a8Kl!"
               "status" : "ENABLED",
             }' \
         "https://api.stormpath.com/v1/directories/WpM9nyZ2TbaEzfbRvLk9KA/accounts?registrationWorkflowEnabled=false"

<a class="anchor" name="account-retrieve"></a>
### Retrieve an Account

HTTP `GET` returns a representation of an `account` resource that includes the attributes.

**Example Request**

    GET https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;
    
    {
      "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA",
      "username" : "jlpicard",
      "email" : "capt@enterprise.com",
      "fullName" : "Jean-Luc Picard",
      "givenName" : "Jean-Luc",
      "middleName" : "",
      "surname" : "Picard",
      "status" : "ENABLED",
      "customData": {
        "href": "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/customData" 
      },
      "groups" : {
        "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/groups"
      },
      "groupMemberships" : {
        "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/groupMemberships"
      },
      "directory" : {
        "href" : "https://api.stormpath.com/v1/directories/1FaQ6kZxTL4DVJXWeXtUh7"
      },
      "tenant" : {
        "href" : "https://api.stormpath.com/v1/tenants/Ad8mIcavSty7XzD-xZdP3g"
      },
      "emailVerificationToken" : null
    }

<a class="anchor" name="account-resources-expand"></a>
#### Expandable Resources

When retrieving an account, you can also retrieve one or more of its linked resources by [expanding them in-line](#links-expansion) using the `expand` query parameter.

The following `Account` attributes are expandable:

* `customData`
* `tenant`
* `directory`
* `groups`
* `groupMemberships`

Also, because `groups` and `groupMemberships` are [Collection Resources](#collections) themselves, you can additionally control [pagination](#pagination) for either expanded collection.  For example:

    GET https://api.stormpath.com/v1/accounts/WpM9nyZ2TbaEzfbRvLk9KA?expand=tenant,directory,groups(offset:0,limit:50),groupMemberships(offset:0,limit:50)

See the [Link Expansion](#links-expansion) section for more information on expanding link attributes.

<a class="anchor" name="account-update"></a>
### Update an Account

Use HTTP `POST` when you want to change one or more specific attributes of an `account` resource. Unspecified attributes will not be changed, but at least one attribute must be specified.

{% docs warning %}
Changes made to an account are immediately reflected in any application that has access to the account (based on applications' [account store mappings](#account-store-mappings)). Be careful updating an account for a single application's needs - ensure that the changes are OK for any and all applications that may access the account.
{% enddocs %}

**Optional Attributes**

* [username](#username)
* [email](#email)
* [password](#password)
* [givenName](#givenName)
* [middleName](#middleName)
* [surname](#surname)
* [status](#status)
* [customData](#account-resource-custom-data)

{% docs note %}
The password in the request is being sent to Stormpath as plain text. This is one of the reasons why Stormpath only allows requests via HTTPS. Stormpath implements the latest password hashing and cryptographic best-practices that are automatically upgraded over time so the developer does not have to worry about this. Stormpath can only do this for the developer if Stormpath receives the plaintext password so we can hash it using these techniques.

Plaintext passwords also allow Stormpath to [enforce password restrictions](#directories-password-restrictions) in a configurable manner (e.g., you can configure your directories to reject passwords without mixed case and non-alphanumeric characters.)

Most importantly, Stormpath does not persist nor relay plaintext passwords in any circumstances.
  
On the client side, then, you do not need to worry about salting or storing passwords at any point; you need only pass them to Stormpath for hashing, salting, and persisting with the appropriate HTTPS API call (e.g., [Create An Account](#account-create) or [Update An Account](#account-update)).
{% enddocs %}

Here are some account update examples:

* [Simple Update Account Example](#account-update-simple)
* [Create an Account and suppress registration emails](#account-create-no-email)
* [Update an Account's password directly](#ChangeAccountPassword)
* [Update an Account and its Custom Data simultaneously](#update-custom-data-embedded)

<a class="anchor" name="UpdateAccountName"></a><a class="anchor" name="account-update-simple"></a>
**Example Request to Update the Name**

    POST https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02bAb
    Content-Type: application/json;charset=UTF-8
    
    {
      "username" : "jlpicard",
      "givenName" : "Jean-Luc",
      "surname" : "Picard",
    }

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;
    
    {
      "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA",
      "username" : "jlpicard",
      "email" : "capt@enterprise.com",
      "fullName" : "Jean-Luc Picard",
      "givenName" : "Jean-Luc",
      "middleName" : "",
      "surname" : "Picard",
      "status" : "ENABLED",
      "customData": {
        "href": "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/customData" 
      },
      "groups" : {
        "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/groups"
      },
      "groupMemberships" : {
        "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/groupMemberships"
      },
      "directory" : {
        "href" : "https://api.stormpath.com/v1/directories/1FaQ6kZxTL4DVJXWeXtUh7"
      },
      "tenant" : {
        "href" : "https://api.stormpath.com/v1/tenants/Ad8mIcavSty7XzD-xZdP3g"
      },
      "emailVerificationToken" : null
    }

<a class="anchor" name="ChangeAccountPassword"></a>
#### Update an Account's Password Directly    

**Example Request to Change an Account Password**

    POST https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02bAb
    Content-Type: application/json;charset=UTF-8
    
    {
      "password" : "L9%hw4c5q"
    }

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;
    
    {
      "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA",
      "username" : "jlpicard",
      "email" : "capt@enterprise.com",
      "fullName" : "Jean-Luc Picard",
      "givenName" : "Jean-Luc",
      "middleName" : "",
      "surname" : "Picard",
      "status" : "ENABLED",
      "customData": {
        "href": "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/customData" 
      },
      "groups" : {
        "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/groups"
      },
      "groupMemberships" : {
        "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/groupMemberships"
      },
      "directory" : {
        "href" : "https://api.stormpath.com/v1/directories/1FaQ6kZxTL4DVJXWeXtUh7"
      },
      "tenant" : {
        "href" : "https://api.stormpath.com/v1/tenants/Ad8mIcavSty7XzD-xZdP3g"
      },
      "emailVerificationToken" : null
    }

<a class="anchor" name="account-add-group"></a>
#### Assign an Account to a Group

If the account is part of a directory containing groups, you can associate the account with a group.

To assign an account to a group:

**Example Request**

    POST https://api.stormpath.com/v1/groupMemberships
    Content-Type: application/json;charset=UTF-8
    
    {
      "account" : {
        "href" : "https://api.stormpath.com/v1/accounts/Gu8oshf7HdsspjHs3uhd7jGd"
      },
      "group" : {
        "href" : "https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ"
      }
    }

**Example Response**

    HTTP/1.1 201 Created
    Location: https://api.stormpath.com/v1/groupMemberships/cJoiwjorTTmLDDBsf04Abi
    Content-Type: application/json;charset=UTF-8;
    
    {
      "href" : "https://api.stormpath.com/v1/groupMemberships/cJoiwjorTTmLDDBsf04Abi",
      "account" : {
        "href" : "https://api.stormpath.com/v1/accounts/Gu8oshf7HdsspjHs3uhd7jGd"
      },
      "group" : {
        "href" : "https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ"
      }
    }

<a class="anchor" name="account-remove-group"></a>
#### Remove an Account from a Group

If the account is the member of a group within a directory, you can remove the account from the group by deleting the `groupMembership` resource that associates the two together:

**Example Request**

    DELETE https://api.stormpath.com/v1/groupMemberships/cJoiwjorTTmLDDBsf04Abi

**Example Response**

    HTTP/1.1 204 No Content

<a class="anchor" name="account-enable"></a>
#### Enable or Disable an Account

Accounts have an "status" which defines its state in the systems: enabled and disabled. An enabled account can be successfully authenticated if it is assigned to an active account store in an application while a disabled account cannot.

{% docs note %}
Enabling and disabling accounts for mirrored (LDAP) directories is not available in Stormpath. You manage mirrored (LDAP) accounts on the primary server installation.
{% enddocs %}

For example, to enable an account:

**Example Request**

    POST https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02bAb
    Content-Type: application/json;charset=UTF-8
    
    {
      "status" : "ENABLED"
    }

<a class="anchor" name="account-delete"></a>
### Delete an Account

Deleting an account completely erases the account from the directory and erases all account information from Stormpath.

{% docs warning %}
Deleting an account permanently removes the account from any application that has access to the account (based on applications' [account store mappings](#account-store-mappings)). Additionally, be careful deleting an account for a single application's needs - ensure that the deletion is OK for any and all applications that may access the account.
{% enddocs %}

To delete an account:

**Example Request**

    DELETE https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02bAb

**Example Response**

    HTTP/1.1 204 No Content

### Account Custom Data

While Stormpath's default Account attributes are useful to many applications, you might want to add your own custom data to a Stormpath account.  If you want, you can store all of your custom account information in Stormpath so you don't have to maintain another separate database to store your specific account data.

Please see the [custom data section](#custom-data) for more information and requirements/restrictions for creating, retrieving, updating and deleting account custom data.

<a class="anchor" name="accounts-list"></a>
### List Accounts

Using the API, you can view [all accounts of an application](#accounts-application-accounts-list), [all members of a group](#accounts-application-group-members), or [all accounts/members of a directory](#accounts-application-directory-accounts).

An application's `accounts` is a [Collection Resource](#collections) that represents all accounts that can log in to the application.

    /v1/applications/:applicationUid/accounts

<a class="anchor" name="accounts-application-accounts-list"></a>
#### List Application Accounts

HTTP GET returns a paginated list of links for accounts within a specified application.

Example request:

    GET https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/accounts

Example response:

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;
    
    {
      "href": "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/accounts"
      "offset": 0,
      "limit": 25,
      "items" : [
         {
           "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02bAb"
           "username" : "jlpicard",
           "email" : "capt@enterprise.com",
           "fullName" : "Jean-Luc Picard",
           "givenName" : "Jean-Luc",
           "middleName" : "",
           "surname" : "Picard",
           "status" : "DISABLED",
           "groups" : {
             "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/groups"
           },
           "groupMemberships" : {
             "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/groupMemberships"
           },
           "directory" : {
             "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q"
           },
           "tenant" : {
             "href" : "https://api.stormpath.com/v1/tenants/Ad8mIcavSty7XzD-xZdP3g"
           },
           "emailVerificationToken" : null
         },
         {
           "href" : "https://api.stormpath.com/v1/accounts/tHEcAkeiSAlIe9sdh8KjdJda"
           "username" : "st131",
           ...remaining Account key/value pairs...
        }
        ...
      ]
    }

<a class="anchor" name="accounts-application-group-members"></a>
#### List Group Members

**Example Request**

    GET https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ/accounts

**Example Response**

    HTTP/1.1 200 OK
     Content-Type: application/json;charset=UTF-8;
    
     {
       "href": "https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ/accounts"
       "offset": 0,
       "limit": 25,
       "items" : [
         {
           "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02bAb"
           "username" : "jlpicard",
           "email" : "capt@enterprise.com",
           "fullName" : "Jean-Luc Picard",
           "givenName" : "Jean-Luc",
           "middleName" : "",
           "surname" : "Picard",
           "status" : "DISABLED",
           "groups" : {
             "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/groups"
           },
           "groupMemberships" : {
             "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/groupMemberships"
           },
           "directory" : {
             "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q"
           },
           "tenant" : {
             "href" : "https://api.stormpath.com/v1/tenants/Ad8mIcavSty7XzD-xZdP3g"
           },
           "emailVerificationToken" : null
         },
         ... additional account resources ...
       ]
     }

<a class="anchor" name="accounts-application-directory-accounts"></a>
#### List Directory Accounts

**Example Request From a Directory**

    GET https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q/accounts

**Example Response From a Directory**

    HTTP/1.1 200 OK
     Content-Type: application/json;charset=UTF-8;

     {
       "href": "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q/accounts"
       "offset": 0,
       "limit": 25,
       "items" : [
         {
           "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02bAb"
           "username" : "jlpicard",
           "email" : "capt@enterprise.com",
           "fullName" : "Jean-Luc Picard",
           "givenName" : "Jean-Luc",
           "middleName" : "",
           "surname" : "Picard",
           "status" : "DISABLED",
           "groups" : {
             "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/groups"
           },
           "groupMemberships" : {
             "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/groupMemberships"
           },
           "directory" : {
             "href" : "https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q"
           },
           "tenant" : {
             "href" : "https://api.stormpath.com/v1/tenants/Ad8mIcavSty7XzD-xZdP3g"
           },
           "emailVerificationToken" : null
         },
         ... additional Account resources ...
       ]
     }

### Search Accounts

Account attributes supported for search:

* givenName
* surname
* email
* username
* middleName
* status

**Searchable Account Collection Resources**

Account Collection Resource | Search Functionality
:----- | :-----
/v1/directories/:directoryId/accounts | A search across accounts in the specified directory.
/v1/applications/:applicationId/accounts | A search across accounts that are users of the specified application.
/v1/groups/:groupId/accounts | A search across accounts in the specified group.

<a class="anchor" name="account-verify-email"></a>
### Verify An Email Address

If you want to verify that an account's email address is valid that the account belongs to a real person, Stormpath can help automate this for you, too.

#### Understanding The Email Verification Workflow

This workflow requires 3 parties to be involved: your application end-user, your application, and the Stormpath API server.

1. When the account is created in a Directory that has "Verification" enabled, Stormpath will email the account email address automatically.
2. The end-user opens his or her email and clicks the verification link.
3. With the token from the verification link clicked by the end-user, Your application calls back to the Stormpath API server to complete the process.

As mentioned previously, when you create a new account, it is stored in a Directory. If the account is created in a directory with both [Account Registration](#application-account-register) and Verification enabled, Stormpath will automatically send a welcome email that contains a verification link to the account's email address on your behalf. If the person reading the email clicks the verification link in the email, the account will then have an `ENABLED` status and be allowed to login to applications.

{% docs note %}
Accounts created in a Directory that has the Verification workflow enabled will have an `UNVERIFIED` status by default. `UNVERIFIED` is the same as `DISABLED`, but additionally indicates why the account is disabled. When the email link is clicked, they will have an `ENABLED` status.
{% enddocs %}

##### The Account Verification Base URL

It is also expected that the workflow's `Account Verification Base URL` has been set to a URL that will be processed by your own application web server. This URL should be free of any query parameters, as the Stormpath back-end will append on to the URL a parameter used to verify the email. If this URL is not set, a default Stormpath-branded page will appear which allows the user to complete the workflow.

{% docs note %}
The `Account Verification Base URL` defaults to a Stormpath API Sever URL which, while it is functional, is a Stormpath API server web page.  Because it will likely confuse your application end-users if they see a Stormpath web page, we strongly recommended that you specify a URL that points to your web application. Moreover, when specifying the Base URL, ensure it is a Base URL without query parameters
{% enddocs %}

<a class="anchor" name="accounts-verification-configuration"></a>
#### Configure The Verification Workflow

This workflow is disabled by default on Directories, but you can enable it, and set up the account verification base URL, easily in the Stormpath Admin Console UI. Refer to the [Stormpath Admin Console product guide](https://stormpath.com/docs/console/product-guide#!ManageWorkflowAutomation) for complete instructions.

#### Trigger The Verification Email (Create A Token)

In order to verify an account's email address, an `emailVerificationToken` must be created for that account. To create this token, you simply create an account in a directory, either programmatically or via a public account creation form of your own design, that has the account registration and verification workflow enabled.

For example, if you were to request the account object for a user who has not yet been verified, you will note that the account `status` is set to `UNVERIFIED` and `emailVerificationToken` will have an `href`:

    {
      href: "https://api.stormpath.com/v1/accounts/6XLbNaUsKm3E0kXMTTr10V"
      username: "test"
      email: "frank@stormpath.com"
      fullName: "test test test"
      givenName: "test"
      middleName: "test"
      surname: "test"
      status: "UNVERIFIED"
     -groups: {
        href: "https://api.stormpath.com/v1/accounts/6XLbNaUsKm3E0kXMTTr10V/groups"
      }
     -groupMemberships: {
        href: "https://api.stormpath.com/v1/accounts/6XLbNaUsKm3E0kXMTTr10V/groupMemberships"
      }
     -directory: {
        href: "https://api.stormpath.com/v1/directories/5D1bvO5To6KQBaGFh793Zz"
      }-
     -tenant: {
        href: "https://api.stormpath.com/v1/tenants/23mq7BPIxNgPUPZDwj04SZ"
      }
     -emailVerificationToken: {
        href: "https://api.stormpath.com/v1/accounts/emailVerificationTokens/6YJv9XBH1dZGP5A8rq7Zyl"
      }-
    }

{% docs tip %}
As an end-developer, all you need to do to create email verification tokens when a new account is created is to [configure the workflow](#accounts-verification-configuration) for the appropriate directory.
{% enddocs %}

#### Verifying The Account (Consume The Token)

When a new account is registered after configuration, either programmatically or through an account creation form in your application, an email verification token is created and Stormpath then automatically sends an email to the user. This email will include a link to the base URL you've [configured](#accounts-verification-configuration) with the following query string parameter:

    http://www.yourapplicationurl.com/path/to/validator?sptoken=$VERIFICATION_TOKEN

The token you capture from the query string is used to form the full `href` for a special email verification endpoint used to verify the account.

**Email Verification Tokens Collection Resource URI**

    /v1/accounts/emailVerificationsToken/:verificationToken

To verify the account, you use the token from the query string to form the above URL and `POST` a body-less request against the fully-qualified end point:

**Example Request**

    POST https://api.stormpath.com/v1/accounts/emailVerificationTokens/6YJv9XBH1dZGP5A8rq7Zyl

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
      href: "https://api.stormpath.com/v1/accounts/6XLbNaUsKm3E0kXMTTr10V"
    }

If the validation succeeds, you will receive back the `href` for the `account` resource which has now been verified. An email confirming the verification will be automatically sent to the account's email address by Stormpath afterwards, and the account will then be able to authenticate successfully.

If the verification token is not found, a `404 Not Found` is returned with an [error payload](#errors) explaining why the attempt failed:

**Example Email Verification Failure Response**

    HTTP/1.1 404 Not Found
    Content-Type: application/json;charset=UTF-8;

    {
      status: 404
      code: 404
      message: "The requested resource does not exist."
      developerMessage: "The requested resource does not exist."
      moreInfo: "mailto:support@stormpath.com"
    }

<a class="anchor" name="accounts-authenticate"></a>
### Authenticate An Account

After an account has been created, you can authenticate an account given an input of a username or email and a password from the end-user.  When authentication occurs, you are authenticating a user within a specific application against the application's account stores. That being said, the `application` resource is the starting point for authentication attempts. 

Once you have the application resource you may attempt authentication by sending a 'POST' request to the application's `loginAttempts` endpoint and providing a base64 encoded username and password pair that is seperated with a colon (for example - testuser:testpassword).  Stormpath requires that the username and password are base64 encoded so these values are not passed as clear text.

**Example Request**

    POST https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/loginAttempts
    Content-Type: application/json;charset=UTF-8

    {
       "type": "basic",
       "value": "anNtaXRoOmNoYW5nZW1l"
    }


**Example Successful Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
      "account": {
        "href" : "https://api.stormpath.com/v1/accounts/5BedLIvyfLjdKKEEXAMPLE"
      }
    }

For more information on working with applications and authentication, refer to the [Log in (Authenticate) an Account](#application-account-authc) section of this guide.

<a class="anchor" name="accounts-reset"></a>
### Reset An Account's Password

This is a self-service password reset workflow.  The account is sent an email with a secure link.  The person owning the account can click on the link and be shown a password reset form to reset their password.  This is strongly recommended to reduce support requests to your application team as well as to reduce your exposure to account passwords for added security.

The password reset workflow involves changes to an account at an application level, and as such, this workflow relies on the `application` resource as a starting point. For more information on working with this workflow via REST after they have already been configured, refer to the [Working With Applications](#application-password-reset) section of this guide.

This workflow is disabled by default for accounts, but you can enable it easily in the Stormpath Admin Console UI. Refer to the [Stormpath Admin Console product guide](https://stormpath.com/docs/console/product-guide#!ManageWorkflowAutomation) for complete instructions.

{% docs note %}
Workflows are only available on cloud directories and only configurable using the Stormpath Admin Console.  They are not currently configurable via the REST API. Also, the Stormpath Administrator directory's automated workflows cannot be altered.
{% enddocs %}

<a class="anchor" name="account-groups"></a>
### Account Groups

The account's `groups` resource is a [Collection Resource](#collections) which represents all groups where a specific account is a member.

**Resource URI**

    /v1/accounts/:accountId/groups

<a class="anchor" name="list-account-groups"></a>
#### List Account Groups

HTTP `GET` returns a Collection Resource containing links for all [groups](#groups) where a specific account is a member.

**Example Request**

    GET https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/groups

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
      "href": "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/groups"
      "offset": 0,
      "limit": 25,
      "items" : [
        {
          "href" : "https://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ"
          "name": "Red Shirts",
          "description": "",
          "status": "ENABLED",
          "directory": {
            "href": "http://api.stormpath.com/v1/directories/1FaQ6kZxTL4DVJXWeXtUh7"
          },
          "tenant": {
            "href": "http://api.stormpath.com/v1/tenants/tqjB6LiESGO00qvC5dkNw"
          },
          "accounts": {
            "href": "http://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ/accounts"
          },
          "accountMemberships": {
            "href": "http://api.stormpath.com/v1/groups/ZgoHUG0oSoVNeU0K4GZeVQ/accountMemberships"
          }
        },
        ... additional Account resources ...
      ]
    }

<a class="anchor" name="search-account-groups"></a>
#### Search Account Groups

You may search for directories by sending a `GET` request to your application's `accounts` Collection Resource `href` URL using [search query parameters](#search).  Any matching directories with your tenant will be returned as a [paginated](#pagination) list.

##### Searchable Group Attributes

The following [group attributes](#account-resource) are searchable via [filter](#search-filter) and [attribute](#search-attribute) searches:

* `name`
* `description`
* `status`

In addition to the [search query parameters](#search), you may also use [pagination](#pagination) and [sorting](#sorting) query parameters to customize the paginated response.  For example:

    curl -u $API_KEY_ID:$API_KEY_SECRET \
         -H "Accept: application/json" \
         "https://api.stormpath.com/v1/accounts/$ACCOUNT_ID/groups?q=foo&orderBy=name&offset=0&limit=50"
<!-- {: .bash} -->

<a class="anchor" name="working-with-account-groups"></a>
#### Working With Account Groups

Group resources support the full suite of CRUD commands and other interactions. Please see the [Groups section](#groups) for more information.

<a class="anchor" name="account-group-memberships"></a>
### Account Group Memberships

An account's `groupMemberships` resource is a [Collection Resource](#collections) which represents all group memberships where a specific account is a member.

**Account Group Membership Collection Resource URI**

    /v1/accounts/:accountId/groupMemberships

<a class="anchor" name="list-account-group-memberships"></a>
#### List Account Group Memberships

`HTTP GET` returns a Collection Resource containing the group memberships to which a specific account is a member.

**Example Request**

    GET https://api.stormpath.com/v1/accounts/MvdTIJakRO2Ry8c5z5itWw/groupMemberships

**Example Response**

    HTTP/1.1 200 OK
         Content-Type: application/json;charset=UTF-8;

    {
        "href" : "https://api.stormpath.com/v1/accounts/MvdTIJakRO2Ry8c5z5itWw/groupMemberships",
        "offset" : 0,
        "limit" : 25,
        "items": [
          {
            "href" : "https://api.stormpath.com/v1/groupMemberships/36KuRJcsfiHZjCR0Trv4yJ",
            "account" : {
              "href" : "https://api.stormpath.com/v1/accounts/MvdTIJakRO2Ry8c5z5itWw"
            },
            "group" : {
              "href" : "https://api.stormpath.com/v1/groups/tKP_30-9TcCneD3ktBwcig"
            }
          },
          {
            "href" : "https://api.stormpath.com/v1/groupMemberships/1kjD3owGFAAzoGhFsO1oLz",
            "account" : {
              "href" : "https://api.stormpath.com/v1/accounts/MvdTIJakRO2Ry8c5z5itWw"
            },
            "group" : {
              "href" : "https://api.stormpath.com/v1/groups/smJGMBMpQ_-FKvMgCRTdVA"
            }
          }
        ]
    }

<a class="anchor" name="working-with-account-group-memberships"></a>
#### Working With Account Group Memberships

Groups Membership resources support the full suite of CRUD commands and other interactions. Please see the [Group Memberships section](#group-memberships) for more information.

*** 
## Custom Data

Account and Group resources have predefined fields that are useful to many applications, but you are likely to have your own custom data that you need to associate with an account or group as well.

For this reason, both the account and group resources support a linked `customData` resource that you can use for your own needs.

The `customData` resource is a schema-less JSON object (aka 'map', 'associative array', or 'dictionary') that allows you to specify whatever name/value pairs you wish.

The `customData` resource `href` is always the account or group `href` with a `/customData` suffix:

<a class="anchor" name="account-custom-data-resource-uri"></a>
**Account Custom Data Resource URI**

    /v1/accounts/:accountId/customData

<a class="anchor" name="group-custom-data-resource-uri"></a>
**Group Custom Data Resource URI**

    /v1/groups/:groupId/customData

In addition to your custom name/value pairs, a `customData` resource will always contain 3 reserved read-only fields:

- `href`: The fully qualified location of the custom data resource
- `createdAt`: the UTC timestamp with millisecond precision of when the resource was created in Stormpath as an [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) formatted string, for example `2017-04-01T14:35:16.235Z`
- `modifiedAt`: the UTC timestamp with millisecond precision of when the resource was last updated in Stormpath as an [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) formatted string.

You can store an unlimited number of additional name/value pairs in the `customData` resource, with the following restrictions:

* The total storage size of a single `customData` resource cannot exceed 10 MB (megabytes).  **The `href`, `createdAt` and `modifiedAt` field names and values do not count against your resource size quota.**
* Field names must:
    * be 1 or more characters long, but less than or equal to 255 characters long (1 <= N <= 255).
    * contain only alphanumeric characters `0-9A-Za-z`, underscores `_` or dashes `-` but cannot start with a dash `-`.
    * may not equal any of the following reserved names: `href`, `createdAt`, `modifiedAt`, `meta`, `spMeta`, `spmeta`, `ionmeta`, or `ionMeta`.

{% docs note %}
While the `meta`, `spMeta`, `spmeta`, `ionmeta`, or `ionMeta` fields are not returned in the response today, they might be used in the future.  As is the case with all JSON use cases, ensure your REST client will not break if it encounters one of these (or other fields it does not recognize) at some time in the future.
{% enddocs %}

For Custom Data, you can:

* [Create Custom Data](#create-custom-data)
* [Retrieve Custom Data](#retrieve-custom-data)
* [Update Custom Data](#update-custom-data)
* [Delete All Custom Data](#update-custom-data)
* [Delete a single Custom Data field](#delete-custom-data-field)

<a class="anchor" name="create-custom-data"></a>
### Create Custom Data

Whenever you create an account or a group, an empty `customData` resource is created for that account or group automatically - you do not need to explicitly execute a request to create it.

However, it is often useful to populate custom data at the same time you create an account or group.  You can do this by embedding the `customData` directly in the account or group resource. For example:

**Example Create Account with Custom Data**

    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
         -H "Accept: application/json" \
         -H "Content-Type: application/json" \
         -d '{
               "username" : "jlpicard",
               "email" : "capt@enterprise.com",
               "givenName" : "Jean-Luc",
               "middleName" : "",
               "surname" : "Picard",
               "password" : "uGhd%a8Kl!"
               "status" : "ENABLED",
               "customData": {
                 "rank": "Captain",
                 "birthDate": "2305-07-13",
                 "birthPlace": "La Barre, France",
                 "favoriteDrink": "Earl Grey tea"
               }
             }' \
     "https://api.stormpath.com/v1/directories/exampleDirectoryId/accounts"

**Example Create Group with Custom Data**

     curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
          -H "Accept: application/json" \
          -H "Content-Type: application/json" \
          -d '{
                "name" : "Starfleet Officers",
                "customData": {
                  "headquarters": "San Francisco, CA"
                }
              }' \
      "https://api.stormpath.com/v1/directories/exampleDirectoryId/groups"

<a class="anchor" name="retrieve-custom-data"></a>
### Retrieve Custom Data

A common way to retrieve an account or group's custom data is to use [link expansion](#links-expansion) and retrieve the custom data at the same time as when you retrieve an account or group.

**Example: Retrieve an Account with its Custom Data**

    curl --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET https://api.stormpath.com/v1/accounts/exampleAccountId?expand=customData

**Example: Retrieve a Group with its Custom Data**

    curl --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET https://api.stormpath.com/v1/groups/exampleGroupId?expand=customData

You can also of course return an account or group's custom data resource by executing a `GET` request directly to the account-specific or group-specific Custom Data Resource URI.

**Example Retrieve Account Custom Data Request**

    curl --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET https://api.stormpath.com/v1/accounts/exampleAccountId/customData

**Example Retrieve Group Custom Data Request**

    curl --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET https://api.stormpath.com/v1/groups/exampleGroupId/customData

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;
    
    {
      "href": "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/customData",
      "createdAt": "2014-07-16T13:48:22.378Z",
      "modifiedAt": "2014-07-16T13:48:22.378Z",
      "birthDate": "1985-07-15",
      "favoriteColor": "blue",
    }

<a class="anchor" name="update-custom-data"></a>
### Update Custom Data

You may update an account or group's custom data, in one of two ways:

* by [updating the customData resource directly](#update-custom-data-directly), independent of the group or account, or
* by [embedding customData changes in an account or group update request](#update-custom-data-embedded)

<a class="anchor" name="update-custom-data-directly"></a>
#### Update Custom Data Directly

The first way to update an account or group's custom data is by `POST`ing changes directly to the custom data's `href`.  This allows you to interact with the customData resource directly, without having to do so 'through' an account or group request.

In the following example request, we're interacting with a `customData` resource directly, and we're changing the value of an existing field named `favoriteColor` and we're adding a brand new field named `hobby`:

**Example Account Custom Data Update**

    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
         -H "Accept: application/json" \
         -H "Content-Type: application/json;charset=UTF-8" \
         -d '{
               "favoriteColor": "red",
               "hobby": "Kendo"
             }' \
      "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02bAb/customData"

The response will contain the resource with the latest values:

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;
    
    {
      "href": "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/customData",
      "createdAt": "2014-07-16T13:48:22.378Z",
      "modifiedAt": "2014-07-16T13:48:22.378Z",
      "birthDate": "1985-07-15",
      "favoriteColor": "red",
      "hobby": "Kendo"
    }

As you can see, the response contains the 'merged' representation of what was already on the server plus what was sent in the request, and at no point did we need to interact with the account directly.

<a class="anchor" name="update-custom-data-embedded"></a>
#### Update Custom Data as part of an Account or Group Request

Sometimes it is helpful to update an account or group's `customData` as part of an update request for the account or group.  In this case, just submit customData changes in an embedded `customData` field embedded in the account or group request resource.  For example:

    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
         -H "Accept: application/json" \
         -H "Content-Type: application/json" \
         -d '{
               "status" : "ENABLED",
               "customData": {
                   "favoriteColor": "blue",
                   "hobby": "Kendo"
               }
             }' \
        "https://api.stormpath.com/v1/accounts/exampleAccountId"

In the above example, we're performing 3 modifications in one request:

1. We're modifying the account's `status` attribute and setting it to `ENABLED`.  We're _also_
2. Changing the existing customData `favoriteColor` field value to `blue` (it was previously `red`) and
3. Adding a new customData `hobby` field with a value of `Kendo`.

This request modifies both the account resource _and_ that account's custom data in a single request.

The same simultaneous update behavior may be performed for Group updates as well.

<a class="anchor" name="delete-custom-data"></a>
### Delete Custom Data

You may delete all of an account or group's custom data by sending a `DELETE` request to the account or group's customData `href`:

**Example: Delete all of an Account's Custom Data**

    curl --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET https://api.stormpath.com/v1/accounts/exampleAccountId/customData

**Example: Delete all of a Group's Custom Data**

    curl --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET https://api.stormpath.com/v1/groups/exampleGroupId/customData

**Example Response**

    HTTP/1.1 204 No Content

This will delete all of the respective account or group's custom data fields, but it leaves the `customData` placeholder in the account or group resource.  You cannot delete the `customData` resource entirely - it will be automatically permanently deleted when the account or group is deleted.

<a class="anchor" name="delete-account-custom-data-field"></a>
### Delete Custom Data Field

You may also delete an individual custom data field entirely.  

To understand field deletion, we should have a quick reminder about JSON `null` values.  `null` is a valid value for JSON fields and may be specified.  For example:

    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
         -H "Accept: application/json" \
         -H "Content-Type: application/json;charset=UTF-8" \
         -d '{
               "favoriteColor": null
             }' \
      "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02bAb/customData"


This request is valid and indicates that the `favoriteColor` field still exists on the customData resource, and it is a meaningful field, it just does not currently have a value (maybe it will be populated later).

Because `null` is an important and often useful value for JSON data, then, we can't delete a field (remove it entirely from the customData resource) by simply setting it to `null`.

Therefore, to delete a customData field, we must send an explicit `DELETE` request to an href representing the exact field to delete, using the following resource URI:

**Account Custom Data Field Resource URI**

    https://api.stormpath.com/v1/accounts/:accountId/customData/:fieldName

**Group Custom Data Field Resource URI**

    https://api.stormpath.com/v1/groups/:groupId/customData/:fieldName

These URIs only supports `DELETE` requests.

**Example Request**

    DELETE https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02bAb/customData/favoriteColor

**Example Response**

    HTTP/1.1 204 No Content

This request would remove the `favoriteColor` field entirely from the customData resource.  The next time the resource is [retrieved](#retrieve-custom-data), the field will be missing entirely.

***

<a class="anchor" name="administration"></a>
## Administering Stormpath

For more information about administering Stormpath using the Admin Console, please refer to the [Admin Console Product Guide](http://stormpath.com/docs/console/product-guide).

***

<a class="anchor" name="glossary"></a>
## Glossary of Terms

Attribute | Description
:----- | :----- |
<a id="account"></a>Account | An **account** is a unique identity within a directory. Stormpath does not use the term *user* because it implies a person, while accounts can represent a person, 3rd-party software, or non-human clients. Accounts can be used to log in to applications.
<a id="agent"></a>Agent | An **agent** populates LDAP directories. An agent status reflects communication/error state because the agent is communicating with Stormpath.
<a id="apikey"></a>API Key | An **API key** is a unique ID paired with a secret value. API keys are used by software applications to communicate with Stormpath through the Stormpath REST API.
<a id="application"></a>Application | An **application** is a software application that communicates with Stormpath. It is typically a real world application that you are building, such as a web application, but it can also be infrastructural software, such as a Unix or Web server.
<a id="authentication"></a>Authentication | **Authentication** is the act of proving someone (or something) is actually who they say they are. When an account is authenticated, there is a high degree of certainty that the account identity is legitimate.
<a id="authorization"></a>Authorization | **Authorization**, also known as Access Control, is the process of managing and enforcing access to protected resources, functionality, or behavior.
<a id="directory"></a>Directory | A **directory** is a collection of accounts and groups. Administrators can use different directories to create silos of accounts. For example, customers and employees can be stored in different directories.
<a id="directory-agent"></a>Directory Agent | A **directory agent** is a Stormpath software application installed on your corporate network to securely synchronize an on-premise directory, such as LDAP or Active Directory, into a Stormpath cloud directory.
<a id="directory-mirroring"></a>Directory Mirroring | **Directory mirroring** securely replicates selected data from one (source) directory to another (target or mirrored) directory for authentication and access control. The source directory is the authoritative source for all data. Changes are propagated to the target/mirror directory for convenience and performance benefits.
<a id="group"></a>Group | A **group** is a collection of accounts within a directory. In Stormpath, for anyone familiar with Role-Based Access Control, the term group is used instead of role.
<a id="group-membership"></a>Group Membership | A **group membership** is a two-way mapping between an account and a group.
<a id="account-store"></a>Account Store | A **account store** is a directory or group associated with an application for account authentication. Accounts within account stores associated with an application can login to that application.
<a id="AccountStoreMapping"></a>Account Store Mapping | An **account store mapping** is a mapping between a group or directory and an application.
<a id="identity-management"></a>Identity Management | **Identity management** is the management, authentication, authorization, and permissions of identities to increase security and productivity, while decreasing cost, downtime, and repetitive tasks.
<a id="role"></a>Role |A **role** is a classification of accounts, such as administrators or employees. In Stormpath, roles are represented as groups.
<a id="rbac"></a>Role-Based Access Control | **Role-Based Access Control** (RBAC) is the act of controlling access to protected resources or behavior based on the groups assigned to a particular account. RBAC is done using Stormpath groups.
<a id="rest-api-def"></a>REST API | **REST API** is a software architectural style enabling data transfer and functionality using common web-based communication protocols. Stormpath provides a REST API for tenants so they can easily integrate Stormpath with their software applications.
<a id="tenant"></a>Tenant | A **tenant** is a private partition within Stormpath containing all data and settings—specifically your applications, directories, groups and accounts. When you sign up for Stormpath, a tenant is created for you. You can add other user accounts (for example, for your co-workers) to your tenant to help you manage your data. For convenience, many companies like to have one tenant where they can easily manage all application, directory, and account information across their organization.*

{% docs note %}
*You must know your tenant when logging in to the Admin Console website. There is a "Forgot Tenant" link on the login page if you do not know what your tenant is.
{% enddocs %}
