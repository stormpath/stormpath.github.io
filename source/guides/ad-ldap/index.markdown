---
layout: doc
lang: guides
title: Integrating Stormpath with Active Directory and LDAP
---

In this guide, we discuss how to set up Stormpath to manage and authenticate users that are synced from mirrored Active Directory (AD) and LDAP locations. Stormpath provides robust tools that are firewall friendly to help you build applications for your company or your clients that have existing user repositories.

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

It’s an elegant solution for organizations transitioning to the cloud, and the simplest tool for developers wrestling with Active Directory/LDAP.  If you are building a [multi-tenant](/guides/multi-tenant) application, you can use the Stormpath AD/LDAP Agent to sync data from your customers AD/LDAP servers into the cloud.

Stormpath is fully configurable to import objects and map attributes for both `Accounts` and `Groups`.  Stormpath will also delegate authentication requests to Active Directory / LDAP servers, this means that password policies around strength / expiration are managed externally, but a developer does not need to understand the complexity of these systems.

In the following sections, we will outline considerations and best practices with using this functionality.

## Setting up the Stormpath Active Directory / LDAP Agent

When enabling Stormpath to work with Active Directory and LDAP servers, you create what is called a `Mirrored Directory` in Stormpath.

A `Directory` in Stormpath is a top-level storage container of `Accounts` and `Groups`. Directories resemble real world repositories of users that can be mapped to an `Application`.  This denotes that the directory is able to login or authenticate to an application.

Note that mirrored directories are read-only, they represent a mirror of the representative information stored in AD/LDAP server.

To be able to mirror information between Stormpath and the AD / LDAP server, it is required to configure an install an `Agent`.

{% docs note %}
Agent configuration is an option that is enabled through the [Administrator Console](api.stormpath.com) and is only available for tenants with the [subscription plan](www.stormpath.com/pricing) Premium or higher. 
{% enddocs %}

To configure an `Agent`, you must login to the [Administrator Console](api.stormpath.com), and follow these steps:

1. Click on the `Directories` tab
2. Click on `Create Directory` button
3. Click the `Mirror` button

This will start the directory creation wizard for AD / LDAP.  After configuring the Mirrored Directory, you will be able to input Agent configuration information related to AD / LDAP such as:

1. Agent User DN
2. Agent User Password
3. Directory connection parameters such as Host and Port
4. Attribute Configuration

Once the creation wizard is completed, you will be able to download the agent to deploy on the network with the AD / LDAP server.

After the agent is deployed and started, the agent will reports its status and it can be monitored directly from the Stormpath Administrator Console in the Agents tab.

##  Authentication Considerations for Multiple Active Directory / LDAP Configurations

When authenticating an account to an Application that is mapped to a `Mirrored Directory` the authentication request is delegated to the AD / LDAP server.  This means that Stormpath does not store passwords or password hashes for mirrored directories. Authentication can be performed through a REST API call, or by using one of the Stormpath SDKs.

Directories enforce email/username uniqueness across accounts within the directory, so two accounts can not have the same email or username. If you have multiple directories for additional AD / LDAP servers, it is possible that the same email or username will exist in multiple directories.

During login, when an application is mapped to multiple directories as `Account Stores` Stormpath consults the application’s assigned account stores in the order that they are assigned to the application. When a matching account is discovered in a mapped account store, it is used to verify the authentication attempt and all subsequent account stores are ignored. In other words, accounts are matched for application login based on a ‘first match wins’ policy.

For developers that have multiple mirrored directories, it is recommended to specify the specific account store for the login attempt.

To illustrate this further take the following example:

        //Multi-tenant application allow you to log into multiple sub-domains 

        //Sub-domain #1
        http://customer-a.mysite.com/login

        //Sub-domain #2
        http://customer-b.mysite.com/login

The application during the login attempt will be able to route each login attempt to the correct `Account Store` (or Mirrored Directory) based on the sub-domain.  The Stormpath REST API and SDKs allow you to search/iterate account store mapping and associate a login attempt with an account store.

{% docs note %}
 Collecting tenant through sub-domain is one way of understanding the tenant, their are also other mechanisms for handling multi-tenancy within Stormpath. Please check out our [multi-tenancy guide](/guides/multi-tenant) for more info
{% enddocs %}

## Supplementing Mirrored Active Directory / LDAP with Account Linking

Since Mirrored Directories are read-only, your application may require the ability to set additional groups / roles, store additional details, or even associate an account with an additional Facebook or Google account within Stormpath. 

This is accomplished using a separate master `Directory` and storing account hrefs in the account `Custom Data`.  

{% docs notes %}
The master directory is not an `Account Store` for the application.  Users will not be able to login to the master directory, they will authenticate against the Active Directory or LDAP `Mirrored Directory`
{% enddocs %}

The `customData` resource is a schema-less JSON object (aka ‘map’, ‘associative array’, or ‘dictionary’) that allows you to specify whatever name/value pairs you wish.

A common strategy is to store an array of account links (account's `href` property) on an account so they can be accessed easily.

### Provisioning Accounts

When provisioning accounts in the master directory, their are some best practices
Provisioned accounts for account linking usually follows this work flow:

1.  A user authenticates with an application.
1.  Once authenticate:
    1. Search for the account in the master directory (this can be done by username or email)
    2. If user does not exist in the master directory, create it.
    3. Store a link to the account in the mirrored directory as custom data on the created account in the master directory

Since Stormpath enforces specific required fields (`email`, `password`, `giveName`, `surname`) some of these may fields may require dummy data to get around the enforcement.  Since

This created duplicated account in the master directory will act as a holder for additional account links and other metadata that you need to store for the account.

### Synchronizing the Accounts

Accounts data that is stored in the master directory may need to sync with modification of data in the Active Directory or LDAP server.  There are a couple possibilities that are common to accomplish this:

1. Sync on authentication
2. Use a script to sync at regular time intervals 

Syncing on authentication means that when a use authenticates successfully, any changes in the mirror directory needs to be applied to the master directory.   This is a simpler solution, but will not keep a fully synced master directory.  If your application requires that this information is kept in sync then a script needs to be run at a regular interval that will read the information from a the mirrored directory and update accounts as they exist in the master directory.

### Managing Passwords 

Since the Stormpath uses delegates authentication to AD / LDAP servers for authentication, it does not store the passwords for the accounts.  Managing passwords for AD / LDAP are handled outside of Stormpath.


