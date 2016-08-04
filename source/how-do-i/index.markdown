---
layout: doc
description: Quick guides to common user management tasks with Stormpath.
title: How Do I...?
lang: rest
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
* [Reset an account's password](#PasswordReset)
* [Verify an account's email](#VerifyEmail)


****

##<a id="CreateAccount"></a>Create an Account

For information about creating an account, refer to the appropriate product guide:

* [REST Product Guide](/rest/product-guide/latest/accnt_mgmt.html#add-a-new-account-to-a-directory)
* [Java Product Guide](/java/product-guide/#account-create)
* [PHP Product Guide](/php/product-guide/#account-create)
* [Ruby Product Guide](/ruby/product-guide/#account-create)
* [Python Product Guide](/python/product-guide/#account-create)

##<a id="AssignAcGps"></a>Assign Accounts to Groups

In Stormpath, roles are represented as groups. A group is a collection of accounts within a directory. If the account is part of a directory containing groups, you can associate the account with a group.

For information about assigning an account to a group, refer to the appropriate product guide:

* [REST Product Guide](/rest/product-guide#account-add-group)
* [Java Product Guide](/java/product-guide#account-add-group)
* [PHP Product Guide](/php/product-guide#account-add-group)
* [Ruby Product Guide](/ruby/product-guide#account-add-group)
* [Python Product Guide](/python/product-guide#account-add-group)

##<a id="CreateDirectory"></a>Create a New Directory

For information about creating directories, refer to the appropriate product guide:

* [REST Product Guide](/rest/product-guide#directory-create)
* [Java Product Guide](/java/product-guide#directory-create)
* [PHP Product Guide](/php/product-guide#directory-create)
* [Ruby Product Guide](/ruby/product-guide#directory-create)
* [Python Product Guide](/python/product-guide#directory-create)

##<a id="UpdateDirectories"></a>Update a Directory

For information about updating a cloud directory or agent configuration, refer to the appropriate product guide:

* [Edit a Cloud Directory: REST Product Guide](/rest/product-guide#update-a-directory)
* [Edit a Cloud Directory: Java Product Guide](/java/product-guide#update-a-directory)
* [Edit a Cloud Directory: PHP Product Guide](/php/product-guide#update-a-directory)
* [Edit a Cloud Directory: Ruby Product Guide](/ruby/product-guide#update-a-directory)
* [Edit a Cloud Directory: Python Product Guide](/python/product-guide#update-a-directory)


##<a id="AddLS"></a>Add an Application Account Store Mapping
Adding an account store mapping to an application provisions a directory or group to that application.  By doing so, all account store accounts can log into the application.  Sometimes this is called associating a directory with an application or associating a group with an application.

For information about adding login sources, refer to the appropriate product guide:

* [REST Product Guide](/rest/product-guide#create-an-account-store-mapping)
* [Java Product Guide](/java/product-guide#create-an-account-store-mapping)
* [PHP Product Guide](/php/product-guide#create-an-account-store-mapping)
* [Ruby Product Guide](/ruby/product-guide#create-an-account-store-mapping)
* [Python Product Guide](/python/product-guide#create-an-account-store-mapping)

##<a id="AuthenticateUser"></a>Authenticate a User

Below is the generic flow for authenticating a user in Stormpath:

1. Collect your end-user's plaintext username (or email) and password.
2. Base64-encode the user-submitted data.
3. Post the Base64-encoded data over SSL to your application loginAttempts REST URL.

For information about authenticating users, refer to the appropriate product guide:

* [REST Product Guide](/rest/product-guide#AuthenticateAccounts)
* [Java Product Guide](/java/product-guide#AuthenticateAccounts)
* [PHP Product Guide](/php/product-guide#AuthenticateAccounts)
* [Ruby Product Guide](/ruby/product-guide#AuthenticateAccounts)
* [Python Product Guide](/python/product-guide#AuthenticateAccounts)


##<a id="UseLDAP"></a>Use an LDAP directory

For information about using an LDAP directory, refer to the appropriate product guide:

* [REST Product Guide](/rest/product-guide#directory-mirror)
* [Java Product Guide](/java/product-guide#directory-mirror)
* [PHP Product Guide](/php/product-guide#directory-mirror)
* [Ruby Product Guide](/ruby/product-guide#directory-mirror)
* [Python Product Guide](/python/product-guide#directory-mirror)


##<a id="CreateDirGroups"></a>Create Roles Within Directories

Groups are collections of accounts within a directory that are often used for authorization and access control to the application. In Stormpath, the term group is used in place of role.

For information about creating groups, refer to the appropriate product guide:

* [REST Product Guide](/rest/product-guide#create-a-group)
* [Java Product Guide](/java/product-guide#create-a-group)
* [PHP Product Guide](/php/product-guide#create-a-group)
* [Ruby Product Guide](/ruby/product-guide#create-a-group)
* [Python Product Guide](/python/product-guide#create-a-group)

##<a id="EstConnectionAppSP"></a>Add an Application to Stormpath

To associate an application with Stormpath for authentication and authorization, you must register the application within Stormpath. When registering an application with Stormpath, you are adding the application for authentication through Stormpath.

For information about connecting applications with Stormpath, refer to the appropriate product guide:

* [REST Product Guide](/rest/product-guide#create-an-application-aka-register-an-application-with-stormpath)
* [Java Product Guide](/java/product-guide#create-an-application-aka-register-an-application-with-stormpath)
* [PHP Product Guide](/php/product-guide#create-an-application-aka-register-an-application-with-stormpath)
* [Ruby Product Guide](/ruby/product-guide#create-an-application-aka-register-an-application-with-stormpath)
* [Python Product Guide](/python/product-guide#create-an-application-aka-register-an-application-with-stormpath)


##<a id="#PasswordReset"></a>Resetting an Account's Password

Workflows are common user management operations that are automated for you by Stormpath. You can only use the Password Reset Workflow on cloud directories and configurations for workflow automations are applied at the directory level.

For information about managing workflow automations, refer to the appropriate product guide:

* [REST Product Guide](/rest/product-guide#application-password-reset)
* [Java Product Guide](/java/product-guide#application-password-reset)
* [PHP Product Guide](/php/product-guide#application-password-reset)
* [Ruby Product Guide](/ruby/product-guide#application-password-reset)
* [Python Product Guide](/python/product-guide#application-password-reset)

##<a id="#VerifyEmail"></a>Verifying an Account's Email

To enable Account Registration and Verification on an application, you must use the Admin Console to configure and enable this workflow.

For information about managing workflow automations, refer to the appropriate product guide:

* [Admin Console Product Guide](/console/product-guide#account-registration-and-verification)


