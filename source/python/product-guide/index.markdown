---
layout: doc
lang: python
title: Stormpath Python Product Guide
---

Stormpath provides developers with a simple yet powerful REST+JSON API that enables user management control for organizations and applications.

For help to quickly get started with Stormpath, refer to the [Python Quickstart Guide](http://www.stormpath.com/docs/python/quickstart).

***

## What is Stormpath?

Stormpath is the first easy, secure user management and authentication service for developers.

Fast and intuitive to use, Stormpath enables plug-and-play security and accelerates application development on any platform.

Built for developers, it offers an easy API, open source SDKs, and an active community. The flexible cloud service can manage millions of users with a scalable pricing model that is ideal for projects of any size.

By offloading user management and authentication to Stormpath, developers can bring new applications to market faster, reduce development and operations costs, and protect their users with best-in-class security.

### Architectural Overview

<img src="http://www.stormpath.com/sites/default/files/docs/Architecture.png" alt="High-level Architecture" title="High-level Architecture" width="700" height="430">

### Stormpath Admin Console

The Stormpath Admin Console allows authorized administrators to:

* Configure applications to access Stormpath
* Create and manage accounts and adjust group membership
* Create and manage directories and the associated groups
* Map directories and groups to allow accounts to log in to integrated applications
* Configure workflow or account administration automation

To access the Stormpath Admin Console, visit [https://api.stormpath.com/login](https://api.stormpath.com/login).

### REST API

The Stormpath API offers authorized developers and administrators programmatic access to:

* Securely authenticate accounts
* Create and manage accounts and adjust group membership
* Manage directories
* Manage groups
* Initiate and process account automations

For more detailed documentation on the Stormpath API, visit the [API Reference Documentation](http://www.stormpath.com/docs/rest/api/).


### Python SDK

The Stormpath Python SDK allows any Python-based application to easily use the Stormpath user management service for all authentication and access control needs.

The Python SDK can be found on [Github](https://github.com/stormpath/stormpath-sdk-python).

When you make SDK method calls, the calls are translated into HTTPS requests to the Stormpath REST+JSON API. The Stormpath Python SDK therefore provides a clean object-oriented paradigm natural to Python developers and alleviates the need to know how to make REST+JSON requests.

This SDK is compatible with the 2.7 and 3.2 and later versions of Python.

Stormpath also offers guides and SDKs for [Ruby](www.stormpath.com/docs/ruby/product-guide),  [Java](www.stormpath.com/docs/java/product-guide), and [PHP](www.stormpath.com/docs/php/product-guide).

If you are using a language that does not yet have an SDK, you can use the REST API directly and refer to the [REST API Product Guide](www.stormpath.com/docs/rest/product-guide).

***

## SDK Concepts

Throughout this guide, code examples appear using the Stormpath Python SDK.

Although knowing how the SDK is designed and how it works is not required to use it, knowing some of the design details will help you use it more efficiently and effectively.

### Client

The root entry point for SDK functionality is the `Client` instance. Using the client instance, you can access all tenant data, such as applications, directories, groups, and accounts.

#### Preferred Configuration

There are different ways to create a client instance to interact with your resources. The preferred mechanism is by reading a secure `apiKey.properties` file, where the Client implementation is being used:

	from stormpath.client import Client

	api_key_file = '/home/myhomedir/.stormpath/apiKey.properties'
	client = Client(api_key_file_location=api_key_file)

This is heavily recommended if you have access to the file system.

#### API Key Configuration

The [Python Quickstart Guide](http://www.stormpath.com/docs/python/quickstart) assumes you have easy access to an `apiKey.properties` file. Some applications however might not have access to the file system (such as Heroku) applications. In these cases, you can also create a client instance by directly providing the API key and, where often they are available as environment variables, such as `$_ENV`.

{% docs warning %}
Do not use this technique if you have access to a file system. Depending on the environment, environment variables are less secure than reading a permission-restricted file like `apiKey.properties`.
{% enddocs %}

For example:

	client = Client(api_key={'id': 'apiKeyId', 'secret': 'apiKeySecret'})

{% docs note %}
DO NOT specify your actual `apiKey.id` and `apiKey.secret` values in source code! They are secure values associated with a specific person. You should never expose these values to other people, not even other co-workers.
{% enddocs %}

Only use this technique if the values are obtained at runtime using a configuration mechanism that is not hard-coded into source code or easily-visible configuration files.


### High-level Overview

The Stormpath SDK and the associated components reside and execute within your application at runtime. When making method calls on the SDK objects - particularly objects that represent REST data resources such as applications and accounts - the method call automatically triggers an HTTPS request to the Stormpath API server if necessary.

The HTTPS request allows you to program your application code to use regular Python objects and alleviates you from worrying about the lower-level HTTP REST+JSON details and individual REST resource HTTP endpoints.

Here is how the communication works:<br>
<img src="http://www.stormpath.com/sites/default/files/docs/SDKCommunicationFlow.png" alt="SDK Communication Flow" title="SDK Communication Flow" width="700">

In this example scenario, we have an existing SDK `account` resource instance, and we want its `directory`.

The request is broken down as follows:

1. The application attempts to acquire the account directory instance.
2. If the directory resource is not already cached, the SDK creates a request to send to the Stormpath API server.
3. An HTTPS GET request is executed.
4. The Stormpath API server authenticates the request caller and looks up the directory resource.
5. The Stormpath API server responds with the JSON representation of the directory resource.
6. The Stormpath SDK transforms the JSON response into a directory object instance.
7. The directory instance is returned to the application.

### Detailed Design

The Stormpath SDK is designed with two primary design principles:

* **Composition**<br>
Although most SDK end users never need to customize the implementation behavior of an SDK, the SDK is pluggable meaning that the functionality can be customized by plugging in new implementations of relevant components. The SDK leans toward the [programming to interfaces](http://en.wikipedia.org/wiki/Software_interface#Software_interfaces) and principles of [object composition](http://en.wikipedia.org/wiki/Object_composition) to support pluggability. Even if SDK end users never leverage this design, the design helps the Stormpath development team provide support and bug fixes without disrupting existing SDK usages.

* **Proxying**<br>
Python instances representing REST resources use the [Proxy software design pattern](http://en.wikipedia.org/wiki/Proxy_pattern) to intercept property access allowing the SDK implementation to automatically load the resource data or other referenced resources if necessary.

#### Architectural Components

The core component concepts of the SDK are as follows:<br>
<img src="http://www.stormpath.com/sites/default/files/docs/ComponentArchitecture.png" alt="Stormpath SDK Component Architecture" title="Stormpath SDK Component Architecture" width="670">

* **Client** is the root entry point for SDK functionality and accessing other SDK components, such as the `ResourceList`. A client is constructed with a Stormpath API key which is required to communicate with the Stormpath API server.
  * **DataStore** is central to the Stormpath SDK. It is responsible for managing all Python `resource` objects that represent Stormpath REST data resources such as applications, directories, and accounts. The DataStore is also responsible for translating calls made on Ruby resource objects into REST requests to the Stormpath API server as necessary and managing chaching mechanisms. It works between your application and the Stormpath API server.
    * **RequestExecutor** is an internal infrastructure component used by the `DataStore` to execute HTTP requests (`GET`, `PUT`, `POST`, `DELETE`) as necessary. When the DataStore needs to send a Python `Resource` instance state to or query the server for resources, it delegates to the RequestExecutor to perform the actual HTTP requests. The Stormpath SDK default `RequestExecutor` implementation is `HttpExecutor` which uses the [Requests](http://docs.python-requests.org/) library to execute the raw requests and read the raw responses.

### Resources and Proxying

When applications interact with a Stormpath SDK `resource` instance, they are really interacting with an intelligent data-aware proxy, not a simple object with some properties. Specifically, the `resource` instance is a proxy to the SDK `Client` allowing resource instances to load data that might not yet be available.

For example, using the SDK Communication Flow diagram in the [high-level overview](#HighLevelOverview) section, assuming you have a reference to an `account` object - perhaps you have queried for it or you already have the account `href` and you want to load the `account` resource from the server:

	account_href = 'https://api.stormpath.com/v1/accounts/ACCOUNT_UID_HERE'
	account = client.accounts.get(account_href)

This retrieves the account at the specified `href` location using an HTTP `GET` request.

If you also want information about the `directory` owning that account, every account has a reference to the parent directory location in the JSON representation. For example:

	{
	  "givenName": "John",
	  "surname": "Smith",
	  ...
	  "directory": {
	      "href": "https://api.stormpath.com/v1/directories/someDirectoryIdHere"
	  }
	  ...
	}

An impractical way to retrieve a directory of the account is to somehow get the `href` of the directory and then manually send a request to Stormpath:

    directory_href = 'https://api.stormpath.com/v1/directories/DIR_UID_HERE'
    directory = client.directories.get(directory_href)

This technique is cumbersome, verbose, and requires a lot of boilerplate code in your project. As such, SDK resources **automatically** execute the lookups for unloaded references for you using simple property navigation! Notice the JSON `directory` property is only a link (pointer) to the directory; it does not contain any of the directory properties. The JSON shows we should be able to reference the `directory` property through the `account`:

The previous lookup becomes:

	directory = account.directory

If the directory already exists in cache because the SDK has previousy loaded it, the directory is immediately returned. However, if the directory is not present, the directory `href` is used to return the directory properties (the immediate data loaded) automatically for you. Thus, the `href` property is always available without querying the service. This technique is known as *lazy loading* which allows you to traverse entire object graphs automatically without requiring constant knowledge of `href` URLs.

### Error Handling

Errors thrown from the server are translated to an [Error](https://github.com/stormpath/stormpath-sdk-python/blob/master/stormpath/error.py). This applies to all requests to the Stormpath API endpoints.

For example, when getting the current tenant from the client you can catch any error that the request might produce as following:

	from stormpath.resource import Error

	try:
        account = client.accounts.get(NONEXISTENT_STORMPATH_ACCOUNT)
        account.username
	except Error as re:
	    print('Message: ' + re.message)
	    print('HTTP Status: ' + str(re.status))
	    print('Developer Message: ' + re.developer_message)
	    print('More Information: ' + re.more_info)
	    print('Error Code: ' + str(re.code))

***

### Caching

The caching mechanism enables us to store the state of an already accessed resource in a cache store. If we accessed the resource again and the data inside the cache hasn't yet expired, we would get the resource directly from the cache store. By doing so, we can reduce network traffic and still have access to some of the resources even if there is a connectivity problem with Stormpath. Be aware, however, that when using a persistent cache store like Redis, if the data changes quickly on Stormpath and the TTL and TTI are set to a large value, you may get resources with attributes that don't reflect the real state. If this edge case won't affect your data consistency, you can use the caching mechanism by providing an additional parameter when creating the Client instance parameter:

    from stormpath.cache.redis_store import RedisStore
    from stormpath.cache.memory_store import MemoryStore

    cache_opts = {'store': MemoryStore,
                '   regions': {
                    'applications': {
                        'store': RedisStore,
                        'ttl': 300,
                        'tti': 300,
                        'store_opts': {
                            'host': 'localhost',
                            'port': 6739}}
                    'directories': {
                        'store': MemoryStore,
                        'ttl': 60}}
                  }

    client = Client(api_key={'id': 'apiKeyId', 'secret': 'apiKeySecret'},
        cache_options=cache_opts)


The cache options dictionary can have a complex structure if we want to fine-tune the cache by using all the available options:

1. The `store` option - The class that functions as the data cache. By default, if no cache options are set, the `MemoryStore` is used, which means we don't actually use a real cache, just the local object attributes. E.g. if an attribute of a resource is accessed the first time, the attribute value is fetched from Stormpath and saved as the object attribute. If we read the attribute again, Stormpath wouldn't be queried. Note that `MemoryStore` is overly complex to explicitly demonstrate the caching architecture. However, `RedisStore` is a full-fledged cache. We can write additional cache implementations by providing the caching interface methods to get, put, delete, clear the cache and query about cache size without changing the whole SDK. Please check the existing cache implementations for info on how to do that.

2. The `regions` option - each resource 'region' can have a separate cache implementation. E.g. `Application` resources are stored in Redis but `Directory` resources use `MemoryStore`. These kind of resource groups are called `regions`, each with its own options:

  1. `store` - The cache store, if none is set for this region, the global stores set at the root of the cache options is used.
  2. `ttl` - Time To Live. The amount of time (in seconds) after which the stored resource data will be considered expired.
  3. `tti` - Time To Interact. If this amount of time has passed after the resource was last accessed, it will be considered expired.
  4. `store_opts` - The store-specific options, if any. E.g. `RedisStore` requires a host and a port to be set because we need that information when accessing Redis, while `MemoryStore` requires no further options.

***

## Applications

An [application](#applications) in Stormpath represents a real world application that can communicate with and be provisioned by Stormpath.

When defining an application in Stormpath, it is typically associated with one or more directories or groups. The associated directories and groups form the application *user base*. The accounts within the associated directories and groups are considered the application users and can login to the application.

For applications, the basic details include:

Attribute | Description
:----- | :-----
Name | The name used to identify the application within Stormpath. This value must be unique.
Description | A short description of the application.
Status | By default, this value is set to `Enabled`. Change the value to `Disabled` if you want to prevent accounts from logging in to the application.

{% docs tip %}
Using the URL for your application as the application description within Stormpath is often helpful.
{% enddocs %}

You can control access to your Stormpath Admin Console and API by managing the [account stores](#manage-application-account-stores) for the listed Stormpath application.

For applications, you can:

* [Locate the application REST URL](#locate-the-application-rest-url)
* [List applications](#list-applications)
* [Retrieve an application](#retrieve-an-application)
* [Register an application](#register-an-application)
* [Edit the details of an application](#edit-an-application)
* [Enable an application](#enable-an-application)
* [Disable an application](#disable-an-application)
* [Delete an application](#delete-an-application)
* [Manage application account stores](#manage-application-account-stores)
	* [Change default account and group locations](#change-default-account-and-group-locations)
	* [Add another account store](#add-another-account-store)
	* [Change account store priority order](#change-account-store-priority-order)
  * [List account stores](#list-account-stores)
	* [Remove account store](#remove-account-store)

### Locate the Application REST URL

When communicating with the Stormpath REST API, you might need to reference an application using the REST URL or `href`. For example, you require the REST URL to delete applications or to obtain a listing of accounts mapped to an application.

To obtain an application REST URL:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. In the Applications table, click the application name.<br>
The REST URL appears on the Details tab.<br><img src="http://www.stormpath.com/sites/default/files/docs/AppResturl.png" alt="Application Resturl" title="Application Resturl">


### List Applications

To retrieve a list of applications, you must do the following get the Tenant applications from the client.

**Code:**

	applications = client.applications

	for app in applications:
		print('Application ' + app.name)
		print('Application Description ' + app.description)
		print('Application Status ' + app.status)

### Retrieve an Application

You will typically retrieve an `Application` referenced from another resource, for example using the `application` property of the `Account` resource.

You can also directly retrieve a specific application using the `href` (REST URL) value. For any application, you can [find the application href](#locate-the-application-rest-url) in the Stormpath console.

After you have the `href` it can be loaded directly as an object instance by retrieving it from the server, using the `client`:

	application_href = 'https://api.stormpath.com/v1/applications/APP_UID_HERE'
	application = client.applications.get(application_href)

### Register an Application

To authenticate a user account in your [application](#applications), you must first register the application with Stormpath.

To register an application you must create it from the client instance:

	application = client.applications.create({
      "name": 'This Is My Python App',
      "description": 'This is my python app description'
    })

You can also register an application, create a directory and link the application with the directory in one step:

	application = client.applications.create({
      "name": 'This Is My Python App',
      "description": 'This is my python app description'
    }, create_directory="Directory")

If `True` is used instead of a string that represents the directory name, a generic directory name is derived from the name of the newly created application.
This is useful if you don't want to be bothered with organizing your directories and prefer to start using the application functionality as soon as possible.


### Edit an Application

To edit applications, use the attributes of an existing application instance to set the values and call the `save` method:

	application.status = "DISABLED"
	application.description = 'New Application Description'

	application.save()

### Enable an Application

Enabling a previously disabled application allows any enabled directories, groups, and accounts associated with the application account stores in Stormpath to log in.

To enable an application, you must set the 'ENABLED' status to the application instance and call the 'save' method on it:

    application.status = "ENABLED"

    application.save()

### Disable an Application

Disabling an application prevents the application from logging in any accounts in Stormpath, but retains all application configurations. If you must temporarily turn off logins, disable an application.

**Note:** The Stormpath application cannot be disabled.

To disable an application, you must set the 'DISABLED' status to the application instance and call the 'save' method on it:

    application.status = "DISABLED"

    application.save()

### Delete an Application

Deleting an application completely erases the application and its configurations from Stormpath. We recommend that you disable an application rather than delete it, if you anticipate that you might use the application again.

**Notes:**

* The Stormpath application cannot be deleted.
* Deleted applications cannot be restored.

To delete an application, you must call the 'delete' method on the application instance.

    application.delete()

### Manage Application Account Stores

_Account Store_ is a generic term for either a Directory or a Group. Directories and Groups both contain, or 'store' accounts, so they are both considered account stores.

In Stormpath, you control who may login to an application by associating (or 'mapping') one or more account stores to an application. All of the accounts in the application's assigned account stores form the application's effective user base; those accounts may login to the application. If no account stores are assigned to an application, no accounts will be able to login to the application.

#### How Login Attempts Work

When an account tries to login to an application, the application's assigned account stores are consulted _in the order that they are assigned to the application.  When a matching account is discovered in a mapped account store, it is used to verify the authentication attempt and all subsequent account stores are ignored.  In other words, accounts are matched for application login based on a 'first match wins' policy.

Let's look at an example to illustrate this behavior.  Assume an application named Foo has been assigned (mapped) to two account stores, a 'Customers' directory and an 'Employees' directory, in that order.

<img src="http://www.stormpath.com/sites/default/files/docs/LoginAttemptFlow.png" alt="Login Sources Diagram" title="Account Stores Diagram" width="650" height="500">

As you can see, Stormpath tries to find the account in the 'Customers' directory first because it has a higher _priority_ than the 'Employees' directory.  If not found, the 'Employees' directory is tried next as it has a lower priority.

You can assign multiple account stores to an application, but only one is required to enable login for an application.  Assigning multiple account stores (directories or groups) to an application, as well as configuring their priority, allows you precise control over the account populations that may login to your various applications.

**Resource Attributes**

| Attribute | Description | Type | Valid Value |
| :----- | :----- | :---- | :---- |
| `href` | The account store mapping resource's fully qualified location URI. | String | <span>--</span> |
| `application` | A reference to the mapping's Application. Required. | object | <span>--</span> |
| `account_store` | A reference to the mapping's account store (either a Group or Directory) containing accounts that may login to the `application`.  Required. | object | <span>--</span> |
| `list_index` | The order (priority) when the associated `accountStore` will be consulted by the `application` during an authentication attempt.  This is a zero-based index; an account store at `list_index` of `0` will be consulted first (has the highest priority), followed the account store at `list_index` `1` (next highest priority), etc.  Setting a negative value will default the value to `0`, placing it first in the list.  A `list_index` of larger than the current list size will place the mapping at the end of the list and then default the value to `(list size - 1)`. | Integer | 0 <= N < list size |
| `is_default_account_store` | A `True` value indicates that new accounts created by the `application` will be automatically saved to the mapping's `accountStore`. A `False` value indicates that new accounts created by the application will not be saved to the `accountStore`. | boolean | `True`,`False` |
| `is_default_group_store` | A `True` value indicates that new groups created by the `application` will be automatically saved to the mapping's `accountStore`. A `False` value indicates that new groups created by the application will not be saved to the `accountStore`. **This may only be set to `True` if the `accountStore` is a Directory.  Stormpath does not currently support Groups storing other Groups.** | boolean | `True`,`False` |

For account store mappings, you may:

* [Assign an account store](#add-another-account-store) to an application
* [Set the default account store](#change-default-account-store) for new accounts created by an application
* [Set the default group store](#change-default-account-and-group-locations) for new groups created by an application
* [Change the account store priority](#change-account-store-priority-order) of an assigned account store
* [List an application's assigned account stores](#list-account-stores)
* [Remove an assigned account store](#remove-account-store) from an application

To manage application account stores, you must log in to the Stormpath Admin Console:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name.
4. Click the **Login Sources** tab.<br>

The account stores appear in order of priority.<br>
  <img src="http://www.stormpath.com/sites/default/files/docs/LoginSources.png" alt="Login Sources" title="Login Sources" width="650" height="170">

**Code:**

  mapping_href = 'https://api.stormpath.com/v1/accountStoreMappings/MAPPING_UID_HERE'
  account_store_mapping = client.account_store_mappings.get(mapping_href)

<a name="add-another-account-store"></a>
#### Add Another Account Store

Adding an account store to an application provisions a directory or group to that application.  By doing so, all account store accounts can log into the application.

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name.
4. Click the **Login Sources** tab.
5. Click **Add Login Source**.
6. In the *login source* list, select the appropriate directory or group.<br>
  <img src="http://www.stormpath.com/sites/default/files/docs/LSDropdown1.png" alt="Login Sources" title="Login Sources"><br>
7.  If the directory contains groups, you can select all users or specific group for access.<br>
  <img src="http://www.stormpath.com/sites/default/files/docs/LSDropdown2.png" alt="Login Sources" title="Login Sources"><br>
8. Click **Add Login Source**.<br>
The new account store is added to the bottom of the account store list.

**Code:**

  application_href = 'https://api.stormpath.com/v1/applications/APP_UID_HERE'
  application = client.applications.get(application_href)

  directory_href = 'https://api.stormpath.com/v1/directories/DIR_UID_HERE'
  directory = client.applications.get(directory_href)

  account_store_mapping = application.account_store_mappings.create({
      'application': application,
      'account_store': directory,
    'list_index': 0,
    'is_default_account_store': False,
    'is_default_group_store': True
  })

**Warning**

* If none of the application's AccountStoreMappings are designated as the default account store, the application _WILL NOT_ be able to create new accounts.
Also, if none of the application's AccountStoreMappings are designated as the default group store, the application _WILL NOT_ be able to create new group.
* Mirrored directories or groups within Mirrored directories are read-only; they cannot be set as an application's default account store. Attempting to set `isDefaultAccountStore` to `true` on an AccountStoreMapping that reflects a mirrored directory or group will result in an error response.

<a name="change-default-account-and-group-locations"></a>
#### Change the default account store

Applications cannot store Accounts directly - Accounts are always stored in a Directory or Group.  Therefore, if you would like an application to be able to create new accounts/groups, you must specify which of the application's associated account stores should store the application's newly created accounts.  This designated account store is called the application's _default account store_ or _default group store_.

On the Login Sources tab for applications, you can select the account store (directory or group) to use as the default locations when creating new accounts and groups.

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name.
4. Click the **Login Sources** tab.
  a. To specify the default creation location(directory) for new accounts created in the application, in the appropriate row, select **New Account Location**.
  b. To specify the default creation location(directory) for new groups created in the application, in the appropriate row, select **New Group Location**.
5. Click **Save**.

**Code:**

  account_store_mapping.is_default_account_store = True
  account_store_mapping.is_default_group_store = False

  account_store_mapping.save()

**Note**

* Only one of an application's mapped account stores may be the default group/account store.
* Setting an AccountStoreMapping's `isDefaultGroupStore` value to `true` will automatically set the application's other AccountStoreMappings' `isDefaultGroupStore` values to `false`. HOWEVER:
* Setting an AccountStoreMapping's `isDefaultGroupStore` value to `false` **WILL NOT** automatically set another AccountStoreMapping's `isDefaultGroupStore` to `true`.  You are responsible for explicitly setting `isDefaultGroupStore` to `true` if you want the application to be able to create new groups.

**Warning**

* If no AccountStoreMapping is designated as the default group/account store, the application _WILL NOT_ be able to create new groups/accounts.
* Stormpath does not currently support storing groups within groups.  Therefore `isDefaultGroupStore` can only be set to `true` when the AccountStoreMapping's `accountStore` is a Directory.  Attempting to set `isDefaultGroupStore` to `true` on an AccountStoreMapping that reflects a group will result in an error response.
* Mirrored directories are read-only; they cannot be set as an application's default group store.  Attempting to set `isDefaultGroupStore` to `true` on an AccountStoreMapping that reflects a mirrored directory will result in an error response.

<a name="change-account-store-priority-order"></a>
#### Change Account Store Priority Order

When you map multiple account stores to an application, you must also define the account store order.

The account store order is important during the login attempt for a user account because of cases where the same user account exists in multiple account stores. When a user account attempts to log in to an application, Stormpath searches the listed account stores in the order specified, and uses the credentials (password) of the first occurrence of the user account to validate the login attempt.

To specify the account store order:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name.
4. Click the **Login Sources** tab.
5. Click the row of the directory to move.
6. Drag the row to the appropriate order.<br>
  For example, if you want to move the first account store to the second account store, click anywhere in the first row of the account store table and drop the row on the second row.<br>
  <img src="http://www.stormpath.com/sites/default/files/docs/LoginPriority.png" alt="Login Sources" title="Login Sources" width="650">
7. Click **Save Priorities**.

**Code:**

  account_store_mapping.list_index = 2

  account_store_mapping.save()

<a name="list-account-stores">
#### List Account Stores

You can list an applications's mapped account stores by iterating through the application's `account_store_mappings`.

**Code:**

  for account_store_mapping in application.account_store_mappings:
    print("Account Store: ", account_store_mapping.account_store.name)
    print("Account Store Mapping Index: ", account_store_mapping.list_index)
    print("Account Store Mapping default account store? ", account_store_mapping.is_default_account_store)
    print("Account Store Mapping default group store? ", account_store_mapping.is_default_group_store)

<a name="remove-account-store"></a>
#### Remove Account Store

Removing an account store from an application deprovisions that directory or group from the application. By doing so, all accounts from the account store are no longer able to log into the application.

To remove an account store from an application:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name.
4. Click the **Login Sources** tab.
5. On the Login Sources tab, locate the directory or group.
6. Under the Actions column, click **Remove**.

**Code:**

  account_store_mapping.delete()

<a name="retrieve-account-store-resource"></a>
#### Retrieve Account Store Resource

To retrieve the directory or group representing the account store, we can use the following code:

**Code:**

  app_or_dir = account_store_mapping.account_store

***

## Directories

[Directories](#Directory) contain [authentication](#Authentication) and [authorization](#Authorization) information about users and groups. Stormpath supports an unlimited number of directories. Administrators can use different directories to create silos of users. For example, you might store your customers in one directory and your employees in another.

For directories, the basic details include:

Attribute | Description
:----- | :-----
Name | The name used to identify the directory within Stormpath. This value must be unique.
Description | Details about this specific directory.
Status | By default, this value is set to Enabled. Change the value to Disabled if you want to prevent all user accounts in the directory from authenticating even where the directory is set as a login source to an application.

Within Stormpath, there are two types of directories you can implement:

* A <strong>Cloud</strong> directory, also known as Stormpath-managed directories, which are hosted by Stormpath and use the Stormpath data model to store user and group information. This is the default and most common type of directory in Stormpath.
* A <strong>Mirrored</strong> directory, which is a Stormpath-hosted directory populated with data pushed from your existing LDAP/AD directory using a Stormpath synchronization agent. All user management is done on your existing LDAP/AD directory, but the cloud mirror can be accessed through the Stormpath APIs on your modern applications.
	* LDAP/AD directories cannot be created using the API.
	* You can specify various LDAP/AD object and attribute settings of the specific LDAP/AD server for users and groups.
	* If the agent status is Online, but you are unable to see any data when browsing your LDAP/AD mapped directory, it is likely that your object and filters are configured incorrectly.

You can add as many directories of each type as you require. Changing group memberships, adding accounts, or deleting accounts in directories affects ALL applications to which the directories are mapped as <a href="#LoginSource" title="login source">login sources</a>.

LDAP/AD accounts and groups are automatically deleted when:

* The backing object is deleted from the LDAP/AD directory service.
* The backing LDAP/AD object information no longer matches the account filter criteria configured for the agent.
* The LDAP/AD directory is deleted.

For directories, you can:

* [Locate the directory REST URL](#locate-the-directory-rest-url)
* [List directories](#list-directories)
* [Retrieve directories](#retrieve-directories)
* [Create a directory](#create-a-directory)
	* [Create a cloud directory](#create-a-cloud-directory)
	* [Create a mirrored (LDAP) directory](#create-a-mirrored-directory)
* [Map directories to applications](#map-directories-to-applications)
* [Edit directory details](#edit-directory-details)
* [Update agent configuration](#update-agent-configuration)
* [Enable a directory](#enable-a-directory)
* [Disable a directory](#disable-a-directory)
* [Delete a directory](#delete-a-directory)

<a name="locate-the-directory-rest-url"></a>
### Locate the Directory REST URL

When communicating with the Stormpath REST API, you might need to reference a directory using the REST URL or `href`. For example, you require the REST URL to create accounts in the directory using an SDK.

To obtain a directory REST URL:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. In the Directories table, click the directory name.<br>
The REST URL appears on the Details tab.<br><img src="http://www.stormpath.com/sites/default/files/docs/Resturl.png" alt="Application Resturl" title="Application REST url">

<a name="list-directories"></a>
### List Directories

To list directories, you must get the directories from the client instance.

**Code:**

	directories = client.directories

	for dir in directories:
		print('Directory ' + dir.name)
	         print('Directory Description ' + dir.description)
	         print('Directory Status ' + dir.status)

<a name="retrieve-directories"></a>
### Retrieve a Directory

You will typically retrieve a `Directory` linked from another resource.

You can also retrieve it or as a direct reference, such as `account.directory`.

Finally, you can also directly retrieve a specific directory using the `href` (REST URL) value. For any directory, you can [find the directory href](#locate-the-directory-rest-url) in the Stormpath console.

After you have the `href` it can be loaded directly as an object instance by retrieving it from the server:

	href = 'https://api.stormpath.com/v1/directories/DIR_UID_HERE'
	directory = client.directories.get(href)

<a name="create-a-directory"></a>
### Create a Directory

To create a directory for application authentication, you must know which type of directory service to use.

You can create a:

* [Cloud directory](#create-a-cloud-directory), which is hosted by Stormpath and uses the Stormpath data model to store user and group information. This is the most common type of directory in Stormpath.

**OR**

* [Mirrored (LDAP) directory](#create-a-mirrored-directory), which uses a synchronization agent for your existing LDAP/AD directory. All user account management is done on your existing LDAP/AD directory with the Stormpath agent mirroring the primary LDAP/AD server.

**Note:** The ability to create a mirrored, or agent, directory is connected to your subscription. If the option is not available, click the question mark for more information.

<a name="create-a-cloud-directory"></a>
#### Create a Cloud Directory

	directory = client.directories.create({
		name: "This is my test directory",
		description: "This is the description of my test directory"
	})

<a name="create-a-mirrored-directory"></a>
#### Create a Mirrored Directory

Mirrored directories, after initial configuration, are accessible through the Agents tab of the directory.

1. Click the **Directories** tab.
2. Click **Create Directory**.
3. Click **Mirror**.

	<img src="http://www.stormpath.com/sites/default/files/docs/CreateLDAPDirectory.png" alt="Create LDAP Directory" title="Create Mirrored Directory" width="650">

4. On the 1. Directory Basics tab, complete the field values as follows:

	Attribute | Description
:----- | :-----
Directory Name | A short name for this directory, unique from your other Stormpath directories.
Directory Description | An optional description explaining the purpose for the directory.
Directory Status | Whether or not the directory is to be used to authenticate accounts for any assigned applications. By default, this value is set to Enabled. Change the value to Disabled if you want to prevent all user accounts in the directory from authenticating even where the directory is set as a login source to an application.

5. Click **Next**.

	<img src="http://www.stormpath.com/sites/default/files/docs/CreateLDAP2.png" alt="Agent Configuration" title="Agent Configuration" width="640">

6. On the 2. Agent Configuration tab, complete the field values as follows::

	Attribute | Description
	:----- | :-----
Directory Service | The type of directory service to be mirrored. For example, LDAP.
Directory Host | The IP address or Host name of the directory server to connect to. This domain must be accessible to the agent, for example, behind any firewall that might exist.
Directory Port | The directory server port to connect to. Example: `10389` for LDAP, `10689` for LDAPS, however your directory server maybe configured differently.
Use SSL | Should the agent socket connection to the directory use Secure Sockets Layer (SSL) encryption? The Directory Port must accept SSL.
Agent User DN | The username used to connect to the directory. For example: `cn=admin,cn=users,dc=ad,dc=acmecorp,dc=com`
Agent Password | The agent user DN password.
Base DN | The base Distinguished Name (DN) to use when querying the directory. For example, `o=mycompany,c=com`
Directory Services Poll Interval | How often (in minutes) to poll the directory to detect directory object changes.

7. Click **Next**.

	<img src="http://www.stormpath.com/sites/default/files/docs/CreateLDAP3.png" alt="Account Configuration" title="Account Configuration" width="640">


8. On the 3. Account Configuration tab, complete the field values as follows:

	Attribute | Description
:----- | :-----
Account DN Suffix | Optional value appended to the Base DN when accessing accounts. For example, `ou=Users`. If left unspecified, account searches will stem from the Base DN.
Account Object Class | The object class to use when loading accounts. For example, `user`
Account Object Filter | The filter to use when searching user objects.
Account Email Attribute | The attribute field to use when loading the user email address. Example: `email`
Account First Name Attribute | The attribute field to use when loading the account first name.  Example: `givenname`
Account Middle Name Attribute | The attribute field to use when loading the account middle name. Example: `middlename`
Account Last Name Attribute | The attribute field to use when loading the account last name. Example: `sn`
Account Login Name Attribute |  The attribute field to use when logging in the account. Example: `uid`
Account Password Attribute | The attribute field to use when loading the account password. Example: `password`

9. Click **Next**.

	<img src="http://www.stormpath.com/sites/default/files/docs/CreateLDAP4.png" alt="Group Configuration" title="Group Configuration" width="640">

10. On the 4. Group Configuration tab, complete the field values as follows:

	Attribute | Description
:----- | :-----
Group DN Suffix | This value is used in addition to the base DN when searching and loading roles. An example is `ou=Roles`. If no value is supplied, the subtree search will start from the base DN.
Group Object Class | This is the name of the class used for the LDAP group object. Example: `group`
Group Object Filter | The filter to use when searching for group objects.
Group Name Attribute | The attribute field to use when loading the group name. Example: `cn`
Group Description Attribute | The attribute field to use when loading the group description. Example: `desc`
Group Members Attribute | The attribute field to use when loading the group members. Example: `member`

11. Click **Next**.
12. On the 5. Confirm tab, review the information and click **Create Directory**.<br>The webpage refreshes with the populated directory information.
13. Review the Download Agent tab and perform the steps as directed.

	<img src="http://www.stormpath.com/sites/default/files/docs/LastLDAPCreate.png" alt="Download Agent" title="Download Agent">

The `agent.id` and `agent.key` values will be specific to the agent of this directory.

After creating a backed directory in the Stormpath Admin Console and installing the Stormpath agent, the synchronization of the directory data starts when you start the agent.

After the agent is configured, associated with the agent is a status. This status is the **agent communication status** which reflects communication state as the agent communicates with Stormpath. As you make changes to the agent configuration, those changes are automatically pushed to the remote client and applied. Any further errors or conditions appear under the status column. The valid status codes are:

* **Online**: The agent is online and all things are working nominally.
* **Offline**: Stormpath detects that the agent is not communicating with it at all.
* **Error**: The agent is online, but there is a problem with communicating nominally with Stormpath or LDAP.

{% docs note %}
After the directory has been created, although the Workflows tab appears, workflows cannot be configured for this type of directory.
{% enddocs %}

### Map Directories to Applications

Currently, you can only associate directories with application in the Stormpath Admin Console.

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Applications** tab.<br>The applications table shows the application for which the directory is providing account authentication, or log in, credentials.
5. To change the login source, you must modify the application login source information.<br>If the directory is currently not specified as a login source for an application, the table contains the following message:<br>
	*Currently, there are no applications associated with this directory. To create an association, click here, and select an application. From the login sources tab, you can create the association.*

### Edit Directory Details

To edit directories, use the attributes of an existing directory instance to set the values and call the `save` method:

	directory.status = "DISABLED"
 	directory.name = 'New Directory Name'
	directory.description = 'New Directory Description'

	directory.save()

### Update Agent Configuration

You can modify an agent configuration going through the [Directories](#directory) or [Agent](#directory-agent) tabs.

The Agents tab contains a table listing all known agents used by you. Each table entry shows the following:

* The **Stormpath directory name** as a link which you can click to modify any parameters.
* A **description** which is pulled from the directory Details tab.
* The agent communication **status** reflects communication state as the agent communicates with Stormpath. As you make changes to the agent configuration, those changes are automatically pushed to the remote client and applied. Any further errors or conditions appear under the status column. The valid status codes are:

	* **Online**: The agent is online and all things are working nominally.
	* **Offline**: Stormpath detects that the agent is not communicating with it at all.
	* **Error**: The agent is online, but there is a problem with communicating nominally with Stormpath or LDAP/AD.

Although the Workflows tab appears for a mirrored LDAP/AD directory, workflows cannot be configured for this type of directory.

#### Directories Tab
1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Agent Configuration** tab.<br> **Note:** If you do not see an Agent Configuration tab, you are looking at a Stormpath cloud directory.
5. Make the necessary changes and click **Update**.

#### Agents Tab
1. Log in to the Stormpath Admin Console.
2. Click the **Agents** tab.
3. Click the directory name.
4. Make the necessary changes and click **Update**.


### Enable a Directory

Enabling previously disabled directories allows the groups and accounts to log into any applications for which the directory is defined as a login source.

To enable a directory, you must:

1. Get the directory instance from the client instance with the href of the directory.
2. Set the directory instance to enabled.
3. Call the save method on the directory instance.

**Code:**

	 href = 'https://api.stormpath.com/v1/directories/DIR_UID_HERE'
	 directory = client.directories.get(href)

	 directory.status = "ENABLED"

	 directory.save()

### Disable a Directory

Disabling directories prevents the accounts from logging into any applications connected to Stormpath, but retains the directory data as well as all group and account data. If you must shut off several accounts quickly and easily, disable a directory.

The Stormpath Administrators directory cannot be disabled.

To disable a directory, you must:

1. Get the directory instance from the client with the href of the directory.
2. Set the directory instance to disabled.
3. Call the save method on the directory instance.

**Code:**

	 href = 'https://api.stormpath.com/v1/directories/DIR_UID_HERE'
	 directory = client.directories.get(href)

	 directory.status = "DISABLED"

	 directory.save()

### Delete a Directory

**Code:**

	 href = 'https://api.stormpath.com/v1/directories/DIR_UID_HERE'
	 directory = client.directories.get(href)

	 directory.delete()

***

## *Accounts*

In Stormpath, users are referred to as user account objects or [accounts](#account). The username and email fields for accounts are unique within a directory and are used to log into applications. Within Stormpath, an unlimited number of accounts per directory is supported.

You manage LDAP/AD accounts on your primary LDAP/AD installation. LDAP/AD accounts and groups are automatically deleted when:

* The backing object is deleted from the LDAP/AD directory service.
* The backing LDAP/AD object information no longer matches the account filter criteria configured for the agent.
* The LDAP/AD directory is deleted.

An account is a unique identity within a directory. An account can exist in only a single directory but can be a part of multiple groups owned by that directory.

For accounts, the the basic detail information includes:

Attribute | Description
:----- | :-----
Directory | The directory to which the account will be added.<br>**Note:** The account cannot be moved to a different directory after it has been created. |
Username | The login name of the account for applications using username instead of email. The value must be unique within its parent directory.|
First Name | The account owner first name. |
Middle Name | The account owner middle name. |
Last Name | The account owner last name. |
First Name | The account owner first name. |
Email | The account owner email address. This is can be used by applications, such as the Stormpath Admin Console, that use an email address for logging in. The value must be unique within its parent directory. |
Status | The status is set to Enabled by default. It is only set to Disabled if you want to deny access to the account to Stormpath-connected applications. |
Password | The credentials used by an account during a login attempt. The specified value must adhere to the password policies set for the parent directory.|

For accounts, you can:

* [Locate the account REST URL](#LocateAccURL).
* [Authenticate accounts](#AuthenticateAccounts).
* [List accounts](#ListAccounts).
	* [List accounts by group](#ListGroupAccounts).
	* [List accounts by directory](#ListDirectoryAccounts).
	* [List accounts by application](#ViewAccountMap).
* [Create an account](#CreateAccounts).
* [Edit account details](#EditAccounts).
* [Change an account password](#ChangeAccountPasswords).
* [Assign accounts to groups](#AssignAccountGroup).
* [Remove accounts from groups](#RemoveAccountGroup).
* [Enable an account](#EnableAccounts).
* [Disable an account](#DisableAccounts).
* [Delete an account](#DeleteAccounts).

### Locate the Account REST URL
When communicating with the Stormpath REST API, you might need to reference an account using the REST URL or `href`. For example, you require the REST URL to create accounts in the directory using an SDK.

To obtain a directory REST URL:

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. In the Accounts table, click the account name.<br>
The REST URL appears on the Details tab.

### Authenticate Accounts

To authenticate an account you must have the application the account authenticates against. With the application, the account is authenticated by providing the username and password as follows:

	href = 'https://api.stormpath.com/v1/applications/APP_UID_HERE'
	application = client.applications.get(href)

	# The result is an authenticated Account
	account = application.authenticate_account("USERNAME", "PASSWORD")

### List Accounts

For accounts, you can view, or list them according to their <a href="#ListGroupAccounts" title="group membership">group membership</a>, <a href="#ListDirectoryAccounts" title="directory accounts">the directories to which they belong</a>, or the <a href="#ViewAccountMap" title="View Account Map">applications to which they are associated</a>.

#### List Accounts by Group

To list all groups associated with an account:

1. Get the client
2. Get the group from the client with the group `href`.
3. Get the group accounts.

**Code:**

	href = 'https://api.stormpath.com/v1/groups/GROUP_UID_HERE'
	group = client.groups.get(href)

	accounts = group.accounts

	for acc in accounts:
	    print('Given Name ' + acc.givenName)


#### List Accounts by Directory

To list user accounts contained in a directory, you must:

1. Get the client
2. Get the directory from the client with the directory `href`.
3. Get the directory accounts from the directory instance.

**Code:**

	href = 'https://api.stormpath.com/v1/directories/DIR_UID_HERE'
	directory = client.directories.get(href)

	accounts = directory.accounts

	for acc in accounts:
	    print('Given Name ' + acc.givenName)

#### List Accounts by Application

To list user accounts mapped to an application, you must:

1. Get the application from the client with the application `href`.
2. Get the application accounts.

**Code:**

	href = 'https://api.stormpath.com/v1/applications/APPLICATION_UID_HERE'
	application = client.applications.get(href)

	accounts = application.accounts

	for acc in accounts:
	    print('Given Name ' + acc.givenName)

### Retrieve an Account

To retrieve a specific account you need the `href` which can be loaded as an object instance by retrieving it from the server, using the client:

	href = 'https://api.stormpath.com/v1/accounts/ACCOUNT_UID_HERE'
	account = client.accounts.get(href)

### Create an Account

To create a user accounts, you must:

1. Get the directory where you want to create the account from the client with the directory href.
2. Set the account properties.
3. Create the account from the directory.

To create accounts, create a dictionary object with account attributes and then create the account from a directory as follows:

**Code:**

	href = 'https://api.stormpath.com/v1/directories/DIR_UID_HERE'
	directory = client.directories.get(href)

    account_dict = {
        "username": 'Username'
        "email": 'Email',
        "givenName": 'Given Name',
        "surname": 'Surname',
        "password": 'Password'
    }

    account = directory.create_account(account_dict)

If you want to override the registration workflow and have the account created with ENABLED status right away, pass `False` as second argument, for example:

	account = directory.create_account(account_dict, False)

If you want to associate the account to a group, add the following:

	account.add_group(group)

### Edit Account Details

To edit accounts, use the attributes of an existing account instance to set the values and call the `save()` method:

	account.status = "DISABLED"
	account.given_name = 'New Given Name'
	account.surname = 'New Surname'
	account.username = 'New Username'
	account.email = 'New Email'
	account.middleName = 'New Middle Name'

	account.save()

If you want to add a group to an account, do the following:

	account.add_group(group)


### Assign Accounts to Groups

The association between a group and an account can be done from an account or group instance. If the account is part of a directory containing groups, you can associate the account with a group. To add an account to a group, you must:

1. Get the client instance
2. Get the group and account instance from the client with the corresponding hrefs.
3. Add the group to the account instance OR add the account to the group instance.

**Code:**

	href = 'https://api.stormpath.com/v1/accounts/ACCOUNT_UID_HERE'
	account = client.account.get(href)

	href = 'https://api.stormpath.com/v1/groups/GROUP_UID_HERE'
	group = client.groups.get(href)

	# account.add_group(group) OR group.add_account(account)

### Remove Accounts from Groups

The remove an account from, or delete the account as a member of, a group you must:

1. Get the group membership instance.
	* The group membership can be retrieved directly from the client, if the `href` is known to the user.
	* Another way of retrieving the group membership is by searching for the group membership that represents the relationship between the group and the account that you want to delete.
2. Delete the group membership by calling the `delete` method.

**Code:**

	href = 'https://api.stormpath.com/v1/groupMemberships/GROUP_MEMBERSHIP_UID_HERE'
	group_membership = client.group_memberships.get(href)

	group_membership.delete()

**OR**

	from stormpath.resource import Account

	group_href = 'https://api.stormpath.com/v1/groups/GROUP_UID_HERE'

	account_href = 'https://api.stormpath.com/v1/accounts/ACCOUNT_UID_HERE'
	account = client.accounts.get(account_href)

	group_linked = False
	group_membership = None
	# looping the group membership aggregate of the account
	for tmp_group_membership in account.group_memberships:

		group_membership = tmp_group_membership
		tmp_group = group_membership.group

		# here, we make sure this is the group we're looking for
		if tmp_group and group_href in tmp_group.href:
			group_linked = True
			break
	# if the group was found, we delete it
	if group_linked:
		group_membership.delete()

### Enable Accounts

Enabling a previously disabled account allows the account to log in to any applications where the directory or group is defined as an application login source.

**Note:** Enabling and disabling accounts for mirrored (LDAP) directories is not available in Stormpath. You manage mirrored (LDAP) accounts on the primary server installation.

To enable an account, you must:

1. Get the account instance from the client with the account href.
2. Set the account instance status to "enabled".
3. Call the save method on the account instance.

**Code:**

	href = 'https://api.stormpath.com/v1/accounts/ACCOUNT_UID_HERE'
	account = client.accounts.get(href)

	account.status = "ENABLED"

	account.save()

### Disable Accounts

Disabling an account prevents the account from logging into any applications in Stormpath, but retains all account information. You typically disable an account if you must temporarily remove access privileges.

If you disable an account within a directory or group, you are completely disabling the account from logging in to any applications to which it is associated.

**Note:** Enabling and disabling accounts for mirrored (LDAP) directories is not available in Stormpath. You manage mirrored (LDAP) accounts on the primary server installation.

To disable an account, you must:

1. Get the account instance from the client with the account href.
2. Set the account instance status to disabled.
3. Call the save method on the account instance.

**Code:**

	href = 'https://api.stormpath.com/v1/accounts/ACCOUNT_UID_HERE'
	account = client.accounts.get(href)

	account.status = "DISABLED"

	account.save()

### Delete an Account

Deleting an account completely erases the account from the directory and erases all account information from Stormpath.

To delete an account, you must use the Stormpath Admin Console.

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. Under the Actions column for the account, click **Delete**.
4. In the prompt that appears, to confirm deleting the account, click **Ok**.

***

## Groups

[Groups](#Group) are collections of accounts within a directory that are often used for authorization and access control to the application. In Stormpath, the term group is synonymous with [role](#Role).

You manage LDAP/AD groups on your primary LDAP/AD installation. LDAP/AD accounts and groups are automatically deleted when:

* The backing object is deleted from the LDAP/AD directory service.
* The backing LDAP/AD object information no longer matches the account filter criteria configured for the agent.
* The LDAP/AD directory is deleted.

For groups, the basic detail information includes:

Attribute | Description
:--- | :---
Name | The name of the group. Within a given directory, this value must be unique. |
Description | A short description of the group. |
Status | This is set to Enabled by default. This is only set to Disabled to prevent all group accounts from logging into any application even when the group is set as a login source to an application.<br>**Note:** If an account is also a member to another group that does have access to an application, then the account can login. |

With groups, you can:

* [Locate the group REST URL](#LocateGroupURL).
* [List groups](#ListGroups) including:
	* [List group accounts](#ListAccountGroups).
	* [List directory groups](#ListDirectoryGroups).
* [Create groups](#CreateGroups).
* [Edit group details](#EditGroups).
* [Enable a group](#EnableGroups).
* [Disable a group](#DisableGroups).
* [Delete a group](#DeleteGroups).</p>

### Locate the Group REST URL

When communicating with the Stormpath REST API, you might need to reference a group using the REST URL or `href`. For example, you require the REST URL to create accounts to associate with the group in the directory using an SDK.

To obtain a group REST URL:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. In the Directories table, click the directory name.
4. Click the **Groups** tab.
5. Click the group name.<br>
The REST URL appears on the Details tab.

### List Groups

For groups, you can view, or list them by [account membership](#ListAccountGroups) or [the directory](#ListDirectoryGroups).

#### List Accounts in a Group

To list all accounts associated with, or members of, a group, you must:

1. Create a client instance.
2. Get the account instance from the client instance using the account href.
3. Get the groups from the account.

To list all groups on a directory or an account, loop the groups aggregate from a directory or an account:

	href = 'https://api.stormpath.com/v1/accounts/ACCOUNT_UID_HERE'
	account = client.accounts.get(href)

	groups = account.groups

	for group in groups:
		print("Group " + grp.name)

#### List Groups in a Directory

To list all groups contained within a directory, you must:

1. Get a client instance.
2. Get the directory instance from the client instance using the directory href.
3. Get the groups from the directory.

To list all groups on a directory or an account, loop the groups aggregate from a directory or an account:

	href = 'https://api.stormpath.com/v1/directories/DIR_UID_HERE'
	directory = client.directories.get(href)

	for group in groups:
		print("Group " + grp.name)

### Retrieve a Group

To retrieve a specific group you need the `href` which can be loaded as an object instance by retrieving it from the server:

	href = 'https://api.stormpath.com/v1/groups/GROUP_UID_HERE'
	group = client.groups.get(href)

### Create Groups

You can create a group from the Python SDK. You can do it getting a reference to a directory and creating the group out of it:

	directory_url = "https://api.stormpath.com/v1/directories/YOUR_DIRECTORY_ID_HERE"

    directory = client.directories.get(directory_url)

    group = directory.groups.create({
      name: 'A new group',
      description: 'The description of the new group'
    })

### Edit Group Details

To edit groups, use the attributes of an existing group instance to set the values and call the save method:

	group.status = "DISABLED"
	group.name = 'New Group Name'
	group.description = 'New Group Description'

	group.save()

### Enable a Group

If the group is contained within an <em>enabled directory where the directory is defined as a login source</em>, then enabling or re-enabling the group allows all accounts contained within the group (membership list) to log in to any applications for which the directory is defined as a login source.

If the group is contained within a <em>disabled directory where the directory is defined as a login source</em>, the group status is irrelevant and the group members are not be able to log in to any applications for which the directory is defined as a login source.

If the group is defined as a login source, then enabling or re-enabling the group allows accounts contained within the group (membership list) to log in to any applications for which the group is defined as a login source.

To enable a group, you must:

1. Create a client instance.
2. Get the group instance from the client instance using the group href.
3. Set the group instance status to enabled.
4. Call the save method on the group instance.

**Code:**

	href = 'https://api.stormpath.com/v1/groups/GROUP_UID_HERE'
	group = client.groups.get(href)

	group.status = "ENABLED"

	group.save()


### Disable a Group

If a group is explicitly set as an application login source, then disabling that group prevents any of its user accounts from logging into that application but retains the group data and memberships. You would typically disable a group if you must shut off a group of user accounts quickly and easily.

To disable a group, you must:

1. Get a client instance.
2. Get the group instance from the client instance using the group href.
3. Set the group instance status to disabled.
4. Call the save method on the group instance.

**Code:**

	href = 'https://api.stormpath.com/v1/groups/GROUP_UID_HERE'
	group = client.groups.get(href)

	group.status = "DISABLED"

	group.save()

### Delete a Group

A group can be deleted from the Python SDK invoking `group.delete()`:

	href = 'https://api.stormpath.com/v1/groups/GROUP_UID_HERE'
	group = client.groups.get(href)

	group.delete()

***

## Workflow Automations

Workflows are common user management operations that are automated for you by Stormpath. Account Registration and Verification workflow configurations manage how accounts are created in your directory. The Password Reset workflow enables you to configure how password reset works and the context of messages. For both workflows, messages can be formatted in plain text or HTML.

Workflows are only available on cloud directories and only configurable using the Stormpath Admin Console. The Stormpath Administrator directory has default workflow automations which cannot be altered.<br>

On the Workflows tab, you can automate <a href="#AccountRegistration" title="account registration and verification">account registration and verification</a> and <a href="#PasswordReset" title="password reset">password resets</a>.

<img src="http://www.stormpath.com/sites/default/files/docs/ManageWorkflows.png" alt="Workflow Automation" title="Workflow Automation" width="670" height="250">

### Account Registration and Verification

For the Account Registration and Verification workflow, you must perform the following actions:

* <a href="#ConfigureAccountRegistration" title="Configure Account Registration and Verification">Configure account registration and verification</a>
* <a href="#InitiateAccountRegistration" title="Initiate Account Registration and Verification">Initiate account registration and verification</a>
* <a href="#VerifyAccount" title="Verify the Account">Verify the account</a>
<br>

**Note:** The ability to modify workflows, depends on your subscription level. If an option is not available (grayed out), click the question mark for more information.

#### Configure Account Registration and Verification

To configure account registration and verification:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click **Workflows** tab.
5. On the Workflows tab, next to Registration and Verification, click **show**.
	* By default, the Account Registration and Verification workflow automation is disabled. By leaving this workflow off, all accounts created in the directory are enabled, unless otherwise specified, and the user does not receive any registration or verification emails from Stormpath.
	* By only enabling <strong>Enable Registration and Verification Workflow</strong> and not also enabling <strong>Require newly registered accounts to verify their email address</strong>, new accounts are marked as enabled and the users receive a registration success email. <br>

		<img src="http://www.stormpath.com/sites/default/files/docs/RegistrationVerification.png" alt="Account Registration and Verification" title="Account Registration and Verification" width="650" height="430">


	* You configure the Registration Success Message with the following attributes:

		Attribute | Description
:----- | :-----
Message Format | The message format for the body of the Account Registration Success email. It can be Plain Text or HTML. Available formats depend on the tenant subscription level.
"From" Name | The value to display in the "From" field of the Account Registration Success message.
"From" Email Address | The email address from which the Account Registration Success message is sent.
Subject | The value for the subject field of the Account Registration Success message.
Body | The value for the body of the message. Variable substitution is supported for the account first name, last name, username, and email, as well as the name of the directory where the account is registered.

	* By also selecting **Require newly registered accounts to verify their email address**:
		* Newly created accounts are given an *unverified* status and a verification email is sent to the user. The verification email contains a token unique to the user account. When the user clicks the link, they are sent to the verification base URL where the token is submitted to Stormpath for verification. If verified, the account status changes to enabled and a verification success email is sent to the user.
		* An Account Verification Message section appears.<br>

			<img src="http://www.stormpath.com/sites/default/files/docs/AccountVerificationMessage.png" alt="Account Verification" title="Account Verification" width="700" height="420">

		* You configure the Account Verification Message with the following attributes: <br>

			Attribute | Description
:----- | :-----
Account Base URL | Your application URL which receives the token and completes the workflow. Stormpath offers a default base URL to help during development.
Message Format | The message format for the body of the Account Verification email. It can be Plain Text or HTML. Available formats depend on the tenant subscription level.
From" Name | The value to display in the "From" field of the Account Success message.
"From" Email Address | The email address from which the Account Verification message is sent.
Subject | The value for the subject field of the Account Verification message.
Body | The value for the body of the message. Variable substitution is supported for the account first name, last name, username, and email, as well as the name of the directory where the account is registered and the url (containing the token) that the user must click.
		* A Verification Success Message section appears.<br>

			<img src="http://www.stormpath.com/sites/default/files/docs/VerificationEmailParams.png" alt="Email Verification" title="Email Verification" width="700" height="420">

		* You configure the Verification Success Message with the following attributes: <br>

			Attribute | Description
:----- | :-----
Message Format | The message format for the body of the Account Verification Success email. It can be Plain Text or HTML. Available formats depend on the tenant subscription level.
"From" Name | The value to display in the "From" field of the Account Verification Success message.
"From" Email Address | The email address from which the Account Verification Success message is sent.
Subject | The value for the subject field of the Account Verification Success message.
Body | The value for the body of the message. Variable substitution is supported for the account first name, last name, username, and email, as well as the name of the directory where the account is registered.


6. When all the fields are complete, click **Update**.


#### Initiate Account Registration and Verification

If the workflow is enabled, an account registration is automatically initiated during an account creation.


#### Initiate Account Registration and Verification

If the workflow is enabled, an account registration is automatically initiated during an account creation.


#### Verify Account

If a directory has the the account verification workflow enabled:

1. A newly created account in the directory has an `UNVERIFIED` status until the email address has been verified.
2. When a new user is registered for the first time, Stormpath sends an email to the user with a secure verification link, which includes a secure verification token.
3. When the user clicks the link in the email, they are sent to the verification URL set up in the verification workflow.
	* To verify the account email address (which sets the account status to `ENABLED`), the verification token in the account verification email must be obtained from the link account holders receive in the email.
	* This is achieved by implementing the following logic:

			verification_token = # obtain it from query parameter, according to the workflow configuration of the link

			# when the account is correctly verified it gets activated and that account is returned in this verification
			account = client.accounts.verify_email_token(verification_token)


### Password Reset

When you reset an account password using Stormpath, the user receives an email with a link and a secure reset token. The link sends the user to a password reset page where they submit a new password to Stormpath. When the password is successfully reset, the user receives a success email. You can configure, at the directory level, how password reset works, the URL of the reset page, and the content of the email messages.

Messages can be formatted in plain text or HTML.

#### Configure Password Reset

To configure the password reset workflow:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click **Workflows** tab.
5. On the Workflows tab, next to Password Reset, click **show**.

	<img src="http://www.stormpath.com/sites/default/files/docs/ResetPW1.png" alt="Password Reset" title="Password Reset" width="640" height="430">
6. Complete the values as follows:<br>

	Attribute | Description
:----- | :-----
<a id ="BaseURL"></a>Base URL | Your application URL which receives the token and completes the workflow. Stormpath offers a default base URL to help during development.
Expiration Window | The number of hours that the password reset token remains valid from the time it is sent.

7. Under Password Reset Message, complete the values as follows:<br>

	Attribute | Description
:----- | :-----
Message Format | The message format for the body of the Password Reset email. It can be Plain Text or HTML. Available formats depend on the tenant subscription level.
"From" Name | The value to display in the "From" field of the Password Reset message.
"From" Email Address | The email address from which the Password Reset message is sent.
Subject | The value for the subject field of the Password Reset message.
Body | The value for the body of the message. Variable substitution is supported for the account first name, last name, username, and email, as well as the name of the directory where the account is registered, the url the user must click to verify their account, and the number of hours for which the URL is valid.

8. Under Password Reset Success Message, complete the values as follows:<br>

	Attribute | Description
:----- | :-----
Message Format | The message format for the body of the Password Reset Success email. It can be Plain Text or HTML. Available formats depend on the tenant subscription level.
"From" Name | The value to display in the "From" field of the Password Reset Success message.
"From" Email Address | The email address from which the Password Reset Success message is sent.
Subject | The value for the subject field of the Password Reset Success message.
Body | The value for the body of the message. Variable substitution is supported for the account first name, last name, username, and email, as well as the name of the directory where the account is registered.

	<img src="http://www.stormpath.com/sites/default/files/docs/ResetPW2.png" alt="Password Reset Message" title="Password Reset Message" width="640" height="418">

9. When all the fields are complete, click **Update**.

#### Initiate Password Reset

To initiate the password reset workflow in your application, you must create a password reset token, which is sent from Stormpath in an email to the user.

This is done from the application as follows:

	href = 'https://api.stormpath.com/v1/applications/APP_UID_HERE'
	application = client.applications.get(href)

	# creating the password reset token and sending the email
	application.send_password_reset_email('email')


#### Complete Password Reset

After the password reset token is created and the workflow is initiated, Stormpath sends a reset email to the user. The email contains a web link that includes the [base URL](#BaseURL) and the reset token.

`https://myAwesomeapp.com/passwordReset?sptoken=TOKEN`

Where `myAwesomeapp.com/passwordReset` is the base URL.

After the user clicks the link, the user is sent to the base URL. The password reset token can then be obtained from the query string.

To complete password reset, collect and submit the user's new password with the reset token to Stormpath.

**Note:** To complete the password reset, you do not need any identifying information from the user. Only the password reset token and the new password are required.

The password is changed as follows:

	href = 'https://api.stormpath.com/v1/applications/APP_UID_HERE'
	application = client.applications.get(href)

	# getting the Account from the token and changing the password
	account = application.verify_password_reset_token('PASS_RESET_TOKEN')
	account.password = 'New Password'
	account.save()

***

## Administering Stormpath

For more information about administering Stormpath using the Admin Console, please refer to the [Admin Console Product Guide](http://stormpath.com/docs/console/product-guide).

***

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
