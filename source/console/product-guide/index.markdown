---
layout: doc
title: Stormpath Admin Console Guide
lang: console
---

For help to quickly get started with Stormpath, refer to the [Stormpath Admin Quickstart Guide](http://www.stormpath.com/docs/console/quickstart).

The following items are covered in this document:

* [**What is Stormpath?**](#Stormpath)
	* [Architectural Overview](#ArchitectureOverview)
	* [Stormpath Admin Console](#AdminConsole)
	* [REST API](#RestAPI)

* [**Administering Stormpath**](#Administration)

	* [Billing and Subscription Level](#Billing)
	* [Default Resources](#DefaultResources)
	* [Invite Other Administrators](#InviteAdmins) 
	* [Manage API Keys](#ManageAPIkeys)
		* [Assign New API Keys](#AssignAPIkeys)
		* [Activate API Keys](#ActivateAPIkeys)
		* [Deactivate API Keys](#DeactivateAPIkeys)
		* [Delete API Keys](#DeleteAPIkeys)
	* [Workflow Automations](#WorkflowAutomation)

* [**Applications**](#Applications)
	* [Locate the Application REST URL](#LocateAppURL)
	* [Navigate the Application Browser](#NavigateApps)
	* [Register an Application](#RegisterApps)
	* [Edit an Application](#EditApps)
	* [Manage Application Login Sources](#ManageLoginSources)
		* [Change Default Account and Group Locations](#ChangeDefaults)
		* [Add Another (Directory) Login Source](#AddLoginSource)
		* [Change the Login Source Priority Order](#ChangeLoginSourcePriority)
		* [Remove Login Sources](#RemoveLoginSource)
	* [Enable an Application](#EnableApps)
	* [Disable an Application](#DisableApps)
	* [Delete an Application](#DeleteApps)
	* [View Accounts Mapped to an Application](#AppAccounts)

* [**Directories**](#Directories)
	* [Locate the Directory REST URL](#LocateDirURL)
	* [Navigate the Directory Browser](#ListDir)
	* [Create a Directory](#CreateDir)
		* [Create a Cloud Directory](#CreateCloud) 
		* [Create a Mirrored (LDAP) Directory](#CreateMirror)
	* [Edit a Cloud Directory](#EditDir)
	* [Update Mirrored Agent Configuration](#UpdateAgent)
	* [Create and Manage Cloud Directory Accounts](#CMAccounts)
		* [Create Directory Accounts](#CreateDirAccounts)
		* [Edit Directory Accounts](#EditDirAccounts)
		* [Disable Directory Accounts](#DisDirAccounts)
		* [Delete Directory Accounts](#DelDirAccounts)
	* [Associate Directories with Applications](#AssocApplications)
	* [Manage Workflow Automations](#ManageWorkflowAutomation)
		* [Account Registration and Verification](#AccountRegistration)
			* [Configure Account Registration and Verification](#ConfigureAccountRegistration)
			* [Initiate Account Registration and Verification](#InitiateAccountRegistration)
			* [Verify the Account](#VerifyAccount)
		* [Password Reset](#PasswordReset)
			* [Configure Password Reset](#ConfigurePasswordReset)
			* [Initiate Password Reset](#InitiatePasswordReset)
			* [Complete Password Reset](#CompletePasswordReset)
	* [Enable a Directory](#EnableDir)
	* [Disable a Directory](#DisableDir)
	* [Delete a Directory](#DeleteDir)
	
* [**Accounts**](#Accounts)
	* [Locate the Account REST URL](#LocateAccURL)
	* [Authenticate Accounts](#AuthenticateAccounts)
	* [Navigate the Account Browser](#NavigateAccounts)
	* [Create an Account](#CreateAccounts)
	* [Edit an Account](#EditAccounts)
	* [Change an Account Password](#ChangeAccountPasswords)
	* [Assign Accounts to Groups](#AssignAccountGroups)
	* [Remove Accounts from Groups](#RemoveAccountGroups)
	* [Enable Accounts](#EnableAccounts)
	* [Disable Accounts](#DisableAccounts)
	* [Delete Accounts](#DeleteAccounts)
	
* [**Groups**](#Groups)
	* [Locate the Group REST URL](#LocateGroupURL)
	* [View Directory Groups](#ListGroups)
	* [Create Groups](#CreateGroups)
	* [Edit Groups](#EditGroups)
	* [Enable Groups](#EnableGroups)
	* [Disable Groups](#DisableGroups)
	* [Delete Groups](#DeleteGroups)
	* [Manage Group Accounts](#ManageGroupAccounts)
		* [View Group Accounts](#ListGroupAccounts)
		* [Add Group Accounts](#AddGroupAccounts)
		* [Assign Group Accounts](#AssignGroupAccounts)
		* [Edit Group Accounts](#EditGroupAccounts)
		* [Enable Group Accounts](#EnableGroupAccounts)
		* [Disable Group Accounts](#DisableGroupAccounts)
		* [Remove Group Accounts](#RemoveGroupAccounts)


* [**Glossary of Terms**](#Glossary)

***

##<a id="Stormpath"></a>*What is Stormpath?*

Stormpath is the first easy, secure user management and authentication service for developers. 

Fast and intuitive to use, Stormpath enables plug-and-play security and accelerates application development on any platform. 

Built for developers, it offers an easy API, open source SDKs, and an active community. The flexible cloud service can manage millions of users with a scalable pricing model that is ideal for projects of any size.

By offloading user management and authentication to Stormpath, developers can bring new applications to market faster, reduce development and operations costs, and protect their users with best-in-class security.

###<a id="ArchitecturalOverview"></a>Architectural Overview

<img src="http://www.stormpath.com/sites/default/files/docs/Architecture.png" alt="High-level Architecture" title="High-level Architecture" width="700" height="430">

###<a id="AdminConsole"></a>Stormpath Admin Console

The Stormpath Admin Console allows authorized administrators to:

* Configure applications to access Stormpath
* Create and manage accounts and adjust group membership
* Create and manage directories and the associated groups
* Map directories and groups to allow accounts to log in to integrated applications
* Configure workflow or account administration automation 

To access the Stormpath Admin Console, visit [https://api.stormpath.com/login](https://api.stormpath.com/login)

###<a id="RestAPI"></a>REST API

The Stormpath API offers authorized developers and administrators programmatic access to:

* Securely authenticate accounts.
* Create and manage accounts and adjust group membership.
* Manage directories.
* Manage groups.
* Initiate and process account automations.

For more detailed documentation on the Stormpath API, visit the [API Reference Documentation](http://www.stormpath.com/docs/rest/api).

***

##<a id="Administration"></a>*Administering Stormpath*

As an administrator in Stormpath, you have full access to the Stormpath Admin Console and the REST API, enabling you to perform a variety of tasks including:

* [Adding new users](#CreateAccounts), including additional administrators 
* [Managing the default application and directory](#DefaultResources)
* [Assigning new API keys](#AssignAPIkeys)
* [Registering applications](#RegisterApps)
* [Creating directories](#CreateDir)
* [Creating groups](#CreateGroups)
* [Managing login sources](#ManageLoginSources)
* [Configuring workload account automation](#ManageWorkflowAutomation)

###<a id="Billing"></a>Billing and Subscription Level

When you initially sign up for Stormpath, your account is established with the default Developer subscription level. The Developer level is available for free.

If you would like to view or take advantage of features provided by higher-level subscriptions, in the top corner of the Stormpath Admin Console, click Settings, Subscription. If you upgrade your subscription level, you will also have to provide billing information by clicking **Settings**, **Billing**.

For additional information on the various service offerings and subscription levels, see the [pricing page](http://www.stormpath.com/monthly-pricing-plans).

###<a id="DefaultResources"></a>Default Owner, Application, and Directory

Stormpath is configured with various default settings, including a default owner, application, and directory.

When you initially sign up for Stormpath, three resources are automatically established.

* A user account known as the [`Tenant`](#Tenant) owner, which: 
	* Represents the first person in the tenant that signed up for Stormpath.
	* Cannot be disabled or deleted.
	* Is always located in the Stormpath Administrators directory.
	* Is initially responsible for inviting new administrators and managing the Stormpath tenant.

* An application named `Stormpath IAM`, which:
	* Cannot be disabled or deleted.
	* Controls access to the Stormpath Admin Console and API.

* A directory named `Stormpath Administrators`, which:
	* Cannot be disabled or deleted.
	* Is automatically associated with the Stormpath IAM application.
	* Cannot be removed as a login source for the Stormpath IAM application, but it can be moved in the login source priority order.
	* Has various predetermined workflow automations that cannot be altered.
	* Provides any user accounts within this directory log in access to the Stormpath Admin Console.
	* Provides any user accounts within this directory with API keys direct API access.
	* Automatically assigns the first user account created for the tenant to this directory.
	* Provides user accounts contained within this directory the ability to add other user accounts to the directory using the Add Admin button located at the top of the Stormpath Admin Console.
	
###<a id="InviteAdmins"></a>Invite Other Administrators

You can invite other administrator users to help you manage Stormpath applications, directories, and other aspects of your Stormpath tenant. 

<img src="http://www.stormpath.com/sites/default/files/docs/InviteAdmin.png" alt="Invite Another Admin" title="Invite Another Admin" width="670">

To invite an administrator, use the Add Admin feature. This feature sends an invitation for other administrators to collaborate with you in Stormpath.

The invitees must complete their account information. When the information is submitted, the new administrator user account is added to the Stormpath Administrators directory and gains access to the applications, directories, and accounts you have created.


###<a id="ManageAPIkeys"></a>Manage API Keys

As an administrator for the tenant, you must manage the associated API keys. 

API keys give you access to manage your Stormpath account, you risk exposing confidential information if you fail to take proper care of you API keys.

With API keys, you must never:

* Send API keys by email
* Share API keys with other people in your organization - for example saving the keys in public or cloud-based folders
* Transfer API keys unencrypted
* Commit API keys in source repositories, such as Github
* Save API keys in configuration files

Best practices:

* Download your own API keys from Stormpath admin console, this will minimize the risk of compromising the keys by transferring them through an insecure channel.
* Set proper privileges on the API keys file (can be read only by the owner of the keys) in the OS.
* Rotate API keys on a regular basis. **Note:** You must update the applications using the API keys to use the new ones.
* Minimize API key transfers.
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

For API keys, you can [assign or create new keys](#AssignAPIkeys), [activate inactive keys](#ActivateAPIkeys), [deactivate existing keys](#DeactivateAPIkeys), or [delete existing keys](#DeleteAPIkeys) for users.

Deactivating the API key prevents it from making API calls, while deleting the API key permanently removes it from Stormpath.

<img src="http://www.stormpath.com/sites/default/files/docs/APIKeys.png" alt="API Keys" title="API Keys" width="760">

####<a id="AssignAPIkeys"></a>Assign New API Keys

As an administrator, within the Stormpath Administrators directory you can create, or add more, [API keys](#APIKey) to user accounts.

To create a new API key for a user:

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. Locate the account and click the account link or under Actions, click **Edit**.
4. Under Security Credentials, click **Create API Key**.
5. In the confirmation window, click **Ok**.

####<a id="ActivateAPIkeys"></a>Activate API Keys

To activate a previously deactivated API key for a user:

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. Locate the account and click the account link or under Actions, click **Edit**.
4. Under Security Credentials, in the Status column, click **Activate**.

####<a id="DeactivateAPIkeys"></a>Deactivate API Keys

To deactivate an API key for a user:

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. Locate the account and click the account link or under Actions, click **Edit**.
4. Under Security Credentials, in the Status column, click **Deactivate**.<br>
	<img src="http://www.stormpath.com/sites/default/files/docs/DeactivateAPIKey.png" alt="Deactivate API Key" title="Deactivate API Key" width="700">
5. In the confirmation window, click **Ok**.

**Note:** Any applications using this API key with no longer be able to communicate or authenticate with Stormpath. When it is re-activated, the applications will work again.

####<a id="DeleteAPIkeys"></a>Delete API Keys

To delete an API key for a user:

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. Locate the account and click the account link or under Actions, click **Edit**.
4. Under Security Credentials, in the Status column, click **Delete**.<br>
<img src="http://www.stormpath.com/sites/default/files/docs/DeleteAPIKey.png" alt="Delete API Key" title="Delete API Key" width="700">
5. In the confirmation window, click **Ok**.<br>The API key has been permanently deleted from Stormpath.

**Note:** Deleting an API key permanently removes it from Stormpath, any applications using this API key with no longer be able to communicate or authenticate with Stormpath. To have the application communicate with Stormpath, you must change the API key to an active API key.


###<a id="WorkflowAutomation"></a>Workflow Automations

Stormpath automates common security workflows that many applications require. These include,  [account registration and verification](#AccountRegistration) and [resetting passwords](#PasswordReset). Configurations for workflow automations are applied at the directory level using the Stormpath Admin Console. You can only use this feature on Stormpath-managed (cloud) directories; workflow automations are not available for LDAP directories. Workflow automations also exist for the default Stormpath Administrator directory, but they cannot be modified.

**Note:** The ability to modify workflows, depends on your subscription level. If an option is not available (grayed out), click the question mark for more information.

The **Account Registration and Verification** workflow manages how accounts are created in your directory. It allows you to control the steps that happen when new users are added to a directory. These steps typically include a verification and welcome email. 

Within the account registration and verification workflow automation feature, you can select:

* **Enable Registration and Verification Workflow** 
* **Require newly registered accounts to verify their email address**

Account Registration and Verification is disabled by default on new directories.
	
The **Password Reset** workflow configuration manages user password resets through emails and tokens. Password Reset is enabled by default on new directories.

To learn more, see [Manage Workflow Automation](#ManageWorkflowAutomation).

***

##<a id="Applications"></a>*Applications*

An [application](#Application) in Stormpath represents a real world software application that communicates with Stormpath for its user management and authentication needs.

When defining an application in Stormpath, it is typically associated with one or more directories or groups. The associated directories and groups form the application user base. The accounts within the associated directories and groups are considered the application users and can login to the application. 

For applications, you can: 

* [Locate the application REST URL](#LocateAppURL).
* [Navigate the application browser](#NavigateApps).
* [Register an application](#RegisterApps).
* [Edit an application](#EditApps).
* [Manage application login sources](#ManageLoginSources), including [changing default account and group locations](#ChangeDefaults), [adding another login source](#AddLoginSource), [changing the login source priority order](#ChangeLoginSourcePriority), and [removing login sources](#RemoveLoginSource).
* [Enable an application](#EnableApps).
* [Disable an application](#DisableApps).
* [Delete an application](#DeleteApps).
* [View Accounts Mapped to an Application](#AppAccounts).

###<a id="LocateAppURL"></a>Locate the Application REST URL
When communicating with the Stormpath REST API, you might need to reference an application using the REST URL or `href`. For example, you require the REST URL to list applications by issuing an API request. 

To obtain an application REST URL:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. In the Applications table, click the application name.<br>
The REST URL appears on the Details tab.<br><img src="http://www.stormpath.com/sites/default/files/docs/AppResturl.png" alt="Application Resturl" title="Application Resturl">


###<a id="NavigateApps"></a>Navigate the Application Browser
The application browser enables you to view and search for integrated applications.

To view all applications in your tenant:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
	* This displays the Application Browser, showing all applications that exist in your Stormpath tenant.
	* A disabled application cannot authenticate any user accounts. <br>
3. To view or edit an application, click the application name or, under the Actions column, click **Edit**.


###<a id="RegisterApps"></a>Register an Application
To associate an [application](#Application) with Stormpath for [authentication](#Authentication), you must register the application within Stormpath. 

To register an application:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click **Register Application**.<br> 
	<img src="http://www.stormpath.com/sites/default/files/docs/ApplicationRegistrationWizard.png" alt="Register Application Wizard" title="Register Application Wizard" width="700"> 
4. Complete the fields as follows:

	Attribute | Description
:----- | :-----
Name | The name used to identify the application within Stormpath. This value must be unique. |
Description | A short description of the application.<br> **Note:** A URL for the application is often helpful.|
Status | By default, this value is set to Enabled. Change the value to Disabled if you want to prevent accounts from logging in to the application. |

5. For the associated directory, you can:
	a. Create a new directory, which can be named to match the application or have a distinct name.
	b. Add users from other directories or groups.
6. After specifying the directory parameters, you can specify the login priority order.
7. When all information is complete, click **Save**.

###<a id="EditApps"></a>Edit an Application

You can update an application:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name or, under the Actions column, click **Edit**. 
4. Make the necessary edits and click **Save**.


###<a id="ManageLoginSources"></a>Manage Application Login Sources

[Login sources](#LoginSource) define the user base for a given application. Login sources determine which user account stores are used and the order in which they are accessed when a user account attempts to log in to your application.

In Stormpath, a directory or group can be a login source for an application. At least one login source must be associated with an application for accounts to log in to that application.

####How Login Attempts Work

**Example:** Assume an application named Foo has been mapped to two login sources, the Customers and Employees directories, in that order.

Here is what happens when a user attempts to log in to an application named Foo:

<img src="http://www.stormpath.com/sites/default/files/docs/LoginAttemptFlow.png" alt="Login Sources Diagram" title="Login Sources Diagram" width="650" height="500">

You can configure multiple login sources, but only one is required for logging in. Multiple login sources allows each application to view multiple directories as a single repository during a login attempt.

After an application has been registered in Stormpath, you can:

* [Change default account and group locations](#ChangeDefaults)
* [Add another login source](#AddLoginSource) (directories)
* [Change the login source priority order](#ChangeLoginSourcePriority)
* [Remove login sources](#RemoveLoginSource)

To manage application login sources, you must log in to the Stormpath Admin Console:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name.
4. Click the **Login Sources** tab.<br>
The login sources appear in order of priority.<br> 
	<img src="http://www.stormpath.com/sites/default/files/docs/LoginSources.png" alt="Login Sources" title="Login Sources" width="650" height="170">

####<a id="ChangeDefaults"></a>Change Default Account and Group Locations

On the Login Sources tab for applications, you can select the login sources (directory or group) to use as the default locations when creating new accounts and groups.

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name.
4. Click the **Login Sources** tab.
	a. To specify the default creation location(directory) for new accounts created in the application, in the appropriate row, select **New Account Location**.
	b. To specify the default creation location(directory) for new groups created in the application, in the appropriate row, select **New Group Location**.
5. Click **Save**.

####<a id="AddLoginSource"></a>Add Another Login Source

Adding a login source to an application provisions a directory or group to that application. By doing so, all login source accounts can log into the application.

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name.
4. Click the **Login Sources** tab.
5. Click **Add Login Source**.
6. In the *login source* list, select the appropriate directory.<br>
	<img src="http://www.stormpath.com/sites/default/files/docs/LSDropdown1.png" alt="Login Sources" title="Login Sources"><br>
7. If the directory contains groups, you can select all users or specific group for access.<br> 
	<img src="http://www.stormpath.com/sites/default/files/docs/LSDropdown2.png" alt="Login Sources" title="Login Sources"><br>
8. Click **Add Login Source**.<br>
The new login source is added to the bottom of the login sources list. 

####<a id="ChangeLoginSourcePriority"></a>Change Login Source Priority Order

When you map multiple login sources to an application, you must also define the login source order.

The login source order is important during the login attempt for a user account because of cases where the same user account exists in multiple directories. When a user account attempts to log in to an application, Stormpath searches the listed login sources in the order specified, and uses the credentials (password) of the first occurrence of the user account to validate the login attempt.

To specify the login source order:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name.
4. Click the **Login Sources** tab.
5. Click the row of the directory to move.
6. Drag the row to the appropriate order.<br>For example, if you want to move the first login source to the second login source, click anywhere in the first row of the login source table and drop the row on the second row.<br>
	<img src="http://www.stormpath.com/sites/default/files/docs/LoginPriority.png" alt="Login Sources" title="Login Sources" width="650">
7. Click **Save Priorities**.

####<a id="RemoveLoginSource"></a>Remove Login Sources

Removing a login source from an application deprovisions that directory or group from the application. By doing so, all accounts from the login source are no longer able to log into the application.

To remove a login source from an application:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name.
4. Click the **Login Sources** tab.
5. On the Login Sources tab, locate the directory or group.
6. Under the Actions column, click **Remove**.

###<a id="EnableApps"></a>Enable an Application

Enabling a previously disabled application allows any enabled directories, groups, and accounts associated with the application login sources in Stormpath to log in.

To enable an application:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.<br>The application browser appears showing all applications that exist in your Stormpath tenant.
3. Under the Actions column, click **Enable**. 


###<a id="DisableApps"></a>Disable an Application

Disabling an application prevents the application from accepting log ins from the directories (including the contained groups and accounts) defined as login sources, but retains all application configurations. If you must temporarily turn off logins, disable an application. 

The Stormpath IAM application cannot be disabled.

To disable an application:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.<br>The application browser appears showing all applications that exist in your Stormpath tenant.
3. Under the Actions column, click **Disable**. <br>
The application can no longer be logged into by accounts.


###<a id="DeleteApps"></a>Delete an Application

Deleting an application completely erases the application and its configurations from Stormpath. 

We recommend that you disable an application rather than delete it, if you anticipate that you might use the application again.

The Stormpath IAM application cannot be deleted.

To delete an application:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Under the Actions column, click **Delete**. 

The application is erased from Stormpath and no longer appears in the application browser. 

	
###<a id="AppAccounts"></a>View Accounts Mapped to an Application

To see the users visible to an application:

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name. 
4. Click the **Accounts** tab.

On the Accounts tab for an application, you can see all accounts from all login sources mapped to the selected application. You also see basic information for each user account, such as:

* Account full name
* Username
* Email address
* Status
* Parent directory

To [edit an account](#EditAccounts), under the Actions column of the account row, click **Edit**. You are redirected to the Account Details tab.


***	

##<a id="Directories"></a>*Directories*

[Directories](#Directory) contain [authentication](#Authentication) and [authorization](#Authorization) information about users and groups. Stormpath supports an unlimited number of directories. Administrators can use different directories to create silos of users. For example, you might store your customers in one directory and your employees in another.

Within Stormpath, there are two types of directories you can implement:

* **Cloud** also known as Stormpath-managed directories are hosted by Stormpath and use the Stormpath data model to store user and group information. This is the most common type of directory in Stormpath.
* **Mirror** is a synchronization agent for your existing Lightweight Directory Access Protocol (LDAP) or Active Directory (AD) directory provided by Stormpath. All user management is done on your existing LDAP/AD agent directory, but the cloud mirror can be accessed through the Stormpath APIs on your modern applications.
	* LDAP/AD directories cannot be created using the API. 
	* You can specify various LDAP/AD object and attribute settings of the specific LDAP/AD server for users and groups. 
	* If the agent status is Online, but you are unable to see any data when browsing your LDAP/AD mapped directory, it is likely that your object and filters are configured incorrectly.

You can add as many directories of each type as you require. Changing group memberships, adding accounts, or deleting accounts in directories affects ALL applications to which the directories are mapped login sources.

LDAP/AD accounts are automatically deleted when:

* The backing object is deleted from the LDAP/AD directory service.
* The backing LDAP/AD object information no longer matches the account filter criteria configured for the agent.
* The LDAP/AD directory is deleted.

For directories, you can:

* [Locate the directory REST URL](#LocateDirURL).
* [Navigate the directory browser](#ListDir).
* [Create directories](#CreateDir).
	* [Create a cloud directory](#CreateCloud). 
	* [Create a mirrored directory](#CreateMirror).
* [Edit cloud directory details](#EditDir). 
* [Update mirrored agent configuration](#UpdateAgent).
* [Create and manage cloud directory accounts](#CMAccounts).
* [Associate directories with applications](#AssocApplications).
* [Manage cloud directory workflow automations](#ManageWorkflowAutomation).
* [Enable a directory](#EnableDir).
* [Disable a directory](#DisableDir).
* [Delete a directory](#DeleteDir).


###<a id="LocateDirURL"></a>Locate the Directory REST URL
When communicating with the Stormpath REST API, you might need to reference a directory using the REST URL or `href`. For example, you require the REST URL to create accounts in the directory using an SDK. 

To obtain a directory REST URL:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. In the Directories table, click the directory name.<br>
The REST URL appears on the Details tab.<br><img src="http://www.stormpath.com/sites/default/files/docs/Resturl.png" alt="Application Resturl" title="Application Resturl">


###<a id="ListDir"></a>Navigate the Directory Browser

To view directories:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
	* This will display the Directory Browser, showing all the directories that exist in your Stormpath tenant.
	* A Disabled directory cannot be used by any applications, regardless of whether or not they are mapped to it.

3. To view or edit directory details, click the directory name or, under the Actions column, click **Edit**.
	* The Stormpath Administrators directory is set up by default when you first signed up for Stormpath.
	* To add more directories, see [Create a Directory](#CreateDir).
	

###<a id="CreateDir"></a>Create a Directory

To create a directory for application authentication, you must know which type of directory service to use.

You can create a:

* [Cloud Directory](#CreateCloud), which is hosted by Stormpath and uses the Stormpath data model to store user and group information. This is the most common type of directory in Stormpath.

**OR**

* [Mirrored (LDAP) agent directory](#CreateMirror), which uses a synchronization agent for your existing LDAP/AD directory. All user account management is done on your existing LDAP/AD directory with the Stormpath agent mirroring the primary LDAP/AD server.

**Note:** The ability to create a mirrored, or agent, directory is connected to your subscription. If the option is not available, click the question mark for more information.

####<a id="CreateCloud"></a>Create a Cloud Directory

1. Click the **Directories** tab.
2. Click **Create Directory**.
3. Click **Cloud**.
4. Complete the field values as follows:
<br> <img src="http://www.stormpath.com/sites/default/files/docs/CreateCloudDirectory.png" alt="Create Cloud Directory" title="Create Cloud Directory" width="650" height="460">

	Attribute | Description
:----- | :-----
Name | The name used to identify the directory within Stormpath. This value must be unique. |
Description | Details about this specific directory.|
Status | By default, this value is set to Enabled. Change the value to Disabled if you want to prevent all user accounts in the directory from authenticating even where the directory is set as a login source to an application. |
Min characters | The minimum number of acceptable characters for the account password. |
Max characters | The maximum number of acceptable characters for the account password. |
Mandatory characters | The required character patterns which new passwords will be validated against. For example, for an alphanumeric password of at least 8 characters with at least one lowercase and one uppercase character, select the abc, ABC, and 012 options. The more patterns selected, the more secure the passwords but the more complicated for a user.|
5. Click **Create**. 

####<a id="CreateMirror"></a>Create a Mirrored Directory

Mirrored directories, after initial configuration, are accessible through the Agents tab of the directory. 

1. Click the **Directories** tab.
2. Click **Create Directory**.
3. Click **Mirror**. <br> 
<img src="http://www.stormpath.com/sites/default/files/docs/CreateLDAPDirectory.png" alt="Create LDAP Directory" title="Create Mirrored Directory" width="650">

4. On the 1. Directory Basics tab, complete the field values as follows:
	
	Attribute | Description
:----- | :-----
Directory Name | A short name for this directory, unique from your other Stormpath directories. |
Directory Description | An optional description explaining the purpose for the directory.|
Directory Status | Whether or not the directory is to be used to authenticate accounts for any assigned applications. By default, this value is set to Enabled. Change the value to Disabled if you want to prevent all user accounts in the directory from authenticating even where the directory is set as a login source to an application. |

5. Click **Next**.

	<img src="http://www.stormpath.com/sites/default/files/docs/CreateLDAP2.png" alt="Agent Configuration" title="Agent Configuration" width="640">
	
6. On the 2. Agent Configuration tab, complete the field values as follows::
	
	Attribute | Description
	:----- | :-----
Directory Service | The type of directory service to be mirrored. For example, LDAP. |
Directory Host | The IP address or Host name of the directory server to connect to. This domain must be accessible to the agent, for example, behind any firewall that might exist. |
Directory Port | The directory server port to connect to. Example: `10389` for LDAP, `10689` for LDAPS, however your directory server maybe configured differently.|
Use SSL | Should the agent socket connection to the directory use Secure Sockets Layer (SSL) encryption? The Directory Port must accept SSL. |
Agent User DN | The username used to connect to the directory. For example: `cn=admin,cn=users,dc=ad,dc=acmecorp,dc=com` |
Agent Password | The agent user DN password. |
Base DN | The base Distinguished Name (DN) to use when querying the directory. For example, `o=mycompany,c=com` |
Directory Services Poll Interval | How often (in minutes) to poll the directory to detect directory object changes. |

7. Click **Next**.

	<img src="http://www.stormpath.com/sites/default/files/docs/CreateLDAP3.png" alt="Account Configuration" title="Account Configuration" width="640">

		
8. On the 3. Account Configuration tab, complete the field values as follows:
		
	Attribute | Description 
:----- | :-----
Account DN Suffix | Optional value appended to the Base DN when accessing accounts. For example, `ou=Users`. If left unspecified, account searches will stem from the Base DN. |
Account Object Class | The object class to use when loading accounts. For example, `user` |
Account Object Filter | The filter to use when searching user objects. |
Account Email Attribute | The attribute field to use when loading the user email address. Example: `email` |
Account First Name Attribute | The attribute field to use when loading the account first name. Example: `givenname` |
Account Middle Name Attribute | The attribute field to use when loading the account middle name. Example: `middlename` |
Account Last Name Attribute | The attribute field to use when loading the account last name. Example: `sn` |
Account Login Name Attribute |  The attribute field to use when logging in the account. Example: `uid` |
Account Password Attribute | The attribute field to use when loading the account password. Example: `password` |

9. Click **Next**.

	<img src="http://www.stormpath.com/sites/default/files/docs/CreateLDAP4.png" alt="Group Configuration" title="Group Configuration" width="640">

10. On the 4. Group Configuration tab, complete the field values as follows:
	
	Attribute | Description 
:----- | :-----
Group DN Suffix | This value is used in addition to the base DN when searching and loading roles. An example is `ou=Roles`. If no value is supplied, the subtree search will start from the base DN. |
Group Object Class | This is the name of the class used for the LDAP group object. Example: `group` |
Group Object Filter | The filter to use when searching for group objects. |
Group Name Attribute | The attribute field to use when loading the group name. Example: `cn` |
Group Description Attribute | The attribute field to use when loading the group description. Example: `desc` |
Group Members Attribute | The attribute field to use when loading the group members. Example: `member` |

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

**Note:** After the directory has been created, although the Workflows tab appears, workflows cannot be configured for this type of directory.

###<a id="EditDir"></a>Edit a Cloud Directory

To edit the details of a cloud directory:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name or, under the Actions column, click **Edit**.
4. Make the necessary changes and click **Update**.
	

###<a id="UpdateAgent"></a>Update Agent Configuration

You can modify an agent configuration going through the [Directories](#UpdateAgentDir) or [Agent](#UpdateAgentAgents) tabs.

The Agents tab contains a table listing all known agents used by you. Each table entry shows the following:

* The **Stormpath directory name** as a link which you can click to modify any parameters.
* A **description** which is pulled from the directory Details tab.
* The agent communication **status** reflects communication state as the agent communicates with Stormpath. As you make changes to the agent configuration, those changes are automatically pushed to the remote client and applied. Any further errors or conditions appear under the status column. The valid status codes are:

	* **Online**: The agent is online and all things are working nominally.
	* **Offline**: Stormpath detects that the agent is not communicating with it at all.
	* **Error**: The agent is online, but there is a problem with communicating nominally with Stormpath or LDAP/AD.

Although the Workflows tab appears for a mirrored LDAP/AD directory, workflows cannot be configured for this type of directory.

####<a id="UpdateAgentDir"></a>Directories Tab
1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Agent Configuration** tab.<br> **Note:** If you do not see an Agent Configuration tab, you are looking at a Stormpath cloud directory.
5. Make the necessary changes and click **Update**.

####<a id="UpdateAgentAgent"></a>Agents Tab
1. Log in to the Stormpath Admin Console.
2. Click the **Agents** tab.
3. Click the directory name.
4. Make the necessary changes and click **Update**.

###<a id="CMAccounts"></a>Create and Manage Cloud Directory Accounts

For accounts within cloud directories, you can [create](#CreateDirAccounts), [edit](#EditDirAccounts), [disable](#DisDirAccounts), or [delete](#DelDirAccounts) accounts.

Changing group memberships, adding accounts, or deleting accounts in directories affects ALL applications to which the directories are mapped login sources.

####<a id="CreateDirAccounts"></a>Create Cloud Directory Accounts

Although within a directory there is a create account feature, you are redirected to the Create Account screen on the Accounts tab.

To create an account:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Accounts** tab.
5. Click **Create Account**.<br>**Note:** If you do not see the Create Account button, you are looking at a mirrored directory.	
6. For more information about creating an account, click [here](#CreateAccounts)

####<a id="EditDirAccounts"></a>Edit an Existing Cloud Directory Account
1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name or under the Actions column, click **Edit**.
4. Click the **Accounts** tab.
5. For more information about editing an account, click [here](#EditAccounts)
		
####<a id="DisDirAccounts"></a>Disable an Existing Cloud Directory Account

Although the Stormpath Admin Console provides an option to disable an account within a directory, the disable command is actually performed against the account. If you disable an account within a cloud directory or group, you are completely disabling the account from logging in to any applications to which it is associated.

To disable an account from within a directory:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name or under the Actions column, click **Edit**.
4. Click the **Accounts** tab.
5. Under the Actions column, click **Disable**.
6. In the prompt that appears, to confirm disabling the account, click **Ok**.

####<a id="DelDirAccounts"></a>Delete an Existing Cloud Directory Account

If you delete an account from a directory, you are actually completely deleting the account from Stormpath.

To delete an account from within a directory:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name or under the Actions column, click **Edit**.
4. Click the **Accounts** tab.
5. Under the Actions column, click **Delete**.
6. In the prompt that appears, to confirm deleting the account, click **Ok**.


###<a id="AssocApplications"></a>Associate Directories with Applications

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Applications** tab.<br>The applications table shows the application for which the directory is providing account authentication, or log in, credentials.
5. To change the login source, you must modify the application login source information.<br>If the directory is currently not specified as a login source for an application, the table contains the following message:
	
	*Currently, there are no applications associated with this directory. To create an association, click here, and select an application. From the login sources tab, you can create the association.*


###<a id="ManageWorkflowAutomation"></a>Workflow Automations

Workflows are common user management operations that are automated for you by Stormpath. Account Registration and Verification workflow configurations manage how accounts are created in your directory. The Password Reset workflow enables you to configure how password reset works and the context of messages. For both workflows, messages can be formatted in plain text or HTML.

Workflows are only available on cloud directories and only configurable using the Stormpath Admin Console.The Stormpath Administrator directory has default workflow automations which cannot be altered.

On the Workflows tab, you can automate <a href="#AccountRegistration" title="account registration and verification">account registration and verification</a> and <a href="#PasswordReset" title="password reset">password resets</a>.

<img src="http://www.stormpath.com/sites/default/files/docs/ManageWorkflows.png" alt="Workflow Automation" title="Workflow Automation" width="670" height="250">

####<a id="AccountRegistration"></a>Account Registration and Verification

For the Account Registration and Verification workflow, you must perform the following actions:

* <a href="#ConfigureAccountRegistration" title="Configure Account Registration and Verification">Configure account registration and verification</a>
* <a href="#InitiateAccountRegistration" title="Initiate Account Registration and Verification">Initiate account registration and verification</a>
* <a href="#VerifyAccount" title="Verify the Account">Verify the account</a>
<br>

**Note:** The ability to modify workflows, depends on your subscription level. If an option is not available (grayed out), click the question mark for more information.

#####<a id="ConfigureAccountRegistration"></a>Configure Account Registration and Verification

To configure account registration and verification:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click **Workflows** tab.
5. On the Workflows tab, next to Registration and Verification, click **show**.
	* By default, the Account Registration and Verification workflow automation is disabled. By leaving this workflow off, all accounts created in the directory are enabled, unless otherwise specified, and the user does not receive any registration or verification emails from Stormpath.
	* By only enabling **Enable Registration and Verification Workflow** and not also enabling **Require newly registered accounts to verify their email address**, new accounts are marked as enabled and the users receive a registration success email.

		<img src="http://www.stormpath.com/sites/default/files/docs/RegistrationVerification.png" alt="Account Registration and Verification" title="Account Registration and Verification" width="650" height="430">


	* You configure the Registration Success Message with the following attributes:
	
		Attribute | Description
:----- | :-----
Message Format | The message format for the body of the Account Registration Success email. It can be Plain Text or HTML. Available formats depend on the tenant subscription level. |
"From" Name | The value to display in the "From" field of the Account Registration Success message.|
"From" Email Address | The email address from which the Account Registration Success message is sent. |
Subject | The value for the subject field of the Account Registration Success message. |
Body | The value for the body of the message. Variable substitution is supported for the account first name, last name, username, and email, as well as the name of the directory where the account is registered. |

	* By also selecting **Require newly registered accounts to verify their email address**:
		* Newly created accounts are given an *unverified* status and a verification email is sent to the user. The verification email contains a token unique to the user account. When the user clicks the link, they are sent to the verification base URL where the token is submitted to Stormpath for verification. If verified, the account status changes to enabled and a verification success email is sent to the user.
		* An Account Verification Message section appears.
		
			<img src="http://www.stormpath.com/sites/default/files/docs/AccountVerificationMessage.png" alt="Account Verification" title="Account Verification" width="700" height="420">

		* You configure the Account Verification Message with the following attributes: 

			Attribute | Description
:----- | :-----
Account Base URL | Your application URL which receives the token and completes the workflow. Stormpath offers a default base URL to help during development. |
Message Format | The message format for the body of the Account Verification email. It can be Plain Text or HTML. Available formats depend on the tenant subscription level. |
From" Name | The value to display in the "From" field of the Account Success message. |
"From" Email Address | The email address from which the Account Verification message is sent. |
Subject | The value for the subject field of the Account Verification message. |
Body | The value for the body of the message. Variable substitution is supported for the account first name, last name, username, and email, as well as the name of the directory where the account is registered and the url (containing the token) that the user must click. |
		* A Verification Success Message section appears.<br><img src="http://www.stormpath.com/sites/default/files/docs/VerificationEmailParams.png" alt="Email Verification" title="Email Verification" width="700" height="420">

		* You configure the Verification Success Message with the following attributes:

			Attribute | Description
:----- | :-----
Message Format | The message format for the body of the Account Verification Success email. It can be Plain Text or HTML. Available formats depend on the tenant subscription level. |
"From" Name | The value to display in the "From" field of the Account Verification Success message. |
"From" Email Address | The email address from which the Account Verification Success message is sent. |
Subject | The value for the subject field of the Account Verification Success message. |
Body | The value for the body of the message. Variable substitution is supported for the account first name, last name, username, and email, as well as the name of the directory where the account is registered. |

		
6. When all the fields are complete, click **Update**.


#####<a id="InitiateAccountRegistration"></a>Initiate Account Registration and Verification

If the workflow is enabled, an account registration is automatically initiated during an account creation. 


#####<a id="VerifyAccount"></a>Verify Account

If a directory has the the account verification workflow enabled:

1. A newly created account in the directory has an `UNVERIFIED` status until the email address has been verified.
2. When a new user is registered for the first time, Stormpath sends an email to the user with a secure verification link, which includes a secure verification token.
3. When the user clicks the link in the email, they are sent to the verification URL set up in the verification workflow. 
	* To verify the account email address (which sets the account status to `ENABLED`), the verification token in the account verification email must be obtained from the link account holders receive in the email. 
	* This is achieved by implementing the following logic:

			require "stormpath-sdk"
			include Stormpath::Resource
			...
			...
			verification_token = # obtain it from query parameter, according to the workflow configuration of the link

			tenant = client.current_tenant

			# when the account is correctly verified it gets activated and that account is returned in this verification
			account = tenant.verify_account_email verification_token



####<a id="PasswordReset"></a>Password Reset

When you reset an account password using Stormpath, the user receives an email with a link and a secure reset token. The link sends the user to a password reset page where they submit a new password to Stormpath. When the password is successfully reset, the user receives a success email. You can configure, at the directory level, how password reset works, the URL of the reset page, and the content of the email messages.

Messages can be formatted in plain text or HTML.

#####<a id="ConfigurePasswordReset"></a>Configure Password Reset

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
<a id ="BaseURL"></a>Base URL | Your application URL which receives the token and completes the workflow. Stormpath offers a default base URL to help during development. |
Expiration Window | The number of hours that the password reset token remains valid from the time it is sent. |

7. Under Password Reset Message, complete the values as follows:<br>

	Attribute | Description
:----- | :-----
Message Format | The message format for the body of the Password Reset email. It can be Plain Text or HTML. Available formats depend on the tenant subscription level. |
"From" Name | The value to display in the "From" field of the Password Reset message. |
"From" Email Address | The email address from which the Password Reset message is sent. |
Subject | The value for the subject field of the Password Reset message. |
Body | The value for the body of the message. Variable substitution is supported for the account first name, last name, username, and email, as well as the name of the directory where the account is registered, the url the user must click to verify their account, and the number of hours for which the URL is valid. |

8. Under Password Reset Success Message, complete the values as follows:<br>

	Attribute | Description
:----- | :-----
Message Format | The message format for the body of the Password Reset Success email. It can be Plain Text or HTML. Available formats depend on the tenant subscription level. |
"From" Name | The value to display in the "From" field of the Password Reset Success message.|
"From" Email Address | The email address from which the Password Reset Success message is sent. |
Subject | The value for the subject field of the Password Reset Success message. |
Body | The value for the body of the message. Variable substitution is supported for the account first name, last name, username, and email, as well as the name of the directory where the account is registered. |

	<img src="http://www.stormpath.com/sites/default/files/docs/ResetPW2.png" alt="Password Reset Message" title="Password Reset Message" width="640" height="418">

9. When all the fields are complete, click **Update**.

#####<a id="InitiatePasswordReset"></a>Initiate Password Reset

To initiate the password reset workflow in your application, you must create a password reset token, which is sent from Stormpath in an email to the user. 
	
This is done from the application as follows:

	require "stormpath-sdk"
	include Stormpath::Resource
	...
	...
	href = 'https://api.stormpath.com/v1/applications/APP_UID_HERE'
	application = client.data_store.get_resource href, Application

	# creating the password reset token and sending the email
	application.send_password_reset_email 'username or email'


#####<a id="CompletePasswordReset"></a>Complete Password Reset

After the password reset token is created and the workflow is initiated, Stormpath sends a reset email to the user. The email contains a web link that includes the [base URL](#BaseURL) and the reset token. 

`https://myAwesomeapp.com/passwordReset?sptoken=TOKEN`

Where `myAwesomeapp.com/passwordReset` is the base URL.

After the user clicks the link, the user is sent to the base URL. The password reset token can then be obtained from the query string.

To complete password reset, collect and submit the user's new password with the reset token to Stormpath.

**Note:** To complete the password reset, you do not need any identifying information from the user. Only the password reset token and the new password are required.

The password is changed as follows:

	require "stormpath-sdk"
	include Stormpath::Resource
	...
	...  
	href = 'https://api.stormpath.com/v1/applications/APP_UID_HERE'
	application = client.data_store.get_resource href, Application 

	# getting the Account from the token and changing the password
	account = application.verify_password_reset_token 'PASS_RESET_TOKEN'
	account.set_password 'New Password'
	account.save


###<a id="EnableDir"></a>Enable a Directory

Enabling previously disabled directories allows the groups and accounts to log into any applications for which the directory is defined as a login source.

To enable a directory:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Locate the directory and, in the Actions column, click **Enable**.


###<a id="DisableDir"></a>Disable a Directory

Disabling directories prevents the accounts from logging into any applications connected to Stormpath, but retains the directory, group, and account data. If you must shut off several accounts quickly and easily, disable a directory. 

The Stormpath Administrators directory cannot be disabled.

To disable a directory:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Locate the directory and, in the Actions column, click **Disable**.

All groups and accounts within the directory are now unable to log into any applications for which the directory is a login source.


###<a id="DeleteDir"></a>Delete a Directory

Deleting a directory completely erases the directory and all group and account data from Stormpath. 

We recommend that you disable a directory rather than delete it, in case an associated application contains historical data associated with accounts in the directory.

The Stormpath Administrators directory cannot be deleted.

To delete a directory:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Locate the directory and, in the Actions column, click **Delete**.


***

##<a id="Accounts"></a>*Accounts*

In Stormpath, users are referred to as user account objects or [accounts](#Account). The username and email fields for accounts are unique within a directory and are used to log into applications. Within Stormpath, an unlimited number of accounts per directory is supported. 

You manage LDAP/AD accounts on your primary LDAP/AD installation. LDAP/AD accounts and groups are automatically deleted when:

* The backing object is deleted from the LDAP/AD directory service.
* The backing LDAP/AD object information no longer matches the account filter criteria configured for the agent.
* The LDAP/AD directory is deleted.

An account is a unique identity within a directory. An account can exist in only a single directory but can be a part of multiple [groups](#Groups) owned by that directory.

For accounts, you can: 

* [Locate the account REST URL](#LocateAccURL).
* [Authenticate accounts](#AuthenticateAccounts).
* [Navigate the account browser](#NavigateAccounts).
* [Create an account](#CreateAccounts).
* [Edit account details](#EditAccounts).
* [Change an account password](#ChangeAccountPasswords).
* [Assign an account to group](#AssignAccountGroups).
* [Remove an account from a group](#RemoveAccountGroups).
* [Enable an account](#EnableAccounts).
* [Disable an account](#DisableAccounts).
* [Delete an account](#DeleteAccounts).

###<a id="LocateAccURL"></a>Locate the Account REST URL

When communicating with the Stormpath REST API, you might need to reference an account using the REST URL or `href`. For example, you require the REST URL to create accounts in the directory using an SDK. 

To obtain an account REST URL:

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. In the Accounts table, click the account name.<br>The REST URL appears on the Details tab.


###<a id="AuthenticateAccounts"></a>Authenticate Accounts


**cURL**

1. Base64 encode the user-submitted username (or email), colon character ':', and password. For example, on *nix:

		$ echo 'account_username:account_password' | openssl base64
		YWNjb3VudF91c2VybmFtZTphY2NvdW50X3Bhc3N3b3JkCg==

2. Use your API key ID and secret and the base64 `value` and POST to your application loginAttempts URL:

		$ curl --user API_KEY_ID:API_KEY_SECRET \
	       -H "Accept: application/json" \
    	   -H "Content-Type: application/json" 
    	   -d '{"type": "basic", \
    	   "value":"YWNjb3VudF91c2VybmFtZTphY2NvdW50X3Bhc3N3b3JkCg=="}' \
    	   https://api.stormpath.com/v1/applications/APP_UID/loginAttempts

**httpie**

1. Base64 encode the user-submitted username (or email), colon character ':', and password. For example, on *nix:

		$ echo 'account_username:account_password' | openssl base64
		YWNjb3VudF91c2VybmFtZTphY2NvdW50X3Bhc3N3b3JkCg==

2. Use your API key ID and secret and the base64 `value` and POST to your application loginAttempts URL:

		$ http -a API_KEY_ID:API_KEY_SECRET POST \
		  https://api.stormpath.com/v1/applications/APP_UID/loginAttempts \
		  type=basic value=YWNjb3VudF91c2VybmFtZTphY2NvdW50X3Bhc3N3b3JkCg==
    


###<a id="NavigateAccounts"></a>Navigate the Account Browser

The accounts browser enables you to view and search for accounts in Stormpath.

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
	* This displays the accounts browser, showing all accounts that exist in your Stormpath tenant.
	* A disabled account cannot log into any application, regardless of whether or not they are mapped to it.
3. To view or edit an account, click the account name or, under the Actions column, click **Edit**.
4. To view the groups for which the account is a member, click the **Groups** tab.
5. To view the applications to which the account has access, click the **Applications** tab.


###<a id="CreateAccounts"></a>Create an Account

You can only create accounts for cloud, or Stormpath-managed directories. For accounts in a mirrored directory, the accounts must be created on the primary server and then they are mirrored to the Stormpath agent.

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. Click **Create an Account**.
4. Complete the fields as follows:<br>
<img src="http://www.stormpath.com/sites/default/files/docs/CreateAccount.png" alt="Create Account" title="Create Account" width="640" height="380">
	
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
Confirm Password | Confirmation of the account credentials. This value must match the value of the Password attribute.|

5. Click **Create Account**.

If workflow automation is configured:

* Creating an account automatically initiates an Account Registration & Verification workflow that sends the account owner an email. 
* You can suppress emails by selecting Suppress Registration and Verification emails.

After adding an account, you can specify its group membership, specify any administrator rights to Stormpath, and set the API keys.


###<a id="EditAccounts"></a>Edit an Account

1. Log in to the Stormpath Admin Console. 
2. Click the **Accounts** tab.<br>You can refine your search to the directory level by clicking the appropriate directory name under the Directory column.
3. Under the Name column, click the account name link.<br>
	**OR**<br>	
4. Under the Actions column for the account, click **Edit**.<br>
<img src="http://www.stormpath.com/sites/default/files/docs/AccountDetail.png" alt="Edit Account" title="Edit Account" width="700"><br>
5. On the Details tab, change the values as required, noting the following information:
	
	Attribute | Description
:----- | :-----
Directory | The directory to which the account was added.<br>**Note:** The account cannot be moved to a different directory. |
Username | The login name of the account for applications using username instead of email. The value must be unique within its parent directory.|
First Name | The account owner first name. |
Middle Name | The account owner middle name. |
Last Name | The account owner last name. |
First Name | The account owner first name. |
Email | The account owner email address. This is can be used by applications, such as the Stormpath Admin Console, that use an email address for logging in. The value must be unique within its parent directory. |
Status | The status is changed within the Accounts table on the Accounts tab. |

6. Under Security Credentials, you can:
	* Change the password. Your options include, forcing the account owner to change the password or resetting the password for the account owner.
	* Create an API key. 
7. When all updates are complete, click **Update**.

	
###<a id="ChangeAccountPasswords"></a>Change an Account Password

To change an account password: 

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. Under the Name column, click the account name.
4. On the Details tab, under Security Credentials, click **Change Password**.<br>
<img src="http://www.stormpath.com/sites/default/files/docs/PasswordChange.png" alt="Change Password" title="Change Password" width="700"><br>
5. You can cancel the password change, select to have the user reset the password, or change the password for the user.
6. When all updates are complete, click **Update**.
	

###<a id="AssignAccountGroups"></a>Assign an Account to a Group

If the account is part of a directory containing groups, you can associate the account with a group.

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. Under the Name column, click the account name.
4. Click the **Groups** tab.
5. Click **Assign to group**.
6. In the Assign account dialog, select the appropriate groups and click **Assign**.

The Account Groups tab refreshes to include the new group.


###<a id="RemoveAccountGroups"></a>Remove an Account from Groups

If the account is the member of a group within a directory, you can remove the account from the group.

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. Click the account name.
3. Click the **Groups** tab.
4. Under the Actions column, click **Remove**.

The Account Groups tab refreshes with the group removed.

###<a id="EnableAccounts"></a>Enable an Account

Enabling a previously disabled account allows the account to log in to any applications where the directory or group is defined as an application login source.

**Note:** Enabling and disabling accounts for mirrored directories is not available in Stormpath. You manage mirrored accounts on the primary server installation.

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. To disable an account, in the Accounts table, under Actions column for the account, click **Enable**.
4. In the prompt that appears, to confirm disabling the account, click **Ok**.


###<a id="DisableAccounts"></a>Disable an Account

Disabling an account prevents the account from logging into any applications in Stormpath, but retains all account information. You typically disable an account if you must temporarily remove access privileges.

If you disable an account within a directory or group, you are completely disabling the account from logging in to any applications to which it is associated.

**Note:** Enabling and disabling accounts for mirrored directories is not available in Stormpath. You manage mirrored accounts on the primary server installation.

You can disable cloud directory accounts using the Stormpath Admin Console.

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. To disable an account, in the Accounts table, under Actions column for the account, click **Disable**.
4. In the prompt that appears, to confirm disabling the account, click **Ok**.


###<a id="DeleteAccounts"></a>Delete an Account

Deleting an account completely erases the account from the directory and erases all account information from Stormpath.

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. Under the Actions column for the account, click **Delete**.
4. In the prompt that appears, to confirm deleting the account, click **Ok**.
	

***


##<a id="Groups"></a>*Groups*

[Groups](#Group) are collections of accounts within a directory that are often used for authorization and access control to the application. In Stormpath, the term group is synonymous with role.

You manage LDAP/AD groups on your primary LDAP/AD installation. LDAP/AD accounts and groups are automatically deleted when:

* The backing object is deleted from the LDAP/AD directory service.
* The backing LDAP/AD object information no longer matches the account filter criteria configured for the agent.
* The LDAP/AD directory is deleted.

For groups, you can:

* [Locate the group REST URL](#LocateGroupURL).
* [View directory groups](#ListGroups).
* [Create groups](#CreateGroups).
* [Edit a group](#EditGroups).
* [Enable a group](#EnableGroups).
* [Disable a group](#DisableGroups).
* [Delete a group](#DeleteGroups).
* [Manage group accounts](#ManageGroupAccounts).
	* [View accounts associated with a group](#ListGroupAccounts).
	* [Add accounts to a group](#AddGroupAccounts).
	* [Assign accounts to a group](#AssignGroupAccounts).
	* [Edit group account details](#EditGroupAccounts).
	* [Enable a group account](#EnableGroupAccounts).
	* [Disable a group account](#DisableGroupAccounts).
	* [Remove a group account](#RemoveGroupAccounts).

###<a id="LocateGroupURL"></a>Locate the Group REST URL

When communicating with the Stormpath REST API, you might need to reference a group using the REST URL or `href`. For example, you require the REST URL to create accounts to associate with the group in the directory using an SDK. 

To obtain a group REST URL:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. In the Directories table, click the directory name.
4. Click the **Groups** tab.
5. Click the group name.<br>The REST URL appears on the Details tab.


###<a id="ListGroups"></a>View Directory Groups

To view the groups associated with a directory:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.


###<a id="CreateGroups"></a>Create a Group

To create a group:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.
5. Click **Create Group**.<br>
	<img src="http://www.stormpath.com/sites/default/files/docs/CreateGroup.png" alt="Create Groups" title="Create Groups" width="700"><br>
6. Complete the fields as follows:
	
	Attribute | Description
	:----- | :-----
Name | The name of the group. Within a given directory, this value must be unique. |
Description | A short description of the group.|
Status| This is set to Enabled by default. This is only set to Disabled to prevent all group accounts from logging into any application even when the group is set as a login source to an application.<br>**Note:** If an account is also a member to another group that does have access to an application, then the account can login. |

7. When the fields are complete, click **Create**.


###<a id="EditGroups"></a>Edit Group Details

To edit the details of a group:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.
5. Click the group name link or under the Actions column, click **Edit**.
6. Change the values as required and, when done, click **Update**.


###<a id="EnableGroups"></a>Enable a Group

If the group is contained within an *enabled directory where the directory is defined as a login source*, then enabling the group allows all accounts contained within the group (membership list) to log in to any applications for which the directory is defined as a login source.

If the group is contained within an *disabled directory where the directory is defined as a login source*, the group members are not be able to log in to any applications for which the directory is defined as a login source. 

If the group is defined as a login source, then enabling the group allows accounts contained within the group (membership list) to log in to any applications for which the group is defined as a login source.

To enable a group:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.
5. Under the Actions column, click **Enable**.


###<a id="DisableGroups"></a>Disable a Group

If a group is explicitly set as an application login source, then disabling that group prevents any of its user accounts from logging into that application but retains the group data and memberships. You would typically disable a group if you must shut off a group of user accounts quickly and easily.

If the group is contained within an directory defined as a login source, disabling the group prevents group members from logging in to any applications for which the directory is defined as a login source. 

To disable a group:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.
5. Under the Actions column, click **Disable**.


###<a id="DeleteGroups"></a>Delete a Group

Deleting a cloud directory group erases the group and all its membership relationships. User accounts that are members of the group will not be deleted.

We recommend that you disable an group rather than delete it, if you believe you might need to retain the user data or application connection.

To delete a cloud directory group:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.
5. Under the Actions column, click **Delete**.


###<a id="ManageGroupAccounts"></a>Manage Group Accounts

For cloud directory group accounts, you can: 	
	
* [View accounts associated with a group](#ListGroupAccounts)
* [Add accounts to a group](#AddGroupAccounts)
* [Assign accounts to a group](#AssignGroupAccounts)
* [Edit group account details](#EditGroupAccounts)
* [Enable a group account](#EnableGroupAccounts)
* [Disable a group account](#DisableGroupAccounts)
* [Remove a group account](#RemoveGroupAccounts)

**Note:** Removing an account from a group, does not delete the account from the directory.


####<a id="ListGroupAccounts"></a>List Group Accounts

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.
5. In the Groups table, under the Actions column, click **Members**.
	 
	 
####<a id="AddGroupAccounts"></a>Add Group Accounts

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.
5. Click the group name.
6. Click the **Accounts** tab.
7. Click **Create Account**.
8. Consult [Create an Account](#CreateAccounts) for more information.


####<a id="AssignGroupAccounts"></a>Assign Group Accounts

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.
5. Click the group name.
6. Click the **Accounts** tab.
7. Click **Assign Accounts**.
8. In the Assign Accounts dialog, select the account.
9. Click **Assign Account**.<br>The members table refreshes with the new account included.

####<a id="EditGroupAccounts"></a>Edit Group Accounts

Although accessible through the Accounts tab of a group, accounts are edited at the account level. If using the Stormpath Admin Console, you edit accounts on the Accounts tab.

To edit a group account:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.
5. Click the group name.
6. Click the **Accounts** tab.
7. Click the account name or under the Actions column, click **Edit**.
8. For more information about editing accounts in the Stormpath Admin Console, consult [Edit an Account](#EditAccounts).

####<a id="EnableGroupAccounts"></a>Enable Group Accounts

Although the Stormpath Admin Console provides an option to enable an account within a group, the enable command is actually performed against the account. If you enable an account within a directory or group, you are completely enabling the account to be able to log in to any applications with which it is associated.

To disable an account from within a group:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.
5. Click the group name.
6. Click the **Accounts** tab.
7. Under the Status column, click the **Disabled**.

####<a id="DisableGroupAccounts"></a>Disable Group Accounts

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


####<a id="RemoveGroupAccounts"></a>Remove Group Accounts

To remove accounts from a group:

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.
5. Click the group name.
6. Click the **Accounts** tab.
7. Locate the account and under the Actions column, click **Remove**.


***

##<a id="Glossary"></a>*Glossary of Terms*

Property | Description 
:----- | :----- |
<a id="Account"></a>Account | An **account** is a unique identity within a directory. Stormpath does not use the term *user* because it implies a person, while accounts can represent a person, 3rd-party software, or non-human clients. Accounts can be used to log in to applications. |
<a id="Agent"></a>Agent | An **agent** populates LDAP directories. An agent status reflects communication/error state because the agent is communicating with Stormpath. |
<a id="APIKey"></a>API Key | An **API key** is a unique ID paired with a secret value. API keys are used by software applications to communicate with Stormpath through the Stormpath REST API. |
<a id="Application"></a>Application | An **application** is a software application that communicates with Stormpath. It is typically a real world application that you are building, such as a web application, but it can also be infrastructural software, such as a Unix or Web server. |
<a id="Authentication"></a>Authentication | **Authentication** is the act of proving someone (or something) is actually who they say they are. When an account is authenticated, there is a high degree of certainty that the account identity is legitimate. |
<a id="Authorization"></a>Authorization | **Authorization**, also known as Access Control, is the process of managing and enforcing access to protected resources, functionality, or behavior. |
<a id="Directory"></a>Directory | A **directory** is a collection of accounts and groups. Administrators can use different directories to create silos of accounts. For example, customers and employees can be stored in different directories. |
<a id="DirectoryAgent"></a>Directory Agent | A **directory agent** is a Stormpath software application installed on your corporate network to securely synchronize an on-premise directory, such as LDAP or Active Directory, into a Stormpath cloud directory. |
<a id="DirectoryMirroring"></a>Directory Mirroring | **Directory mirroring** securely replicates selected data from one (source) directory to another (target or mirrored) directory for authentication and access control. The source directory is the authoritative source for all data. Changes are propagated to the target/mirror directory for convenience and performance benefits. |
<a id="Group"></a>Group | A **group** is a collection of accounts within a directory. In Stormpath, for anyone familiar with Role-Based Access Control, the term group is used instead of role. |
<a id="IdentityManagement"></a>Identity Management | **Identity management** is the management, authentication, authorization, and permissions of identities to increase security and productivity, while decreasing cost, downtime, and repetitive tasks. |
<a id="LoginSource"></a>Login Source | A **login source** is a directory or group associated with an application for account authentication. Accounts within login sources associated with an application can login to that application. |
<a id="Role"></a>Role |A **role** is a classification of accounts, such as administrators or employees. In Stormpath, roles are represented as groups. |
<a id="RBAC"></a>Role-Based Access Control | **Role-Based Access Control** (RBAC) is the act of controlling access to protected resources or behavior based on the groups assigned to a particular account. RBAC is done using Stormpath groups. |
<a id="RESTAPIdef"></a>REST API | **REST API** is a software architectural style enabling data transfer and functionality using common web-based communication protocols. Stormpath provides a REST API for tenants so they can easily integrate Stormpath with their software applications. |
<a id="Tenant"></a>Tenant | A **tenant** is a private partition within Stormpath containing all data and settings—specifically your applications, directories, groups and accounts. When you sign up for Stormpath, a tenant is created for you. You can add other user accounts (for example, for your co-workers) to your tenant to help you manage your data. For convenience, many companies like to have one tenant where they can easily manage all application, directory, and account information across their organization. **Note:** You must know your tenant when logging in to the Admin Console website. There is a "Forgot Tenant" link on the login page if you do not know what your tenant is. |

