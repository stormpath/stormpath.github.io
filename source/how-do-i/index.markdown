---
layout: default
title: How Do I...?
---

* [Create an account.](#CreateAccount)
* [Assign a role to a user](#AssignAcGps)
* [Create a new directory.](#CreateDirectory)
* [Update a directory.](#UpdateDirectories)
* [Add another directory or login source.](#AddLS)
* [Associate a directory with an application.](#AssociateDir)
* [Authenticate a user.](#AuthenticateUser)
* [Use an LDAP directory.](#UseLDAP)
* [Create roles within directories.](#CreateDirGroups)
* [Add an application for Stormpath authorization.](#EstConnectionAppSP)
* [Manage workflow automations.](#ManageWA)


****


##<a id="CreateAccount"></a>Create an Account

1. Log in to the Stormpath Admin Console.
2. Click the **Accounts** tab.
3. Click **Create an Account**.

For information about creating an account, refer to the appropriate product guide:

* [Console Product Guide](/console/product-guide#CreateAccounts)
* [REST Product Guide](/rest/product-guide#CreateAccounts)
* [Java Product Guide](/java/product-guide#CreateAccounts)
* [PHP Product Guide](/php/product-guide#CreateAccounts)
* [Ruby Product Guide](/ruby/product-guide#CreateAccounts)
* [Python Product Guide](/python/product-guide#CreateAccounts)

##<a id="AssignAcGps"></a>Assign Accounts to Groups

In Stormpath, roles are represented as groups. A group is a collection of accounts within a directory. If the account is part of a directory containing groups, you can associate the account with a group.

1. Navigate to the appropriate account.
2. Click the **Groups** tab.
3. Click **Assign to group**.
4. In the Assign account dialog, select the appropriate groups and click **Assign**.

The Account Groups tab refreshes to include the new group.

For information about assigning an account to a group, refer to the appropriate product guide:

* [Console Product Guide](/console/product-guide#AssignAccountGroups)
* [REST Product Guide](/rest/product-guide#AssignAccountGroup)
* [Java Product Guide](/java/product-guide#AssignAccountGroup)
* [PHP Product Guide](/php/product-guide#AssignAccountGroup)
* [Ruby Product Guide](/ruby/product-guide#AssignAccountGroup)
* [Python Product Guide](/python/product-guide#AssignAccountGroup)

##<a id="CreateDirectory"></a>Create a New Directory

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click **Create Directory**.

For information about creating directories, refer to the appropriate product guide:

* [Create a Stormpath Cloud Directory: Console Product Guide](/console/product-guide#CreateCloud)
* [Create an LDAP Directory: Console Product Guide](/console/product-guide#CreateDir)
* [REST Product Guide](/rest/product-guide#CreateDir)
* [Java Product Guide](/java/product-guide#CreateDir)
* [PHP Product Guide](/php/product-guide#CreateDir)
* [Ruby Product Guide](/ruby/product-guide#CreateDir)
* [Python Product Guide](/python/product-guide#CreateDir)



##<a id="UpdateDirectories"></a>Update a Directory

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Scroll the Directories table and click the directory name.
4. Make the necessary changes and click **Update**.

For information about updating a cloud directory or agent configuration, refer to the appropriate product guide:

* [Edit a Cloud Directory: Console Product Guide](/console/product-guide#EditDir)
* [Update LDAP Agent Configuration: Console Product Guide](/console/product-guide#UpdateAgent)
* [Edit a Cloud Directory: REST Product Guide](/rest/product-guide#EditDir)
* [Edit a Cloud Directory: Java Product Guide](/java/product-guide#EditDir)
* [Edit a Cloud Directory: PHP Product Guide](/php/product-guide#EditDir)
* [Edit a Cloud Directory: Ruby Product Guide](/ruby/product-guide#EditDir)
* [Edit a Cloud Directory: Python Product Guide](/python/product-guide#EditDir)


##<a id="AddLS"></a>Add Another Login Source
Adding a login source to an application provisions a directory or group to that application.  By doing so, all login source accounts can log into the application.

1. Click **Add Login Source**.
2. In the login source list, select the appropriate directory.
3. If the directory contains groups, you can select all users or specific group for access. 
4. Click **Add Login Source**.

	The new login source is added to the bottom of the login sources list.    
	
For information about adding login sources, refer to the appropriate product guide:

* [Console Product Guide](/console/product-guide#AddLoginSource)
* [REST Product Guide](/rest/product-guide#AddLoginSource)
* [Java Product Guide](/java/product-guide#AddLoginSource)
* [PHP Product Guide](/php/product-guide#AddLoginSource)
* [Ruby Product Guide](/ruby/product-guide#AddLoginSource)
* [Python Product Guide](/python/product-guide#AddLoginSource)


##<a id="AssociateDir"></a>Associate a Directory with an Application

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click the application name.
4. Click the **Login Sources** tab.
5. Click **Add Login Source**.
6. In the login source list, select the appropriate directory.
7. Select all users or specific group for access. 
8. Click **Add Login Source**.

For information about associating directories and applications, refer to the appropriate product guide:

* [Console Product Guide](/console/product-guide#AssocApplications)
* [REST Product Guide](/rest/product-guide#AssocApplications)
* [Java Product Guide](/java/product-guide#AssocApplications)
* [PHP Product Guide](/php/product-guide#AssocApplications)
* [Ruby Product Guide](/ruby/product-guide#AssocApplications)
* [Python Product Guide](/python/product-guide#AssocApplications)



##<a id="AuthenticateUser"></a>Authenticate a User

1. Collect your end-user's plaintext username (or email) and password.
2. Base64-encode the user-submitted data.
3. Post the Base64-encoded data over SSL to your application loginAttempts REST URL.

For information about authenticating users, refer to the appropriate product guide:

* [Console Product Guide](/console/product-guide#AuthenticateAccounts)
* [REST Product Guide](/rest/product-guide#AuthenticateAccounts)
* [Java Product Guide](/java/product-guide#AuthenticateAccounts)
* [PHP Product Guide](/php/product-guide#AuthenticateAccounts)
* [Ruby Product Guide](/ruby/product-guide#AuthenticateAccounts)
* [Python Product Guide](/python/product-guide#AuthenticateAccounts)


##<a id="UseLDAP"></a>Use an LDAP directory

For information about using an LDAP directory, refer to the appropriate product guide:

* [Console Product Guide](/console/product-guide#CreateDir)
* [REST Product Guide](/rest/product-guide#CreateDir)
* [Java Product Guide](/java/product-guide#CreateDir)
* [PHP Product Guide](/php/product-guide#CreateDir)
* [Ruby Product Guide](/ruby/product-guide#CreateDir)
* [Python Product Guide](/python/product-guide#CreateDir)


##<a id="CreateDirGroups"></a>Create Roles Within Directories

Groups are collections of accounts within a directory that are often used for authorization and access control to the application. In Stormpath, the term group is used in place of role.

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click the **Groups** tab.
5. Click **Create Group**.
6. Complete the fields and click **Create**.

For information about creating groups, refer to the appropriate product guide:

* [Console Product Guide](/console/product-guide#CreateGroups)
* [REST Product Guide](/rest/product-guide#CreateGroups)
* [Java Product Guide](/java/product-guide#CreateGroups)
* [PHP Product Guide](/php/product-guide#CreateGroups)
* [Ruby Product Guide](/ruby/product-guide#CreateGroups)
* [Python Product Guide](/python/product-guide#CreateGroups)

##<a id="EstConnectionAppSP"></a>Add an Application to Stormpath

To associate an application with Stormpath for authentication and authorization, you must register the application within Stormpath. When registering an application with Stormpath, you are adding the application for authentication through Stormpath.

1. Log in to the Stormpath Admin Console.
2. Click the **Applications** tab.
3. Click **Register Application**.
4. Complete the steps in the Register Application wizard.

For information about connecting applications with Stormpath, refer to the appropriate product guide:

* [Console Product Guide](/console/product-guide#RegisterApps)
* [REST Product Guide](/rest/product-guide#RegisterApps)
* [Java Product Guide](/java/product-guide#RegisterApps)
* [PHP Product Guide](/php/product-guide#RegisterApps)
* [Ruby Product Guide](/ruby/product-guide#RegisterApps)
* [Python Product Guide](/python/product-guide#RegisterApps)


##<a id="ManageWA"></a>Manage Workflow Automations

Workflows are common user management operations that are automated for you by Stormpath. You can only use this feature on cloud directories and configurations for workflow automations are applied at the directory level.

1. Log in to the Stormpath Admin Console.
2. Click the **Directories** tab.
3. Click the directory name.
4. Click **Workflows** tab.

For information about managing workflow automations, refer to the appropriate product guide:

* [Console Product Guide](/console/product-guide#ManageWorkflowAutomation)
* [REST Product Guide](/rest/product-guide#ManageWorkflowAutomation)
* [Java Product Guide](/java/product-guide#ManageWorkflowAutomation)
* [PHP Product Guide](/php/product-guide#ManageWorkflowAutomation)
* [Ruby Product Guide](/ruby/product-guide#ManageWorkflowAutomation)
* [Python Product Guide](/python/product-guide#ManageWorkflowAutomation)


<!--
//TODO: add REST API links to each item
//TODO: add "How do I" for Password reset AND include the details of creating the password reset page
//TODO: add "How do I" for Verification AND include the details of creating the verification page
-->

