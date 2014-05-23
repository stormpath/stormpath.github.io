---
layout: doc
lang: guides
title: Integrating Stormpath with Active Directory and LDAP
---

{% docs info %}
 **This feature is currently in Beta.**  If you have any question, bug reports, or enhancement requests please email support@stormpath.com. 
{% enddocs %}

{% docs note %}
AD/LDAP integration is only available to customers with a [Premium subscription plan or higher](www.stormpath.com/pricing)
{% enddocs %}


In this guide, we discuss how to set up Stormpath to manage and authenticate users that are synchronized from existing Active Directory (AD) and LDAP servers. Stormpath offers a firewall friendly approach thats perfect for internal applications trying to sync to their own AD/LDAP servers and for SaaS applications trying to sync with their customers' AD/LDAP servers.

## What is Stormpath? 

Stormpath is a user management API that makes it easy for developers to launch applications and APIs with secure, scalable user infrastructure. It automates:

* User Account registration and login
* Authentication and authorization
* Flexible, secure user profile data
* Group and role management, including pre-built Role-Based Access Control (RBAC)
* Best-practice password security and data storage

You access Stormpath via a [beautiful](http://stormpath.com/blog/designing-rest-json-apis) REST+JSON API or our [language-specific SDKs](http://docs.stormpath.com).

## Why use Stormpath to integrate with existing Active Directory and LDAP servers?

Many organizations use Active Directory (AD) or LDAP for identity services. But connecting new web and mobile applications outside the firewall to on-premise Active Directory or LDAP servers is difficult, time-consuming and sometimes impossible. With Stormpath, you can seamlessly connect your web or mobile applications to existing Active Directory/LDAP servers.

![](https://stormpath.com/images/landingpage/ldap/ldap2.png)

It’s an elegant solution for organizations transitioning to the cloud, and the simplest tool for developers wrestling with Active Directory/LDAP.  

Stormpath is fully configurable to import objects and map attributes for both `Accounts` and `Groups`.  Stormpath will also delegate user management to Active Directory / LDAP servers, this means that password policies around strength / expiration are managed externally, and a developer does not need to understand the complexity of those systems.

In the following sections, we will outline considerations and best practices with using this functionality.

## Setting up the Stormpath Active Directory / LDAP Agent
{% docs note %}
  Configuration of AD/LDAP directories is currently only available through the [Adminstrator Console](api.stormpath.com).  It's not _yet_ available via API and SDK.
{% enddocs %}

In order to synchronize Stormpath with an Active Directory or LDAP server, you create a `Directory` in Stormpath, specifically a `Mirror Directory`

A `Directory` in Stormpath is a top-level storage container of `Accounts` and `Groups`. Directories resemble real world repositories of user accounts that can be mapped to an `Application`.  Once a `Directory` is mapped to an `Application`, all of the directory's `Accounts` are able to log into the app.

A `Mirror Directory` is a special `Directory` used for AD/LDAP synchronization. And each `Mirror Directory` is paired with a synchronization `Agent` that is install alongside the AD/LDAP server. 


To configure a `Mirror Directoy` and its `Agent`, you first log in to the [Administrator Console](api.stormpath.com), and follow these steps:

1. Click on the `Directories` tab
2. Click on `Create Directory` button
3. Click the `Mirror` button

This will start the directory creation wizard for AD / LDAP.  After configuring the Mirrored Directory, you will be able to input Agent configuration information related to the AD / LDAP server:

1. Agent User DN 
2. Agent User Password
3. Directory connection parameters such as Host and Port
4. Attribute Configuration

Once the creation wizard is completed, you can download the `Agent` to deploy on the same network as the AD / LDAP server.  `Agent installation instructions are provided in the console as the last step of the wizard.

{% docs note %}
The Stormpath `Agent` requires Java 1.6 or higher.
{% enddocs %}

After the agent is deployed and started, the agent will reports its status, pull down its configuration data, and then begin synchronization.  The agent can be monitored directly from the Stormpath Administrator Console in the Agents tab _(visible for Premium subscribers and above)_.

##Authentication Considerations for Multiple Directories

If you are mapping multiple directories to an Application in Stormpath, then you need to make special considerations regarding user authentication.  

###Understanding Stormpath Default Login Flow
First, let's explain how a login attempt flows in Stormpath.  

When a `Directory` or `Group` is associated with an `Application`, is it referred to as an `AccountStore`.  The aggregate of an application's account stores make up its userbase-- the collection of users who are able to access and log into that application.  

During a typical login attempt, Stormpath will cycle through the application's account stores in the order they are configured and search for the target user account.  Accounts are matched on a 'first match wins' policy.

Let's look at an example to illustrate this behavior.  Assume that two account stores, a 'Customers' directory and an 'Employees' directory have been assigned (mapped) to a 'Foo' application, in that order.

The following flow chart shows what happens when an account attempts to login to the Foo application:

<img src="/images/docs/LoginAttemptFlow.png" alt="Login Attempt Flow" title="Login Attempt Flow" width="650" height="500">

As you can see, Stormpath tries to find the account in the 'Customers' directory first because it has a higher _priority_ than the 'Employees' directory.  If not found, the 'Employees' directory is tried next as it has a lower priority.


###Best Practices for Multiple Directories.
For applications with a small number of mapped directories (aka `AccountStores`), you will need to determine the login priority of your `AccountStores`.  The order will depend on your use case.  If one `Account Store` is considered to be "cleaner" or have "more trusted" user data, you might put them first.  Alternatively, you might put your most important user population, first.  

For applications that have a master user `Directory` that is supplemented by AD/LDAP directories for authentication, we recommend all AD/LDAP based `AccountStores` take a higher priority over the master user `Directory`.  Once the user is authenticated, you could follow a link to their master record in your master `Directory`.  More on this scenario in the next section.

For certain applications that have large numbers of `AccountStores`, collision of usernames and email addresses can become a problem.  In these less common scenarios, it is recommended that you specify the target `AccountStore` during the login attempt.

<!--
To illustrate, take the following example.  A SaaS vendor, Acme, let's its customers connect their AD/LDAP servers for easy user provisioning. Within Stormpath, Acme now has a `Mirror Directory` for each customer with AD/LDAP.  In turn, each `Mirror Directory` is set as an `AccountStore` for their core application and each can be used to login into their core application.  

It's easy to do in code:

####Python:

    account_store = client.directories.get(directoryhref)
    application.authenticate_account('tk421@stormpath.com', 'Password1!', account_store)

####Java

    AccountStore accountStore = client.getResource(directoryHref, Directory.class);
    
    AuthenticationRequest authRequest = new
        UsernamePasswordRequest("tk421@stormpath.com", "Password1!", accountStore);

    AuthenticationResult result = application.authenticateAccount(authRequest);

How you determine which `AccountStore` to target will depend on your use case.  For multi-tenant or SaaS applications, Stormpath recommends subdomains for each tenant 

        //Multi-tenant application allow you to log into multiple sub-domains 

        //Sub-domain #1
        http://customer-a.mysite.com/login

        //Sub-domain #2
        http://customer-b.mysite.com/login

The application during the login attempt will be able to route each login attempt to the correct `Account Store` based on the sub-domain.
-->

## Supplementing a Master User Directory with AD/LDAP directories
For many applications there will likely be a master `Directory` for all users in order to keep the user base simple, enforce uniqueness of emails/username across all users, and maintain one canonical identity per user.  In fact, this is a recommended approach for most multi-tenant or SaaS applications.  Checkout our [multi-tenancy guide](/guides/multi-tenant) for more info.

However, when supporting Active Directory or LDAP integration, your application will now need to support multiple directories-- one `Mirror Directory` for each AD/LDAP integration. 

In this scenario, we recommend linking each `Account` in a AD/LDAP `Mirror Directory` with a master `Account` in the master user `Directory`.  This offers a few benefits.  

1. You can maintain one `Directory` that has _all_ your user accounts-- retaining globally unique canonical identities across your application

2. You are able to leverage your own `Groups` in the master user directory. Remember, most data in a `Mirror Directory` is read-only meaning you cannot create your own `Groups` in them, only read the `Groups` synchronized from Active Directory and LDAP

3. Keep a user's identity alive even after they've left your customer's organization and been deprovisioned in AD/LDAP.  This is valuable in a SaaS model where the user is loosely coupled to an organization.  Contractors and temporary workers are good example

###Provisioning, Linking, and Sync the Account in the Master Directory

The Stormpath `Agent` is regularly updating its `Mirror Directory` and sometimes adding new user `Accounts`.  Because this data can be quite fluid, we recommend initiating all provisioning, linking, and synchronization on a successful login attempt of the `Account` in the `Mirror Directory`.  

On a successful login attempt, you would search your master `Directory` for a matching user.  This is often done by searching for a matching email address.  

If the `Account` does not exist, you would create it.  You would then create a link between the two accounts using `customData` on the `Mirror Directory` `Account`.  The link should be the Stormpath `href` for the `Account` in the master `Directory`.

    "customData": {
        "accountLink": "https://api.stormpath.com/v1/accounts/3fLduLKlQu"
    }

{% docs tip %}
The `customData` resource is a schema-less JSON object (aka ‘map’, ‘associative array’, or ‘dictionary’) that allows you to specify whatever name/value pairs you wish.

Even though most `Mirror Directory` data is read-only, you can still write your own `customData` to the `Account` and `Group` resources.  That data, however, will NOT be written back to AD/LDAP.
{% enddocs %}

In some cases, where a user could be in many directories at once, you may need links to multiple `Accounts`, perhaps from the master `Account`. A common strategy is to store a collections of account links (again, account's `href` property).  Using `customData`, this could be a JSON map.

    "customData": {
        "accountLinks": {
            "Link1": "https://api.stormpath.com/v1/accounts/3fLduLKlQu",
            "Link2": "https://api.stormpath.com/v1/accounts/X3rjfa4Ljd", 
            "Link3": "https://api.stormpath.com/v1/accounts/a05Ghpjd30"
        }
    }

If the `Account` does already exist, then you can sync any data you like or just follow the `href` in the link to then work with the master `Account` the rest of the user's session.

