---
layout: doc
lang: ruby
title: Stormpath Ruby Product Guide
---

Stormpath is a User Management API that reduces development time with instant-on, scalable user infrastructure. Stormpath’s intuitive API and expert support make it easy for developers to authenticate, manage and secure users and roles in any application.

For help to quickly get started with Stormpath, refer to the [Ruby Quickstart Guide](/ruby/quickstart).

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

To access the Stormpath Admin Console, visit [https://api.stormpath.com/login](https://api.stormpath.com/login)

### REST API

The Stormpath API offers authorized developers and administrators programmatic access to:

* Securely authenticate accounts.
* Create and manage accounts and adjust group membership.
* Manage directories.
* Manage groups.
* Initiate and process account automations.

For more detailed documentation on the Stormpath API, visit the [REST Product Guide](/rest/product-guide).


### Ruby SDK

The Stormpath Ruby SDK allows any Ruby-based application to easily use the Stormpath user management service for all authentication and access control needs. The Ruby SDK can be found on [Github](https://github.com/stormpath/stormpath-sdk-ruby).

When you make SDK method calls, the calls are translated into HTTPS requests to the Stormpath REST+JSON API. The Stormpath Ruby SDK therefore provides a clean object-oriented paradigm natural to Ruby developers and alleviates the need to know how to make REST+JSON requests.

This SDK is compatible with the *1.9.3* and later versions of Ruby. The sample codes of this documentation are based on version *1.0.0.beta* or greater of the Ruby SDK.

Stormpath also offers guides and SDKs for [Java](/java/product-guide), [PHP](/php/product-guide), and [Python](/python/product-guide).

If you are using a language that does not yet have an SDK, you can use the REST API directly and refer to the <a href="/docs/rest/product-guide" title="API">REST API Product Guide.</a>


***

## SDK Concepts

Throughout this guide, code examples appear using the Stormpath Ruby SDK.

Although knowing how the SDK is designed and how it works is not required to use it, knowing some of the design details will help you use it more efficiently and effectively.

### Client

The root entry point for SDK functionality is the `Client` instance. Using the client instance, you can access all tenant data, such as applications, directories, groups, and accounts.


#### Preferred Configuration

There are different ways to create a client instance to interact with your resources. The preferred mechanism is by reading a secure `apiKey.properties` file, where the Client instance is generated from the api key credentials:

	require "stormpath-sdk"

	client = Stormpath::Client.new api_key_file_location: File.join(ENV['HOME'], '.stormpath', 'apiKey.properties')

This is heavily recommended if you have access to the file system.


#### Single URL Configuration

The [Ruby Quickstart Guide](/ruby/quickstart) assumes you have easy access to an `apiKey.properties` file. Some applications however might not have access to the file system (such as Heroku) applications. In these cases, you can also create a client instance using a single URL, where often the URL is available as an environment variable, such as `ENV`.

This technique requires embedding the API key ID and Secret as components in a URL allowing you to have a single URL that contains all necessary information required to construct a `Client`.

{% docs warning %}
Do not use this technique if you have access to a file system. Depending on the environment, environment variables are less secure than reading a permission-restricted file like `apiKey.properties`.
{% enddocs %}

If you do not have access to the file system to read an `apiKey.properties` file, you can create a `Client` instance from the URL. The `Client` accepts a single URL of the application Stormpath HREF with the API key information embedded in the URL. For example:

	application_href = "https://apiKeyId:apiKeySecret@api.stormpath.com/v1/applications/YOUR_APP_UID_HERE"

Make sure that the `apiKeyId` and `apiKeySecret` components are URL-encoded.

You can acquire the `Application` instance by calling the `load` class method of the `Application` class, then you can get the `Client` instance from the application:

	require "stormpath-sdk"

	application = Stormpath::Resource::Application::load application_href
	client = application.client

#### API Key Configuration

Another way to create a client is by creating an `ApiKey` instance with the API credentials and passing this instance to create the client instance:

	require "stormpath-sdk"

	api_key = Stormpath::ApiKey.new 'api_id', 'api_secret'
    client = Stormpath::Client.new  api_key: api_key

{% docs note %}
DO NOT specify your actual `apiKey.id` and `apiKey.secret` values in source code! They are secure values associated with a specific person. You should never expose these values to other people, not even other co-workers.
{% enddocs %}

Only use this technique if the values are obtained at runtime using a configuration mechanism that is not hard-coded into source code or easily-visible configuration files.


### High-level Overview

The Stormpath SDK and the associated components reside and execute within your application at runtime. When making method calls on the SDK objects - particularly objects that represent REST data resources such as applications and accounts - the method call automatically triggers an HTTPS request to the Stormpath API server if necessary.

The HTTPS request allows you to program your application code to use regular Ruby objects and alleviates you from worrying about the lower-level HTTP REST+JSON details and individual REST resource HTTP endpoints.

Here is how the communication works:<br>
<img src="http://www.stormpath.com/sites/default/files/docs/SDKCommunicationFlow.png" alt="SDK Communication Flow" title="SDK Communication Flow" width="700">

In this example, the request is trying to determine the <code>directory</code> of the existing SDK <code>account</code> resource instance.

The request is broken down as follows:

1. The application attempts to acquire the account directory instance.
2. If the directory resource is not already in memory, the SDK creates a request to send to the Stormpath API server.
3. An HTTPS GET request is executed.
4. The Stormpath API server authenticates the request caller and looks up the directory resource.
5. The Stormpath API server responds with the JSON representation of the directory resource.
6. The Stormpath SDK transforms the JSON response into a directory object instance.
7. The directory instance is returned to the application.

### Detailed Design

The Stormpath SDK is designed with two primary design principles:

* **Composition**<br>
Although most SDK end users never need to customize the implementation behavior of an SDK, the SDK is pluggable meaning that the functionality can be customized by plugging in new implementations of relevant components. The SDK leans toward the [programming to interfaces](http://en.wikipedia.org/wiki/Software_interface#Software_interfaces) (as much it they can be applied to Ruby) and principles of [object composition](http://en.wikipedia.org/wiki/Object_composition) to support pluggability. Even if SDK end users never leverage this design, the design helps the Stormpath development team provide support and bug fixes without disrupting existing SDK usages.

* **Proxying**<br>
Ruby instances representing REST resources use the [Proxy software design pattern](http://en.wikipedia.org/wiki/Proxy_pattern) to intercept property access allowing the SDK implementation to automatically load the resource data or other referenced resources if necessary.

#### Architectural Components

The core component concepts of the SDK are as follows:<br>
<img src="http://www.stormpath.com/sites/default/files/docs/ComponentArchitecture.png" alt="Stormpath SDK Component Architecture" title="Stormpath SDK Component Architecture" width="670">

* **Client** is the root entry point for SDK functionality and accessing other SDK components, such as the `DataStore`. A client is constructed with a Stormpath API key which is required to communicate with the Stormpath API server. After it is constructed, the client delegates to an internal DataStore to do most of its work.
* **DataStore** is central to the Stormpath SDK. It is responsible for managing all Ruby `resource` objects that represent Stormpath REST data resources such as applications, directories, and accounts. The DataStore is also responsible for translating calls made on Ruby `resource` objects into REST requests to the Stormpath API server as necessary. It works between your application and the Stormpath API server
	* **RequestExecutor** is an internal infrastructure component used by the `DataStore` to execute HTTP requests (`GET`, `PUT`, `POST`, `DELETE`) as necessary. When the DataStore needs to send a Ruby `Resource` instance state to or query the server for resources, it delegates to the RequestExecutor to perform the actual HTTP requests. The Stormpath SDK default `RequestExecutor` implementation is `HttpClientRequestExecutor` which uses the [httpclient](http://rubygems.org/gems/httpclient) to execute the raw requests and read the raw responses.
	* **MapMarshaller** is an library used by the `DataStore` to convert JSON strings into Ruby `Hash` instances or the reverse. The Hash instances are used by the `ResourceFactory` to construct standard Ruby objects representing REST resources. The Stormpath SDK default `MapMarshaller` is the [multi JSON gem](http://rubygems.org/gems/multi_json).
	* **ResourceFactory** is an internal infrastructure component used by the `DataStore` to convert REST resource map data into standard Ruby `resource` objects. The ResourceFactory uses hashes from multi JSON to construct the Ruby resource instances.
	* **Resources** are standard Ruby objects that have a 1-to-1 correlation with REST data resources in the Stormpath API server such as applications and directories. Applications directly use these `resource` objects for security needs, such as authenticating user accounts, creating groups and accounts, finding application accounts, assigning accounts to groups, and resetting passwords.

### Resources and Proxying

When applications interact with a Stormpath SDK `resource` instance, they are really interacting with an intelligent data-aware proxy, not a simple object with some properties. Specifically, the `resource` instance is a proxy to the SDK client `DataStore` allowing resource instances to load data that might not yet be available.

For example, using the SDK Communication Flow diagram in the [high-level overview](#HighLevelOverview) section, assuming you have a reference to an `account` object - perhaps you have queried for it or you already have the account `href` and you want to load the `account` resource from the server:

	account_href = 'https://api.stormpath.com/v1/accounts/ACCOUNT_UID_HERE'
	account = client.accounts.get account_href

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

Notice the JSON `directory` property is only a link (pointer) to the directory; it does not contain any of the directory properties. The JSON shows we should be able to reference the `directory` property, and then reference the `href` property, and do another lookup (pseudo code):

	directory_href = 'https://api.stormpath.com/v1/directories/DIR_UID_HERE'
	directory = client.directories.get directory_href

This technique is cumbersome, verbose, and requires a lot of boilerplate code in your project. As such, SDK resources **automatically** execute the lookups for unloaded references for you using simple property navigation!

The previous lookup becomes:

	directory = account.directory

If the directory already exists in memory because the `DataStore` has previousy loaded it, the directory is immediately returned. However, if the directory is not present, the directory `href` is used to return the directory properties (the immediate data loaded) automatically for you. This technique is known as *lazy loading* which allows you to traverse entire object graphs automatically without requiring constant knowledge of `href` URLs.

### Error Handling

Errors thrown from the server are translated to a [Stormpath Error](https://github.com/stormpath/stormpath-sdk-ruby/blob/master/lib/stormpath-sdk/error.rb). This applies to all requests to the Stormpath API endpoints.

For example, when getting the current tenant from the client you can catch any error that the request might produce as follows:

	begin

	  tenant = client.tenant

	rescue Stormpath::Error => e
	  p 'Message: ' + e.message
	  p 'HTTP Status: ' + e.status.to_s
	  p 'Developer Message: ' + e.developer_message
	  p 'More Information: ' + e.more_info
	  p 'Error Code: ' + e.code.to_s
	end

***

## Applications

An <a href="#Application" title="Application">application</a> in Stormpath represents a real world software application that communicates with Stormpath for its user management and authentication needs.

When defining an application in Stormpath, it is typically associated with one or more directories or groups. The associated directories and groups form the application <em>user base</em>. The accounts within the associated directories and groups are considered the application users and can login to the application.

For applications, the basic details include:

Attribute | Description
:----- | :-----
Name | The name used to identify the application within Stormpath. This value must be unique.
Description | A short description of the application.
Status | By default, this value is set to Enabled. Change the value to Disabled if you want to prevent accounts from logging in to the application.

{% docs note %}
A URL for the application is often helpful.
{% enddocs %}

For applications, you can: 

* [Locate the application REST URL](#locate-the-application-rest-url) within the Stormpath Admin Console.
* [List applications](#list-applications).
* [Retrieve an application](#retrieve-an-application).
* [Register an application](#register-an-application).
* [Edit the details of an application](#edit-an-application).
* [Enable an application](#enable-an-application).
* [Disable an application](#disable-an-application).
* [Delete an application](#disable-an-application).</p>


### Locate the Application REST URL

When communicating with the Stormpath REST API, you might need to reference an application using the REST URL or `href`. For example, you require the REST URL to delete applications or to obtain a listing of accounts mapped to an application. 

To obtain an application REST URL:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. In the Applications table, click the application name.<br>
The REST URL appears on the Details tab.<br><img src="http://www.stormpath.com/sites/default/files/docs/AppResturl.png" alt="Application Resturl" title="Application Resturl">


### List Applications

To retrieve a list of applications, you must do the following:

Get the tenant applications from the client.

**Code:**

	client.applications.each do |application|
      p "Application: #{application.name}"
      p "Application Description: #{application.description}"
      p "Application Status: #{application.status}"
    end

### Retrieve an Application

You will typically retrieve an `Application` referenced from another resource, for example using the `Application Collection` property of the `Tenant` resource.

You can also directly retrieve a specific application using the `href` (REST URL) value. For any application, you can [find the application href](#LocateAppURL) in the Stormpath console. This can be particularly useful when you need an application href for the to create a `Client` instance.

After you have the `href` it can be loaded directly as an object instance by retrieving it from the server, using the client:

	application_href = 'https://api.stormpath.com/v1/applications/APP_UID_HERE'
	application = client.applications.get application_href

### Register an Application

To authenticate a user account in your [application](#Application), you must first register the application with Stormpath.

To register an application you must create it from the client instance:

	application = client.applications.create({
      name: 'This Is My Ruby App',
      description: 'This is my ruby app description'
    })


### Edit an Application

To edit applications, use the `_accessors_` of an existing application instance to set the values and call the `save` method:

	application.status = Status::DISABLED  # the Status class provides the valid status' constants
	application.name = 'New Application Name'
	application.description = 'New Application Description'

	application.save

### Enable an Application

Enabling a previously disabled application allows any enabled directories, groups, and accounts associated with the application account store in Stormpath to log in. 

To enable an application, you must set the 'ENABLED' status to the application instance and call the 'save' method on it:

**Code:**

	application.status = Status::ENABLED  # the Status class provides the valid status' constants
 
	application.save


### Disable an Application

Disabling an application prevents the application from logging in any accounts in Stormpath, but retains all application configurations. If you must temporarily turn off logins, disable an application. 

{% docs note %}
The Stormpath IAM application cannot be disabled.
{% enddocs %}

To disable an application, you must set the 'DISABLED' status to the application instance and call the 'save' method on it:

**Code:**

	application.status = Status::DISABLED  # the Status class provides the valid status' constants

	application.save

### Delete an Application

Deleting an application completely erases the application and its configurations from Stormpath. We recommend that you disable an application rather than delete it, if you anticipate that you might use the application again.

{% docs note %}

* The Stormpath IAM application cannot be deleted.
* Deleted applications cannot be restored.

{% enddocs %}

To delete an application, you must call the 'delete' method on the application instance.

**Code:**

	application.delete

***	

## Account Store Mappings

Account Store is a generic term for either a Directory or a Group. Directories and Groups are both considered “account stores” because they both contain, or ‘store’, Accounts. An Account Store Mapping, then, is a relationship between an Account Store and an Application.

In Stormpath, you control who may login to an application by associating (or ‘mapping’) one or more account stores to an application. All of the accounts in the application’s assigned account stores form the application’s effective user base; those accounts may login to the application. If no account stores are assigned to an application, no accounts will be able to login to the application.

You control which account stores are assigned (mapped) to an application, and the order in which they are consulted during a login attempt, by manipulating an application’s `AccountStoreMapping` resources.

####How Login Attempts Work

**Example:**
Assume an application named Foo has been mapped to two account stores, the Customers and Employees directories, in that order.

Here is what happens when a user attempts to log in to an application named Foo:  

<img src="http://www.stormpath.com/sites/default/files/docs/LoginAttemptFlow.png" alt="Login Sources Diagram" title="Login Sources Diagram" width="650" height="500">

You can configure multiple account stores, but only one is required for logging in. Multiple account stores allows each application to view multiple directories as a single repository during a login attempt.

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

For Account Store Mappings you may:

* [Create an account store mapping](#create-an-account-store-mapping)
* [Retrive an account store mapping](#retrive-an-account-store-mapping)
* [Change the account store priority order](#change-account-store-priority)
* [Remove account stores](#remove-account-store).

To manage application account stores, you must log in to the Stormpath Admin Console:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name.
4. Click the **Account Stores** tab.<br>
The account stores appear in order of priority.<br> 
	<img src="http://www.stormpath.com/sites/default/files/docs/LoginSources.png" alt="Login Sources" title="Login Sources" width="650" height="170">

#### Create an Account Store Mapping

Adding a account store to an application provisions a directory or group to that application.  By doing so, all accounts in the account store can log into the application.

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name.
4. Click the **Account Store** tab.
5. Click **Add Account Store**.
6. In the *account store* list, select the appropriate directory.<br>
	<img src="http://www.stormpath.com/sites/default/files/docs/LSDropdown1.png" alt="Login Sources" title="Login Sources"><br>
7.  If the directory contains groups, you can select all users or specific group for access.<br> 
	<img src="http://www.stormpath.com/sites/default/files/docs/LSDropdown2.png" alt="Login Sources" title="Login Sources"><br>
8. Click **Add Account Store**.<br>
The new account store is added to the bottom of the account store list.    

	account_store_mapping = client.account_store_mappings.create({ 
  	application: application, # an application resource object 
 		account_store: directory, # a directory or a group resource object 
  	list_index: 0, 
  	is_default_account_store: true, 
  	is_default_group_store: true 
	}) 

#### Retrive an account store mapping

Account store mappings are retrivable through their REST URL:

	account_store_mapping = client.account_store_mappings.get 'https://api.stormpath.com/v1/accountStoreMappings/:accountStoreMappingId;
	application = account_store_mapping.application 
	account_store = account_store_mapping.account_store # this could be a directory or a group instance 
	list_index = account_store_mapping.list_index 
	default_account_store = account_store_mapping.default_account_store? 
	default_group_store = account_store_mapping.default_group_store? 


#### Change Account Store Priority

When you map multiple account store to an application, you must also define the account store order.

The account store order is important during the login attempt for a user account because of cases where the same user account exists in multiple directories. When a user account attempts to log in to an application, Stormpath searches the listed account store in the order specified, and uses the credentials (password) of the first occurrence of the user account to validate the login attempt.

To specify the account store order:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name.
4. Click the **Account Store** tab.
5. Click the row of the directory to move.
6. Drag the row to the appropriate order.<br>
	For example, if you want to switch the first account store and the second account store, click anywhere in the first row of the account store table and drop the row on the second row.<br>
	<img src="http://www.stormpath.com/sites/default/files/docs/LoginPriority.png" alt="Login Sources" title="Login Sources" width="650">
7. Click **Save Priorities**.

		account_store_mapping = client.account_store_mappings.get 'https://api.stormpath.com/v1/accountStoreMappings/:accountStoreMappingId;
		account_store_mapping.list_index = 1 # or whichever index number you prefer
		account_store_mapping.save

#### Change Default Account Store and Default Group Store:

When you map multiple account store to an application, you must also define the account store order.

New accounts created by the application will be automatically saved to the mapping’s default account store.
New groups created by the application will be automatically saved to the mapping’s default group store.

To specify the default account or group store:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name.
4. Click the **Account Store** tab.
5. Click the radio buttons to toggle between default account and group locations (stores).
<br>
	<img src="http://www.stormpath.com/sites/default/files/docs/LoginPriority.png" alt="Login Sources" title="Login Sources" width="650">
6. Click **Save**.

		account_store_mapping = client.account_store_mappings.get 'https://api.stormpath.com/v1/accountStoreMappings/:accountStoreMappingId;
		account_store_mapping.default_account_store = directory # this can be a directory or a group instance
		account_store.mapping.default_group_store = directory # this can only be a directory instance
		account_store_mapping.save

#### Remove Account Stores

Removing a account store from an application deprovisions that directory or group from the application. By doing so, all accounts from the account store are no longer able to log into the application.

To remove a account store from an application:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name.
4. Click the **Account stores** tab.
5. On the Account stores tab, locate the directory or group.
6. Under the Actions column, click **Remove**.

		account_store_mapping = client.account_store_mappings.get 'https://api.stormpath.com/v1/accountStoreMappings/:accountStoreMappingId;
		account_store_mapping.delete


## Directories

[Directories](#Directory) contain [authentication](#Authentication) and [authorization](#Authorization) information about users and groups. Stormpath supports an unlimited number of directories. Administrators can use different directories to create silos of users. For example, you might store your customers in one directory and your employees in another.

For directories, the basic details include:

Attribute | Description
:----- | :-----
Name | The name used to identify the directory within Stormpath. This value must be unique.
Description | Details about this specific directory. (Optional)
Status | By default, this value is set to Enabled. Change the value to Disabled if you want to prevent all user accounts in the directory from authenticating even where the directory is set as an account store to an application.

Within Stormpath, there are two types of directories you can implement:

* A <strong>Cloud</strong> directory, also known as a Stormpath-managed directory, which is hosted by Stormpath and uses the Stormpath data model to store user and group information. This is the default and most common type of directory in Stormpath.
* A <strong>Mirror</strong> directory, which is a Stormpath-hosted directory populated with data pushed from your existing LDAP/AD directory using a Stormpath synchronization agent. All user management is done on your existing LDAP/AD directory, but the cloud mirror can be accessed through the Stormpath APIs on your modern applications.
	* LDAP/AD directories cannot be created using the API.
	* You can specify various LDAP/AD object and attribute settings of the specific LDAP/AD server for users and groups via the Stormpath Admin Console.
	* If the agent status is Online, but you are unable to see any data when browsing your LDAP/AD mapped directory, it is likely that your object and filters are configured incorrectly.

You can add as many directories of each type as you require. Changing group memberships, adding accounts, or deleting accounts in directories affects ALL applications to which the directories are mapped as <a href="#LoginSource" title="login source">account stores</a>.

LDAP/AD accounts and groups are automatically deleted when:

* The backing object is deleted from the LDAP/AD directory service.
* The backing LDAP/AD object information no longer matches the filter criterias configured for the agent.
* The LDAP/AD directory is deleted.

For directories, you can:

* [Locate the directory REST URL](#LocateDirURL).
* [List directories](#ListDirectories).
* [Retrieve directories](#RetrieveDir).
* [Create a directory](#CreateDir).
	* [Create a cloud directory](#CreateCloud). 
	* [Create a mirrored (LDAP) directory](#CreateMirror).
* [Map directories to applications](#AssocApplications).
* [Edit directory details](#EditDir). 
* [Update agent configuration](#UpdateAgent).
* [Enable a directory](#EnableDir).
* [Disable a directory](#DisableDir).
* [Delete a directory](#DeleteDir).


### Locate the Directory REST URL
When communicating with the Stormpath REST API, you might need to reference a directory using the REST URL or `href`. For example, you require the REST URL to create accounts in the directory using an SDK. 

To obtain a directory REST URL:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. In the Directories table, click the directory name.<br>
The REST URL appears on the Details tab.<br><img src="http://www.stormpath.com/sites/default/files/docs/Resturl.png" alt="Application Resturl" title="Application Resturl">


### List Directories
To retrieve directories, you must:

1. Get the directories from the client.

**Code:**

        require "stormpath-sdk"
        ...
        ...
        client.directories.each do |dir|
            p '** Directory: ' + dir.name
            p '   Description: ' + ((dir.description.nil?) ? '-' : dir.description)
            p '   Status: ' + dir.status
        end

### Retrieve a Directory

You will typically retrieve a `Directory` linked from another resource. 

You can also retrieve it or as a direct reference, such as `account.directory`.

Finally, you can also directly retrieve a specific directory using the `href` (REST URL) value. For any directory, you can [find the directory href](#LocateDirURL) in the Stormpath console.

After you have the `href` it can be loaded directly as an object instance by retrieving it from the server, using the client:

	require "stormpath-sdk"
	...
	...
	href = 'https://api.stormpath.com/v1/directories/DIR_UID_HERE'
	directory = client.directories.get href 

### Create a Directory

To create a directory for application authentication, you must know which type of directory service to use. 

You can create a:

* [Cloud directory](#CreateCloud), which is hosted by Stormpath and uses the Stormpath data model to store user and group information. This is the most common type of directory in Stormpath.

**OR**

* [Mirrored (LDAP) directory](#CreateMirror), which uses a synchronization agent for your existing LDAP/AD directory. All user account management is done on your existing LDAP/AD directory with the Stormpath agent mirroring the primary LDAP/AD server.

{% docs note %}
The ability to create a mirrored, or agent, directory is connected to your subscription. If the option is not available, click the question mark for more information.
{% enddocs %}

#### Create a Cloud Directory


	require "stormpath-sdk"
	...
	...
	directory = client.directories.create({
		name: "New Directory",
		description: "New Directory Description"
	})
	

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
Directory Status | Whether or not the directory is to be used to authenticate accounts for any assigned applications. By default, this value is set to Enabled. Change the value to Disabled if you want to prevent all user accounts in the directory from authenticating even where the directory is set as a account store to an application.

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
5. To change a account store, you must modify the application account store information.<br>If the directory is currently not specified as a account store for an application, the table contains the following message:<br>	
	*Currently, there are no applications associated with this directory. To create an association, click here, and select an application. From the account stores tab, you can create the association.*


### Edit Directory Details

To edit directories, use the `_accessors_` of an existing directory instance to set the values and call the `save` method:

        require "stormpath-sdk"
        ...
        ...
        directory.status = Status::DISABLED  # the Status class provides the valid status' constants
        directory.name = 'New Directory Name'
        directory.description = 'New Directory Description'

        directory.save


### Update Agent Configuration

You can modify an agent configuration going through the [Directories](#UpdateAgentDir) or [Agent](#UpdateAgentAgents) tabs.

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
4. Click the **Agent Configuration** tab. 
5. Make the necessary changes and click **Update**.

{% docs note %}
If you do not see an Agent Configuration tab, you are looking at a Stormpath cloud directory.
{% enddocs %}

#### Agents Tab
1. Log in to the Stormpath Admin Console.
2. Click the **Agents** tab.
3. Click the directory name.
4. Make the necessary changes and click **Update**.


### Enable a Directory

Enabling previously disabled directories allows the groups and accounts to log into any applications for which the directory is defined as a account store.

To enable a directory, you must:

1. Get the directory instance from the client instance with the href of the directory.
2. Set the directory instance to enabled.
3. Call the save method on the directory instance.

**Code:**

        require "stormpath-sdk"
        ...
        ...
        href = 'https://api.stormpath.com/v1/directories/DIR_UID_HERE'
        directory = client.directories.get href

        directory.status = Status::ENABLED  # the Status class provides the valid status' constants

        directory.save

### Disable a Directory

Disabling directories prevents the accounts from logging into any applications connected to Stormpath, but retains the directory data as well as all group and account data. If you must shut off several accounts quickly and easily, disable a directory. 

The Stormpath Administrators directory cannot be disabled.

To disable a directory, you must:

1. Get the directory instance from the client with the href of the directory.
2. Set the directory instance to disabled.
3. Call the save method on the directory instance.

**Code:**

        require "stormpath-sdk"
        ...
        ...
        href = 'https://api.stormpath.com/v1/directories/DIR_UID_HERE'
        directory = client.directories.get href

        directory.status = Status::DISABLED  # the Status class provides the valid status' constants

        directory.save

### Delete a Directory

**Code:**

        require "stormpath-sdk"
        ...
        ...
        href = 'https://api.stormpath.com/v1/directories/DIR_UID_HERE'
        directory = client.directories.get href

        directory.delete

***

## Accounts

In Stormpath, users are referred to as user account objects or [accounts](#Account). The username and email fields for accounts are unique within a directory and are used to log into applications. Within Stormpath, an unlimited number of accounts per directory is supported. 

You manage LDAP/AD accounts on your primary LDAP/AD installation. LDAP/AD accounts and groups are automatically deleted when:

* The backing object is deleted from the LDAP/AD directory service.
* The backing LDAP/AD object information no longer matches the account filter criteria configured for the agent.
* The LDAP/AD directory is deleted.

An account is a unique identity within a directory. An account can exist in only a single directory but can be a part of multiple groups owned by that directory.


For accounts, the the basic detail information includes:

Attribute | Description
:----- | :-----
Directory | The directory to which the account will be added.
Username | The login name of the account for applications using username instead of email. The value must be unique within its parent directory.|
First Name | The account owner first name.
Middle Name | The account owner middle name.
Last Name | The account owner last name.
First Name | The account owner first name.
Email | The account owner email address. This is can be used by applications, such as the Stormpath Admin Console, that use an email address for logging in. The value must be unique within its parent directory.
Status | The status is set to Enabled by default. It is only set to Disabled if you want to deny access to the account to Stormpath-connected applications.
Password | The credentials used by an account during a login attempt. The specified value must adhere to the password policies set for the parent directory.

{% docs note %}
The account cannot be moved to a different directory after it has been created.
{% enddocs %}

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

	require "stormpath-sdk"
	...
    ...
    client = Stormpath::Client.new api_key_file_location: File.join(ENV['HOME'], '.stormpath', 'apiKey.properties')

	href = 'https://api.stormpath.com/v1/applications/APP_UID_HERE'
	application = client.applications.get href

	# when the account is authenticated, it produces an AuthenticationResult
	request = Stormpath::Authentication::UsernamePasswordRequest.new 'usernameOrEmail', 'password'
	result = application.authenticate_account request

	# from the result, we obtain the authenticated Account
	account = result.account

### List Accounts

For accounts, you can view, or list them according to their [group membership](#ListGroupAccounts), 
[the directories to which they belong](#ListDirectoryAccounts), or the [applications
 to which they are associated](#ViewAccountMap).

#### List Accounts by Group

To list all accounts associated with a group:

1. Get the client.
2. Get the group from the client with the group `href`.
3. Get the group accounts.

**Code:**

	 require "stormpath-sdk"
	 ...
     ...
	 href = 'https://api.stormpath.com/v1/groups/GROUP_UID_HERE'
     group = client.groups.get href
  
	 accounts = group.accounts
	  
	 accounts.each do |acc|
	    p 'Given Name ' + acc.given_name
	 end


#### List Accounts by Directory 

To list user accounts contained in a directory, you must:

1. Get the client.
2. Get the directory from the client with the directory `href`.
3. Get the directory accounts from the directory instance.

**Code:**

	 require "stormpath-sdk"
	 ...

	 href = 'https://api.stormpath.com/v1/directories/DIR_UID_HERE'
	 directory = client.directories.get href
  
	 accounts = directory.accounts
  
	 accounts.each do |acc|
	    p 'Given Name ' + acc.given_name
	 end


#### List Accounts by Application

To list user accounts mapped to an application, you must:

1. Get the client.
2. Get the application from the client with the application `href`.
3. Get the application accounts.

**Code:**

	 require "stormpath-sdk"
	 ...

	 href = 'https://api.stormpath.com/v1/applications/APPLICATION_UID_HERE'
	 application = client.applications.get href
  
	 accounts = application.accounts
  
	 accounts.each do |acc|
	    p 'Given Name ' + acc.given_name
	 end



### Retrieve an Account

To retrieve a specific account you need the `href` which can be loaded as an object instance by retrieving it from the server, using the client:

	require "stormpath-sdk"
	...
	href = 'https://api.stormpath.com/v1/accounts/ACCOUNT_UID_HERE'
	account = client.accounts.get href


### Create an Account

To create a user accounts, you must:

1. Get the client.
2. Get the directory where you want to create the account from the client with the directory href.
3. Set the account properties.
4. Create the account from the directory.

**Code:**

         require "stormpath-sdk"
         ...
         ...
         href = 'https://api.stormpath.com/v1/directories/DIR_UID_HERE'
         directory = client.directories.get href

         account = directory.accounts.create({
           given_name: 'John',
           surname: 'Smith',
           email: 'john.smith@example.com',
           username: 'johnsmith',
           password: '4P@$$w0rd!'
         })

If you want to override the registration workflow and have the account created with ENABLED status right away, pass an account instance and _false_ as second argument, for example:

     account = Stormpath::Resource::Account.new({
       given_name: 'John',
       surname: 'Smith',
       email: 'john.smith@example.com',
       username: 'johnsmith',
       password: '4P@$$w0rd!'
     }, client)

     account = directory.create_account account, false

If you want to associate the new account to a group, use the following:

	account.add_group group

### Edit Account Details

To edit accounts, use the setters of an existing account instance to set the values and call the `save` method:

	require "stormpath-sdk"
	...
	...
	account.status = Stormpath::Resource::Status::DISABLED  # the Status class provides the valid status' 	constants
	account.given_name = 'New Given Name'
	account.surname = 'New Surname'
	account.username = 'New Username'
	account.email = 'New Email'
	account.password = 'New Password'
	account.middle_name = 'New Middle Name'

	account.save

If you want to add a group to an account, do the following:

	account.add_group group
	

### Assign Accounts to Groups

The association between a group and an account can be done from an account or group instance. If the account is part of a directory containing groups, you can associate the account with a group. To add an account to a group, you must:

1. Get a client instance.
2. Get the group and account instances from the client with the corresponding hrefs.
3. Add the group to the account instance OR add the account to the group instance.

**Code:**

	 require "stormpath-sdk"
	 ...
	 ...
	 href = 'https://api.stormpath.com/v1/accounts/ACCOUNT_UID_HERE'
	 account = client.accounts.get href
	  
	 href = 'https://api.stormpath.com/v1/groups/GROUP_UID_HERE'
	 group = client.groups.get href
  
	 # account.add_group group OR group.add_account account


### Remove Accounts from Groups

The remove an account from, or delete the account as a member of, a group you must:

1. Get a client instance.
2. Get the group membership instance.
	* The group membership can be retrieved directly from the client, if the `href` is known to the user.
	* Another way of retrieving the group membership is by searching for the group membership that represents the relationship between the group and the account that you want to delete.
3. Delete the group membership by calling the `delete` method.

**Code:**

	 require "stormpath-sdk"
	 ...
	 ...
	 href = 'https://api.stormpath.com/v1/groupMemberships/GROUP_MEMBERSHIP_UID_HERE'
	 group_membership = client.group_memberships.get href
  
	 group_membership.delete 
	
**OR**

	 require "stormpath-sdk"
	 ...
	 ...
	 group_href = 'https://api.stormpath.com/v1/groups/GROUP_UID_HERE'
 
	 account_href = 'https://api.stormpath.com/v1/accounts/ACCOUNT_UID_HERE'
	 account = client.accounts.get account_href
 
	 group_linked = false
	 group_membership = nil
	 # looping the group membership aggregate of the account
	 account.group_memberships.each { |tmp_group_membership|
 
	   group_membership = tmp_group_membership
	   tmp_group = group_membership.group
 
	   # here, we make sure this is the group we're looking for
	   if !tmp_group.nil? and tmp_group.href.include? group_href
        group_linked = true
        break
	   end
	 }
 
	 # if the group was found, we delete it
	 if group_linked
	   group_membership.delete
	 end



### Enable Accounts

Enabling a previously disabled account allows the account to log in to any applications where the directory or group is defined as an application account store.

{% docs note %}
Enabling and disabling accounts for mirrored (LDAP) directories is not available in Stormpath. You manage mirrored (LDAP) accounts on the primary server installation.
{% enddocs %}

To enable an account, you must:

1. Get a client instance.
2. Get the account instance from the client with the account href.
3. Set the account instance status to enabled.
4. Call the save method on the account instance.

**Code:**

	 require "stormpath-sdk"
	 ...
	 ...
	 href = 'https://api.stormpath.com/v1/accounts/ACCOUNT_UID_HERE'
	 account = client.accounts.get href
  
	 account.status = Status::ENABLED  # the Status class provides the valid status' constants
 
	 account.save

### Disable Accounts

Disabling an account prevents the account from logging into any applications in Stormpath, but retains all account information. You typically disable an account if you must temporarily remove access privileges.

If you disable an account within a directory or group, you are completely disabling the account from logging in to any applications to which it is associated.

{% docs note %}
Enabling and disabling accounts for mirrored (LDAP) directories is not available in Stormpath. You manage mirrored (LDAP) accounts on the primary server installation.
{% enddocs %}

To disable an account, you must:

1. Get a client instance.
2. Get the account instance from the client with the account href.
3. Set the account instance status to disabled.
4. Call the save method on the account instance.

**Code:**

	 require "stormpath-sdk"
	 ...
	 ...

	 href = 'https://api.stormpath.com/v1/accounts/ACCOUNT_UID_HERE'
	 account = client.accounts.get href
  
	 account.status = Status::DISABLED  # the Status class provides the valid status' constants
 
	 account.save


### Delete an Account

Deleting an account completely erases the account from the directory and erases all account information from Stormpath.

To delete an account, you must:

1. Get a client instance.
2. Get the account instance from the client with the account href.
3. Call the `delete` method on the account instance.

**Code:**

     require "stormpath-sdk"
     ...
     ...

     href = 'https://api.stormpath.com/v1/accounts/ACCOUNT_UID_HERE'
     account = client.accounts.get href

     account.delete


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
Name | The name of the group. Within a given directory, this value must be unique.
Description | A short description of the group.
Status | This is set to Enabled by default. This is only set to Disabled to prevent all group accounts from logging into any application even when the group is set as a account store to an application.

{% docs note %}
If an account is also a member to another group that does have access to an application, then the account can login.
{% enddocs %}

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

	require "stormpath-sdk"
	...
	...
	href = 'https://api.stormpath.com/v1/accounts/ACCOUNT_UID_HERE'
	account = client.accounts.get href
  
	groups = account.groups
 
	groups.each do |grp|
		p 'Group ' + grp.name
	end

#### List Groups in a Directory

To list all groups contained within a directory, you must:

1. Get a client instance.
2. Get the directory instance from the client instance using the directory href.
3. Get the groups from the directory.

To list all groups on a directory or an account, loop the groups aggregate from a directory or an account:

        require "stormpath-sdk"
        ...
        ...
        href = 'https://api.stormpath.com/v1/directories/DIR_UID_HERE'
        directory = client.directories.get href

        groups = directory.groups

        groups.each do |grp|
            p 'Group ' + grp.name
        end

### Retrieve a Group

To retrieve a specific group you need the `href` which can be loaded as an object instance by retrieving it from the server:

	require "stormpath-sdk"
	...
	...
	href = 'https://api.stormpath.com/v1/groups/GROUP_UID_HERE'
	group = client.groups.get href


### Create Groups

You can create a group from the Ruby SDK. You can do it getting a reference to a directory and creating the group out of it:

	require "stormpath-sdk"
	...
	...
	directory_url = "https://api.stormpath.com/v1/directories/YOUR_DIRECTORY_ID_HERE"

    directory = client.directories.get directory_url

    group = directory.groups.create({
      name: 'A new group', 
      description: 'The description of the new group'
    })


### Edit Group Details

To edit groups, use the `_accesors_` of an existing group instance to set the values and call the save method:

	require "stormpath-sdk"
	...
	...
	group.status = Status::DISABLED  # the Status class provides the valid status' constants
	group.name = 'New Group Name'
	group.description = 'New Group Description'

	group.save


### Enable a Group

If the group is contained within an <em>enabled directory where the directory is defined as a account store</em>, then enabling or re-enabling the group allows all accounts contained within the group (membership list) to log in to any applications for which the directory is defined as a login source.

If the group is contained within a <em>disabled directory where the directory is defined as a account store</em>, the group status is irrelevant and the group members are not be able to log in to any applications for which the directory is defined as a account store.

If the group is defined as a account store, then enabling or re-enabling the group allows accounts contained within the group (membership list) to log in to any applications for which the group is defined as a account store.

To enable a group, you must:

1. Create a client instance.
2. Get the group instance from the client instance using the group href.
3. Set the group instance status to enabled.
4. Call the save method on the group instance.

**Code:**

	require "stormpath-sdk"
	...
	...
	href = 'https://api.stormpath.com/v1/groups/GROUP_UID_HERE'
	group = client.groups.get href
  
	group.status = Status::ENABLED  # the Status class provides the valid status' constants
 
	group.save


### Disable a Group

If a group is explicitly set as an application account store, then disabling that group prevents any of its user accounts from logging into that application but retains the group data and memberships. You would typically disable a group if you must shut off a group of user accounts quickly and easily.

To disable a group, you must:

1. Get a client instance.
2. Get the group instance from the client instance using the group href.
3. Set the group instance status to disabled.
4. Call the save method on the group instance.

**Code:**

	require "stormpath-sdk"
	...
	...
	href = 'https://api.stormpath.com/v1/groups/GROUP_UID_HERE'
	group = client.groups.get href
  
	group.status = Status::DISABLED  # the Status class provides the valid status' constants
 
	group.save

	 
### Delete a Group

A group can be deleted by invoking the `delete` method on the group instance:

	require "stormpath-sdk"
	...
	...
	href = 'https://api.stormpath.com/v1/groups/GROUP_UID_HERE'
	group = client.groups.get href
  
	group.delete
 

***


## Workflow Automations

Workflows are common user management operations that are automated for you by Stormpath. Account Registration and Verification workflow configurations manage how accounts are created in your directory. The Password Reset workflow enables you to configure how password reset works and the context of messages. For both workflows, messages can be formatted in plain text or HTML.

Workflows are only available on cloud directories and only configurable using the Stormpath Admin Console.The Stormpath Administrator directory has default workflow automations which cannot be altered.<br>

On the Workflows tab, you can automate <a href="#AccountRegistration" title="account registration and verification">account registration and verification</a> and <a href="#PasswordReset" title="password reset">password resets</a>.

<img src="http://www.stormpath.com/sites/default/files/docs/ManageWorkflows.png" alt="Workflow Automation" title="Workflow Automation" width="670" height="250">


### Account Registration and Verification

For the Account Registration and Verification workflow, you must perform the following actions:

* <a href="#ConfigureAccountRegistration" title="Configure Account Registration and Verification">Configure account registration and verification</a>
* <a href="#InitiateAccountRegistration" title="Initiate Account Registration and Verification">Initiate account registration and verification</a>
* <a href="#VerifyAccount" title="Verify the Account">Verify the account</a>
<br>

{% docs note %}
The ability to modify workflows, depends on your subscription level. If an option is not available (grayed out), click the question mark for more information.
{% enddocs %}

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


#### Verify Account

If a directory has the the account verification workflow enabled:

1. A newly created account in the directory has an `UNVERIFIED` status until the email address has been verified.
2. When a new user is registered for the first time, Stormpath sends an email to the user with a secure verification link, which includes a secure verification token.
3. When the user clicks the link in the email, they are sent to the verification URL set up in the verification workflow. 
	* To verify the account email address (which sets the account status to `ENABLED`), the verification token in the account verification email must be obtained from the link account holders receive in the email. 
	* This is achieved by implementing the following logic:

			require "stormpath-sdk"
			...
			...
			verification_token = # obtain it from query parameter, according to the workflow configuration of the link

			# when the account is correctly verified it gets activated and that account is returned in this verification
			account = client.accounts.verify_email_token verification_token



### Password Reset

When you reset an account password using Stormpath, the user receives an email with a link and a secure reset token. The link sends the user to a password reset page where they submit a new password to Stormpath. When the password is successfully reset, the user receives a success email. You can configure, at the directory level, how password reset works, the URL of the reset page, and the content of the email messages.

This workflow is enabled by default.

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

	require "stormpath-sdk"
	...
	...
	href = 'https://api.stormpath.com/v1/applications/APP_UID_HERE'
	application = client.applications.get href

	# creating the password reset token and sending the email
	application.send_password_reset_email 'email'


#### Complete Password Reset

After the password reset token is created and the workflow is initiated, Stormpath sends a reset email to the user. The email contains a web link that includes the [base URL](#BaseURL) and the reset token. 

`https://myAwesomeapp.com/passwordReset?sptoken=TOKEN`

Where `myAwesomeapp.com/passwordReset` is the base URL.

After the user clicks the link, the user is sent to the base URL. The password reset token can then be obtained from the query string.

To complete password reset, collect and submit the user's new password with the reset token to Stormpath.

{% docs note %}
To complete the password reset, you do not need any identifying information from the user. Only the password reset token and the new password are required.
{% enddocs %}

The password is changed as follows:

	require "stormpath-sdk"
	...
	...  
	href = 'https://api.stormpath.com/v1/applications/APP_UID_HERE'
	application = client.applications.get href

	# getting the Account from the token and changing the password
	account = application.verify_password_reset_token 'PASS_RESET_TOKEN'
	account.password = 'New Password'
	account.save


***


## Ruby Sample Code

### Heroku Ruby Sample App

This [application](https://github.com/stormpath/stormpath-heroku-ruby-sample) is a rudimentary Ruby test application that can run on Heroku to demonstrate how to communicate successfully with the Stormpath REST API.


**Code:**

	require "stormpath-sdk"
	require "sinatra"
	require "cgi"

	get '/' do

		begin

			application_url = ENV['STORMPATH_URL']
			api_key_id = ENV['STORMPATH_API_KEY_ID']
            api_key_secret = ENV['STORMPATH_API_KEY_SECRET']

            api_key = Stormpath::ApiKey.new api_key_id, api_key_secret
            client = Stormpath::Client.new  api_key: api_key

		    application = client.applications.get application_url

		    inspect_result = application.inspect

		    "<h2>Your Heroku Stormpath configuration works!</h2></br>Here's your application information:</br></br>" +
		        CGI::escapeHTML(inspect_result)

		rescue Exception => e

		    "Something went wrong: " + e.message

		end

	end



### Create a Stormpath SDK Client Using a Stormpath API Key File

The following code shows how to create a Stormpath SDK client using a Stormpath API key file and communicate with the Stormpath REST API.

**Code:**

    #!/usr/bin/env ruby

    require 'optparse'
    require 'rubygems'
    require 'stormpath-sdk'

    options = {}
    help_called = false

    opt_parser = OptionParser.new do |opt|
        opt.banner = "Usage: ruby stormpath.rb COMMAND [OPTIONS]"
        opt.separator ""
        opt.separator "This script helps you test the Stormpath Ruby SDK."
        opt.separator ""
        opt.separator "If no option is specified, the Client instance is displayed with a 'to_s' call."
        opt.separator ""
        opt.separator  "Commands"
        opt.separator  "     file: use the specified file to retrieve API Key Information."
        opt.separator  ""
        opt.separator  "Options"

        opt.on("-o","--option OPTION","Available options to perform on the Ruby SDK.") do |option|
            options[:option] = option
        end

        opt.separator  "         tenant: get the a Tenant representation based on the provided API Key" +
                         " with a call to 'inspect' on that Tenant."

        opt.on("-h","--help","Help on this script.") do
            puts opt_parser
            help_called = true
        end

        opt.separator  ""
        opt.separator  "Examples:"
        opt.separator  "    Get Tenant from file: ruby stormpath.rb file -o tenant YOUR_FILE_HERE_REPLACEME"

    end
    opt_parser.parse!
    case ARGV[0]

        when "file"

            opt = options[:option]
            file = ARGV[1]

            if !file.nil? and File::exist? file

                client = Stormpath::Client.new({
                    api_key_file_location: file
                })

                if (opt == 'tenant')

                    puts "Getting tenant from Client..."
                    begin

                        puts client.tenant.inspect
                        puts "Done"

                    rescue Stormpath::Error => e

                        p '** Error Retrieving Tenant **'
                        p 'Message: ' + e.message
                        p 'HTTP Status: ' + e.status.to_s
                        p 'Developer Message: ' + e.developer_message
                        p 'More Information: ' + e.more_info
                        p 'Error Code: ' + e.code.to_s

                    end

                else
                    puts "Showing Client instance..."
                    puts client.to_s
                    puts "Done"

                end

            else
                puts "File #{file} does not exist."
            end

        else
            if !help_called
                puts opt_parser
            end
    end



To run this sample, you require the Stormpath Ruby SDK gem installed on your system. You can install it using the following command:

	gem install stormpath-sdk --pre

Then, assuming you saved the code shown above in a file called stormpath.rb, run:

	ruby stormpath.rb file ~/.stormpath/your_stormpath_api_key.properties -o tenant

This prints your tenant data, such as name, link to applications, and directories. If you see your tenant @properties printed, you have successfully communicated with Stormpath through the Ruby SDK!

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