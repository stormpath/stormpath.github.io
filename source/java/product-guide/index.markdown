---
layout: doc
lang: java
title: Stormpath Java Product Guide
---

Stormpath is a User Management API that reduces development time with instant-on, scalable user infrastructure. Stormpath’s intuitive API and expert support make it easy for developers to authenticate, manage and secure users and roles in any application.

To get started with the basics of Stormpath quickly, check out the [Java Quickstart Guide](/java/quickstart). For a more complete understanding and reference of the full Stormpath service, read on.

***

## What is Stormpath?

Stormpath is the first easy, secure user management and authentication service for developers.

Fast and intuitive to use, Stormpath enables plug-and-play security and accelerates application development on any platform.

Built for developers, it offers an easy API, open source SDKs, and an active community. The flexible cloud service can manage millions of users with a scalable pricing model that is ideal for projects of any size.

By offloading user management and authentication to Stormpath, developers can bring new applications to market faster, reduce development and operations costs, and protect their users with best-in-class security.

### Overview

<img src="/images/docs/Architecture.png" alt="High-level Architecture" title="High-level Architecture" width="700" height="430">

Stormpath is a REST API service.  You use a REST client (or one of our open-source language-specific SDKs) inside your application to communicate with the Stormpath API. Stormpath's API allows you to offload user management and authentication by helping you do the following:

* Account registration, complete with sending welcome emails
* Account email verification (send email -> user clicks a link -> their account is verified and they can login)
* Secure password storage with continuously updated cryptography best practices
* Password reset (send email -> user clicks a link -> sets new password -> account password encrypted and stored securely)
* Account login (authentication)
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
* Account Stores

These resources and their relationships are manageable by the REST API as described in this document, but you may also manage them via the [Stormpath Admin Console](https://api.stormpath.com) user interface.

**Applications**

An [Application](#applications) is a real-world software application that communicates with Stormpath to offload user management, authentication, and security workflows.  Each application that communicates with Stormpath is represented within Stormpath so you may manage its security needs.

You can assign one or more *Account Stores* to an Application.  Accounts within assigned account stores may login to the application.

**Account Stores**

An *Account Store* is a generic term for either a `Directory` or a `Group`. Directories and Groups are both considered 'account stores' because they both contain, or 'store', Accounts. 

* **Directories**

  A [Directory](#directories) is a top-level storage container of Accounts and Groups. A Directory also manages security policies (like password strength) for the Accounts it contains. Stormpath supports two types of Directories: natively hosted 'Cloud' directories that originate in Stormpath and 'Mirror' directories that act as secure mirrors or replicas of existing directories outside of Stormpath, for example LDAP or Active Directory servers.

  Directories can be used to cleanly manage segmented account populations - for example, you might use one Directory for company employees and another Directory for customers, each with its own security policies.

* **Groups**

  A [Group](#groups) is a uniquely named collection of Accounts within a Directory. Each Group within a Directory must have a unique name and may contain Accounts within their own Directory. Groups are mostly used for security and access control, often called Role-Based Access Control.

  For example, you might only show a particular user interface button if an Account is in the 'Administrators' Group. It might be helpful to note that Stormpath does not have an explicit Role concept - you use Stormpath Groups as Roles for Role-Based Access Control.

**Accounts**

An [Account](#accounts) is a unique identity within a Directory, with a unique username and/or email address. An account can log in to applications using either the email address or username associated with it. Accounts can represent end-users, but they can also be used to represent services, platforms, or any "entity" that needs to connect to a Stormpath-powered service.

**Tenants**

Stormpath is a [multi-tenant](http://en.wikipedia.org/wiki/Multitenancy) software service. When you [sign up for Stormpath](https://api.stormpath.com/register), a private data 'space', called a `Tenant`, is created for you.  This private [tenant space](#tenants) contains all of the data you own, including your applications, directories, accounts and groups and more.  The `Tenant` concept is mostly 'behind the scenes' and you don't need to use it all that often, but sometimes it is necessary or useful to use directly.

***

<a class="anchor" name="rest-api"></a>
### REST API

The Stormpath API offers authorized developers and administrators programmatic access to:

* Securely authenticate accounts.
* Create and manage accounts and adjust group membership.
* Manage directories.
* Manage groups.
* Initiate and process account automations.

For more detailed documentation on the Stormpath API, visit the [REST API Product Guide](/rest/product-guide/).

<a class="anchor" name="java-sdk"></a>
### Java SDK

The Stormpath Java SDK allows any JVM-based application to easily use the Stormpath user management service for all authentication and access control needs. The Java SDK can be found on [Github](https://github.com/stormpath/stormpath-sdk-java).

When you make SDK method calls, the calls are translated into HTTPS requests to the Stormpath REST+JSON API. The Stormpath Java SDK therefore provides a clean object-oriented paradigm natural to JVM developers and alleviates the need to know how to make REST+JSON requests. 

Any JVM-based programming language can use the Stormpath Java SDK. JVM languages include Java, Groovy, Scala, Clojure, Kotlin, Jython, and JRuby.

Stormpath also offers guides and SDKs for [Ruby](/ruby/product-guide), [PHP](/php/product-guide), and [Python](/python/product-guide).

If you are using a language that does not yet have an SDK, you can use the REST API directly and refer to the [REST API Product Guide](/rest/product-guide/).

***

<a class="anchor" name="sdk-concepts"></a>
## SDK Concepts

Throughout this guide, code examples appear using the Stormpath Java SDK.

Although knowing how the SDK is designed and how it works is not required to use it, knowing some of the design details will help you use it more efficiently and effectively.

### Client

The root entry point for SDK functionality is the `Client` instance. Using the client instance, you can access all tenant data, such as applications, directories, groups, and accounts.

The client can also have static properties configured if the user prefers to use the convenient static calls instead of instance calls.

<a class="anchor" name="preferred-config"></a>
#### Preferred Configuration

There are different ways to create a client instance to interact with your resources. The preferred mechanism is by reading a secure `apiKey.properties` file, where a `ClientBuilder` instance receives the ApiKey built using the `ApiKeyBuilder`:

	import com.stormpath.sdk.client.*;
	...

	String path = System.getProperty("user.home") + "/.stormpath/apiKey.properties";
	ApiKey apiKey = ApiKeys.builder().setFileLocation(path).build();
	Client client = Clients.builder().setApiKey(apiKey).build();

This is heavily recommended if you have access to the file system.

<a class="anchor" name="custom-api-key-names"></a>
#### Custom Api Key Id and Secret names

You can even identify the names of the properties to use as the API key id and secret. For example, suppose your properties were:

    String foo = "APIKEYID";
    String bar = "APIKEYSECRET";

You could configure the Client by creating a client instance using the following `ApiKeyBuilder` and `ClientBuilder` instances:

	ApiKey apiKey = ApiKeys.builder()
			.setFileLocation(apiKeyFileLocation)
            .setIdPropertyName(foo)
            .setSecretPropertyName(bar)
            .build();
    
    Client client = Clients.builder()
    		.setApiKey(apiKey)
            .build();               

<a class="anchor" name="api-key-properties-string"></a>
#### API Key Properties

The client can be configured by setting a `Properties` instance using `ClientBuilder` and an `ApiKeyBuilder` instance:

    Properties properties = new Properties();
    properties.setProperty("apiKey.id", "APIKEYID");
    properties.setProperty("apiKey.secret", "APIKEYSECRET");

	ApiKey apiKey = ApiKeys.builder().setProperties(properties).build();
    Client client = Clients.builder().setApiKey(apiKey).build();

Working with different property names (explained in the previous config instructions) also work with this scenario.

<a class="anchor" name="api-key-configuration"></a>
#### API Key Configuration

Another way to create a client is by creating the `ApiKey` instance with the API credentials and passing this instance to create the client instance:

	ApiKey apiKey = ApiKeys.builder().setId("apiKeyId").setSecret("apiKeySecret").build();
	Client client = Clients.builder().setApiKey(apiKey).build();

{% docs warning %}
DO NOT specify your actual `apiKey.id` and `apiKey.secret` values in source code! They are secure values associated with a specific person. You should never expose these values to other people, not even other co-workers.
{% enddocs %}

Only use this technique if the values are obtained at runtime using a configuration mechanism that is not hard-coded into source code or easily-visible configuration files.

{% docs note %}

Security Notice: Any account that can access the Stormpath application within the Stormpath Admin Console has full administrative access to your Stormpath data and settings, including access to the REST API if they have an API Key.

Assign user accounts to Stormpath, through [account stores](#account-store-mappings), wisely.
{% enddocs %}

<a class="anchor" name="authentication-scheme-configuration"></a>
#### Authentication Scheme Configuration

You can choose one of two authentication schemes to authenticate with Stormpath: 

1. **Stormpath SAuthc1 Authentication**:  This is the recommended approach, and the default setting.  This approach computes a cryptographic digest of the request and sends the digest value along with the request. If the transmitted digest matches what the Stormpath API server computes for the same request, the request is authenticated. The Stormpath SAuthc1 digest-based authentication scheme is more secure than standard HTTP digest authentication.
2. **Basic Authentication**: This is _only_ recommended when your application runs in an environment outside of your control, and that environment manipulates your application's request headers when requests are made.  Google App Engine is one known such environment.  However, Basic Authentication is not as secure as Stormpath's `SAuthc` algorithm, so only use this if you are forced to do so by your application runtime environement.

When no authentication scheme is explicitly configured, `Sauthc1` is used by default.

If you must change to basic authentication for these special environments, set the `authenticationScheme` property:

    String path = System.getProperty("user.home") + "/.stormpath/apiKey.properties";
    Client client = Clients.builder()
    	.setApiKey(ApiKeys.builder()
	    	.setFileLocation(path)
    	    .build()
    	)
        .setAuthenticationScheme(AuthenticationScheme.BASIC) //Basic Authentication
        .build();

<a class="anchor" name="high-level-overview"></a>
### High-level Overview

The Stormpath SDK and the associated components reside and execute within your application at runtime. When making method calls on the SDK objects - particularly objects that represent REST data resources such as applications and accounts - the method call automatically triggers an HTTPS request to the Stormpath API server if necessary.

The HTTPS request allows you to program your application code to use regular Java objects and alleviates you from worrying about the lower-level HTTP REST+JSON details and individual REST resource HTTP endpoints.

Here is how the communication works:<br />

![](/images/docs/SDKCommunicationFlow.png =700x "SDK Communication Flow")

In this example scenario, we have an existing SDK `account` resource instance, and we want its `directory`.

The request is broken down as follows:

1. The application attempts to acquire the account directory instance.
2. If the directory resource is not already in memory, the SDK creates a request to send to the Stormpath API server.
3. An HTTPS GET request is executed.
4. The Stormpath API server authenticates the request caller and looks up the directory resource.
5. The Stormpath API server responds with the JSON representation of the directory resource.
6. The Stormpath SDK transforms the JSON response into a directory object instance.
7. The directory instance is returned to the application.

<a class="anchor" name="detailed-design"></a>
### Detailed Design

The Stormpath SDK is designed with two primary design principles:

* **Composition**<br>
Although most SDK end users never need to customize the implementation behavior of an SDK, the SDK is pluggable meaning that the functionality can be customized by plugging in new implementations of relevant components. The SDK leans toward the [programming to interfaces](http://en.wikipedia.org/wiki/Software_interface#Software_interfaces) and principles of [object composition](http://en.wikipedia.org/wiki/Object_composition) to support pluggability. Even if SDK end users never leverage this design, the design helps the Stormpath development team provide support and bug fixes without disrupting existing SDK usages.

* **Proxying**<br>
Java instances representing REST resources use the [Proxy software design pattern](http://en.wikipedia.org/wiki/Proxy_pattern) to intercept property access allowing the SDK implementation to automatically load the resource data or other referenced resources if necessary.

<a class="anchor" name="architectural-components"></a>
#### Architectural Components

The core component concepts of the SDK are as follows:<br />

![](/images/docs/ComponentArchitecture.png =700x430 "Stormpath SDK Component Architecture")

* **Client** is the root entry point for SDK functionality and accessing other SDK components, such as the `DataStore`. A client is constructed with a Stormpath API key which is required to communicate with the Stormpath API server. After it is constructed, the client delegates to an internal DataStore to do most of its work.
* **DataStore** is central to the Stormpath SDK. It is responsible for managing all Java `resource` objects that represent Stormpath REST data resources such as applications, directories, and accounts. The DataStore is also responsible for translating calls made on Java `resource` objects into REST requests to the Stormpath API server as necessary. It works between your application and the Stormpath API server.
	* **RequestExecutor** is an internal infrastructure component used by the `DataStore` to execute HTTP requests (`GET`, `PUT`, `POST`, `DELETE`) as necessary. When the DataStore needs to send a Java `Resource` instance state to or query the server for resources, it delegates to the RequestExecutor to perform the actual HTTP requests. The Stormpath SDK default `RequestExecutor` implementation is `HttpClientRequestExecutor` which uses [Apache HTTPComponents](http://hc.apache.org/) to execute the raw requests and read the raw responses.
	* **MapMarshaller** is an internal infrastructure component used by the `DataStore` to convert JSON strings into Java `Object` instances or the reverse. The map instances are used by the `ResourceFactory` to construct standard Java objects representing REST resources. The Stormpath SDK default `MapMarshaller` uses [Jackson](https://github.com/FasterXML/jackson).
	* **ResourceFactory** is an internal infrastructure component used by the `DataStore` to convert REST resource map data into standard Java `resource` objects. The ResourceFactory uses Objects from `MapMarshaller` to construct the Java resource instances.
	* **Resources** are standard Java objects that have a 1-to-1 correlation with REST data resources in the Stormpath API server such as applications and directories. Applications directly use these `resource` objects for security needs, such as authenticating user accounts, creating groups and accounts, finding application accounts, assigning accounts to groups, and resetting passwords.

<a class="anchor" name="resources-proxying"></a>
### Resources and Proxying

When applications interact with a Stormpath SDK `resource` instance, they are really interacting with an intelligent data-aware proxy, not a simple object with some properties. Specifically, the `resource` instance is a proxy to the SDK client `DataStore` allowing resource instances to load data that might not yet be available.

For example, using the SDK Communication Flow diagram in the [high-level overview](#high-level-overview) section, assuming you have a reference to an `account` object - perhaps you have queried for it or you already have the account `href` and you want to load the `account` resource from the server:

Using the static Client configuration:

    String href = "https://api.stormpath.com/v1/accounts/ACCOUNT_UID_HERE";
    Account account = client.getDataStore().getResource(href, Account.class);

This retrieves the account at the specified `href` location using an HTTP `GET` request.

If you also want information about the `directory` owning that account, every account has a reference to the parent directory location in the JSON representation. For example:

	{
	  "givenName": "John",
	  "surname": "Smith",
	  ...
	  "directory": {
	      "href": "https://api.stormpath.com/v1/directories/DIR_UID_HERE"
	  }
	  ...
	}

Notice the JSON `directory` property is only a link (pointer) to the directory; it does not contain any of the directory properties. The JSON shows we should be able to reference the `directory` property, and then reference the `href` property, and do another lookup (pseudo code):

Using the static Client configuration:

    String href = "https://api.stormpath.com/v1/directories/DIR_UID_HERE";
    Directory directory = client.getDataStore().getResource(href, Directory.class);

This technique is cumbersome, verbose, and requires a lot of boilerplate code in your project. As such, SDK resources **automatically** execute the lookups for unloaded references for you using simple property navigation!

The previous lookup becomes:

	Directory directory = account.getDirectory();

If the directory already exists in memory because the `DataStore` has previously loaded it, the directory is immediately returned. However, if the directory is not present, the directory `href` is used to return the directory properties (the immediate data loaded) automatically for you. This technique is known as *lazy loading* which allows you to traverse entire object graphs automatically without requiring constant knowledge of `href` URLs.

<a class="anchor" name="error-handling"></a>
### Error Handling

Errors thrown from the server are translated to a [ResourceException](https://github.com/stormpath/stormpath-sdk-java/blob/master/api/src/main/java/com/stormpath/sdk/resource/ResourceException.java). This applies to all requests to the Stormpath API endpoints.

For example, when getting the current tenant from the client you can catch any error that the request might produce as following:

	try {
    	client.getCurrentTenant();
    } catch (ResourceException ex) {
        System.out.println(ex.getMessage());
    }

#### Error Code Reference

The [Stormpath Error Code Reference](http://docs.stormpath.com/errors) provides the list of all Stormpath-specific error codes and their meanings.

***

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
<a id="collections-page"></a>`currentPage` | An object containing the current page with an array of resources. The size of this array or resources can be less than the requested `limit`. For example, if the limit requested is greater than the maximum allowed or if the response represents the final page in the total collection and the item count of the final page is less than the `limit`. This is a [pagination](#pagination)-specific attribute. | Object

**Request**

To acquire a Collection Resource, use the getter of the containing parent resource, which is always in plural for collection resources.

For example, getting the tenant's children collection resources:

    DirectoryList directories = tenant.getDirectories();
    ApplicationList applications = tenant.getApplications();

<a class="anchor" name="pagination"></a>
### Pagination


If a Collection Resource represents a large enough number of resource instances, it will not include them all in a single response. Instead a technique known as _pagination_ is automatically used by the SDK to return all resources when iterating over them.

<a class="anchor" name="pagination-query-parameters"></a>
#### Pagination Options

There are two pagination options that may be specified to control pagination:

- [offset](#collections-offset): The zero-based starting index in the entire collection of the first item to return. Default is <code>0</code>.
- [limit](#collections-limit): The maximum number of collection items to return for a single request. Minimum value is <code>1</code>. Maximum value is <code>100</code>. Default is <code>25</code>.

**Example Collection Resource Request**

An example request for a Collection Resource using pagination:

Using [fluent DSL](http://en.wikipedia.org/wiki/Fluent_interface) queries that return the collection resource:

	ApplicationList applications = tenant.getApplications(Applications.criteria().offsetBy(100).limitTo(40));

    for(Application app : applications) {
    	System.out.println(app.getName());
    }

Alternatively, there is a map in all collection resource getters that you can use to specify the pagination:

	Map<String, Object> queryParams = new HashMap<String, Object>();
    queryParams.put("offset", 10);
    queryParams.put("limit", 40);
    ApplicationList applications = tenant.getApplications(queryParams);
    for(Application app : applications) {
    	System.out.println(app.getName());
    }

This example requests a tenant's `applications` Collection Resource from the server with page results starting at index 10 (the 11th element), with a maximum of 40 total elements.

<a class="anchor" name="sorting"></a>
### Sorting

A request for a Collection Resource can contain optional `orderBy` query parameters. Each Collection Resource has fixed `orderBy` methods in its Fluent DSL operations.

For example, a sorted request for a tenant's `applications` Collection Resource looks like this:

	ApplicationList applications = tenant.getApplications(Applications.criteria().orderByName().ascending().orderByStatus().descending());
	for(Application app : applications) {
    	System.out.println(app.getName());
    }

By default, all `orderBy` clauses are ascending, therefore the `ascending()` operation is not required to be invoked.

Alternatively, you can use the collection getter options to specify the order:

    Order order = Order.asc("surname");
    Map<String, Object> queryParams = new HashMap<String, Object>();
    queryParams.put("orderBy", order);
    AccountList accounts = application.getAccounts(queryParams);

Now you can loop though the collection resource and get the results according to the specified order:

	for(Account account: accounts) {
    	System.out.println(account.getGivenName() + " " + account.getSurname());
    }

<a class="anchor" name="search"></a>
### Search

You can search for specific resources within a Collection Resource by using certain query parameters to specify your search criteria.

There is currently one type of searche that might be performed: a targeted [Attribute](#search-attribute)-based search. It supports result [ordering](#sorting), [pagination](#pagination), and [link expansion](#links-expansion).

{% docs info %}
Currently, a search request must be targeted at resources of the same type. For example, a search can be performed across accounts or groups, but not both at the same time. Because the Stormpath REST API always represents one or more resources of the same type as a Collection Resource, a search is always sent to a Collection Resource endpoint.
{% enddocs %}

<a class="anchor" name="search-attribute"></a>
#### Attribute Search

Attribute-based search is the ability to find resources based on full and partial matching of specific individual resource attributes:

    Map<String, Object> queryParams = new HashMap<String, Object>();
    queryParams.put("anAttribute", "someValue");
    queryParams.put("anotherAttribute", "anotherValue");

For example, to search an application's accounts for an account with a `givenName` of `Joe` (type-unsafe query):

	Map<String, Object> queryParams = new HashMap<String, Object>();
    queryParams.put("givenName", "Joe");
    AccountList accounts = application.getAccounts(queryParams);

Or, for type-safe queries:

    AccountCriteria criteria = Accounts.where(Accounts.givenName().eqIgnoreCase("Joe"));
    AccountList accounts = application.getAccounts(criteria);

Now you can loop through the collection resource and get the results according to the specified search:

    for(Account account: accounts) {
    	System.out.println(account.getGivenName() + " " + account.getSurname());
    }

**Matching Logic**

Attribute-based queries use standard URI query parameters and function as follows:

- Each query parameter name is the same name of a searchable attribute on an instance in the [Collection Resource](#collections).
- A query parameter value triggers one of four types of matching criteria:
    - No asterisk at the beginning or end of the value indicates a direct case-insensitive match.
    - An asterisk only at the beginning of the value indicates that the case-insensitive value is at the end.
    - An asterisk only at the end of the value indicates that the case-insensitive value is at the beginning.
    - An asterisk at the end AND at the beginning of the value indicates the value is contained in the string.

For example, consider the following search:

	Map<String, Object> queryParams = new HashMap<String, Object>();
    queryParams.put("givenName", "Joe");
    queryParams.put("middleName", "*aul");
    queryParams.put("surname", "*mit*");
    queryParams.put("email", "joePaul*");
    queryParams.put("status", "disabled");
    AccountList accounts = application.getAccounts(queryParams);

Or using the `Criteria` object methods, where you don't need to specify the asterisks:

	AccountCriteria criteria1 = Accounts
                .where(Accounts.givenName().eqIgnoreCase("Joe"))
                .and(Accounts.middleName().endsWithIgnoreCase("aul"))
                .and(Accounts.surname().containsIgnoreCase("mit"))
                .and(Accounts.email().startsWithIgnoreCase("joePaul"))
                .and(Accounts.status().eq(AccountStatus.DISABLED));
    AccountList accounts = application.getAccounts(criteria);

Now you can loop through the collection resource and get the results according to the specified search:

    for(Account account: accounts) {
    	System.out.println(account.getGivenName() + " " + account.getSurname());
    }

This returns all accounts where:

- Each account has access to the application.
- The account `givenName` is equal to 'Joe' (case insensitive) AND
- The account `middleName` ends with 'aul' (case insensitive) AND
- The account `surname` equals or contains 'mit' (case insensitive) AND
- The account `email` starts with 'joePaul' (case insensitive) AND
- The account `status` equals 'disabled' (case insensitive).

{% docs note %}
For resources with a `status` attribute, string values can also be used; however, they **must be the exact value**. For example, `enabled` or `disabled` can be passed but fragments such as `ena`, `dis`, `bled` are not acceptable.
{% enddocs %}

<a class="anchor" name="links-expansion"></a>
### Link Expansion

When requesting a resource you might want the Stormpath API server to return not only that resource, but also one or more of its linked resources. Link expansion allows you to retrieve related resources in a single request to the server instead of having to issue multiple separate requests.

#### Expand Query Parameter

For example, to retrieve an account and its parent directory, instead of issuing two requests (one for the account and another for its directory) add an `expand` query parameter with a value of `directory` to the resource URI.

To better illustrate this, we will use an example using a raw REST API call and then we will explain how to get the same result using the Java SDK.

Request:

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

#### Expansion Depth Limit

It is currently only possible to expand a resource's immediate links. It is not currently possible to expand links of links.

For example, it would not be possible to return an account with its directory expanded and also the directory's groups expanded as well. Link expansion is currently only possible one level 'deep'.

If you have a critical need of multi-depth expansion, please contact us at <support@stormpath.com> and submit a feature request.

#### Expanding Collection Resources

In the Java SDK you can only expand properties of Collection Resources when you are directly requesting them. For example, to expand the directory of all the groups of an account:

	GroupList groups = account.getGroups(Groups.criteria().withDirectory());

Now you can loop through the collection resource and get the results according to the specified expansion:

    for(Group group: groups) {
    	System.out.println(group.getDirectory().getName());
    }

After this request, when you call the `directory` property of each `group` instance of the `groups` collection resource, the SDK won't have to call the server because the `directory` would have already been loaded.

#### Paginated Expansion

You can additionally provide pagination parameters to control the paged output of the expanded collection.

For example, to expand the `accountMemberships` (starting at the first one - index 0) and limiting to 10 results total:

	GroupList groups = account.getGroups(Groups.criteria().withAccountMemberships(0, 10));

#### Expanding Multiple Links

You can specify more than one link attribute by specifying a list of attribute names to expand.

For example, to retrieve the groups of an account with `directory` and `tenant` expanded, execute the following request:

    GroupList groups = account.getGroups(Groups.criteria().withDirectory().withTenant());

After this request, when you call the `directory` or the `tenant` property of each retrieved `group`, the SDK won't have to call the server because those properties would have already been loaded.


<a class="anchor" name="tenants"></a>
## Tenants

Stormpath is a [multi-tenant](http://en.wikipedia.org/wiki/Multitenancy) software service. When you [sign up for Stormpath](https://api.stormpath.com/register), a private data 'space' is created for you. This space is represented as a `Tenant` resource in the Stormpath REST API.

It might help to think of a `Tenant` as a Stormpath customer. As a Stormpath Tenant (customer), you own your `Tenant` resource and everything in it - `Applications`, `Directories`, `Accounts`, `Groups`, and so on.

In the Stormpath REST API specifically, your `Tenant` resource can be thought of as your global starting point.  You can access everything in your tenant space by accessing your tenant resource first and then interacting with its other linked resources (applications collection, directories collection, etc).

<a class="anchor" name="tenant-resource"></a>
### Tenant Resource

<a class="anchor" name="tenant-resource-class"></a>
#### Resource Class

    com.stormpath.sdk.tenant.Tenant

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
* [Access a tenant's applications](#tenant-applications)
* [Access a tenant's directories](#tenant-directories)

<!-- TODO: We do not want users to update their Tenant information yet: * [Update (HTTP `POST`) a tenant resource](#UpdateTenantResource) -->

"Create" and "Delete" Tenant operations are currently not supported via the REST API. If you require this functionality, please email <support@stormpath.com> and request it.

<a class="anchor" name="tenant-retrieve"></a>
### Retrieve A Tenant

You may only retrieve your own Tenant: every API Key that executes REST requests is associated with a Tenant, and the request caller may only retrieve the Tenant corresponding to the API Key used.

Because a REST caller can retrieve one and only one `Tenant` resource, it is often more convenient not to be concerned with the Tenant-specific URL is when performing a request, and instead use the Client tenant.

You can request the `current` Tenant resource, and the Java SDK will automatically load the current tenant, by following the `302` redirect to the `Tenant` resource corresponding to the currently executing API caller. In other words, this call redirects the API caller to their own Tenant's URI, and the Java SDK returns the concrete tenant information so the user doesn't have to worry about following the redirect.

**Example Request With A Client Instance**

    Tenant tenant = client.getCurrentTenant();

<a class="anchor" name="tenant-applications"></a>
### Tenant Applications

A `Tenant` has one or more [Applications](#applications) registered with Stormpath.  Each registered application may communicate with Stormpath to simplify and automate its user management and authentication needs.

**Tenant Applications Collection Resource**

    tenant.getApplications();

<a class="anchor" name="tenant-applications-list"></a>
#### List Tenant Applications

You can list your tenant's applications by requesting your tenant's `applications` Collection Resource.  The response is a [paginated](#pagination) list of tenant applications.

You may also use collection [pagination](#pagination) and [sort ordering](#sorting) query parameters to customize the paginated response.

**Example Request**

    ApplicationList applications = tenant.getApplications();

    for(Application application : applications) {
		System.out.println(application.getName());
    }

ApplicationList applications = tenant.getApplications(Applications.where(Applications.name().eqIgnoreCase("foo")));

        for(Application application : applications) {
            System.out.println(application.getName());
        }
        
<a class="anchor" name="tenant-applications-search"></a>
#### Search Tenant Applications

You may search for applications by requesting your tenant's `applications` Collection Resource using [search query parameters](#search). Any matching applications within your tenant will be returned as a [paginated](#pagination) list.

##### Searchable Application Attributes

The following application attributes are searchable via [attribute](#search-attribute) searches:

* `name`
* `description`
* `status`

In addition to the the [search query parameters](#search), you may also use [pagination](#pagination) and [sorting](#sorting) query parameters to customize the paginated response.  For example:

	ApplicationList applications = tenant.getApplications(
                Applications.where(Applications.name().eqIgnoreCase("foo"))
                        .offsetBy(0)
                        .limitTo(50)
                        .orderByName()
	);

	for(Application application : applications) {
    	System.out.println(application.getName());
    }

#### Working With Tenant Applications

Application resources supports the full suite of CRUD commands and other interactions.  Please see the [Applications section](#applications) for more information.

<a class="anchor" name="tenant-directories"></a>
### Tenant Directories

A `Tenant` has one or more [Directories](#directories) that contain accounts and groups.  Accounts may login to [applications](#applications) and groups can be used for access control within applications.

**Tenant Directories Collection Resource**

    tenant.getDirectories();

<a class="anchor" name="tenant-directories-list"></a>
#### List Tenant Directories

You can list your tenant's directories by requesting your tenant's `directories` Collection Resource.  The response is a [paginated](#pagination) list of your tenant's directories.

You may also use collection [pagination](#pagination) and [sort ordering](#sorting) query parameters to customize the paginated response.

**Example request**

	DirectoryList directories = tenant.getDirectories();

	for(Directory directory : directories) {
    	System.out.println(directory.getName());
    }

<a class="anchor" name="tenant-directories-search"></a>
#### Search Tenant Directories

You may search for directories by requesting your tenant's `directories` Collection Resource using [search query parameters](#search).  Any matching directories with your tenant will be returned as a [paginated](#pagination) list.

##### Searchable Directory Attributes

The following [directory attributes](#directory) are searchable via [attribute](#search-attribute) searches:

* `name`
* `description`
* `status`

In addition to the the [search query parameters](#search), you may also use [pagination](#pagination) and [sorting](#sorting) query parameters to customize the paginated response.  For example:

    DirectoryList directories = tenant.getDirectories(
                	Directories.where(Directories.name().eqIgnoreCase("foo"))
                        .offsetBy(0)
                        .limitTo(50)
                        .orderByName()
    );

    for(Directory directory : directories) {
    	System.out.println(directory.getName());
    }

#### Working With Tenant Directories

Directory resources support the full suite of CRUD commands and other interactions. Please see the [Directories section](#directories) for more information.

***        

<a class="anchor" name="applications"></a>
## Applications

An `Application` in Stormpath represents any real world piece of software that communicates with Stormpath to offload its user management and authentication needs.  The application can be anything that can make a REST API call - a web application that you are writing, a web server like Apache or Nginx, a Linux operating system, etc - basically anything that a user can login to.  A [tenant](#tenants) administrator can register one or more applications with Stormpath.

You control who may login to an application by assigning (or 'mapping') one or more `Directories` or `Groups` (generically called [account stores](#account-store-mappings)) to an application.  The `Accounts` in these associated directories or groups (again, _account stores_) collectively form the application's user base. These accounts are considered the application's users and they can login to the application.  Therefore, you can control user population that may login to an application by managing which [account stores](#account-store-mappings) are assigned to the application.

Even the Stormpath Admin Console and API is represented as an `Application` (named Stormpath), so you can control who has administrative access to your Stormpath [tenant](#tenants) by managing the Stormpath application's associated account stores.

<a class="anchor" name="application"></a>
### Application Resource

An individual `Application` resource may be accessed via its Resource URI:

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
<a class="anchor" name="application-defaultAccountStoreMapping"></a>`defaultAccountStoreMapping` | A link to the account store mapping that reflects the [default account store](#account-store-mapping-default-account-store) where the application will store newly created accounts.  (A request to the `createAccount` method will result in storing the new account in the default account store). A `null` value disables the application from directly creating new accounts. | link | `null` or link
<a class="anchor" name="application-defaultGroupStoreMapping"></a>`defaultGroupStoreMapping` | A link to the account store mapping that reflects the [default group store](#account-store-mapping-default-group-store) where the application will store newly created groups.  (A request to the `createGroup` method will result in storing the new group in the default group store). A `null` value disables the application from directly creating new groups. | link | `null` or link

For Applications, you can:

* [Search for an application](#application-search)
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

<a class="anchor" name="application-search"></a>
### Search for an Application

When communicating with the Stormpath REST API, you might need to search for an application.

For example, if you want to find an application named "My Application", you'll need to search the tenant for the "My Application" `application` resource:

**Example Request**

	ApplicationCriteria criteria = Applications.where(Applications.name().eqIgnoreCase("My Application"));
    tenant.getApplications(criteria);

Or, if you only know a part of the name, you can use:

	ApplicationCriteria criteria = Applications.where(Applications.name().containsIgnoreCase("My"));
	tenant.getApplications(criteria);


<a class="anchor" name="application-create"></a>
### Create an Application (aka Register an Application with Stormpath)

For an application to communicate with Stormpath, you must first register it first with Stormpath.

You register an application with Stormpath by simply creating a new `Application` resource.  This is performed by submitting creation request on the `Application` class or on the `Tenant` instance.  This will create a new `Application` instance within the caller's tenant.

When you submit creation request, at least the `name` attribute must be specified, and it must be unique compared to all other applications in your tenant.  The `description` and `status` attributes are optional.

**Required Attribute**

* [name](#application-name) - must be unique compared to all other applications in your tenant.

**Optional Attributes**

* [description](#application-description)
* [status](#application-status) - if unspecified, the default is `enabled`.

**Example Request Using the Tenant Instance**

	Application application = client.instantiate(Application.class);
    application.setName("My Application");
    application.setDescription("My Application Description");
    application.setStatus(ApplicationStatus.ENABLED);

    tenant.createApplication(application);

{% docs note %}
By default, no accounts may login to a newly created application, and the new application cannot create accounts or groups immediately.  Applications must first be associated with one or more [account stores](#account-store-mappings) to enable this behavior.

Account store association however is mostly used for more complex applications.  If you want to create an application quickly and enable this additional behavior immediately, use the `createDirectory` option as discussed next.
{% enddocs %}

<a class="anchor" name="application-create-with-directory"></a>
#### Create an Application and Directory

The above Create Application request assumes you will later assign [account stores](#account-store-mappings) to the application so accounts may log in to the application.  This means that, by default, no one can login to a newly created application, nor can the application create new accounts or new groups directly.  For this additional functionality, one or more account stores must be associated with the application.

For many use cases, that is unnecessary work.  If you want to associate the Application with a new Directory automatically so you can start creating accounts and groups for the application immediately (without having to map other [account stores](#account-store-mappings), you can use the `createDirectory` option.

{% docs note %}
Automatically creating a directory when creating an application *does not* make that `Directory` private or restrict usage to only that `Application`. The created directory is no different than any other directory. The `createDirectory` method exists as a convenience to reduce the number of steps you would have had to execute otherwise.

If you delete an application, you must manually delete any auto-created directory yourself.  There is no shortcut to delete an auto-created directory.  This is to ensure safety in case the directory might be used by other applications.
{% enddocs %}

##### createDirectory()

When sending the creation request, you can append the `createDirectory()` method:

	Application application = client.instantiate(Application.class);
    application.setName("My Application");
    application.setDescription("My Application Description");
    application.setStatus(ApplicationStatus.ENABLED);
    
    tenant.createApplication(
    		Applications.newCreateRequestFor(application)
            	.createDirectory()
            	.build()
    );

This request will:

1. Create the application.
2. Create a brand new Directory and automatically name the directory based on the application.  The generated name will reflect the new application's name as best as is possible, guaranteeing that it is unique compared to any of your existing directories.
3. Set the new Directory as the application's initial [account store](#account-store-mappings).
4. Enable the new Directory as the application's [default account store](#application-defaultAccountStoreMapping), ensuring any new accounts created directly by the application are stored in the new Directory.
5. Enable the new Directory as the application's [default group store](#application-defaultGroupStoreMapping), ensuring any new groups created directly by the application are stored in the new Directory.

This allows you to create accounts and groups directly via the application instance, without having to go through an account store mapping exercise.

##### createDirectoryNamed("a custom name")

If you want to automatically create a Directory for your application, and you also want to manually specify the new Directory's name, instead of using a `true` value as the query parameter value, you can specify a String name instead:

    Application application = client.instantiate(Application.class);
    application.setName("My Application");

    tenant.createApplication(
    	Applications.newCreateRequestFor(application)
        	.createDirectoryNamed("My App Directory")
        	.build()
    );

this request will:

1. Create the application.
2. Create a brand new Directory and automatically set the Directory's name to be your specified text value (e.g. 'My App Directory' in the example above). **HOWEVER**: If the directory name you choose is already in use by another of your existing directories, the request will fail.  You will either need to choose a different directory name or specify `true` and let Stormpath generate an unused unique name for you.
3. Set the new Directory as the application's initial [account store](#account-store-mappings).
4. Enable the new Directory as the application's [default account store](#application-defaultAccountStoreMapping), ensuring any new accounts created directly by the application are stored in the new Directory.
5. Enable the new Directory as the application's [default group store](#application-defaultGroupStoreMapping), ensuring any new groups created directly by the application are stored in the new Directory.

{% docs note %}
Automatically creating a directory when creating an application *does not* make that Directory private or restrict usage to only that application. The created directory is no different than any other directory. The `createDirectory` method exists as a convenience to reduce the number of steps you would have had to execute otherwise.

If you delete an application, you must manually delete any auto-created directory yourself.  There is no shortcut to delete an auto-created directory.  This is to ensure safety in case the directory might be used by other applications.
{% enddocs %}

<a class="anchor" name="application-retrieve"></a>
### Retrieve an Application

After you have created an application, you may retrieve its contents by requesting an application instance using its URL, returned in the `href` attribute.

If you don't have the application's URL, you can find it by [looking it up in the Stormpath Admin Console](/console/product-guide#!LocateAppURL) or by [searching your tenant's applications](#tenant-applications-search) for the application and then using its `href`.

**Example Request**

    Application application = client.getResource(applicationHref, Application.class);


<a class="anchor" name="application-update"></a>
### Update an Application

Set the properties to be updated on an `Application` instance that has an `href` and call the `save` method on it. Unspecified attributes are not changed, but at least one attribute must be specified.

**Updatable Application Attributes**

* [name](#application-name)
* [description](#application-description)
* [status](#application-status)

**Example Request**

	application.setDescription("A new description.");
    application.save();

<a class="anchor" name="application-enable"></a>
#### Enable an Application

Enabled applications allow associated accounts to login.  Disabled applications prevent logins.  When you create an application, it is `enabled` by default.

You can enable an application (and thereby allow associated accounts to login) by setting `status` to `ENABLED`.  For example:

**Example Request**

    application.setStatus(ApplicationStatus.ENABLED);
    application.save();

<a class="anchor" name="application-disable"></a>
#### Disable an Application

Disabled applications prevent associated accounts from logging in.  When you create an application, it is `enabled` by default.

If you want to prevent logins for an application - for example, maybe you are undergoing maintenance and don't want accounts to login during this time - you can disable the application.

You can disable an application (and thereby prevent associated accounts from logging in) by setting `status` to `DISABLED`.  For example:

**Example Request**

    application.setStatus(ApplicationStatus.DISABLED);
    application.save();

<a class="anchor" name="application-delete"></a>
### Delete an Application

You can delete an application ('unregister it') by calling the `delete` method on the application instance.

{% docs warning %}
Deleting an application completely erases the application and any of its related data from Stormpath.
{% enddocs %}

We recommend that you [disable an application](#application-disable) instead of deleting it if you anticipate that you might use the application again or if you want to retain its data for historical reference.

If you wish to delete an application:

**Example Request**

    application.delete();

{% docs info %}
The `Stormpath` console application cannot be deleted.
{% enddocs %}

<a class="anchor" name="applications-list"></a>
### List Applications

You may list your tenant's applications: as described in [List Tenant Applications](#tenant-applications-list).

<a class="anchor" name="applications-search"></a>
### Search Applications

You may search for applications as described in [Search Tenant Applications](#tenant-applications-search).

<a class="anchor" name="application-accounts"></a>
### Application Accounts

An application's `accounts` collection is the collection of all accounts that are accessible to the application.

It might sound a little odd to phrase it that way (_accessible to_), but it makes sense when you realize that applications do not have _direct_ accounts of their own.  Accounts are 'owned' by [directories](#directories) and instead _made available to_ applications.

This means that an application's `accounts` collection is _virtual_.  This virtual collection is an aggregate 'view' of all accounts that are:

1. in any directory [assigned to the application](#account-store-mappings)
2. in any group directly [assigned to the application](#account-store-mappings)

This is a powerful and convenient feature: as you add or remove account stores from an application to control its user population, you automatically 'bring in' any of their accounts.  You can interact with the application's `accounts` collection, like [search for accounts](#application-accounts-search) or [add new accounts](#application-account-register), like you would a normal collection.

{% docs info %}
Most application developers do not need to be aware that an application's `accounts` collection is virtual.  The most common case in Stormpath for simpler apps is to just [create an application with its own directory](#application-create-with-directory) for its own needs.  Used this way, the application's and the directory's accounts (and groups) are the same.  

But it is nice to know that you can customize the application's account population with other directories or groups in the future if you need to do so.
{% enddocs %}

**Application Accounts Collection Resource**

    application.getAccounts();

Applications additionally support the following account-specific functionality:

* [Register A New Account](#application-account-register)
    * and optionally specify your own [account-specific custom data](#application-account-register-with-customData)
* [Verify An Account's Email Address](#application-verify-email)
* [Log In (Authenticate) an Account](#application-account-authc)
* [Reset An Account's Password](#application-password-reset)
* [List an Application's Accounts](#application-accounts-list)
* [Search an Application's Accounts](#application-accounts-search)

<a class="anchor" name="application-account-register"></a>
#### Register a New Account

If your application wants to register a new account, you create a new `account` resource on the application instance.

Set the [account resource attributes](#account-resource) required and any additional ones you desire.

**Example Request**

    Account account = client.instantiate(Account.class);
    account.setGivenName("Jean-Luc");
    account.setUsername("jlpicard");
    account.setSurname("Picard");
    account.setEmail("capt@enterprise.com");
    account.setPassword("4P@$$w0rd!");

    application.createAccount(account);

**How does this work?**

As we [said previously](#application-accounts), an Application does not 'own' accounts of its own - it has access to accounts in one or more directories or groups and the directories actually own the accounts.  So how are we able to create a new account based on only the application?

The `createAccount` method is a convenience: when you create a new `account` resource, Stormpath will automatically route that creation request to a [designated directory or group assigned to the Application](#application-defaultAccountStoreMapping).  The account is then persisted in that directory or group and then made immediately available to the application.

Stormpath uses a generic term, _Account Store_, to generically refer to either a directory or a group since they are both containers for (store) accounts.

For most applications that have only a single assigned _account store_ (again, a directory or group), the account is persisted in that account store immediately - the application developer does not even really need to know that Stormpath automates this.

However, applications that map more than one account store to define their account population have the option of specifying _which_ of those mapped account stores should receive newly created accounts.  You can choose a [_default_ account store](#application-defaultAccountStoreMapping).  If you do not choose one, the first one in the list of mapped account stores is the default location to store new accounts.  We'll talk about setting the default account store and managing an application's assigned account stores later in [Application Account Store Mappings](#application-account-store-mappings).


<a class="anchor" name="application-account-register-with-customData"></a>
##### Register a New Application Account with your own Custom Data

When you create an application account, in addition to Stormpath's account attributes, you may also specify [your own custom data](#custom-data) by including a `CustomData` object:

	Account account = client.instantiate(Account.class);
    account.setUsername("jlpicard");
    account.setEmail("capt@enterprise.com");
    account.setGivenName("Jean-Luc");
    account.setMiddleName("");
    account.setSurname("Picard");
    account.setPassword("uGhd%a8Kl!");
    account.setStatus(AccountStatus.ENABLED);
    CustomData customData = account.getCustomData();
    customData.put("rank", "Captain");
    customData.put("birthDate", "2305-07-13");
    customData.put("birthPlace", "La Barre, France");
    customData.put("favoriteDrink", "Earl Grey tea");
    application.createAccount(account);

Once created, you can further modify the custom data - delete it, add and remove attributes, etc as necessary.  See the [custom data](#custom-data) section for more information and customData requirements/restrictions.

<a class="anchor" name="application-welcome-email"></a>
##### Send a Welcome Email

Stormpath makes it easy to send a welcome email to the person associated with a newly created account.

When you create a new `account` resource, it is stored in a Directory. If the account is created in a directory with [Account Registration](#application-account-register) enabled, Stormpath will automatically send the welcome email to the account's email address on your behalf.

The email will be shown as coming from your email address, and you don't have to worry about email servers or how to send the email yourself.  You can customize the email template to say whatever you like.

By association then, if you add an account to your application programmatically or through the Stormpath Admin Console, and that account is stored in a directory with this feature enabled, Stormpath will send a welcome email to that account email address.

This workflow is disabled by default on Directories, but you can enable it easily in the Stormpath Admin Console UI. Refer to the [Stormpath Admin Console product guide](https://stormpath.com/docs/console/product-guide#!ManageWorkflowAutomation) for complete instructions.

###### Overwriting Execution Workflow

The execution of the registration workflow can be explicitly overwritten on a per-request basis using the  `createAccount(CreateAccountRequest)` method:

	Account account = client.instantiate(Account.class);
    account.setGivenName("Jean-Luc");
    account.setUsername("jlpicard");
    account.setSurname("Picard");
    account.setEmail("capt@enterprise.com");
    account.setPassword("4P@$$w0rd!");
	
	application.createAccount(
		Accounts.newCreateRequestFor(account)
			.setRegistrationWorkflowEnabled(true)
			.build()
	);


If `registrationWorkflowEnabled` is true, the account registration workflow will be triggered no matter what the Login Source configuration is. If `registrationWorkflowEnabled` false, the account registration workflow will not be triggered, no matter what the Login Source configuration is.

If you want to ensure the registration workflow behavior matches the Login Source default, just do not call the `registrationWorkflowEnabled` method.

<a class="anchor" name="application-verify-email"></a>
#### Verify An Account's Email Address

This workflow allows you to send a welcome email to a newly registered account and optionally verify that they own the email addressed used during registration.

The email verification workflow involves changes to an account at an application level, and as such, this workflow relies on the `account` resource as a starting point. For more information on working with these workflows via REST after they have already been configured, refer to the [Working With Accounts](#account-verify-email) section of this guide.
This workflow is disabled by default for accounts, but you can enable it easily in the Stormpath Admin Console UI. Refer to the [Stormpath Admin Console product guide](https://stormpath.com/docs/console/product-guide#!ManageWorkflowAutomation) for complete instructions.

{% docs note %}
Workflows are only available on cloud directories and only configurable using the Stormpath Admin Console. They are not currently configurable via the Java SDK. Also, the Stormpath Administrator directory's automated workflows cannot be altered.
{% enddocs %}

<a class="anchor" name="application-account-authc"></a>
#### Log In (Authenticate) an Account

You may authenticate an account by calling the `authenticateAccount` method of an application instance:

**Example Request**

	UsernamePasswordRequest authenticationRequest = new UsernamePasswordRequest("usernameOrEmail", "password");
    AuthenticationResult result = application.authenticateAccount(authenticationRequest);

If the login attempt is successful, an `AuthenticationResult` object is returned with a reference to the successfully authenticated account:

    Account account = result.getAccount();

If the login attempt fails, a `400 Bad Request` is returned with an [error payload](#error-handling) explaining why the attempt failed:

**Example Login Attempt Failure Handling**

	try {
    	UsernamePasswordRequest authenticationRequest = new UsernamePasswordRequest("johnsmith", "badPassword");
        application.authenticateAccount(authenticationRequest);
	} catch (ResourceException ex) {
    	System.out.println(ex.getStatus()); // Will output: 400
        System.out.println(ex.getCode()); // Will output: 400
        System.out.println(ex.getMessage()); // Will output: "Invalid username or password."
        System.out.println(ex.getDeveloperMessage()); // Will output: "Invalid username or password."
        System.out.println(ex.getMoreInfo()); // Will output: "mailto:support@stormpath.com"
	}

#### Log In (Authenticate) an Account with Specific AccountStore

When you submit an authentication request to Stormpath, instead of executing the default login logic that cycles through account stores to find an account match, you can specify the `AccountStore` where the login attempt will be issued to.

At the time you create the request, it is likely that you may know the account store where the account resides, therefore you can target it directly. This will speed up the authentication attempt (especially if you have a very large number of account stores).

**Example Request**
	
	AccountStore accountStore = anAccountStoreMapping.getAccountStore();
	UsernamePasswordRequest authenticationRequest = new UsernamePasswordRequest("usernameOrEmail", "password", accountStore);
    AuthenticationResult result = application.authenticateAccount(authenticationRequest);

<a class="anchor" name="application-password-reset"></a>
#### Reset An Account's Password

Stormpath has a comprehensive mechanism for secure password reset, as well.

##### Understanding The Password Reset Workflow

In Stormpath, the model used for password reset is based on the common standard of sending an email to the address associated with the account. This email contains a verification link with a limited-life token. The end-user clicks this link and is redirected to either your own or a Strompath-owned password reset page where he or she can enter a new password.

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

Creating a new password reset token automatically sends a password reset email to the destination email address if that address corresponds to an account listed in the application [account stores](#account-store-mappings).

A successful request sends a password reset email to the first discovered account associated with the corresponding application. The email recipient can then click a password reset URL in the email to reset their password in a web form.

The `sendPasswordResetEmail` method of an application instance must be called to send the email with the URL that includes the token:

**Example Request**

    Account account = application.sendPasswordResetEmail("john.smith@example.com");

A successfully returned account by this request indicates that a password reset email will be sent as soon as possible to the email specified.

If the password reset token creation fails, a `400 Bad Request` is returned with an [error payload](#error-handling) explaining why the attempt failed:

At this point, an email will be built using the [password reset base URL](#password-reset-base-URL) specified in the Stormpath Admin Console.

In a real-world implementation, you must build an end-point in your application that is designed to accept a request with the query string parameter "sptoken", which is the token value generated for the user. This token is then used to verify the reset request before updating the account accordingly.        

<a class="anchor" name="password-reset-token-retrieve"></a>
##### Validate A Password Reset Request (Validate A Token)

Once you've successfully generated a token for a password request, you'll need to consume it to allow the user to change his or her password. To do this, Stormpath sends an email (that you can customize) to the user with a link and a verification token in the format that follows:

    http://yoursite.com/path/to/reset/page?sptoken=$TOKEN

Once the user clicks this browser, your controller should retrieve the token from the query string and check it against the Stormpath API.

Retrieving a token resource successfully using a call to the `verifyPasswordResetToken` method of an application instance indicates that the token is valid. Thus, to validate a token, you call to the `verifyPasswordResetToken` method and specify the token captured from the query string as the specific resource to request:

**Example Request**

	Account account = application.verifyPasswordResetToken("$TOKEN");

If the password reset token is invalid - it never existed or has expired - a `404 Not Found` response is returned.

After a successfully request with the query string token, you'll receive back an Account instance. Use this instance to set a new password. You do this just like any other [account update](#account-update), by specifying the attribute to update and calling the `save` method.

<a class="anchor" name="application-accounts-list"></a>
#### List Application Accounts

You can list your application's accounts by sending a request to your application's `accounts` Collection Resource.  The response is a [paginated](#pagination) list of application accounts.

You may also use collection [pagination](#pagination) and [sort ordering](#sorting) query parameters to customize the paginated response.

**Example Request**

    AccountList accounts = application.getAccounts();
    for(Account account : accounts) {
    	System.out.println(account.getGivenName() + " " + account.getSurname());
    }

<a class="anchor" name="application-accounts-search"></a>
#### Search Application Accounts

You may search for directories by sending a request to your application's `accounts` Collection Resource using [search query parameters](#search).  Any matching directories with your tenant will be returned as a [paginated](#pagination) list.

##### Searchable Account Attributes

The following [account attributes](#account-resource) are searchable via [attribute](#search-attribute) searches:

* `givenName`
* `middleName`
* `surname`
* `username`
* `email`

In addition to the [search query parameters](#search), you may also use [pagination](#pagination) and [sorting](#sorting) query parameters to customize the paginated response.  For example:

	AccountCriteria criteria = Accounts.where(Accounts.givenName().containsIgnoreCase("foo"))
                .offsetBy(0)
                .limitTo(50)
                .orderByGivenName();
    AccountList accounts = application.getAccounts(criteria);

    for(Account account: accounts) {
    	System.out.println(account.getGivenName() + " " + account.getSurname());
    }

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

**Application Groups Collection Resource **

    application.getGroups();

Applications additionally support the following group-specific functionality:

* [Create A New Application Group](#application-groups-create)
* [List an Application's Groups](#application-groups-list)
* [Search an Application's Groups](#application-groups-search)

<a class="anchor" name="application-groups-create"></a>
#### Create a New Application Group

If your application wants to register a new group, you create a new `Group` resource on the application instance.

Set the [group resource attributes](#group) required and any additional ones you desire.

    Group group = client.instantiate(Group.class);

    group.setName("My Group");
    group.setDescription("My Group Description");

    application.createGroup(group);

**How does this work?**

As we [mentioned above](#application-groups), an Application does not 'own' groups of its own - it has access to groups directly (or indirectly) assigned to it. So how are we able to create a new group based on only the application?

The `createGroup` method is a convenience: when you create a new `Group` resource, Stormpath will automatically route that creation request to a [designated directory assigned to the Application](#application-defaultGroupStoreMapping). The group is then persisted in that directory and then made immediately available to the application.

For most applications that have only a single assigned directory, the group is persisted in that directory immediately - the application developer does not even really need to know that Stormpath automates this.

However, applications that are assigned more than one account store have the option of specifying _which_ of those mapped account stores should receive newly created groups.  You can choose a [_default_ group store](#application-defaultGroupStoreMapping).  If you do not choose one, the first one in the list of mapped account stores is the default location to store newly created groups.  We'll talk about setting the default group store and managing an application's assigned account stores later in [Application Account Store Mappings](#application-account-store-mappings).

<a class="anchor" name="application-groups-create-with-customData"></a>
##### Create a New Application Group with your own Custom Data

When you create an application group, in addition to Stormpath's group attributes, you may also specify [your own custom data](#custom-data) by including a `CustomData` resource:

	Group group = client.instantiate(Group.class);

    group.setName("My Group");
    group.setDescription("My Group Description");
    group.getCustomData().put("Headquarters", Arrays.asList("High Council Chamber", "High Council Tower", "Jedi Temple", "Coruscant"));
    group.getCustomData().put("Affiliation", "Jedi Order");

    application.createGroup(group);


Once created, you can further modify the custom data - delete it, add and remove attributes, etc as necessary.  See the [custom data](#custom-data) section for more information and customData requirements/restrictions.

<a class="anchor" name="application-groups-list"></a>
#### List Application Groups

You can list your application's groups by sending a request to your application's `groups` Collection Resource.  The response is a [paginated](#pagination) list of application groups.

You may also use collection [pagination](#pagination) and [sort ordering](#sorting) query parameters to customize the paginated response.

**Example Request**

	GroupList groups = application.getGroups();
    for( Group group : groups) {
    	System.out.println(group.getName());
    }

<a class="anchor" name="application-groups-search"></a>
#### Search Application Groups

You may search for groups by sending a request to your application's `groups` Collection Resource using [search query parameters](#search).  Any matching groups within your application will be returned as a [paginated](#pagination) list.

##### Searchable Group Attributes

The following [account attributes](#account-resource) are searchable via [attribute](#search-attribute) searches:

* `name`
* `description`

In addition to the [search query parameters](#search), you may also use [pagination](#pagination) and [sorting](#sorting) query parameters to customize the paginated response.  For example:

	GroupCriteria criteria = Groups.where(Groups.name().containsIgnoreCase("foo"))
                .offsetBy(0)
                .limitTo(50)
                .orderByName();
    GroupList groups = application.getGroups(criteria);
    for(Group group: groups) {
    	System.out.println(group.getName());
    }

#### More Group Functionality

Group CRUD and other behavior that is not application-specific is covered in the main [Groups section](#groups).

<a class="anchor" name="application-account-store-mappings"></a>
### Application Account Store Mappings

Stormpath uses the term _Account Store_ to generically refer to either a [group](#groups) or a [directory](#directories), since they both contain (store) accounts.

An application's `accountStoreMappings` collection, then, reflects all [groups](#groups) and [directories](#directories) that are assigned to that application for the purpose of providing accounts that may login to the application.  This is a powerful feature in Stormpath that allows you to control which account populations may login to an application.

However, many applications do not need this feature.  The most common use case in Stormpath is to create an application and a single directory solely for the purpose of that application's needs.  This is a totally valid approach and a good idea when starting with Stormpath.  However, rest assured that you have the flexibility to control your account populations in convenient ways as you expand to use Stormpath for any of your other applications.

You define and modify an application's account store mappings by creating, modifying or deleting [Account Store Mapping](#account-store-mappings) resources.

**Application Account Store Mappings Collection Resource**

    application.getAccountStoreMappings();

<a class="anchor" name="application-account-store-mappings-list"></a>
#### List Application Account Store Mappings

You can list an application's assigned account stores by sending a request to the application's `accountStoreMappings` Collection Resource.  The response is a [paginated](#pagination) list of application account store mappings.

You may also use collection [pagination](#pagination) and [sort ordering](#sorting) query parameters to customize the paginated response.

**Example Request**

	AccountStoreMappingList mappings = application.getAccountStoreMappings();
    for (AccountStoreMapping mapping: mappings) {
    	System.out.println(mapping.getAccountStore().getHref());
    }

***

<a class="anchor" name="account-store-mappings"></a>
## Account Store Mappings

_Account Store_ is a generic term for either a [Directory](#directories) or a [Group](#groups).  Directories and Groups are both are considered "account stores" because they both contain, or 'store', `Accounts`. An _Account Store Mapping_, then, represents an Account Store mapped (assigned) to an `Application`.

In Stormpath, you control who may login to an application by associating (or 'mapping') one or more account
stores to an application.  All of the accounts across all of an application's assigned account stores form the application's effective _user base_; those accounts may login to the application.  If no account stores are assigned to an application, no accounts will be able to login to the application.

You control which account stores are assigned (mapped) to an application, and the order in which they are consulted during a login attempt, by manipulating an application's `AccountStoreMapping` resources.

<a class="anchor" name="workflow-login-attempt"></a>
**How Login Attempts Work**

When an account tries to login to an application, the application's assigned account stores are consulted _in the order that they are assigned to the application_. When a matching account is discovered in a mapped account store, it is used to verify the authentication attempt and all subsequent account stores are ignored. In other words, accounts are matched for application login based on a 'first match wins' policy.

Let's look at an example to illustrate this behavior. Assume that two account stores, a 'Customers' directory and an 'Employees' directory have been assigned (mapped) to a 'Foo' application, in that order.

The following flow chart shows what happens when an account attempts to login to the Foo application:

<img src="/images/docs/LoginAttemptFlow.png" alt="Account Stores Diagram" title="Account Stores Diagram" width="650" height="500">

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

You do this by calling the `create` method on the `AccountStoreMapping` resource class, or by calling the `createAccountStoreMapping` on an `Application` instance. You must specify the application and the account store instances, both containing an `href` property, when creating the account store mapping.

**Required Attributes**

* [application](#account-store-application) (an instance)
* [accountStore](#account-store-accountStore) (an instance)

**Optional Attributes**

* [listIndex](#list-index)
* [isDefaultAccountStore](#account-store-mapping-resource-is-default-account-store) - if unspecified, the default is `false`
* [isDefaultGroupStore](#account-store-mapping-resource-is-default-group-store) - if unspecified, the default is `false`

Creating it from an application instance:

    AccountStoreMapping accountStoreMapping = client.instantiate(AccountStoreMapping.class);
    accountStoreMapping.setAccountStore(accountStore); // this could be an existing group or a directory
    accountStoreMapping.setApplication(application);
    accountStoreMapping.setDefaultAccountStore(Boolean.TRUE);
    accountStoreMapping.setDefaultGroupStore(Boolean.FALSE);
    accountStoreMapping.setListIndex(0);
    application.createAccountStoreMapping(accountStoreMapping);


<a class="anchor" name="account-store-mapping-retrieve"></a>
### Retrieve An Account Store Mapping

After you have created an account store mapping, you may retrieve its contents by sending a request to the static `get` method of the account store mapping class with the `href` attribute, or using a Client instance.

If you don't have the account store mapping's `href`, you can find it in the [application's account store mappings list](#application-account-store-mappings-list).

**Example Request**

	String href = "https://api.stormpath.com/v1/accountStoreMappings/WpM9nyZ2TbayIfbRvLk9CO";
    AccountStoreMapping accountStoreMapping = client.getResource(href, AccountStoreMapping.class);


<a class="anchor" name="account-store-mapping-resources-expand"></a>
#### Expandable Resources

When retrieving an Account Store Mapping, you can also retrieve one or more of its linked resources by [expanding them in-line](#links-expansion) using the expansion options.

The following `AccountStoreMapping` attributes are expandable:

* `accountStore`
* `application`

See the [Link Expansion](#links-expansion) section for more information on expanding link attributes.

<a class="anchor" name="account-store-mapping-update"></a>
### Update An Account Store Mapping

Call the `save` method on an accountStoreMapping when you want to change one or more of the account store mapping's attributes. Unspecified attributes are not changed, but at least one attribute must be specified.

**Updatable Application Attributes**

* [listIndex](#list-index)
* [isDefaultAccountStore](#account-store-mapping-resource-is-default-account-store)
* [isDefaultGroupStore](#account-store-mapping-resource-is-default-group-store)

**Example Request**

    accountStoreMapping.setDefaultAccountStore(Boolean.FALSE);
    accountStoreMapping.save();

<a class="anchor" name="account-store-mapping-update-priority"></a>
#### Set the Login Priority of an Assigned Account Store

As we've [shown previously](#workflow-login-attempt), an account trying to login to an application will be matched to the application's account stores based on the list order they are assigned to the application.  The account store at list index 0 has the highest priority, the account store at list index 1 has the next highest priority, and so on.  When an account is discovered in an account store, the login attempt occurs and returns immediately.  All remaining account stores are not checked.

If you wish to change an account store's login priority for an application, you simply:

1. Find the `accountStoreMapping` resource in the application's `accountStoreMappings` [collection](#collections) that reflects the `accountStore` that you wish to re-prioritize.
2. Issue an update request to that `AccountStoreMapping`'s instance with a new `listIndex` value.

**Example Request**

For example, assume that an account store represented by mapping `$accountStoreMapping` has a list index of `0` (first in the list), and we wanted to lower its priority to `1` (second in the list):

    accountStoreMapping.setListIndex(1);
    accountStoreMapping.save();

<a class="anchor" name="account-store-mapping-default-account-store"></a>
#### Set The Default Account Store for new Application Accounts

Applications cannot store Accounts directly - Accounts are always stored in an Account Store (a Directory or Group). Therefore, if you would like an application to be able to create new accounts, you must specify which of the application's associated account stores should store the application's newly created accounts.  This designated account store is called the application's _default account store_.

You specify an application's default account store by setting the AccountStoreMapping's `isDefaultAccountStore` attribute to equal `true`.  You can do this when you create the `accountStoreMapping` resource.  Or if the resource has already been created:

1. Find the `accountStoreMapping` resource in the Application's `accountStoreMappings` [collection](#collections) that reflects the `accountStore` you wish to be the application's default account store.
2. Issue an update request to that AccountStoreMapping's instance with `defaultAccountStore` set to `true`.

**Example Request**

    accountStoreMapping.setDefaultAccountStore(Boolean.TRUE);
	accountStoreMapping.save();

Now, any time a new account is created from an application's `createAccount` method, the account will actually be created in the designated default account store.

**Directory vs Group?**

If the application's default account store is a:

* directory: the account will be created in the directory
* group: the account will be created in the group's directory first, then assigned to the group automatically.

{% docs note %}
Only one of an application's mapped account stores may be the default account store.

In addition, setting an AccountStoreMapping's `isDefaultAccountStore` value to `true` will automatically set the application's other AccountStoreMappings' `isDefaultAccountStore` values to `false`. However, note that setting an AccountStoreMapping's `isDefaultAccountStore` value to `false` **WILL NOT** automatically set another AccountStoreMapping's `isDefaultAccountStore` to `true`.  You are responsible for explicitly setting `isDefaultAccountStore` to `true` if you want the application to be able to create new accounts.
{% enddocs %}

{% docs warning %}
If none of the application's AccountStoreMappings are designated as the default account store, the application _WILL NOT_ be able to create new accounts from the applications endpoint.  It is still possible to create accounts from the [accounts endpoint](#account-create).
{% enddocs %}

{% docs warning %}
Also note that Mirrored directories or groups within Mirrored directories are read-only; they cannot be set as an application's default account store.  Attempting to set `isDefaultAccountStore` to `true` on an AccountStoreMapping that reflects a mirrored directory or group will result in an error response.
{% enddocs %}

<a class="anchor" name="account-store-mapping-default-group-store"></a>
#### Set The Default Group Store for new Application Groups

Applications cannot store Groups directly - Groups are always stored in a Directory.  Therefore, if you would like an application to be able to create new groups, you must specify which of the application's associated account stores should store the application's newly created groups.  This designated store is called the application's _default group store_.

You specify an application's default group store by setting the `AccountStoreMapping`'s `isDefaultGroupStore` attribute to equal `true`.  You can do this when you create the `accountStoreMapping` resource, or if the resource has already been created:

1. Find the `accountStoreMapping` resource in the Application's `accountStoreMappings` [collection](#collections) that reflects the `accountStore` you wish to be the application's default group store.
2. Issue an update request to that `AccountStoreMapping`'s instance with `isDefaultGroupStore` set to `true`.

**Example Request**

    accountStoreMapping.setDefaultGroupStore(Boolean.TRUE);
    accountStoreMapping.save();

Now, any time a new group is created from an application's `createGroup` method, the group will actually be created in the designated default group store.

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

You remove an assigned account store from an application by deleting the `accountStoreMapping` resource that links the accountStore and the application together.  This removes the possibility of the accounts in the associated account store from being able to login to the application.

{% docs info %}
Deleting an `accountStoreMapping` resource *does not* delete either the account store or the application resources themselves - only the association between the two.
{% enddocs %}

{% docs note %}
Deleting an account store mapping will remove the ability for accounts in the account store from authenticating with the application unless they are associated with an account store that is still mapped to the application. Be careful when removing mappings.

Also, note that if no `AccountStoreMapping` is designated as the default account store, the application _WILL NOT_ be able to create new accounts.  Similarly, if there is no designated default group store, the application will not be able to create new groups.
{% enddocs %}

**Example Request**

For example, to delete the application-accountStore association we created in the above previous example:

    accountStoreMapping.delete();

<a class="anchor" name="account-store-mapping-list"></a>
### List Account Store Mappings

You can list an applications's mapped account stores by issuing a request to the application's `accountStoreMappings` Collection Resource.

The response is a paginated list of `accountStoreMapping` resources.  You may use collection [pagination](#pagination) query parameters to customize the paginated response.

**Example Request**

    AccountStoreMappingList accountStoreMappings = application.getAccountStoreMappings();
    for (AccountStoreMapping accountStoreMapping : accountStoreMappings) {
    	System.out.println(accountStoreMapping.getAccountStore().getHref());
    }

***

<a class="anchor" name="directories"></a>
## Directories

A Directory is a top-level storage containers of `Accounts` and `Groups`. A Directory also manages security policies (like password strength) for the Accounts it contains. 

Additionally:

* All `Accounts` within a directory have a unique email address and/or username.
* All `Groups` within a directory have a unique name.

Stormpath supports two types of Directories:

1. Natively hosted ‘Cloud’ directories that originate in Stormpath and
2. ‘Mirror’ directories that act as secure mirrors or replicas of existing directories outside of Stormpath, for example LDAP or Active Directory servers.

{% docs info %}
Directories are a more advanced feature of Stormpath. If you have a single application or multiple applications that access the same accounts, you usually only need a single directory, and you do not need to be concerned with creating or managing multiple directories.

If however, your application(s) needs to support login for external 3rd party accounts like those in LDAP or Active Directory, or you have more complex account segmentation needs, directories will be a powerful tool to manage your application(s) user base.
{% enddocs %}

Directories can be used to cleanly manage segmented account populations.  For example, you might use one Directory for company employees and another Directory for customers, each with its own security policies.  You can [associate directories to applications](#account-store-mappings) (or groups within a directory) to allow the directory's accounts to login to applications.

You can add as many directories of each type as you require. Adding or deleting accounts, groups and group memberships in directories affects ALL applications to which the directories are mapped as [account stores](#account-store-mappings).

<a class="anchor" name="directory-mirror"></a>
#### Mirror Directories

Mirror directories are a big benefit to Stormpath customers who need LDAP or Active Directory accounts to be able to securely login to public web applications _without breaking corporate firewall policies_. Here is how they work:

* After creating an LDAP or AD Directory in Stormpath, you download a Stormpath Agent.  This is a simple standalone software application that you install behind the corporate firewall so it can communicate directly with the LDAP or AD server.
* You configure the agent via LDAP filters to view only the accounts that you want to expose to your Stormpath-enabled applications.
* The Agent will start synchronizing immediately, pushing this select data _outbound_ to Stormpath over a TLS (HTTPS) connection.
* The synchronized accounts and groups appear in the Stormpath Directory.  The accounts will be able to login to any Stormpath-enabled application [that you assign](#account-store-mappings).
* When the Agent detects local LDAP or AD changes, additions or deletions to these specific accounts or groups, it will automatically propagate those changes to Stormpath to be reflected by your Stormpath-enabled applications.

LDAP or Active Directory are still the 'system of record' or source of identity 'truth' for these accounts and groups.  The big benefit is that your Stormpath-enabled applications still use the same convenient REST+JSON API - they do not need to know anything about LDAP, Active Directory or legacy connection protocols!

{% docs tip %}
The Stormpath Agent is **firewall friendly**: you do not need to open any inbound holes in your company firewall.  The only requirement is that the Agent be able to make an _outbound_ HTTPS connection to https://api.stormpath.com 
{% enddocs %}

Finally, note that accounts and groups in mirrored directories are automatically deleted when:

* The original object is deleted from the LDAP or AD directory service.
* The original LDAP/AD object information no longer matches the account filter criteria configured for the agent.
* The LDAP/AD directory is deleted.

<a class="anchor" name="directory"></a>
### Directory Resource

An individual `directory` resource may be accessed via its Resource URI:

**Resource URI**

    /v1/directories/:directoryId

<a class="anchor" name="directory-attributes"></a>
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
* Work with directories:
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

* [Search your tenant's `directories`](#tenant-directories-search)
* Retrieve an application's `accountStoreMappings` and extract the directories iteratively
* View an account's `directory` field.

For example, if you need the `href` for a directory named "My Directory", you can search your tenant's `DirectoryList` collection using [attribute search](#search-attribute):

**Example Request**

	DirectoryList directories = tenant.getDirectories(
		Directories.where(
			Directories.name().eqIgnoreCase("My Directory")
		)
	);

    Directory directory = null;
    for(Directory dir : directories) {
    	if(dir.getName().equalsIgnoreCase("My Directory")) {
        	directory = dir;
            break;
        }
    }
    if( directory != null) {
	    System.out.println("Href: " + directory.getHref());
	}

If you only know a small part, you can use the `containsIgnoreCase` method instead of the `eqIgnoreCase` one.

You can achieve the same result using the type-unsafe variant:

	Map<String, Object> queryParams = new HashMap<String, Object>();
    queryParams.put("name", "My Directory");
    for(Directory directory : tenant.getDirectories(queryParams)) {
    	System.out.println(directory.getHref());
    }
    
If you only know a small part, you can use the asterisk wildcard (e.g., `queryParams.put("name", "My*");`) to narrow down the selection.

<a class="anchor" name="directory-create"></a>
### Create a Directory

{% docs info %}
It is currently only possible to create a standard (non-mirrored) Directory via the Java SDK.  If you need to create a [mirror directory](#directory-mirror) for LDAP or Active Directory, you must use the [Stormpath Admin Console](/console/product-guide#create-a-mirrored-directory).
{% enddocs %}


<a class="anchor" name="directory-create-cloud"></a>
<a class="anchor" name="create-a-cloud-directory"></a>
#### Create a Cloud Directory

To create a new `directory` resource within the caller tenant:
You create a new directory by invoking the `createDirectory` method of the tenant. This will create a new Directory instance within the caller's tenant.

When you invoke this method, at least the `name` attribute must be specified, and it must be unique compared to all other directories in your tenant. The `description` and `status` attribute are optional.

**Resource URI**

    /v1/directories/:directoryId

**Required Attribute**

* [name](#directory-resource-name)

**Optional Attributes**

* [description](#directory-resource-description)
* [status](#directory-resource-status)

**Example Request**

	Directory directory = client.instantiate(Directory.class);

    directory.setName("Captains");
    directory.setDescription("Captains from a variety of stories");

    tenant.createDirectory(directory);
    
<a class="anchor" name="directory-create-mirror"></a>
#### Create a Mirrored (LDAP/AD) Directory

It is currently only possible to create a standard (non-mirrored) Directory via the REST API.  If you need to create a [mirror directory](#directory-mirror) for LDAP or Active Directory, you must use the [Stormpath Admin Console](/console/product-guide#create-a-mirrored-directory).

<a class="anchor" name="associate-directories-with-applications"></a>
#### Associate Directories with Applications

If you want to assign a directory to an application so the directory's accounts may login to the application, you will need to [create an AccountStoreMapping](#create-an-account-store-mapping).

<a class="anchor" name="directory-retrieve"></a>
### Retrieve a Directory

To retrieve a Directory, use the Client instance and pass the directory's `href` as the parameter.

**Example Request Using a Client Instance**

    Directory directory = client.getResource(href, Directory.class);

<a class="anchor" name="directory-update"></a>
### Update a Directory

Use the `save` method when you want to change one or more specific attributes of a `directory` resource. Unspecified attributes will not be changed, but at least one attribute must be specified.

**Optional Attributes**

* [name](#directory-resource-name)
* [description](#directory-resource-description)
* [status](#directory-resource-status)

**Example Request**

	directory.setName("Captains Directory");
    directory.save();

<a class="anchor" name="enable-or-disable-a-directory"></a>
#### Enable Or Disable a Directory

A directory's status can be either `enabled` or `disabled`. An `enabled` directory allows its accounts and groups to login to any [assigned](#account-store-mappings) application.  A `disabled` directory does not allow its accounts and groups to login to applications.

To enable or disable a directory, use the `save` method to set the `status` to either `ENABLED` or `DISABLED`.

**Example Request**

    directory.setStatus(DirectoryStatus.ENABLED);
    directory.save();

<a class="anchor" name="update-agent-configuration"></a>
#### Update Agent Configuration

A [Directory Agent](#directory-agent) is a Stormpath software application installed on your corporate network to securely synchronize an on-premise directory, such as LDAP or Active Directory, into a Stormpath [mirror directory](#directory-mirrored).

You can modify an agent configuration going through the "Directories" or "Agent" tabs on the Stormpath Admin Console. For more information on administering Mirrored Directory agents, refer to the [Stormpath Admin Console product guide](https://stormpath.com/docs/console/product-guide#!UpdateAgent).

<a class="anchor" name="directory-delete"></a>
### Delete a Directory

{% docs warning %}
Deleting a directory completely erases the directory and all of its accounts and groups from Stormpath.
{% enddocs %}

We recommend that you disable a directory instead of deleting it if you anticipate that you might use the directory again or if you want to retain its data for historical reference.

To delete a directory:

**Example Request**

    directory.delete();

{% docs info %}
The `Stormpath Administrators` directory cannot be deleted.
{% enddocs %}

<a class="anchor" name="directory-list"></a>
### List Directories

You may list your tenant's directories as described in [List Tenant Directories](#tenant-directories-list).

<a class="anchor" name="directory-search"></a>
### Search Directories

You may search for directories as described in [Search Tenant directories](#tenant-directories-search).

<a class="anchor" name="work-with-directories"></a>
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

{% docs note %}
It is not currently possible to configure a Directory's account password policy via the REST API.  You must use the [Stormpath Admin Console](https://api.stormpath.com) (Directories --> &lt;choose your directory&gt; --> Details tab).
{% enddocs %}

{% docs note %}
Workflows are only available on cloud directories and only configurable using the Stormpath Admin Console.  They are not currently configurable via the REST API. 

Additionally, the `Stormpath Administrator` directory's automated workflows cannot be altered.
{% enddocs %}

<a class="anchor" name="directories-reg"></a>
### Register A New Account

This workflow allows you to create an account at a directory level.

This workflow relies on the `account` resource as a starting point. For more information refer to the [Create an Account](#account-create) section of this guide.

<a class="anchor" name="directories-verify-email"></a>
### Verifying An Account's Email Address

This workflow allows you to send a welcome email to a newly registered account and optionally verify that they own the email addressed used during registration.

The email verification workflow involves changes to an account at an application level, and as such, this workflow relies on the `account` resource as a starting point. For more information on working with these workflows via the Java SDK after they have already been configured, refer to the [Working With Accounts](#account-verify-email) section of this guide.
This workflow is disabled by default for accounts, but you can enable it easily in the Stormpath Admin Console UI. Refer to the [Stormpath Admin Console product guide](https://stormpath.com/docs/console/product-guide#!ManageWorkflowAutomation) for complete instructions.

{% docs note %}
Workflows are only available on cloud directories and only configurable using the Stormpath Admin Console. They are not currently configurable via the Java SDK. Also, the Stormpath Administrator directory's automated workflows cannot be altered.
{% enddocs %}

<a class="anchor" name="directories-password-reset"></a>
### Resetting An Account's Password

This is a self-service password reset workflow.  The account is sent an email with a secure link.  The person owning the account can click on the link and be shown a password reset form to reset their password.  This is strongly recommended to reduce support requests to your application team as well as to reduce your exposure to account passwords for added security.

The password reset workflow involves changes to an account at an application level, and as such, this workflow relies on the `application` resource as a starting point. For more information on working with this workflow via the Java SDK after they have already been configured, refer to the [Working With Applications](#application-password-reset) section of this guide.

This workflow is disabled by default for accounts, but you can enable it easily in the Stormpath Admin Console UI. Refer to the [Stormpath Admin Console product guide](https://stormpath.com/docs/console/product-guide#!ManageWorkflowAutomation) for complete instructions.

{% docs note %}
Workflows are only available on cloud directories and only configurable using the Stormpath Admin Console.  They are not currently configurable via the Java SDK. Also, the Stormpath Administrator directory's automated workflows cannot be altered.
{% enddocs %}

<a class="anchor" name="directory-groups"></a>
### Directory Groups

The `Groups` Collections for a `Directory` Resource Collection Resource represents all groups owned by a specific directory.

**Directory Groups Collection Resource**

	directory.getGroups();

#### List Directory Groups

You can list your directory's groups by sending a request to your directory's `groups` Collection Resource.  The response is a [paginated](#pagination) list of directory groups.

You may also use collection [pagination](#pagination) and [sort ordering](#sorting) query parameters to customize the paginated response.

**Example Request**

	GroupList groups = directory.getGroups();
    for(Group group : groups) {
    	System.out.println(group.getName());
    }

#### Search Directory Groups

You may search for groups by sending a request to your directory's `groups` Collection Resource using [search query parameters](#search). Any matching groups within your directory will be returned as a [paginated](#pagination) list.

##### Searchable Group Attributes

The following [account attributes](#account-resource) are searchable via [attribute](#search-attribute) searches:

* `name`
* `description`

In addition to the [search query parameters](#search), you may also use [pagination](#pagination) and [sorting](#sorting) query parameters to customize the paginated response.  For example:

    GroupCriteria criteria = Groups.where(Groups.name().eqIgnoreCase("foo"))
                .orderByName()
                .offsetBy(0)
                .limitTo(50);
    GroupList groups = directory.getGroups(criteria);

    for(Group group : groups) {
    	System.out.println(group.getName());
    }

#### Working With Directory Groups

Group resources support the full suite of CRUD commands and other interactions. Please see the [Groups section](#groups) for more information.

<a class="anchor" name="directory-accounts"></a>
### Directory Accounts

The `Accounts` Collection for a `Directory` Resource Collection Resource represents all accounts owned by a specific directory.

**Directory Accounts Collection Resource**

    directory.getAccounts();

#### List Directory Accounts

You can list your directory's accounts by sending a request to your directory's `groups` Collection Resource. The response is a [paginated](#pagination) list of directory groups.

You may also use collection [pagination](#pagination) and [sort ordering](#sorting) query parameters to customize the paginated response.

**Example Request**

    AccountList accounts = directory.getAccounts();
    for(Account account : accounts) {
    	System.out.println(account.getGivenName());
    }

#### Search Directory Accounts

You may search for accounts by sending a request to your directory's `account` Collection Resource using [search query parameters](#search). Any matching groups within your directory will be returned as a [paginated](#pagination) list.

##### Searchable Account Attributes

The following [account attributes](#account-resource) are searchable via [attribute](#search-attribute) searches:

* `username`
* `email`
* `givenName`
* `middleName`
* `surname`

In addition to the [search query parameters](#search), you may also use [pagination](#pagination) and [sorting](#sorting) query parameters to customize the paginated response.  For example:

    AccountCriteria criteria = Accounts.where(Accounts.givenName().eqIgnoreCase("foo"))
                .orderByGivenName()
                .offsetBy(0)
                .limitTo(50);
    AccountList accounts = directory.getAccounts(criteria);

    for(Account account : accounts) {
    	System.out.println(account.getGivenName());
    }

#### Working With Directory Accounts

Account resources support the full suite of CRUD commands and other interactions. Please see the [Accounts section](#accounts) for more information.

<a class="anchor" name="groups"></a>
## Groups

A `Group` is a collection of `Accounts` within a `Directory` that are often used for authorization and access control to the `Application`. In Stormpath, the term `Group` is synonymous with [role](#role).

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
* [List groups](#groups-list)
* [Search groups](#groups-search)
* [Access a group's accounts](#group-accounts)
* [Manage a group's account memberships](#group-account-memberships)

<a class="anchor" name="group-url"></a>
### Locate a Group's REST URL

When communicating with the Stormpath REST API, you might need to reference a group directly using its REST URL or `href`.

There are multiple ways to find a group `href` depending on what information you have available:

* Retrieve a group from a specific directory
* Retrieve a group from a specific account's `groupMemberships`
* Retrieve a group from the application's full list of groups

In all cases, the process is fundamentally the same. Consider the first case as example.

In order to locate a group's `href`, you'll need to first search the tenant for the specific group using some information that you have available.

For example, if you want to find  a group with the name "My Group", you'll need to search the directory for the "My Group" `group` resource:

**Example Request**

    GroupList groups = directory.getGroups();
    Group group;
    for(Group grp : groups) {
    	if(grp.getName().equals("My Group")) {
        	group = grp;
            break;
        }
    }

If you know the name exactly, you can use an [attribute search](#search-attribute):
	
	Map<String, Object> queryParams = new HashMap<String, Object>();
    queryParams.put("name", "My Group");
    Iterator<Group> iterator = directory.getGroups(queryParams).iterator();
    Group group;
    if(iterator.hasNext()) {
    	group = iterator.next();
    	System.out.println(group.getName());
    }

If you only know a small part, you can use the asterisk wildcard (e.g., `queryParams.put("name", "My*");`) to narrow down the selection.

<a class="anchor" name="group-create"></a>
### Create a Group

To create a new `group` resource instance in a specified directory which is accessible to the application:

**Required Attributes**

* [name](#group-resource-name)

**Optional Attributes**

* [description](#group-resource-description)
* [status](#group-resource-status)

**Example Request**

    Group group = client.instantiate(Group.class);
    group.setName("Aquanauts");
    group.setDescription("Aquanauts");
    group.setStatus(GroupStatus.ENABLED);

    directory.createGroup(group);

This creates a new group in the directory.

<a class="anchor" name="group-retrieve"></a>
### Retrieve a Group

A request via the `get` method of the Client data store, returns a representation of a `group` resource that includes the resource attributes.

    Group group = client.getResource(href, Group.class);


<a class="anchor" name="group-update"></a>
### Update a Group

Use the `save` method when you want to change one or more specific attributes of a `group` resource. Unspecified attributes are not changed, but at least one attribute must be specified.

**Optional Attributes**

* [name](#group-resource-name)
* [description](#group-resource-description)
* [status](#group-resource-status)

Here are some account update examples:

* [Simple Update Group Example](#account-update-simple)
* [Enable a Group](#group-enable)
* [Disable a Group](#group-disable)
* [Update a Group and its Custom Data simultaneously](#update-custom-data-embedded)

**Example Request**

	group.setDescription("Sea Voyagers");
    group.save();

<a class="anchor" name="group-enable"></a>
#### Enable a Group

If the group is contained within an *enabled directory where the directory is defined as an account store*, then enabling the group allows all accounts contained within the group (membership list) to log in to any applications for which the directory is defined as an account store.

If the group is contained within an *disabled directory where the directory is defined as an account store*, the group members are not be able to log in to any applications for which the directory is defined as an account store.

If the group is defined as an account store, then enabling the group allows accounts contained within the group (membership list) to log in to any applications for which the group is defined as an account store.

To enable a group:

**Example Request**

    group.setStatus(GroupStatus.ENABLED);
    group.save();

<a class="anchor" name="group-disable"></a>
#### Disable a Group

If a group is explicitly set as an application account store, then disabling that group prevents any of its user accounts from logging into that application but retains the group data and memberships. You would typically disable a group if you must shut off a group of user accounts quickly and easily.

If the group is contained within a directory defined as an account store, disabling the group prevents group members from logging in to any applications for which the directory is defined as an account store.

To disable a group:

**Example Request**

    group.setStatus(GroupStatus.DISABLED);
    group.save();

<a class="anchor" name="group-delete"></a>
### Delete a Group

Deleting a cloud directory group erases the group and all its membership relationships. User accounts that are members of the group will not be deleted.

We recommend that you disable an group rather than delete it, if you believe you might need to retain the user data or application connection.

To delete a cloud directory group:

**Example Request**

    group.delete();

<a class="anchor" name="groups-list"></a>
### List Groups

#### Application Groups

The application groups is a [Collection Resource](#collections) representing all application-accessible groups. A group is accessible to an application if it, or its directory, is assigned to the application as an account store.

	application.getGroups();

It returns a paginated list of links for groups accessible to an application.

**Example request**

    GroupList groups = application.getGroups();
    for( Group group : groups) {
    	System.out.println(group.getName());
    }
        

##### Account Groups

The account `groups` resource is a [Collection Resource](#collections) representing all account-associated groups. A group is associated with an account when an account has been assigned to that group as a member.

    account.getGroups();

The request returns a paginated list of links for groups for which an account is a member.

**Example Request**

    GroupList groups = account.getGroups();
    for(Group group : groups) {
    	System.out.println(group.getName());
    }

##### Directory Groups

The directory `groups` resource is a [Collection Resource](#collections) representing all directory-associated groups. Groups are defined as a subset of members in a directory.

    directory.getGroups();

It returns a paginated list of links for groups for which an account is a member.

**Example Request**

    GroupList groups = directory.getGroups();
    for(Group group : groups) {
    	System.out.println(group.getName());
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
directory.getGroups() | A search across groups in the specified directory.
application.getGroups() | A search across groups accessible to the specified application.
account.getGroups()    | A search across groups assigned to the specified account.

<a class="anchor" name="group-accounts"></a>
### Group Accounts

The Group `accounts` Collection for a `Group` Resource represents all accounts that are members of a specific group.

**Group Accounts Collection Resource**

    group.getAccounts();

The request returns a paginated list of links for accounts that are members of a specific group.

**Example Request**

	AccountList accounts = group.getAccounts();
    for(Account account : accounts) {
    	System.out.println(account.getGivenName());
    }

<a class="anchor" name="group-accounts-search"></a>
#### Search Group Accounts

You may search for directories by sending a  request to your application's `accounts` Collection Resource using [search query parameters](#search).  Any matching directories with your tenant will be returned as a [paginated](#pagination) list.

##### Searchable Account Attributes

The following [account attributes](#account-resource) are searchable via [attribute](#search-attribute) searches:

* `givenName`
* `middleName`
* `surname`
* `username`
* `email`

In addition to the [search query parameters](#search), you may also use [pagination](#pagination) and [sorting](#sorting) query parameters to customize the paginated response.  For example:

    AccountCriteria criteria = Accounts.where(Accounts.givenName().eqIgnoreCase("foo"))
                .orderByGivenName()
                .offsetBy(0)
                .limitTo(50);
    AccountList accounts = group.getAccounts(criteria);

    for(Account account : accounts) {
    	System.out.println(account.getGivenName());
    }

<a class="anchor" name="working-with-group-accounts"></a>
#### Working With Group Accounts

Account resources support the full suite of CRUD commands and other interactions. Please see the [Accounts section](#accounts) for more information.

<a class="anchor" name="group-account-memberships"></a>
### Account Memberships

The `accountMemberships` Collection for a `group` Resource represents all account memberships where a specific group is a member. In this case, Account Memberships are simply an alternative, context-specific name for [Group Memberships](#group-memberships).

**Account Memberships Collection Resource**

    group.getAccountMemberships();

#### List Account Memberships

A request returns a Collection Resource containing the group memberships to which a specific group is a member.

**Example Request**

    GroupMembershipList accountMemberships = group.getAccountMemberships();
    for(GroupMembership ams : accountMemberships) {
    	System.out.println(ams.getGroup().getName());
		System.out.println(ams.getAccount().getGivenName());
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

There are multiple ways to find a group membership, depending on what information you have available:

* Retrieve a full list of group memberships for an account
* Retrieve a full list of group members (as group membership pairings) for a group

In all cases, the process is fundamentally the same. Consider the first case as example. If you want to find a specific group mapping on a specific account,  you'll need to search the group memberships for the associated `account` resource:

**Example Request**

	GroupMembershipList groupMemberships = account.getGroupMemberships();
    GroupMembership groupMembership;
    for(GroupMembership gms : groupMemberships) {
    	if (gms.getGroup().getName().equals("Group Name") {
    		groupMembership = gms;
        	break;
        }
    }

<a class="anchor" name="group-membership-create"></a>
### Create a Group Membership

To create a group membership you need the account and the group.

    account.addGroup(group);

Or, from the group

    group.addAccount(account);

<a class="anchor" name="group-membership-retrieve"></a>
### Retrieve a Group Membership

A request returns a representation of a `groupMembership` resource that includes the account and the group hrefs.

    String href = "https://api.stormpath.com/v1/groupMemberships/249Up9ojT6NUNEYocdG4Dj";
    GroupMembership groupMembership = client.getResource(href, GroupMembership.class);

<a class="anchor" name="group-membership-resources-expand"></a>
#### Expandable Resources

When retrieving an application, you can also retrieve one or more of its linked resources by [expanding them in-line](#links-expansion) using the expansion options.

The following `Application` attributes are expandable:

* `account`
* `group`

See the [Link Expansion](#links-expansion) section for more information on expanding link attributes.

<a class="anchor" name="group-membership-delete"></a>
### Delete a Group Membership

Deleting a group membership completely erases the `groupMembership` resource from Stormpath. This operation does not delete the group or the account involved in the group membership, only the association between them.

**Example Request**

    groupMembership.delete();

<a class="anchor" name="group-memberships-list"></a>
### List Group Memberships

You can list group memberships by [account](#group-membership-by-account) or [group](#account-membership-by-group).

<a class="anchor" name="group-membership-by-account"></a>
#### List Group Memberships For An Account

The account `groupMemberships` resource is a [Collection Resource](#collections) representing all group memberships where the account is involved.

	account.getGroupMemberships();

A request returns a paginated list of the group memberships where the account is involved.

**Example Request**

    GroupMembershipList groupMemberships = account.getGroupMemberships();
    for(GroupMembership gms : groupMemberships) {
    	System.out.println(gms.getAccount().getGivenName());
        System.out.println(gms.getGroup().getName());
    }

<a class="anchor" name="account-membership-by-group"></a>
#### List Account Memberships For A Group

The group `accountMemberships` resource is a collections representing all group memberships where the group is involved.

	group.getAccountMemberships();

List Group Group Memberships (HTTP GET)

A request returns a paginated list of the group memberships where the group is involved.

**Example Request**

    GroupMembershipList accountMemberships = group.getAccountMemberships();
    for(GroupMembership ams : accountMemberships) {
    	System.out.println(ams.getAccount().getGivenName());
        System.out.println(ams.getGroup().getName());
    }

***

<a class="anchor" name="accounts"></a>
## Accounts

An `Account` is a unique identity within a `Directory`, with a unique username and/or email address. An `Account` can log into an `Application` using either the email address or username associated with it. Accounts can represent your end users (people), but they can also be used to represent services, daemons, processes, or any "entity" that needs to login to a Stormpath-enabled application.  Additionally, an account may only exist in a single directory and may be in multiple groups owned by that directory.  Accounts may not be assigned to groups within other directories.

It should be noted that the words 'User' and 'Account' usually mean the same thing, but there is a subtle difference that can be important at times:

- An Account is a unique identity within a Directory. An account can exist in only a single directory but can be a part of multiple groups owned by that directory.
- When an account is granted access to an application (by [mapping a Directory or Group](#account-store-mappings) that contains the account to the application), it becomes a 'User' of that application.

Therefore an Account can be called a 'User' of an application if/when it can login to the application.

#### LDAP/AD Accounts

It should be noted that Accounts that originate in LDAP or Active Directory (AD) are mirrored in Stormpath. You cannot create, update or delete Accounts that originate in an LDAP mirrored directory - you can only read them or use them for login.  This is because LDAP is the source of 'truth' and Stormpath does not (currently) have write-access to LDAP installations.

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

For example, if you want to find an account with the username "test" across an application, you'll need to search the application for the "test" account object:

**Example Request**

	AccountCriteria criteria = Accounts.where(Accounts.username().eqIgnoreCase("test"));
    AccountList accounts = application.getAccounts(criteria);
    Account account;
    for(Account acc : accounts) {
    	account = acc;
    }

If you only know a small part of the username, you can use the `containsIgnoreCase` method (e.g., `Accounts.username().containsIgnoreCase("test")`) to narrow down the selection.

<a class="anchor" name="account-create"></a>
### Create an Account

Through Stormpath's API and Admin Console, you can only create accounts for cloud, or Stormpath-managed, directories. For LDAP, the accounts must be created on the LDAP server and they will be mirrored to the Stormpath agent.

**Required Attributes**

* [email](#email)
* [password](#password)
* [givenName](#givenName)
* [surname](#surname)

**Optional Attributes**

* [username](#username)
* [middleName](#middleName)
* [status](#status)

{% docs note %}
The password in the request is being sent to Stormpath as plain text. This is one of the reasons why Stormpath only allows requests via HTTPS. Stormpath implements the latest password hashing and cryptographic best-practices that are automatically upgraded over time so the developer does not have to worry about this. Stormpath can only do this for the developer if Stormpath receives the plaintext password so we can hash it using these techniques.

Plaintext passwords also allow Stormpath to [enforce password restrictions](#directories-password-restrictions) in a configurable manner (e.g., you can configure your directories to reject passwords without mixed case and non-alphanumeric characters.)

Most importantly, Stormpath does not persist nor relay plaintext passwords in any circumstances.

On the client side, then, you do not need to worry about salting or storing passwords at any point; you need only pass them to Stormpath for hashing, salting, and persisting with the appropriate SDK API call (e.g., [Create An Account](#account-create) or [Update An Account](#account-update)).
{% enddocs %}

**Example Request**

	Account account = client.instantiate(Account.class);
    account.setEmail("john.smith@example.com");
    account.setGivenName("John");
    account.setPassword("4P@$$w0rd!");
    account.setSurname("Smith");
    account.setUsername("johnsmith");

    directory.createAccount(account);

**Example request suppressing the email messages**

	directory.createAccount(account, Boolean.FALSE);


<a class="anchor" name="account-retrieve"></a>
### Retrieve an Account

A request to the `get` method of the `Account` resource class, or to the Client data store, returns a representation of an `account` resource that includes the attributes.

**Example Request**

	String href = "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA";
    Account account = client.getResource(href, Account.class);

See the [Link Expansion](#links-expansion) section for more information on expanding link attributes.

<a class="anchor" name="account-update"></a>
### Update an Account

Use the `save` method when you want to change one or more specific attributes of an `account` resource. Unspecified attributes will not be changed, but at least one attribute must be specified.

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

{% docs note %}
The password in the request is being sent to Stormpath as plain text. This is one of the reasons why Stormpath only allows requests via HTTPS. Stormpath implements the latest password hashing and cryptographic best-practices that are automatically upgraded over time so the developer does not have to worry about this. Stormpath can only do this for the developer if Stormpath receives the plaintext password so we can hash it using these techniques.

Plaintext passwords also allow Stormpath to [enforce password restrictions](#directories-password-restrictions) in a configurable manner (e.g., you can configure your directories to reject passwords without mixed case and non-alphanumeric characters.)

Most importantly, Stormpath does not persist nor relay plaintext passwords in any circumstances.

On the client side, then, you do not need to worry about salting or storing passwords at any point; you need only pass them to Stormpath for hashing, salting, and persisting with the appropriate HTTPS API call (e.g., [Create An Account](#account-create) or [Update An Account](#account-update)).
{% enddocs %}

<a class="anchor" name="UpdateAccountName"></a><a class="anchor" name="account-update-simple"></a>
**Example Update Request**

	account.setSurname("jlpicard");
	account.setGivenName("Jean-Luc");
    account.setSurname("Picard");
    account.save();

If the account is part of a directory containing groups, you can associate the account with a group.

<a class="anchor" name="AddAccountGroup"></a>
**Example Request to Add an Account to a Group**

	account.addGroup(group);

<a class="anchor" name="ChangeAccountPassword"></a>
**Example Request to Change an Account Password**

    account.setPassword("L9%hw4c5q");
    account.save();


<a class="anchor" name="account-add-group"></a>
#### Assign an Account to a Group

If the account is part of a directory containing groups, you can associate the account with a group.

To assign an account to a group:

**Example Request**

    account.addGroup(group);

Both the account and the group must exist and contain a valid `href` property.

<a class="anchor" name="account-remove-group"></a>
#### Remove an Account from a Group

If the account is the member of a group within a directory, you can remove the account from the group by deleting the `groupMembership` resource that associates the two together:

**Example Request**

    groupMembership.delete();

<a class="anchor" name="account-enable"></a>
#### Enable or Disable an Account

Accounts have an "status" which defines its state in the systems: enabled and disabled. An enabled account can be successfully authenticated if it is assigned to an active account store in an application while a disabled account cannot.

{% docs note %}
Enabling and disabling accounts for mirrored (LDAP) directories is not available in Stormpath. You manage mirrored (LDAP) accounts on the primary server installation.
{% enddocs %}

For example, to enable an account:

**Example Request**

	account.setStatus(AccountStatus.ENABLED);
    account.save();

<a class="anchor" name="account-delete"></a>
### Delete an Account

Deleting an account completely erases the account from the directory and erases all account information from Stormpath.

{% docs warning %}
Deleting an account permanently removes the account from any application that has access to the account (based on applications' [account store mappings](#account-store-mappings)). Additionally, be careful deleting an account for a single application's needs - ensure that the deletion is OK for any and all applications that may access the account.
{% enddocs %}

To delete an account:

**Example Request**

    account.delete();

### Account Custom Data

While Stormpath's default `Account` attributes are useful to many applications, you might want to add your own custom data to a Stormpath account.  If you want, you can store all of your custom account information in Stormpath so you don't have to maintain another separate database to store your specific account data.

Please see the [custom data section](#custom-data) for more information and requirements/restrictions for creating, retrieving, updating and deleting account custom data.

<a class="anchor" name="accounts-list"></a>
### List Accounts

The `Accounts` resource is a [Collection Resource](#collections) that represents all accounts associated with their parent. There are different resources that can list their associated accounts. Using the SDK, you can access:

 + [All accounts of an application](#application-accounts-list)
 + [All members of a group](#group-accounts)
 + [All accounts/members of a directory](#directory-accounts)

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
directory.getAccounts() | A search across accounts in the specified directory.
application.getAccounts() | A search across accounts that are users of the specified application.
group.getAccounts() | A search across accounts in the specified group.

<a class="anchor" name="accounts-workflow"></a>
### Work With Accounts

If you want to learn about other account functionalities, such as [verify an email address](#account-verify-email), [log in (authenticate) an account](#accounts-authenticate) and [reset an account password](#accounts-reset), read the instructions below.

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

For example, if you were to request the account object for a user who has not yet been verified, via the REST API, you will note that the account `status` is set to `UNVERIFIED` and `emailVerificationToken` will have an `href`:

    {
      href: "https://api.stormpath.com/v1/accounts/6XLbNaUsKm3E0kXMTTr10V"
      username: "testuser"
      email: "test@stormpath.com"
      fullName: "test user"
      givenName: "test"
      middleName: "test"
      surname: "user"
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

To verify the account, you use the token from the query string to form the above URL and call the `verifyEmailToken` on the Client class, or on the Client tenant instance:

**Example Request**

    Account account = tenant.verifyAccountEmail(verificationToken);

If the validation succeeds, you will receive back the `account` resource which has now been verified. An email confirming the verification will be automatically sent to the account's email address by Stormpath afterwards, and the account will then be able to authenticate successfully.

If the verification token is not found, a `404 Not Found` is returned with an [error payload](#error-handling) explaining why the attempt failed:

**Example Email Verification Failure Response**

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

For more information on working with applications and authentication, refer to the [Log in (Authenticate) an Account](#application-account-authc) section of this guide.

<a class="anchor" name="accounts-reset"></a>
### Reset An Account's Password

This is a self-service password reset workflow.  The account is sent an email with a secure link.  The person owning the account can click on the link and be shown a password reset form to reset their password.  This is strongly recommended to reduce support requests to your application team as well as to reduce your exposure to account passwords for added security.

The password reset workflow involves changes to an account at an application level, and as such, this workflow relies on the `application` resource as a starting point. For more information on working with this workflow via the Java SDK after they have already been configured, refer to the [Working With Applications](#application-password-reset) section of this guide.

This workflow is disabled by default for accounts, but you can enable it easily in the Stormpath Admin Console UI. Refer to the [Stormpath Admin Console product guide](https://stormpath.com/docs/console/product-guide#!ManageWorkflowAutomation) for complete instructions.

{% docs note %}
Workflows are only available on cloud directories and only configurable using the Stormpath Admin Console.  They are not currently configurable via the Java SDK. Also, the Stormpath Administrator directory's automated workflows cannot be altered.
{% enddocs %}

<a class="anchor" name="account-groups"></a>
### Account Groups

The account's `groups` resource is a [Collection Resource](#collections) which represents all groups where a specific account is a member.

**Resource URI**

    account.getGroups();

<a class="anchor" name="list-account-groups"></a>
#### List Account Groups

A request returns a Collection Resource containing links for all [groups](#groups) where a specific account is a member.

**Example Request**

    GroupList groups = account.getGroups();
    for(Group grp : groups) {
    	System.out.println(grp.getName());
    }

<a class="anchor" name="search-account-groups"></a>
#### Search Account Groups

You may search for directories by sending a request to your account's `groups` Collection Resource using [search query parameters](#search).  Any matching groups with your account will be returned as a [paginated](#pagination) list.

##### Searchable Group Attributes

The following [group attributes](#account-resource) are searchable via [attribute](#search-attribute) searches:

* `name`
* `description`
* `status`

In addition to the [search query parameters](#search), you may also use [pagination](#pagination) and [sorting](#sorting) query parameters to customize the paginated response.  For example:

    GroupCriteria criteria = Groups.where(Groups.name().eqIgnoreCase("foo"))
                .orderByName()
                .offsetBy(0)
                .limitTo(50);
    GroupList groups = account.getGroups(criteria);

    for(Group group : groups) {
    	System.out.println(group.getName());
    }


<a class="anchor" name="check-account-member-of-group"></a>
#### Check if an Account is Member of a Group

The account resource provides the `isMemberOfGroup` operation. This operation returns `true` if the account belongs to a group whose name or href is (case insensitive) equal to the specified `String` value. For example:

	String groupName = "Foo Group";
	account.isMemberOfGroup(groupName);
	

<a class="anchor" name="working-with-account-groups"></a>
#### Working With Account Groups

Group resources support the full suite of CRUD commands and other interactions. Please see the [Groups section](#groups) for more information.

<a class="anchor" name="account-group-memberships"></a>
### Account Group Memberships

An account's `groupMemberships` resource is a [Collection Resource](#collections) which represents all group memberships where a specific account is a member.

**Account Group Membership Collection Resource**

    account.getGroupMemberships();

<a class="anchor" name="list-account-group-memberships"></a>
#### List Account Group Memberships

A request returns a Collection Resource containing the group memberships to which a specific account is a member.

**Example Request**

	GroupMembershipList groupMemberships = account.getGroupMemberships();
    for(GroupMembership gms : groupMemberships) {
    	System.out.println(gms.getAccount().getGivenName());
        System.out.println(gms.getGroup().getName());
    }

<a class="anchor" name="working-with-account-group-memberships"></a>
#### Working With Account Group Memberships

Groups Membership resources support the full suite of CRUD commands and other interactions. Please see the [Group Memberships section](#group-memberships) for more information.

***
## Custom Data

`Account` and `Group` resources have predefined fields that are useful to many `Applications`, but you are likely to have your own custom data that you need to associate with an account or group as well.

For this reason, both the account and group resources support a linked `CustomData` resource that you can use for your own needs.

The `CustomData` resource is a schema-less JSON object (aka 'map', 'associative array', or 'dictionary') that allows you to specify whatever name/value pairs you wish.

The `CustomData` resource is always conected to an account or group and you can always reach it  by calling the `getCustomData()` method on the account or group resource instance:

<a class="anchor" name="account-custom-data-resource-uri"></a>
**Account Custom Data Resource URI**

	account.getCustomData().getHref()

<a class="anchor" name="group-custom-data-resource-uri"></a>
**Group Custom Data Resource URI**

    group.getCustomData().getHref()

In addition to your custom name/value pairs, a `CustomData` resource will always contain 3 reserved read-only fields:

- `href`: The fully qualified location of the custom data resource
- `createdAt`: the UTC timestamp with millisecond precision of when the resource was created in Stormpath as an [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) formatted string, for example `2017-04-01T14:35:16.235Z`
- `modifiedAt`: the UTC timestamp with millisecond precision of when the resource was last updated in Stormpath as an [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) formatted string.

You can store an unlimited number of additional name/value pairs in the `CustomData` resource, with the following restrictions:

* The total storage size of a single `CustomData` resource cannot exceed 10 MB (megabytes).  **The `href`, `createdAt` and `modifiedAt` field names and values do not count against your resource size quota.**
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

Whenever you create an account or a group, an empty `CustomData` resource is created for that account or group automatically - you do not need to explicitly execute a request to create it.

However, it is often useful to populate custom data at the same time you create an account or group. You can do this by embedding the `customData` directly in the account or group resource. For example:

**Example Create Account with Custom Data**

	Account account = client.instantiate(Account.class);
    account.setUsername("jlpicard");
    account.setEmail("capt@enterprise.com");
    account.setGivenName("Jean-Luc");
    account.setMiddleName("");
    account.setSurname("Picard");
    account.setPassword("uGhd%a8Kl!");
    account.setStatus(AccountStatus.ENABLED);
    CustomData customData = account.getCustomData();
    customData.put("rank", "Captain");
    customData.put("birthDate", "2305-07-13");
    customData.put("favoriteDrink", "favoriteDrink");
    directory.createAccount(account);

**Example Create Group with Custom Data**

	Group group = client.instantiate(Group.class);
    group.setName("Starfleet Officers");
    CustomData customData = group.getCustomData();
    customData.put("headquarters", "San Francisco, CA");
    directory.createGroup(group);

<a class="anchor" name="retrieve-custom-data"></a>
### Retrieve Custom Data

In order to retrieve an account' or group's custom data directly you can get the `CustomData` resource through the client instance providing the custom data href:

**Example: Retrieve an Account's Custom Data**

	Account account = client.getResource("https://api.stormpath.com/v1/accounts/someAccountId", Account.class);
	CustomData customData = client.getResource(account.getCustomData().getHref(), CustomData.class);

Another alternative using [link expansion](#link-expansion):

	AccountList accounts = application.getAccounts(
                Accounts.where(Accounts.email().eqIgnoreCase("some@email.com"))
                        .withCustomData()
	);	

**Example: Retrieve a Group with its Custom Data**

	Group group = client.getResource("https://api.stormpath.com/v1/groups/someGroupId", Group.class);
    CustomData customData = client.getResource(group.getCustomData().getHref(), CustomData.class);

Another alternative using [link expansion](#link-expansion):

	GroupList groups = application.getGroups(
                Groups.where(Groups.name().eqIgnoreCase("Group Name"))
                        .withCustomData()
	);

<a class="anchor" name="update-custom-data"></a>
### Update Custom Data

You may update an account' or group's custom data, in one of two ways:

* by [updating the customData resource directly](#update-custom-data-directly), independent of the group or account, or
* by [embedding customData changes in an account or group update request](#update-custom-data-embedded)

<a class="anchor" name="update-custom-data-directly"></a>
#### Update Custom Data Directly

The first way to update an account or group's custom data is by saving changes directly to the `CustomData` resource.  This allows you to interact with the customData resource directly, without having to do so 'through' an account or group request.

In the following example request, we're interacting with a `CustomData` resource directly, and we're changing the value of an existing field named `favoriteColor` and we're adding a brand new field named `hobby`:

**Example Account Custom Data Update**

	customData.put("favoriteColor", "red");
    customData.put("hobby", "Kendo");
    customData.save();

<a class="anchor" name="update-custom-data-embedded"></a>
#### Update Custom Data as part of an Account or Group Request

Sometimes it is helpful to update an account or group's `CustomData` as part of an update request for the account or group.  In this case, just submit customData changes in an embedded `CustomData` field embedded in the account or group request resource.  For example:

	account.setStatus(AccountStatus.ENABLED);
    CustomData customData = account.getCustomData();
    customData.put("aaa", "aaaNEW");
    customData.put("favoriteColor", "blue");
	customData.put("favoriteMovie", "Star Wars");
    account.save();

In the above example, we're performing 3 modifications in one request:

1. We're modifying the account's `status` attribute and setting it to `ENABLED`.  We're _also_
2. Changing the existing customData `favoriteColor` field value to `blue` (it was previously `red`) and
3. Adding a new customData field `favoriteMovie` with a value of `Star Wars`.

This request modifies both the account resource _and_ that account's custom data in a single request.

The same simultaneous update behavior may be performed for Group updates as well.

<a class="anchor" name="delete-custom-data"></a>
### Delete Custom Data

You may delete all of an account or group's custom data by invoking the `delete()` method to the account or group's `CustomData`:

**Example: Delete all of an Account's Custom Data**

	account.getCustomData().delete();

**Example: Delete all of a Group's Custom Data**

    group.getCustomData().delete();

This will delete all of the respective account or group's custom data fields, but it leaves the `CustomData` placeholder in the account or group resource.  You cannot delete the `CustomData` resource entirely - it will be automatically permanently deleted when the account or group is deleted.

<a class="anchor" name="delete-account-custom-data-field"></a>
### Delete Custom Data Field

You may also delete an individual custom data field entirely by calling the `remove()` method on the account or group's CustomData while stating the custom data field as a parameter and then saving it.

**Account or Group Custom Data Field Deletion**

	customData.remove("favoriteColor");
    customData.save();

This request would remove the `favoriteColor` field entirely from the customData resource.  The next time the resource is [retrieved](#retrieve-custom-data), the field will be missing entirely.

***

<a class="anchor" name="integration-google"></a>
## Integrating with Google

Stormpath supports accessing accounts from a number of different locations including Google.  Google uses OAuth 2.0 protocol for authentication / authorization and Stormpath can leverage their authorization codea (or access tokens) to return an `Account` for a given code. 

The steps to enable this functionality into your application include:

+ [Create a Google Directory](#creating-a-google-directory)
+ Create an `Account Store Mapping` between a Google Directory and your `Application`
+ [Accessing Accounts with Google Authorization Codes or Access Tokens](#accessing-accounts-with-google-authorization-codes-or-access-tokens)

Google Directories follow behavior similar to [mirror directories](#directory-mirror), but have a `Provider` resource that contains information regarding the Google application that the directory is configured for.

### Google Provider Resource

A `GoogleProvider` resource holds specific information needed for working with a Google Directory.  It is important to understand the format of the provider resource when creating and updating a Google Directory.

A provider resource can be obtained by accessing the directory's provider as follows:

Example Request

    GoogleProvider provider = client.getResource("https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q/provider", GoogleProvider.class);
        
or, by means of the directory Resource:

    GoogleProvider provider = (GoogleProvider) directory.getProvider();

**Resource Attributes**

Attribute | Description | Type | Valid Value
:----- | :----- | :---- | :----
`clientId` | The App ID for your Google application | String | --
`clientSecret` | The App Secret for your Google application | String | --
`redirectUri` | The redirection Uri for your Google application | String | -- 
`providerId` | The provider ID is the Stormpath ID for the Directory's account provider | String | 'google'

In addition to your application specific attributes, a `Provider` resource will always contain 3 reserved read-only fields:

+ `href` : The fully qualified location of the custom data resource
+ `createdAt` : the UTC timestamp with millisecond precision of when the resource was created in Stormpath as an [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) formatted string
+ `modifiedAt` : the UTC timestamp with millisecond precision of when the resource was created in Stormpath as an [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) formatted string

### Creating a Google Directory

Creating a Google Directory requires that you gather some information beforehand from Google's Developer Console regarding your application.  

+ Client ID
+ Client Secret
+ Redirect URI

Creating a Google Directory is very similar to [creating a directory](#create-a-directory) within Stormpath.  For a Google Directory to be configured correctly, you must specify the correct `Provider` information.

**Example Request**

    Directory directory = client.instantiate(Directory.class);
    directory.setName("my-google-directory");
    directory.setDescription("A Google directory");

    CreateDirectoryRequest request = Directories.newCreateRequestFor(directory).
                forProvider(Providers.GOOGLE.builder()
                        .setClientId("857385-m8vk0fn2r7jmjo.apps.googleusercontent.com")
                        .setClientSecret("ehs7_-bA7OWQSQ4")
                        .setRedirectUri("https://myapplication.com/authenticate")
                        .build()
                ).build();
    
    Tenant tenant = client.getCurrentTenant();
    directory = tenant.createDirectory(request);


After the Google Directory has been created, it needs to be [mapped with an application as an account store](#application-account-store-mappings). The Google Directory cannot be a default account store or a default group store.  Once the directory is mapped as an account store for an application, you are ready to access `Accounts` with Google Authorization Codes.

### Accessing Accounts with Google Authorization Codes or Access Tokens

To access or create an account in an already created Google Directory, it is required to gather a Google Authorization Code on behalf of the user.  This requires leveraging Google's OAuth 2.0 protocol and the user's consent for your application's permissions.

Once the Authorization Code is gathered, you can get or create the `Account` by means of the `Application` and specifying its `ProviderData`. The following example shows how you use `ProviderData` to get an `Account` for a given authorization code:

**Example Request**

    String applicationHref = "https://api.stormpath.com/v1/applications/24mp4us71ntza6lBwlu";
    Application application = client.getResource(applicationHref, Application.class);
    ProviderAccountRequest request = Providers.GOOGLE.account()
                .setCode("4/a3p_fn0sMDQlyFVTYwfl5GAj0Obd.oiruVLbQZSwU3oEBd8DOtNApQzTCiwI")
                .build();

    ProviderAccountResult result = application.getAccount(request);
    Account account = result.getAccount();

{% docs note %}
In order to know if the account was created or if it already existed in the Stormpath's Google Directory you can do: `result.isNewAccount();`. It will return `true` if it is a newly created account; `false` otherwise.
{% enddocs %}

Once an `Account` is retreived, Stormpath maps common fields for the Google User to the  Account.  The access token and the refresh token for any additional calls in the `GoogleProviderData` resource and can be retrieved by:

    GoogleProviderData providerData = (GoogleProviderData) account.getProviderData();
    
The returned `GoogleProviderData` includes:

    providerData.getAccessToken(); //-> y29.1.AADN_Xo2hxQflWwsgCSK-WjSw1mNfZiv4
    providerData.getCreatedAt(); //-> 2014-04-01T17:00:09.154Z 
    providerData.getHref(); //-> https://api.stormpath.com/v1/accounts/ciYmtETytH0tbHRBas1D5/providerData 
    providerData.getModifiedAt(); //-> 2014-04-01T17:00:09.189Z 
    providerData.getProviderId(); //-> google 
    providerData.getRefreshToken(); //-> 1/qQTS638g3ArE4U02FoiXL1yIh-OiPmhc

{% docs note %}
The `accessToken` can also be passed as a field for the `ProviderData` to access the account once it is retrieved:
    
    ProviderAccountRequest request = Providers.GOOGLE.account()
                .setAccessToken("y29.1.AADN_Xo2hxQflWwsgCSK-WjSw1mNfZiv4")
                .build();

    ProviderAccountResult result = application.getAccount(request);
    Account account = result.getAccount();
    
    
{% enddocs %}

{% docs note %}
The `refreshToken` will only be present if your application asked for offline access.  Review Google's documentation for more information regarding OAuth offline access.
{% enddocs %}

***

<a class="anchor" name="integration-facebook"></a>
## Integrating with Facebook

Stormpath supports accessing accounts from a number of different locations including Facebook.  Facebook uses OAuth 2.0 protocol for authentication / authorization and Stormpath can leverage their or access tokens to return an `Account` for a given code. 

The steps to enable this functionality into your application include:

+ [Create a Facebook Directory](#creating-a-facebook-directory)
+ Create an `Account Store Mapping` between a Facebook Directory and your `Application`
+ [Accessing Accounts with Facebook User Access Tokens](#accessing-accounts-with-facebook-user-access-tokens)

Facebook Directories follow behavior similar to [mirror directories](#directory-mirror), but have a `Provider` resource that contains information regarding the Facebook application that the directory is configured for.

### Facebook Provider Resource

A `FacebookProvider` resource holds specific information needed for working with a Facebook Directory.  It is important to understand the format of the provider resource when creating and updating a Facebook Directory.

A provider resource can be obtained by accessing the directory's provider as follows:

Example Request

    FacebookProvider provider = client.getResource("https://api.stormpath.com/v1/directories/bckhcGMXQDujIXpbCDRb2Q/provider", FacebookProvider.class);
        
or, by means of the directory Resource:

    FacebookProvider provider = (FacebookProvider) directory.getProvider();

**Resource Attributes**

Attribute | Description | Type | Valid Value
:----- | :----- | :---- | :----
`clientId` | The App ID for your Facebook application | String | --
`clientSecret` | The App Secret for your Facebook application | String | -- 
`providerId` | The provider ID is the Stormpath ID for the Directory's account provider | String | 'facebook'

In addition to your application specific attributes, a `Provider` resource will always contain 3 reserved read-only fields:

+ `href` : The fully qualified location of the custom data resource
+ `createdAt` : the UTC timestamp with millisecond precision of when the resource was created in Stormpath as an [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) formatted string
+ `modifiedAt` : the UTC timestamp with millisecond precision of when the resource was created in Stormpath as an [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) formatted string

### Creating a Facebook Directory

Creating a Facebook Directory requires that you gather some information beforehand from Facebook's Developer Console regarding your application.  

+ Client ID
+ Client Secret

Creating a Facebook Directory is very similar to [creating a directory](#create-a-directory) within Stormpath.  For a Facebook Directory to be configured correctly, you must specify the correct `Provider` information. 

**Example Request**

    Directory directory = client.instantiate(Directory.class);
    directory.setName("my-facebook-directory");
    directory.setDescription("A Facebook directory");

    CreateDirectoryRequest request = Directories.newCreateRequestFor(directory).
                forProvider(Providers.FACEBOOK.builder()
                        .setClientId("857385m8vk0fn2r7jmjo")
                        .setClientSecret("ehs7bA7OWQSQ4")
                        .build()
                ).build();

    Tenant tenant = client.getCurrentTenant();
    directory = tenant.createDirectory(request);


After the Facebook Directory has been created, it needs to be [mapped with an application as an account store](#application-account-store-mappings). The Facebook Directory cannot be a default account store or a default group store.  Once the directory is mapped to an account store for an application, you are ready to access `Accounts` with Facebook User Access Tokens.

### Accessing Accounts with Facebook User Access Tokens

To access or create an account in an already created Facebook Directory, it is required to gather the `User Access Token` on behalf of the user. This usually requires leveraging Facebook's javascript library and the user's consent for your application's permissions.

{% docs note %}
It is required that your Facebook application request for the `email` permission from Facebook. If the access token does not grant `email` permissions, you will not be able to get an `Account` with an access token.
{% enddocs %}

Once the Authorization Code is gathered, you can get or create the `Account` by means of the `Application` and specifying its `ProviderData`. The following example shows how you use `ProviderData` to get an `Account` for a given authorization code:


**Example Request**

    String applicationHref = "https://api.stormpath.com/v1/applications/24mp4us71ntza6lBwlu";
    Application application = client.getResource(applicationHref, Application.class);
    ProviderAccountRequest request = Providers.FACEBOOK.account()
                .setAccessToken("CABTmZxAZBxBADbr1l7ZCwHpjivBt9T0GZBqjQdTmgyO0OkUq37HYaBi4F23f49f5")
                .build();

    ProviderAccountResult result = application.getAccount(request);
    Account account = result.getAccount();


{% docs note %}
In order to know if the account was created or if it already existed in the Stormpath's Facebook Directory you can do: `result.isNewAccount();`. It will return `true` if it is a newly created account; `false` otherwise.
{% enddocs %}

Once an `Account` is retreived, Stormpath maps common fields for the Facebook User to the  Account.  The access token for any additional calls in the `FacebookProviderData` resource and can be retrieved by:

    FacebookProviderData providerData = (FacebookProviderData) account.getProviderData();

The returned `FacebookProviderData` will include:

    providerData.getAccessToken(); //-> CABTmZxAZBxBADbr1l7ZCwHpjivBt9T0GZBqjQdTmgyO0OkUq37HYaBi4F23f49f5
    providerData.getCreatedAt(); //-> 2014-04-01T17:00:09.154Z
    providerData.getHref(); //-> https://api.stormpath.com/v1/accounts/ciYmtETytH0tbHRBas1D5/providerData
    providerData.getModifiedAt(); //-> 2014-04-01T17:00:09.189Z
    providerData.getProviderId(); //-> facebook

***

## Java Sample Code 

### Spring MVC Sample App 

This <a href="https://github.com/stormpath/stormpath-spring-samples" title="pring MVC Sample">application</a> is a Spring MVC-based Twitter clone that helps demonstrate the core functionality of Stormpath. The sample application shows Stormpath-based login, user registration, email verification, password reset, group assignments, <a href="#RBAC" title="RBAC">RBAC</a> checks, and user profile updates.

####Readme: 

**stormpath-spring-samples**: Stormpath example applications based on the Spring Framework.

**tooter** is a sample application that emulates some of the features of <a href="http://twitter.com" title="Twitter">Twitter</a> with the purpose of showing developers how to use the Stormpath Java SDK.

This project requires Maven and access to the Maven Central repository.

Get started:

	$ git clone https://github.com/stormpath/stormpath-spring-samples.git
	$ cd stormpath-spring-samples
	$ mvn install


Deploy the .war file to your web container/application server and launch/access it according to the container configuration.

A detailed documentation on tooter and how to integrate with the Stormpath Java SDK can be found on the wiki <a href="https://github.com/stormpath/stormpath-spring-samples/wiki/Tooter" title="tooter">https://github.com/stormpath/stormpath-spring-samples/wiki/Tooter</a>.

### Apache Shiro Sample Web App 

This is a <a href="https://github.com/stormpath/stormpath-shiro-web-sample" title="shiro web sample">simple web application</a> secured by the Apache Shiro security framework and Stormpath. The example is based of the standard Apache Shiro web sample application and it shows login and <a href="#RBAC" title="RBAC">RBAC</a> using an authorization cache.

### Spring Security Sample Web App 

This is a <a href="https://github.com/stormpath/stormpath-spring-security-example" title="spring security web sample">simple web application</a> secured by the Spring Security framework and Stormpath. It demostrates how to achieve Stormpath and Spring Security integration by means of the <a href="https://github.com/stormpath/stormpath-spring-security">stormpath-spring-security</a> plugin

***

<a class="anchor" name="administration"></a>
## Administering Stormpath

For more information about administering Stormpath using the Admin Console, please refer to the [Admin Console Product Guide](http://stormpath.com/docs/console/product-guide).

***

## Appendix 
### How to get the Java SDK jar files if you are not using a Maven-compatible build tool 

If you are not using a Maven-compatible build tool (such as Maven, Ant+Ivy, Gradle or SBT) to acquire your project dependencies, then you will need to manually download the Stormpath Java SDK jars and its runtime dependencies.

All Stormpath open source SDKs and other Java packages, such as the Shiro Stormpath plugin, are available in Maven central:

[http://search.maven.org/#search%7Cga%7C1%7Ccom.stormpath](http://search.maven.org/#search%7Cga%7C1%7Ccom.stormpath)

You can download any of our jars directly from there.

The problem with a direct download is that you do not automatically get any transitive dependencies required to use the jar. This list can sometimes be long, and it might change enough from release to release such that Stormpath does not manually maintain a list of them separate from our build configuration.

As such, if you are unable to use a Maven-compatible build tool, such as Ant+Ivy, Gradle, or SBT, in your project, you must download the Stormpath jars you require from Maven Central using the [link](http://search.maven.org/#search%7Cga%7C1%7Ccom.stormpath).

* This will get you the jar files you need to compile your project.

However, for transitive dependencies that must be in the classpath at runtime, the fastest thing to do is probably the following:

1. Check out the project from GitHub:

		$ git clone https://github.com/stormpath/stormpath-sdk-java.git

2. Build the project:

		$ mvn clean install

3. Download all runtime dependencies:

		$ mvn dependency:copy-dependencies -DincludeScope=runtime

4. Enter the target/dependency directory of the module you will be using.<br>For example, with the Stormpath Java SDK, the default option is an Apache HTTP-client-based runtime:

		$ cd extensions/httpclient/target/dependency

Here you will find a list of all the runtime dependencies necessary for the module.

Note that Stormpath and Shiro use the SLF4J logging API instead of commons-logging. Commons-logging is however in the runtime dependency list because HTTPClient needs it. Because of this conflict, you will probably want to excludecommons-logging.jar and include jcl-over-slf4j.jar (downloaded from maven central) instead, which is compatible with SLF4J logging and satisfies the needs of HTTPClient.

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

***
