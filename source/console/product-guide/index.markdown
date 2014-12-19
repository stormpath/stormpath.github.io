---
layout: doc
lang: console
description: Learn how to manage your users in the Stormpath admin console.
title: Stormpath Admin Console Guide
---

Stormpath is a User Management API that reduces development time with instant-on, scalable user infrastructure. Stormpath’s intuitive API and expert support make it easy for developers to authenticate, manage and secure users and roles in any application.

For help to quickly get started with Stormpath, refer to the [Stormpath Admin Quickstart Guide](/console/quickstart).

***

## What is Stormpath?

Stormpath is the first easy, secure user management and authentication service for developers. 

Fast and intuitive to use, Stormpath enables plug-and-play security and accelerates application development on any platform. 

Built for developers, it offers an easy API, open source SDKs, and an active community. The flexible cloud service can manage millions of users with a scalable pricing model that is ideal for projects of any size.

By offloading user management and authentication to Stormpath, developers can bring new applications to market faster, reduce development and operations costs, and protect their users with best-in-class security.

### Architectural Overview

![High-level Architecture](/images/docs/Architecture.png =700x430 "High-level Architecture")

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


***

## Administering Stormpath

As an administrator in Stormpath, you have full access to the Stormpath Admin Console and the REST API, enabling you to perform a variety of tasks including:

* [Adding new users](#invite-other-administrators), including additional administrators 
* [Managing the default application and directory](#default-owner-application-and-directory)
* [Assigning new API keys](#manage-api-keys)
* [Registering applications](#register-an-application)
* [Creating directories](#create-a-directory)
* [Creating groups](#create-a-group)
* [Managing account stores](#manage-application-login-sources)
* [Configuring workload account automation](#workflow-automations)

### Billing and Subscription Level

When you initially sign up for Stormpath, your account is established with the default Developer subscription level. The Developer level is available for free.

If you would like to view or take advantage of features provided by higher-level subscriptions, in the top corner of the Stormpath Admin Console, click the drop drown, Subscription. If you upgrade your subscription level, you will also have to provide billing information by clicking the drop down, **Billing**.

For additional information on the various service offerings and subscription levels, see the [pricing page](https://stormpath.com/monthly-pricing-plans).

### Default Owner, Application, and Directory

Stormpath is configured with various default settings, including a default owner, application, and directory.

When you initially sign up for Stormpath, three resources are automatically established.

* A user account known as the [`Tenant`](#tenant) owner, which: 
	* Represents the first person in the tenant that signed up for Stormpath.
	* Cannot be disabled or deleted.
	* Is always located in the Stormpath Administrators directory.
	* Is initially responsible for inviting new administrators and managing the Stormpath tenant.

* An application named `Stormpath`, which:
	* Cannot be disabled or deleted.
	* Controls access to the Stormpath Admin Console and API.

* A directory named `Stormpath Administrators`, which:
	* Cannot be disabled or deleted.
	* Is automatically associated with the Stormpath application.
	* Cannot be removed as a account store for the Stormpath application, but it can be moved in the account store priority order.
	* Has various predetermined workflow automations that cannot be altered.
	* Provides any user accounts within this directory log in access to the Stormpath Admin Console.
	* Provides any user accounts within this directory with API keys direct API access.
	* Automatically assigns the first user account created for the tenant to this directory.
	* Provides user accounts contained within this directory the ability to add other user accounts to the directory using the Add Admin button located at the top of the Stormpath Admin Console.
	
### Invite Other Administrators

You can invite other administrator users to help you manage Stormpath applications, directories, and other aspects of your Stormpath tenant. 

To invite an administrator, use the `Add Administrator` feature. This feature sends an invitation email for other administrators to collaborate with you in Stormpath.

To invite an admin to your tenant:

1. Log in to the Admin Console
2. Click the drop down menu at top right that includes your tenant name and subscription plan
3. Click on **Manage Admins**
4. On the **Tenant Adminstrators** page, click the **Add Administrator** button
5. Fill in the email, subject, and body of the email if needed
6. Click Invite 

This will send an email invitation to the email specified. The invitees must complete their account information, once receiving the email and clicking on the invitation link that will send them to a web page. When the information is submitted, the new administrator user account is added to the Stormpath Administrators directory and gains access to the applications, directories, and accounts you have created.

### Manage API Keys

As an administrator for the tenant, you must manage the associated API keys. 

API keys give you access to manage your Stormpath Tenant, you risk exposing confidential information if you fail to take proper care of you API keys.

With API keys, you must never:

* Send API keys by email, or transfer API keys unencrypted
* Share API keys with other people in your organization - for example saving the keys in public or cloud-based folders
* Commit API keys in source repositories, such as Github
* Save API keys in configuration files

Best practices:

* Download your own API keys from Stormpath Admin Console, this will minimize the risk of compromising the keys by transferring them through an insecure channel.
* Set proper privileges on the API keys file (can be read only by the owner of the keys) in the OS.
* Rotate API keys on a regular basis.
* If API key transfer is mandatory, encrypt the key.

The following is a command line example of how to compress an apiKey file using tar and gzip and encrypt it using openssl:

	$ tar cvzf - apiKey.properties | openssl des3 -salt -k "secure secretKey" -out apiKey.properties.enc

To extract and decrypt the API key, the recipient must do the following:

	$ openssl des3 -d -k "secure secretKey" -in apiKey.properties.enc | tar xvzf -

Another way to accomplish the same thing (simpler one) is to zip and encrypt the apiKey.properties file:

	$ zip -e apiKey.encrypted apiKey.properties
	$ Enter password:
	$ Verify password:

To extract and decrypt the API key, the recipient must do the following:

	$ unzip apiKey.encrypted.zip
	$ Enter password:

For API keys, you can [assign or create new keys](#create-new-api-keys), [activate inactive keys](#activate-inactive-keys), [disable existing keys](#deactivate-existing-api-keys), or [delete existing keys](#delete-existing-api-keys) for users.

Disabling the API key prevents it from making API calls, while deleting the API key permanently removes it from Stormpath.

![API Keys](/images/console/api-keys.png =760x "API Keys")

<a name="create-new-api-keys"></a>
#### Create New API Keys

As an administrator, within the Stormpath Administrators directory you can create, or add more, [API keys](#APIKey) to user accounts.

To create a new API key for an Account:

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. Locate the account in the Stormpath Administrator directory filtering the accounts by directory (left pane) or using the search bar.
4. When clicking the account, on the **Details** pane, scroll down to the bottom of the page to the **API Keys** section and click **Create API Key**.

<a name="activate-inactive-keys"></a>
#### Enable API Keys

To activate a previously disabled API key for an Account:

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. Locate the account in the Stormpath Administrator directory filtering the accounts by directory (left pane) or using the search bar.
4. When clicking the account, on the **Details** pane, scroll down to the bottom of the page to the **API Keys** 
5. Find the API Key that you want to enable, and use the status drop down to select **Enabled**

<a name="deactivate-existing-api-keys"></a>
#### Disable API Keys

To disable an API key for an Account:

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. Locate the account in the Stormpath Administrator directory filtering the accounts by directory (left pane) or using the search bar.
4. When clicking the account, on the **Details** pane, scroll down to the bottom of the page to the **API Keys** 
5. Find the API Key that you want to disable, and use the status drop down to select **Disable**

{% docs note %}
Any applications using this API key with no longer be able to communicate or authenticate with Stormpath. When it is re-activated, the applications will work again.
{% enddocs %}

<a name="delete-existing-api-keys"></a>
#### Delete API Keys

To delete an API key for a user:

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. Locate the account in the Stormpath Administrator directory filtering the accounts by directory (left pane) or using the search bar.
4. When clicking the account, on the **Details** pane, scroll down to the bottom of the page to the **API Keys** 
5. Find the API Key that you want to delete, and click the **Delete** button in the **Action** column

{% docs note %}
Deleting an API key permanently removes it from Stormpath, any applications using this API key with no longer be able to communicate or authenticate with Stormpath. To have the application communicate with Stormpath, you must change the API key to an active API key.
{% enddocs %}

### Setting up Workflows

Stormpath automates common security workflows that many applications require. These include, [account registration and verification](#account-registration-and-verification) and [resetting passwords](#password-reset). Configurations for workflow automations are applied at the directory level using the Stormpath Admin Console. You can only use this feature on Stormpath-managed (cloud) directories. Workflow automations also exist for the default Stormpath Administrator directory, but they cannot be modified.

The **Account Registration and Verification** workflow manages how accounts are created in your directory. It allows you to control the steps that happen when new users are added to a directory. These steps typically include a verification, verification success, and welcome email. 

Within a Directory, you can click on the **Workflows** tab to:

* Enable email verification, configure emails related to verifying the account's email address.
* Enable a welcome email to be sent with information about your application.
* Configure password reset emails to automate password reset for password reset requests.

Account Registration and Verification is disabled by default on new directories.

To learn more, see [Manage Workflow Automation](#directory-workflows).

***

## Applications

An [application](#application) in Stormpath represents a real world software application that communicates with Stormpath for its user management and authentication needs.

When defining an application in Stormpath, it is typically associated with one or more directories or groups. These are called `Account Stores` in Stormpath. The associated directories and groups form the application user base. The accounts within the associated directories and groups are considered the application users and can login to the application. 

For applications, you can: 

* [Locate the application REST URL](#locate-the-application-rest-url)
* [Register an application](#register-an-application)
* [Edit an application](#edit-an-application)
* [Manage application account stores](#manage-application-login-sources) 
	* [Change default account and group locations](#change-default-account-and-group-locations)
	* [Add another account store](#add-another-login-source)
	* [Change the account store priority order](#change-login-source-priority-order)
	* [Remove account stores](#remove-login-sources)
* [Enable an application](#enable-an-application)
* [Disable an application](#disable-an-application)
* [Delete an application](#delete-an-application)
* [View accounts mapped to an application](#view-accounts-mapped-to-an-application)

### Locate the Application REST URL
When communicating with the Stormpath REST API, you might need to reference an application using the REST URL or `href`. For example, you require the REST URL to list applications by issuing an API request. 

To obtain an application REST URL:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. In the Applications table, click the application name. The REST URL appears on the Details tab.

### Register an Application
To associate an [application](#authenticate-accounts) with Stormpath for [authentication](#groups), you must register the application within Stormpath. 

To register an application:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click **Create Application**.<br> 
4. Complete the fields as follows:

Attribute | Description
:----- | :-----
Name | The name used to identify the application within Stormpath. This value must be unique.
Description | A short description of the application. 
Status | By default, this value is set to Enabled. Change the value to Disabled if you want to prevent accounts from logging in to the application.

5. For the associated directory, you can:
	a. Create a new directory, which can be named to match the application or have a distinct name.
	b. Add users from other directories or groups.
6. After specifying the directory parameters, you can specify the login priority order.
7. When all information is complete, click **Save**.


### Edit an Application

You can update an application:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name or, under the Actions column, click **Edit**. 
4. Make the necessary edits and click **Save**.

### Manage Application account stores

Account stores, otherwise called [Account Store Mappings](#account_store_mapping), define the user base for a given application. account stores determine which user account stores are used and the order in which they are accessed when a user account attempts to log in to your application.

In Stormpath, a directory or group can be a account store for an application. At least one account store must be associated with an application for accounts to log in to that application.

####How Login Attempts Work

**Example:** Assume an application named Foo has been mapped to two Account Stores, the Customers and Employees directories, in that order.

Here is what happens when a user attempts to log in to an application named Foo:

![Account Sources Diagram](/images/docs/LoginAttemptFlow.png =650x500 "account stores Diagram")

You can configure multiple Account Stores, but only one is required for logging in. Multiple account stores allows each application to view multiple directories as a single repository during a login attempt.

After an application has been registered in Stormpath, you can:

* [Change default account and group locations](#change-default-account-and-group-locations)
* [Add another Account Store](#add-another-login-source)
* [Change the Account Store priority order](#change-login-source-priority-order)
* [Remove Account Stores](#remove-login-sources)

To manage an Application's Account Stores, you must log in to the Stormpath Admin Console:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name.
4. Click the **Account Stores** tab. The Account Stores appear in order of priority.

<a name="change-default-account-and-group-locations"></a>
#### Change Default Account and Group Locations

On the Account Stores tab for applications, you can select the account stores (directory or group) to use as the default locations when creating new accounts and groups.

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name.
4. Click the **Account Sources** tab.
	a. To specify the default creation location(directory) for new accounts created in the application, in the appropriate row, select **Default Account Location**.
	b. To specify the default creation location(directory) for new groups created in the application, in the appropriate row, select **Default Group Location**.

<a name="add-another-login-source"></a>
#### Add Another Account Store

Adding a account source to an application provisions a directory or group to that application. By doing so, all account source accounts can log into the application.

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name.
4. Click the **Account Sources** tab.
5. Click **Add Account Source**.
6. In the *account source* list, select the appropriate directory.
7. If the directory contains groups, you can select all users or specific group for access.  Groups show under the directory.
8. Click **Create Mapping**. The new account store is added to the bottom of the account store list. 

<a name="change-login-source-priority-order"></a>
#### Change Account Store Priority Order

When you map multiple account stores to an application, you must also define the account store order.

The account store order is important during the login attempt for a user account because of cases where the same user account exists in multiple directories. When a user account attempts to log in to an application, Stormpath searches the listed account stores in the order specified, and uses the credentials (password) of the first occurrence of the user account to validate the login attempt.

To specify the account store order:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name.
4. Click the **Account Stores** tab.
5. Click the row of the directory to move.
6. Drag the row to the appropriate order. For example, if you want to move the first account store to the second account store, click anywhere in the first row of the account store table and drop the row on the second row.

<a name="remove-login-sources"></a>
#### Remove Account Stores

Removing a account source from an application deprovisions that directory or group from the application. By doing so, all accounts from the account store are no longer able to log into the application.

To remove an account source from an application:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name.
4. Click the **Account Stores** tab.
5. On the account stores tab, locate the directory or group.
6. Under the Actions column, click **Unmap**.

### Enable an Application

Enabling a previously disabled application allows any enabled directories, groups, and accounts associated with the application account stores in Stormpath to log in.

To enable an application:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab. The application browser appears showing all applications that exist in your Stormpath tenant.
3. On the **Details** tab, click **Enable** in the Status row. 


### Disable an Application

Disabling an application prevents the application from accepting log ins from the directories (including the contained groups and accounts) defined as account stores, but retains all application configurations. If you must temporarily turn off logins, disable an application. 

To disable an application:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.<br>The application browser appears showing all applications that exist in your Stormpath tenant.
3. Under the Actions column, click **Disable**. The application can no longer be logged into by accounts.

### Delete an Application

Deleting an application completely erases the application and its configurations from Stormpath. 

We recommend that you disable an application rather than delete it, if you anticipate that you might use the application again.

The Stormpath application cannot be deleted.

To delete an application:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Under the Actions column, click **Delete**. 

The application is erased from Stormpath and no longer appears in the application browser. 

	
### View Accounts for an Application

To see the users visible to an application:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name. 
4. Click the **Accounts** tab in the left sub menu.

On the Accounts tab for an application, you can see all accounts from all account stores mapped to the selected application. You also see basic information for each user account, such as:

* Account full name
* Email address
* Status
* Parent directory

To [edit an account](#edit-an-account), under the Actions column of the account row, click **Edit**.


***	

## *Directories*

[Directories](#directories) contain [authentication](#authenticate-accounts) and [authorization](#groups) information about users and groups. Stormpath supports an unlimited number of directories. Administrators can use different directories to create silos of users. For example, you might store your customers in one directory and your employees in another.

Within Stormpath, there are different types of directories you can implement:

* **Cloud** also known as Stormpath-managed directories are hosted by Stormpath and use the Stormpath data model to store user and group information. This is the most common type of directory in Stormpath.
* **Mirror** is a synchronization agent for your existing Lightweight Directory Access Protocol (LDAP) or Active Directory (AD) directory provided by Stormpath. All user management is done on your existing LDAP/AD agent directory, but the cloud mirror can be accessed through the Stormpath APIs on your modern applications.
	* LDAP/AD directories cannot be created using the API. 
	* You can specify various LDAP/AD object and attribute settings of the specific LDAP/AD server for users and groups. 
	* If the agent status is Online, but you are unable to see any data when browsing your LDAP/AD mapped directory, it is likely that your object and filters are configured incorrectly.
* **Social** allows integration to Facebook, Google, LinkedIn, and Github applications so accounts can login with a valid access token.

You can add as many directories of each type as you require. Changing group memberships, adding accounts, or deleting accounts in directories affects ALL applications to which the directories are mapped account stores.

LDAP/AD accounts are automatically deleted when:

* The backing object is deleted from the LDAP/AD directory service.
* The backing LDAP/AD object information no longer matches the account filter criteria configured for the agent.
* The LDAP/AD directory is deleted.

For directories, you can:

* [Locate the directory REST URL](#locate-the-directory-rest-url).
* [Create directories](#create-a-directory).
	* [Create a directory](#create-a-cloud-directory). 
* [Edit cloud directory details](#edit-a-directory). 
* [Update mirrored agent configuration](#UpdateAgent).
* [Create and manage cloud directory accounts](#CMAccounts).
* [Associate directories with applications](#AssocApplications).
* [Manage cloud directory workflow automations](#ManageWorkflowAutomation).
* [Enable a directory](#EnableDir).
* [Disable a directory](#DisableDir).
* [Delete a directory](#DeleteDir).

### Locate the Directory REST URL
When communicating with the Stormpath REST API, you might need to reference a directory using the REST URL or `href`. For example, you require the REST URL to create accounts in the directory using an SDK. 

To obtain a directory REST URL:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. In the Directories table, click the directory name. The REST URL appears on the Details tab.

### Create a Directory

To create a directory for application authentication, you must know which type of directory service to use.

You can create a:

* **Cloud Directory**, which is hosted by Stormpath and uses the Stormpath data model to store user and group information. This is the most common type of directory in Stormpath.
* **Mirrored (LDAP) agent directory**, which uses a synchronization agent for your existing LDAP/AD directory. All user account management is done on your existing LDAP/AD directory with the Stormpath agent mirroring the primary LDAP/AD server.
* **Social Directory**, which uses social providers such as Google, Facebook, LinkedIn and Github to authenticate and sync to Stormpath

{% docs note %}
The ability to create a mirrored, or agent, directory is connected to your subscription. If the option is not available, click the question mark for more information.
{% enddocs %}

<a name="create-a-cloud-directory"></a>
#### Create a Directory

1. Click the **Directories** tab.
2. Click **Create Directory**.
3. Select the Directory Type.
4. Complete the field values in the UI.  Some field value require information from the AD/LDAP system or a social provider (like Application ID and Secret).
5. Click **Create**

### Edit a Directory

To edit the details of a cloud directory:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name or, under the Actions column, click **Edit**.
4. Make the necessary changes and click **Update**.

### Create and Manage Cloud Directory Accounts

For accounts within cloud directories, you can [create](#create-cloud-directory-accounts), [edit](#edit-cloud-directory-accounts), [disable](#disable-cloud-directory-accounts), or [delete](#delete-cloud-directory-accounts) accounts.

Changing group memberships, adding accounts, or deleting accounts in directories affects ALL applications to which the directories are mapped account stores.

<a name="create-cloud-directory-accounts"></a>
#### Create Directory Accounts

To create an account:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Accounts** tab.
5. Fill in the information about the account
6. Click **Create Account**. 

{% docs tip %}
If you do not see the Create Account button, you are looking at a mirrored directory.	
{% enddocs %}

<a name="edit-cloud-directory-accounts"></a>
#### Edit an Existing Directory's Account
1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name or under the Actions column, click **Edit**.
4. Click the **Accounts** tab.
5. For more information about editing an account, click [here](#edit-an-account)
	
<a name="disable-cloud-directory-accounts"></a>	
#### Disable an Existing Directory Account

Although the Stormpath Admin Console provides an option to disable an account within a directory, the disable command is actually performed against the account. If you disable an account within a cloud directory or group, you are completely disabling the account from logging in to any applications to which it is associated.

To disable an account from within a directory:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name or under the Actions column, click **Edit**.
4. Click the **Accounts** tab.
5. Under the Actions column, click **Disable**.
6. In the prompt that appears, to confirm disabling the account, click **Ok**.

<a name="delete-cloud-directory-accounts"></a>
#### Delete an Existing Cloud Directory Account

If you delete an account from a directory, you are actually completely deleting the account from Stormpath.

To delete an account from within a directory:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name or under the Actions column, click **Edit**.
4. Click the **Accounts** tab.
5. Under the Actions column, click **Delete**.
6. In the prompt that appears, to confirm deleting the account, click **Ok**.

### Directory Workflows

Workflows are common user management operations that are automated for you by Stormpath. Account Registration and Verification workflows manage how accounts are created in your directory. The Password Reset workflow enables you to configure how password reset works and the context of messages. For both workflows, messages can be formatted in plain text or HTML.

Workflows are only available on cloud directories and are configurable using the Stormpath Admin Console.The Stormpath Administrator directory has default workflow automations which cannot be altered.

On the Workflows tab, you can automate <a href="#account-registration-and-verification" title="account registration and verification">account registration and verification</a> and <a href="#password-reset" title="password reset">password resets</a>.

<a name="account-registration-and-verification"></a>
#### Account Verification on Registration

Account verification on registration, allows account to be created in a directory with an `UNVERIFIED` status until the account owner can access their email account and click on a verification link.

{% docs note %}
The ability to modify workflows, depends on your subscription level. If an option is not available (grayed out)
{% enddocs %}

##### Configure Account Registration and Verification

To configure account registration and verification:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click **Workflows** tab.
5. On the Workflows tab, click Account Registration & Verification
6. In the pane, you can set up three distinct emails to be sent.  Verification Email, Verification Success Email, and a Welcome Email.

The Verification Email, when enabled for a Directory, will require the user visit their email inbox to click a link to verify their account.  Accounts in directories that have the Verification Email enabled will be created with an `UNVERIFIED` status.

The Verification Success Email, when enabled, is an optional email that will send a success email to the account when the account is verified by clicking on the link in the email.

The Welcome Email, when enabled, is an optional email that will be sent when the account is created (Verification Email Disabled) or when the account is verified (Verification Email Enabled).  This email can be used to send important information about your application to the user.

##### Initiate Account Registration and Verification

If the Verification Email is enabled, an account verification is initialized   automatically during an account creation. 

<a name="password-reset"></a>
#### Password Reset

When you reset an account password using Stormpath, the user receives an email with a link and a secure reset token. The link sends the user to a password reset page where they submit a new password to Stormpath. When the password is successfully reset, the user receives a success email. You can configure, at the directory level, how password reset works, the URL of the reset page, and the content of the email messages.

Messages can be formatted in plain text or HTML.

##### Configure Password Reset

To configure the password reset workflow:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click **Workflows** tab.
5. On the Workflows tab, click the **Password Reset** tab.
6. Configure the Password Reset and optionally the Password Reset Success Email

### Enable a Directory

Enabling previously disabled directories allows the groups and accounts to log into any applications for which the directory is defined as a account store.

To enable a directory:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Locate the directory and, in the Status column, use the dropdown to select **ENABLED**.


### Disable a Directory

Disabling directories prevents the accounts from logging into any applications connected to Stormpath, but retains the directory, group, and account data. If you must shut off several accounts quickly and easily, disable a directory. 

The Stormpath Administrators directory cannot be disabled.

To disable a directory:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Locate the directory and, in the Status column, use the dropdown to select ***DISABLED**.

All groups and accounts within the directory are now unable to log into any applications for which the directory is a account store.


### Delete a Directory

Deleting a directory completely erases the directory and all group and account data from Stormpath. 

We recommend that you disable a directory rather than delete it, in case an associated application contains historical data associated with accounts in the directory.

The Stormpath Administrators directory cannot be deleted.

To delete a directory:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Locate the directory and, in the Actions column, click **Delete**.


***

## Accounts

In Stormpath, users are referred to as [accounts](#account). The username and email fields for accounts are unique within a directory and are used to log into applications. Within Stormpath, an unlimited number of accounts per directory is supported. 

An account is a unique identity within a directory. An account can exist in only a single directory but can be a part of multiple [groups](#group) owned by that directory.

For accounts, you can: 

* [Locate the account REST URL](#locate-the-account-rest-url)
* [Create an account](#create-an-account)
* [Edit account details](#edit-an-account)
* [Change an account password](#change-an-account-password)
* [Assign an account to group](#assign-an-account-to-a-group)
* [Remove an account from a group](#remove-an-account-from-groups)
* [Enable an account](#enable-an-account)
* [Disable an account](#disable-an-account)
* [Delete an account](#delete-an-account)

### Locate the Account REST URL

When communicating with the Stormpath REST API, you might need to reference an account using the REST URL or `href`. For example, you require the REST URL to create accounts in the directory using an SDK. 

To obtain an account REST URL:

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. In the Accounts table, filter, search for, and click the account name. The REST URL appears on the Details tab.

### Create an Account

You can only create accounts for cloud, or Stormpath-managed directories. For accounts in a mirrored directory, the accounts must be created on the primary server and then they are mirrored to the Stormpath agent.

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. Click **Create an Account**.
4. Complete the fields as follows:
	
Attribute | Description 
:----- | :----- 
Directory | The directory to which the account will be added.
Groups | The groups in the directory to which to add the account to when created
Username | The login name of the account for applications using username instead of email. The value must be unique within its parent directory.|
First Name | The account owner first name.
Middle Name | The account owner middle name.
Last Name | The account owner last name.
First Name | The account owner first name.
Email | The account owner email address. This is can be used by applications, such as the Stormpath Admin Console, that use an email address for logging in. The value must be unique within its parent directory.
Status | The status is set to Enabled by default. It is only set to Disabled if you want to deny access to the account to Stormpath-connected applications.
Password | The credentials used by an account during a login attempt. The specified value must adhere to the password policies set for the parent directory.
Confirm Password | Confirmation of the account credentials. This value must match the value of the Password attribute.

5. Click **Create Account**.

{% docs note %}
The account cannot be moved to a different directory after it has been created.
{% enddocs %}

If workflow automation is configured, creating an account automatically initiates an Account Registration & Verification workflow that sends the account owner an email. 


### Edit an Account

1. Log in to the Stormpath Admin Console. 
2. Click the **Accounts** tab. You can filter, and search to find the account.
3. Under the Actions column for the account, click **Edit**.
4. On the Details tab, change the values as required.
6. Under Details tab, you can add an API Key or update Custom Data if needed
7. Under the Groups tab, you can modify Group memberships


{% docs note %}
The account cannot be moved to a different directory.
{% enddocs %}

### Change an Account Password

To change an account password: 

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. Under the Name column, click the account name for the account that you want to change the password.
4. In the Detail tab, under Security Credentials, choose the options to reset the password by email or enter in a new password
	

### Assign an Account to a Group

If the account is part of a directory containing groups, you can associate the account with a group.

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. Under the Name column, click the account name or the Edit button.
4. Click the **Groups** tab.
5. Click **Add to group**.
6. In the Assign account dialog, select the appropriate groups and click **Assign**.

### Remove an Account from Groups

If the account is the member of a group within a directory, you can remove the account from the group.

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. Click the account name.
3. Click the **Groups** tab.
4. Under the Actions column, click **Remove**.

### Enable an Account

Enabling a previously disabled account allows the account to log in to any applications where the directory or group is defined as an application account store.

{% docs note %}
Enabling and disabling accounts for mirrored directories is not available in Stormpath. You manage mirrored accounts on the primary server installation.
{% enddocs %}

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. To disable an account, in the Accounts table, under Actions column for the account, click **Enable**.
4. In the prompt that appears, to confirm disabling the account, click **Ok**.


### Disable an Account

Disabling an account prevents the account from logging into any applications in Stormpath, but retains all account information. You typically disable an account if you must temporarily remove access privileges.

If you disable an account within a directory or group, you are completely disabling the account from logging in to any applications to which it is associated.

{% docs note %}
Enabling and disabling accounts for mirrored directories is not available in Stormpath. You manage mirrored accounts on the primary server installation.
{% enddocs %}

You can disable accounts using the Stormpath Admin Console.

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. To disable an account, in the Accounts table, under Status column for the account, select **Disabled** from the drop down.
4. In the prompt that appears, to confirm disabling the account, click **Ok**.


### Delete an Account

Deleting an account completely erases the account from the directory and erases all account information from Stormpath.

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. Under the Actions column for the account, click **Delete**.
4. In the prompt that appears, to confirm deleting the account, click **Ok**.
	

***


## *Groups*

[Groups](#group) are collections of accounts within a directory that are often used for authorization and access control to the application. In Stormpath, the term group is synonymous with role.

For groups, you can:

* [Locate the group REST URL](#locate-the-group-rest-url)
* [View directory groups](#view-directory-groups)
* [Create groups](#create-a-group)
* [Edit a group](#edit-group-details)
* [Enable a group](#enable-a-group)
* [Disable a group](#disable-a-group)
* [Delete a group](#delete-a-group)
* [Manage group accounts](#manage-group-accounts)
	* [View accounts associated with a group](#list-group-accounts)
	* [Add accounts to a group](#add-group-accounts)
	* [Assign accounts to a group](#assign-group-accounts)
	* [Edit group account details](#edit-group-accounts)
	* [Enable a group account](#enable-group-accounts)
	* [Disable a group account](#disable-group-accounts)
	* [Remove a group account](#remove-group-accounts)

### Locate the Group REST URL

When communicating with the Stormpath REST API, you might need to reference a group using the REST URL or `href`. For example, you require the REST URL to create accounts to associate with the group in the directory using an SDK. 

To obtain a group REST URL:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. In the Directories table, click the directory name.
4. Click the **Groups** tab.
5. Click the group name.<br>The REST URL appears on the Details tab.

### View Directory Groups

To view the groups associated with a directory:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.

### Create a Group

To create a group:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.
5. Click **Create Group**.<br>
	![Create Groups](/images/docs/CreateGroup.png =700x "Create Groups")
<br>
6. Complete the fields as follows:
	
	Attribute | Description
	:----- | :-----
Name | The name of the group. Within a given directory, this value must be unique.
Description | A short description of the group.
Status| This is set to Enabled by default. This is only set to Disabled to prevent all group accounts from logging into any application even when the group is set as a account store to an application.

{% docs note %}
If an account is also a member to another group that does have access to an application, then the account can login.
{% enddocs %}

7. When the fields are complete, click **Create**.


### Edit Group Details

To edit the details of a group:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.
5. Click the group name link or under the Actions column, click **Edit**.
6. Change the values as required and, when done, click **Update**.


### Enable a Group

If the group is contained within an *enabled directory where the directory is defined as a account store*, then enabling the group allows all accounts contained within the group (membership list) to log in to any applications for which the directory is defined as a account store.

If the group is contained within an *disabled directory where the directory is defined as a account store*, the group members are not be able to log in to any applications for which the directory is defined as a account store. 

If the group is defined as a account store, then enabling the group allows accounts contained within the group (membership list) to log in to any applications for which the group is defined as a account store.

To enable a group:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.
5. Under the Actions column, click **Enable**.


### Disable a Group

If a group is explicitly set as an application account store, then disabling that group prevents any of its user accounts from logging into that application but retains the group data and memberships. You would typically disable a group if you must shut off a group of user accounts quickly and easily.

If the group is contained within an directory defined as a account store, disabling the group prevents group members from logging in to any applications for which the directory is defined as a account store. 

To disable a group:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.
5. Under the Actions column, click **Disable**.


### Delete a Group

Deleting a cloud directory group erases the group and all its membership relationships. User accounts that are members of the group will not be deleted.

We recommend that you disable an group rather than delete it, if you believe you might need to retain the user data or application connection.

To delete a cloud directory group:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.
5. Under the Actions column, click **Delete**.


### Manage Group Accounts

For cloud directory group accounts, you can: 	
	
* [View accounts associated with a group](#list-group-accounts)
* [Add accounts to a group](#add-group-accounts)
* [Assign accounts to a group](#assign-group-accounts)
* [Edit group account details](#edit-group-accounts)
* [Enable a group account](#enable-group-accounts)
* [Disable a group account](#disable-group-accounts)
* [Remove a group account](#remove-group-accounts)

{% docs note %}
Removing an account from a group, does not delete the account from the directory.
{% enddocs %}

<a name="list-group-accounts"></a>
#### List Group Accounts

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.
5. In the Groups table, under the Actions column, click **Members**.
	 
<a name="add-group-accounts"></a>	 
#### Add Group Accounts

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.
5. Click the group name.
6. Click the **Accounts** tab.
7. Click **Create Account**.
8. Consult [Create an Account](#create-an-account) for more information.

<a name="assign-group-accounts"></a>
#### Assign Group Accounts

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.
5. Click the group name.
6. Click the **Accounts** tab.
7. Click **Assign Accounts**.
8. In the Assign Accounts dialog, select the account.
9. Click **Assign Account**.<br>The members table refreshes with the new account included.

<a name="edit-group-accounts"></a>
#### Edit Group Accounts

Although accessible through the Accounts tab of a group, accounts are edited at the account level. If using the Stormpath Admin Console, you edit accounts on the Accounts tab.

To edit a group account:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.
5. Click the group name.
6. Click the **Accounts** tab.
7. Click the account name or under the Actions column, click **Edit**.
8. For more information about editing accounts in the Stormpath Admin Console, consult [Edit an Account](#edit-an-account).

<a name="enable-group-accounts"></a>
#### Enable Group Accounts

Although the Stormpath Admin Console provides an option to enable an account within a group, the enable command is actually performed against the account. If you enable an account within a directory or group, you are completely enabling the account to be able to log in to any applications with which it is associated.

To disable an account from within a group:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.
5. Click the group name.
6. Click the **Accounts** tab.
7. Under the Status column, click the **Disabled**.

<a name="disable-group-accounts"></a>
#### Disable Group Accounts

Although the Stormpath Admin Console provides an option to disable an account within a group, the disable command is actually performed against the account. If you disable an account within a directory or group, you are completely disabling the account from logging in to any applications with which it is associated.

To disable an account from within a group:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.
5. Click the group name.
6. Click the **Accounts** tab.
7. Under the Actions column, click **Disable**.
8. In the prompt that appears, to confirm disabling the account, click **Ok**.

<a name="remove-group-accounts"></a>
#### Remove Group Accounts

To remove accounts from a group:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.
5. Click the group name.
6. Click the **Accounts** tab.
7. Locate the account and under the Actions column, click **Remove**.

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
<a id="account-store-mapping"></a>Account Store Mapping | An **account store mapping** is a mapping between a group or directory and an application.
<a id="identity-management"></a>Identity Management | **Identity management** is the management, authentication, authorization, and permissions of identities to increase security and productivity, while decreasing cost, downtime, and repetitive tasks.
<a id="role"></a>Role |A **role** is a classification of accounts, such as administrators or employees. In Stormpath, roles are represented as groups.
<a id="rbac"></a>Role-Based Access Control | **Role-Based Access Control** (RBAC) is the act of controlling access to protected resources or behavior based on the groups assigned to a particular account. RBAC is done using Stormpath groups.
<a id="rest-api-def"></a>REST API | **REST API** is a software architectural style enabling data transfer and functionality using common web-based communication protocols. Stormpath provides a REST API for tenants so they can easily integrate Stormpath with their software applications.
<a id="tenant"></a>Tenant | A **tenant** is a private partition within Stormpath containing all data and settings—specifically your applications, directories, groups and accounts. When you sign up for Stormpath, a tenant is created for you. You can add other user accounts (for example, for your co-workers) to your tenant to help you manage your data. For convenience, many companies like to have one tenant where they can easily manage all application, directory, and account information across their organization.*

{% docs note %}
*You must know your tenant when logging in to the Admin Console website. There is a "Forgot Tenant" link on the login page if you do not know what your tenant is.
{% enddocs %}