---
layout: doc
lang: console
title: Stormpath Admin Quickstart Guide
---

Welcome to Stormpath's Admin Console Quickstart!

This quickstart will get you up and running with Stormpath in about 10 minutes and give you a good initial feel for the Stormpath Admin Console.  During this quickstart, you will do the following:

* Register for a free Stormpath account
* Log in to the admin console
* Register an application with Stormpath so you can manage your directories and accounts
* Create a directory that can store accounts
* Create an account that can log in to the application

With Stormpath, you can offload repetitive security-sensitive logic to Stormpath and get back to building your application's core functionality.  Never worry about storing passwords again!

***

## Sign Up for Stormpath

1. Fill out and submit the [Stormpath registration form](https://api.stormpath.com/register).  This will send a confirmation email.
2. Click the link in the confirmation email.

***

## Working with the Stormpath Admin Console

[Log in to Stormpath](https://api.stormpath.com/login) as the tenant administrator using the credentials you specified during registration.

You'll need to enter three values to log in:

* Your `tenant`
* Your `username`
* Your `password`

Your `tenant` is a unique name for all of your personal data in our systems; different accounts may be granted access to your application or the Admin Console itself, but all of the accounts you exist are created on your tenant.

Once you're logged into the Admin Console, you can start to manipulate applications, directories, and accounts.

### Creating an application

An `application` represents your software application which will be connected to Stormpath. All accounts and directories you want to make accessible through your software application must be connected to a Stormpath `application`.

To create an application, do the following:

1. Click the <strong>Applications</strong> tab along the top of the page.
    2. Click the <strong>Register Application</strong> button.
    
        <img src="http://www.stormpath.com/sites/default/files/docs/ApplicationRegistrationWizard.png" alt="Register Application Wizard" title="Register Application Wizard" width="700">
        
    3. Complete the fields as follows:

        Attribute | Description
:--- | :---
Name | The name used to identify the application within Stormpath. This value must be unique.
Description | A short description of the application.
Status | By default, this value is set to Enabled. Change the value to Disabled if you want to prevent accounts from logging in to the application.

    4. For the associated directory, you can:

        * Create a new directory, which can be named to match the application or have a distinct name.
        * Add users from other directories or groups.
        * After specifying the directory parameters, you can specify the login priority order.
    
    5. When all information is complete, click <strong>Save</strong>.

{% docs tip %}
A URL for the application is often helpful.
{% enddocs %}

At this point, you'll see that your application was successfully created. You can also edit the application, or any of your applications, by clicking on its name in the list of applications.

### Creating a directory

A `directory` contains `accounts`. Directories enforce specific restrictions on the accounts that can exist within it, such as the min and max characters for passwords of accounts in that directory. 

To create a directory, do the following:

1. Click the <strong>Directories</strong> tab.
2. Click <strong>Create Directory</strong>.
3. Click <strong>Cloud</strong>.

    <img src="http://www.stormpath.com/sites/default/files/docs/CreateCloudDirectory.png" alt="Create Cloud Directory" title="Create Cloud Directory" width="650" height="440">

4. Complete the field values as follows: <br>

    Attribute | Description
:----- | :-----
Name | The name used to identify the directory within Stormpath. This value must be unique.
Description | Details about this specific directory.
Status | By default, this value is set to Enabled. Change the value to Disabled if you want to prevent all user accounts in the directory from authenticating even where the directory is set as a login source to an application.
Min characters | The minimum number of acceptable characters for the account password.
Max characters | The maximum number of acceptable characters for the account password.
Mandatory characters | The required character patterns which new passwords will be validated against. For example, for an alphanumeric password of at least 8 characters with at least one lowercase and one uppercase character, select the abc, ABC, and 012 options. The more patterns selected, the more secure the passwords but the more complicated for a user.

5. Click **Create**. </p>

At this point, you'll see that your directory was successfully created. You can also edit the directory, or any of your directory, by clicking on its name in the list of directories.

### Creating an account

A `account` represents an entity that can authenticate with your application. This could be an end-user, an administrator, another software application, or any other entity that needs to authenticate with your application. Accounts have a basic set of attributes. 

1. Click the <strong>Accounts</strong> tab.
2. Click <strong>Create an Account</strong>.

    <img src="http://www.stormpath.com/sites/default/files/docs/CreateAccount.png" alt="Create Account" title="Create Account" width="640" height="380">

3. Complete the fields as follows: <br>

    Attribute | Description
:--- | :---
Directory | The directory to which the account will be added.
Username | The login name of the account for applications using username instead of email. The value must be unique within its parent directory.
First Name | The account owner first name.
Middle Name | The account owner middle name.
Last Name | The account owner last name.
First Name | The account owner first name.
Email | The account owner email address. This is can be used by applications, such as the Stormpath Admin Console, that use an email address for logging in. The value must be unique within its parent directory.
Status | The status is set to Enabled by default. It is only set to Disabled if you want to deny access to the account to Stormpath-connected applications.
Password | The credentials used by an account during a login attempt. The specified value must adhere to the password policies set for the parent directory.
Confirm Password | Confirmation of the account credentials. This value must match the value of the Password attribute.

4. Click <strong>Create Account</strong>.

At this point, you'll see that your account was successfully created. You can also edit the account, or any of your accounts, by clicking on its name in the list of accounts.

{% docs note %}
The account cannot be moved to a different directory after it has been created.
{% enddocs %}

***

## Next Steps

We hope you have found this Quickstart helpful!

For full coverage of Stormpath's Admin Console, including how to edit application details, edit accounts, create groups and assign accounts to groups, reset passwords via password reset emails, and more, please see our [Admin Console](/console/product-guide).
