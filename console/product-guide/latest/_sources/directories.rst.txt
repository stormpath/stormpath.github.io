.. _directories:

***********
Directories
***********

The Directory resource is a top-level container for Account and Group resources. A Directory also manages security policies (like password strength) for the Accounts it contains. Directories can be used to cleanly manage segmented user Account populations. For example, you might use one Directory for company employees and another Directory for customers, each with its own security policies.

The `Directories page <https://api.stormpath.com/ui2/index.html#/directorys>`__ contains the list of Directories in your Stormpath Tenant. On this page you can quickly:

- Search for Directories in the top-right search box
- :ref:`Add new Directories <directories-create>` using the "Create Directory" button
- :ref:`Change the status <directories-change-status>` of one or more Directories to: `Enabled` or `Disabled`
- :ref:`Delete one or more Directories <directories-delete>`
- :ref:`Edit an Directory <directories-edit>`

Find a Directory's URL
================================

To find an Directory's unique URL, first click on its name from the main list of Directories. Its URL can be found at the top of the Directory's page, in the field marked "HREF".

Clicking on this URL will open your Directory's information in JSON format and display it in your browser.

.. _directories-create:

Create a Directory
========================

Directories are top-level containers which contain Accounts and Groups. Users that are created and added directly by your application go into **Cloud** Directories. Users that come in from outside sources, like Social Login, LDAP, or SAML-based Identity Providers, are contained in **Mirror** Directories.

You will need as many Mirror Directories as you have sources for users. This means that, if you would like users to log-in via Facebook, then you will need to add a Facebook Directory. If you would also like your users to be able to log in using Salesforce, then you will need also need a SAML Directory configured for Salesforce.

This section will tell you how to:

- :ref:`Create a Cloud Directory <directories-create-cloud>`
- :ref:`Create a Social Directory <directories-create-social>`

  - :ref:`Google <create-google>`
  - :ref:`Facebook <create-facebook>`
  - :ref:`GitHub <create-github>`
  - :ref:`LinkedIn <create-linkedin>`
  - :ref:`Twitter <create-twitter>`
  - :ref:`Generic OAuth <create-generic>`

- :ref:`Create an AD/LDAP Directory <directories-create-ldap>`

- :ref:`Create a SAML Directory <directories-create-saml>`

  - :ref:`Salesforce <create-salesforce>`
  - :ref:`OneLogin <create-onelogin>`
  - :ref:`Okta <create-okta>`
  - :ref:`Ping Identity <create-ping>`
  - :ref:`ADFS <create-adfs>`
  - :ref:`Azure AD <create-azure>`

.. _directories-create-cloud:

Create a Cloud Directory
--------------------------

To create a new Cloud Directory, start by clicking on **Create Directory** in the top right of the main `Directories page <https://api.stormpath.com/ui2/index.html#/directories>`__. This will bring up the "Create Directory" dialog.

From here you must specify a "Directory Type", which you should leave as "Cloud". You will also need a "Name" for your Directory. The name must be unique within your Tenant.

Optionally, you can also:

- Enter in a "Description" for the Directory.
- Toggle the status from its default "Enabled" status to "Disabled"

After you have completed this, click **Create** and the "Create Directory" dialog will close and you will see your new Directory in the list view.

.. _directories-create-social:

Create a Social Directory
---------------------------

Currently, Stormpath allows your users to log in using their credentials from the following Social Login Providers:

- :ref:`Google <create-google>`
- :ref:`Facebook <create-facebook>`
- :ref:`GitHub <create-github>`
- :ref:`LinkedIn <create-linkedin>`
- :ref:`Twitter <create-twitter>`
- :ref:`Generic OAuth <create-generic>`

In order to configure this, you will need to input information about the Social Login Provider into a newly-created Stormpath Directory. Every Provider will need its own Directory (i.e. if you want users to log in with Google and Facebook, then you will have to create a Directory for each).

.. _create-google:

Google
^^^^^^

Before you integrate Google Login with Stormpath, you must complete the following steps:

- Create an application in the `Google Developer Console <https://console.developers.google.com/start>`__
- Enable Google Login for your Google application
- Retrieve the OAuth Credentials (Client ID and Secret) for your Google application
- Add your application’s redirect URL, which is the URL the user will be returned to after successful authentication.

For more information, please see the `Google OAuth 2.0 documentation <https://developers.google.com/identity/protocols/OAuth2>`__.

Step 1: Create the Google Directory
"""""""""""""""""""""""""""""""""""

To create a new Google Directory, start by clicking on **Create Directory** in the top right of the main `Directories page <https://api.stormpath.com/ui2/index.html#/directories>`__. This will bring up the "Create Directory" dialog.

From here you must specify a "Directory Type", which you should change to "Google". You will also need a "Name" for your Directory. The name must be unique within your Tenant.

Additionally, you must add your Google application's:

- Client ID
- Client Secret
- Authorized Redirect URI

All of these are obtained from the `Google Developer Console <https://console.developers.google.com/start>`__.

Optionally, you can also:

- Enter in a "Description" for the Directory.
- Toggle the status from its default "Enabled" status to "Disabled"

After you have completed this, click **Create** and the "Create Directory" dialog will close and you will see your new Directory in the list view.

Step 2: Map the Google Directory to your Application
""""""""""""""""""""""""""""""""""""""""""""""""""""

In order to enable login via Google, you must also map this Directory to one or more of your Application resources. For instructions on how to do this, please see :ref:`applications-accountstores`.

.. note::

  Depending on what SDK or Integration you are using, further steps may also be necessary to fully enable Login with Google.

.. todo::

  I feel like this sentence is accurate, necessary, and totally unsatisfactory as is...

At this point, any users that choose to login via Google will go through the Google OAuth 2.0 process and have new Accounts created inside this Directory using information retrieved from Google.

.. _create-facebook:

Facebook
^^^^^^^^^^^^

Before you integrate Facebook Login with Stormpath, you must complete the following steps:

- Create an application on the `Facebook Developer Site <https://developers.facebook.com/>`__
- Retrieve your OAuth credentials (App ID and App Secret)
- Add your application’s private and public root URLs

For more information, please see the `Facebook documentation <https://developers.facebook.com/docs/apps/register>`__.

Step 1: Create the Facebook Directory
"""""""""""""""""""""""""""""""""""""

To create a new Facebook Directory, start by clicking on **Create Directory** in the top right of the main `Directories page <https://api.stormpath.com/ui2/index.html#/directories>`__. This will bring up the "Create Directory" dialog.

From here you must specify a "Directory Type", which you should change to "Facebook". You will also need a "Name" for your Directory. The name must be unique within your Tenant.

Additionally, you must add your Facebook application's:

- Client ID
- Client Secret

All of these are obtained from `Facebook For Developers <https://developers.facebook.com/>`__.

Optionally, you can also:

- Enter in a "Description" for the Directory.
- Toggle the status from its default "Enabled" status to "Disabled"

After you have completed this, click **Create** and the "Create Directory" dialog will close and you will see your new Directory in the list view.

Step 2: Map the Facebook Directory to your Application
""""""""""""""""""""""""""""""""""""""""""""""""""""""

In order to enable login via Facebook, you must also map this Directory to one or more of your Application resources. For instructions on how to do this, please see :ref:`applications-accountstores`.

.. note::

  Depending on what SDK or Integration you are using, further steps may also be necessary to fully enable Login with Facebook.

At this point, any users that choose to login via Facebook will go through the Facebook OAuth 2.0 process and have new Accounts created inside this Directory using information retrieved from Facebook. For more information about Social Login, see the `Client API documentation <https://docs.stormpath.com/client-api/product-guide/latest/social_login.html#initiate-social-login>`__.

.. _create-github:

GitHub
^^^^^^

Before you integrate GitHub Login with Stormpath, you must complete the following steps:

- Create an application in the `GitHub Developer Site <https://developer.github.com/>`__
- Retrieve OAuth Credentials (Client ID and Secret) for your GitHub application
- Add your application’s redirect URL, which is the URL the user will be returned to after successful authentication.

For more information, please see the `GitHub documentation on registering your app <https://developer.github.com/guides/basics-of-authentication/#registering-your-app>`__.

Step 1: Create the GitHub Directory
"""""""""""""""""""""""""""""""""""""

To create a new GitHub Directory, start by clicking on **Create Directory** in the top right of the main `Directories page <https://api.stormpath.com/ui2/index.html#/directories>`__. This will bring up the "Create Directory" dialog.

From here you must specify a "Directory Type", which you should change to "GitHub". You will also need a "Name" for your Directory. The name must be unique within your Tenant.

Additionally, you must add your GitHub application's:

- Client ID
- Client Secret

All of these are obtained from `GitHub <https://github.com/settings/developers>`__.

Optionally, you can also:

- Enter in a "Description" for the Directory.
- Toggle the status from its default "Enabled" status to "Disabled"

After you have completed this, click **Create** and the "Create Directory" dialog will close and you will see your new Directory in the list view.

Step 2: Map the GitHub Directory to your Application
""""""""""""""""""""""""""""""""""""""""""""""""""""

In order to enable login via GitHub, you must also map this Directory to one or more of your Application resources. For instructions on how to do this, please see :ref:`applications-accountstores`.

.. note::

  Depending on what SDK or Integration you are using, further steps may also be necessary to fully enable Login with GitHub.

At this point, any users that choose to login via GitHub will go through the GitHub OAuth 2.0 process and have new Accounts created inside this Directory using information retrieved from GitHub. For more information about Social Login, see the `Client API documentation <https://docs.stormpath.com/client-api/product-guide/latest/social_login.html#initiate-social-login>`__.

.. _create-linkedin:

LinkedIn
^^^^^^^^^^^^

Before you integrate LinkedIn Login with Stormpath, you must complete the following steps:

- Create an application in the `LinkedIn Developer Site <https://www.linkedin.com/secure/developer?newapp=>`__
- Add your application’s redirect URL, which is the URL the user will be returned to after successful authentication.
- Retrieve OAuth Credentials (Client ID and Secret) for your LinkedIn application

For more information, please see LinkedIn’s `OAuth documentation <https://developer.linkedin.com/docs/oauth2>`__.

Step 1: Create the LinkedIn Directory
"""""""""""""""""""""""""""""""""""""

To create a new LinkedIn Directory, start by clicking on **Create Directory** in the top right of the main `Directories page <https://api.stormpath.com/ui2/index.html#/directories>`__. This will bring up the "Create Directory" dialog.

From here you must specify a "Directory Type", which you should change to "LinkedIn". You will also need a "Name" for your Directory. The name must be unique within your Tenant.

Additionally, you must add your LinkedIn application's:

- Client ID
- Client Secret

All of these are obtained from `LinkedIn <https://www.linkedin.com/developer/apps/>`__.

Optionally, you can also:

- Enter in a "Description" for the Directory.
- Toggle the status from its default "Enabled" status to "Disabled"

After you have completed this, click **Create** and the "Create Directory" dialog will close and you will see your new Directory in the list view.

Step 2: Map the LinkedIn Directory to your Application
"""""""""""""""""""""""""""""""""""""""""""""""""""""""

In order to enable login via LinkedIn, you must also map this Directory to one or more of your Application resources. For instructions on how to do this, please see :ref:`applications-accountstores`.

.. note::

  Depending on what SDK or Integration you are using, further steps may also be necessary to fully enable Login with LinkedIn.

At this point, any users that choose to login via LinkedIn will go through the LinkedIn OAuth 2.0 process and have new Accounts created inside this Directory using information retrieved from LinkedIn. For more information about Social Login, see the `Client API documentation <https://docs.stormpath.com/client-api/product-guide/latest/social_login.html#initiate-social-login>`__.

.. _create-Twitter:

Twitter
^^^^^^^^^^^^

Before you integrate Twitter Login with Stormpath, you must complete the following steps:

- Create an application in the `Twitter Application Management Site <https://apps.twitter.com/>`__
- Add your application’s redirect URL, which is the URL the user will be returned to after successful authentication. If you are using the Client API, then this should be your ``authorize/callback`` endpoint.
- Retrieve OAuth Credentials (Client ID and Secret) for your Twitter application

For more information, please see Twitter’s `OAuth documentation <https://dev.twitter.com/web/sign-in/implementing>`__.

Step 1: Create the Twitter Directory
"""""""""""""""""""""""""""""""""""""

To create a new Twitter Directory, start by clicking on **Create Directory** in the top right of the main `Directories page <https://api.stormpath.com/ui2/index.html#/directories>`__. This will bring up the "Create Directory" dialog.

From here you must specify a "Directory Type", for which you should select the "Twitter" icon. On the next page you will also need a "Name" for your Directory. The name must be unique within your Tenant.

Additionally, you must add your Twitter application's:

- Client ID
- Client Secret

All of these are obtained from `Twitter <https://apps.twitter.com/>`__.

Optionally, you can also:

- Enter in a "Description" for the Directory.
- Toggle the status from its default "Enabled" status to "Disabled"

After you have completed this, click **Create** and the "Create Directory" dialog will close and you will see your new Directory in the list view.

Step 2: Map the Twitter Directory to your Application
"""""""""""""""""""""""""""""""""""""""""""""""""""""""

In order to enable login via Twitter, you must also map this Directory to one or more of your Application resources. For instructions on how to do this, please see :ref:`applications-accountstores`.

.. note::

  Depending on what SDK or Integration you are using, further steps may also be necessary to fully enable Login with Twitter.

At this point, any users that choose to login via Twitter will go through the Twitter OAuth 2.0 process and have new Accounts created inside this Directory using information retrieved from Twitter. For more information about Social Login, see the `Client API documentation <https://docs.stormpath.com/client-api/product-guide/latest/social_login.html#initiate-social-login>`__.

.. _create-generic:

Generic OAuth
^^^^^^^^^^^^^^

In addition to the out-of-the-box support for the Social Login Providers detailed above, Stormpath also supports the creation of Generic OAuth Directories. These Directories should work with any Social Login Provider that offers an OAuth 2.0 login flow.

.. note::

  For more detailed information about Generic OAuth along with example configurations, please see `the Authentication chapter of the REST Product Guide <https://docs.stormpath.com/rest/product-guide/latest/auth_n.html#generic-oauth-2-0-login>`__.

Before adding your Generic OAuth Directory in Stormpath, you must complete the following steps:

- Create an application with that provider

- Enable OAuth 2.0 login with that provider

- Add your application's redirect URL, which is the URL the user will be returned to after successful authentication. If you are using the Client API, then this will be your Application's ``/authorize`` endpoint (e.g. ``https://endless-winter.apps.stormpath.io/authorize/callback``).

Step 1: Create the Generic OAuth Directory
""""""""""""""""""""""""""""""""""""""""""""

To create a new Generic OAuth Directory, start by clicking on **Create Directory** in the top right of the main `Directories page <https://api.stormpath.com/ui2/index.html#/directories>`__. This will bring up the "Create Directory" dialog.

From here select "OAuth 2.0". In the next view, you will to specify a "Name" for your Directory. The name must be unique within your Tenant.

Additionally, you must add your application's:

- Provider ID: This can be any name of your choosing, but your Application cannot have more than one mapped Account Store with that Provider ID.
- Client ID
- Client Secret
- Authorization Endpoint
- Token Endpoint
- Resource Endpoint
- Access Token Type

To see explanations and example values for these, refer to `the Authentication chapter of the REST Product Guide <https://docs.stormpath.com/rest/product-guide/latest/auth_n.html#generic-oauth-2-0-login>`__.

Optionally, you can also:

- Enter in a "Description" for the Directory.
- Toggle the status from its default "Enabled" status to "Disabled"

After you have completed this, click **Create** and the "Create Directory" dialog will close and you will see your new Directory in the list view.

Step 2: Map the Generic OAuth Directory to your Application
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

In order to enable login via your OAuth provider, you must also map this Directory to one or more of your Application resources. For instructions on how to do this, please see :ref:`applications-accountstores`.

.. note::

  Depending on what SDK or Integration you are using, further steps may also be necessary to fully enable login.

At this point, any users that choose to login via LinkedIn will go through the OAuth 2.0 process and have new Accounts created inside this Directory using information retrieved from your OAuth provider. For more information about Social Login, see the `Client API documentation <https://docs.stormpath.com/client-api/product-guide/latest/social_login.html#initiate-social-login>`__.

.. _directories-create-ldap:

Create an AD/LDAP Directory
---------------------------

In order to allow your users to login via external LDAP directories, including Active Directory, you will need a Subscription that supports it. For more information, please see the `Stormpath pricing page <https://stormpath.com/pricing>`__.

To create a new AD/LDAP Directory, start by clicking on **Create Directory** in the top right of the main `Directories page <https://api.stormpath.com/ui2/index.html#/directories>`__. This will bring up the "Create Directory" dialog.

From here you must specify a "Directory Type", which you should change to "AD/LDAP". Click **Continue** to begin the setup.

Creating your Agent
------------------------

There are 5 steps to creating a new Agent, each corresponding to a tab on the "Create New Agent" page.

1. Directory
^^^^^^^^^^^^^^

Here you enter:

- Your **Directory Name** (required)
- **Directory Description** (optional)
- **Status** (Enabled by default)

2. Connection
^^^^^^^^^^^^^^

On this tab you will configure the Agent. All fields are required.

.. note::

  The Agent will need a login and password for an account with at least read-access to your LDAP directory.

- **Agent Type:** Here you choose whether this Agent will be for an Active Directory instance, or a different kind of LDAP Directory.
- **Directory Host:** The IP address or host name of the LDAP Directory server.
- **Directory Port:** The port of the LDAP Directory server. The SSL default is ``636`` and the non-SSL default is ``389``.
- **Require SSL:** Should the Agent communicate with your AD/LDAP server over SSL? If so, check this box and configure the Directory's port to accept SSL.
- **Agent User DN:** The Distinguished Name (DN) for the account that the Agent will use.
- **Agent User DN Password:** The password for the account that the Agent will use.
- **Base DN:** The Base Distinguished Name identifies the entry in the directory from which searches initiated by LDAP clients occur.
- **Polling Interval:** Here you enter in how often (in minutes) you would like the Agent to poll the LDAP directory.
- **Agent Referrals:** Here there are two options: (1) Use Referrals. For more information, see `here <https://technet.microsoft.com/en-us/library/cc978014.aspx>`__; (2) Ignore Referral Exceptions. Checking this box ignores referral exceptions and allows (potentially partial) results to be returned.

3. Accounts
^^^^^^^^^^^^^^

In this tab you will enter in information about the accounts in your LDAP directory. Specifically, you must enter in the LDAP attributes that map to the attributes found in a `Stormpath Account resource <https://docs.stormpath.com/rest/product-guide/latest/reference.html#account>`__.

.. note::

  Asterisks indicate required fields.

4. Groups
^^^^^^^^^^^^^^

Similar to the previous tab, here you enter information about Groups in your LDAP directory. Just like with the "Accounts" tab, you are mapping the LDAP attributes in your directory to attributes in a `Stormpath Group resource <https://docs.stormpath.com/rest/product-guide/latest/reference.html#group>`__.

.. note::

  Asterisks indicate required fields.

5. Review
^^^^^^^^^^^^^^

On this tab you will see a summary of the information that you entered. If you need to change anything, you can click on the corresponding tab and edit that field.

Once you have reviewed all the information, click **Create Agent**. You will now arrive on the "Directory" page of your new AD/LDAP Directory.

Installing Your LDAP Agent
--------------------------

Scroll down to "AD/LDAP Agent Configuration". Follow the steps on the "Agent Installation" tab to download, configure, and start your Agent. If you made a mistake with any of the settings, don't worry! You can edit them by toggling between the "Agent Configuration", "Account Configuration", and "Group Configuration" Tabs.

Follow the instructions on the page here to download, configure and start your LDAP Agent.

Viewing the Agent's Status
--------------------------

The Agent's status can be either ONLINE, OFFLINE, or ERROR. You can view the status by clicking on the main `Directories page <https://api.stormpath.com/ui2/index.html#/directories>`__. Once an Agent is created, the "Agent Status" column will appear on this page. You can also view the status by clicking on your AD/LDAP Directory. The Agent's status is right under the Directory status.


.. _directories-create-saml:

Create a SAML Directory
-------------------------



.. _directories-edit:

Edit a Directory
========================

To edit an Directory, first click on its name from the main list of Applications. This will bring you to the Directory's page, with the Directory's name displayed on the top.

Here you can edit the Directory's:

- Name
- Description
- Status (Enabled or Disabled)
- Custom Data
- Password Policy

On the left-hand side you will see a set of links to various resources associated with this Application, such as Accounts and Groups. For more information about these, see :ref:`directories-othertasks` below.

.. _directory-custom-data:

Add Custom Data to a Directory
------------------------------------

In the "Custom Data" section of the Directory page, you will see two tabs: "Editor" and "JSON".

To add a new Custom Data entry, click the chevron. This will open a menu with the different kinds of fields that you can add. Click on the kind that you want, and a dummy entry will be created, into which you can then enter whatever values you like.

Once you are finished, a green "Saved" notification will appear in the top right of the "Editor" section. If you would like to undo your latest entry, simply click on **Revert**.

To see what your Custom Data would look like as JSON, click on the "JSON" tab.

.. _directory-password-policy:

Modify Your Directory's Password Policy
------------------------------------------

.. _directories-change-status:

Enable & Disable Directories
================================

You can enable or disable Directories either from:

1. The main list of Directories found on the main `Directories page <https://api.stormpath.com/ui2/index.html#/directories>`__, via the drop-down menus in the "Status" column, or
2. On the page for any individual Directory, via the "Status" field.

Choosing to disable a Directory will bring up a confirmation dialog.

Bulk Status Changes
--------------------

You can change the status of multiple Directories from the Application list view. Select as many Directories as you like using the check boxes in the left-most column, then click on the "Bulk Actions" button. This will open a menu where you can select "Enabled" or "Disabled".

.. _directories-delete:

Delete Directories
========================

.. warning::

  Deleting an Directory permanently and completely erases it and any of its related data (including all Accounts) from Stormpath.
  we recommend that you disable Directories instead of deleting them if you anticipate that you might use the Directory again or if you want to retain its data for historical reference.

Deleting an Directory is done from the `Directories page <https://api.stormpath.com/ui2/index.html#/directorys>`__. In the "Action" column, click on **Delete**. This will bring up a confirmation dialog. Once you have read the dialog, select the "I Understand" checkbox and then click on **Delete Directory**.

Bulk Directory Deletion
-------------------------

You can delete multiple Directories from the Directory list view. Select as many Directories as you like using the check boxes in the left-most column, then click on the "Bulk Actions" button. This will open a menu where you can select "Delete Directory".

.. _directories-othertasks:

Other Tasks
===========

.. _directories-groups:

Manage an Directory's Groups
--------------------------------

When viewing the page for a specific Directory, you can see all of its associated Groups by clicking on the "Groups" link in the left-side navigation panel.

Here you will see a list of all of the Groups that are associated with this Directory. The right-most "Mapped Via" column specifies which Directory the Group belongs to.

From this view you can:

- Search for Groups using the search box in the top right
- Add new Groups to this Directory, via the "Create Group" button.

.. _directories-accounts:

Manage an Directory's Accounts
-----------------------------------

When viewing the page for a specific Directory, you can see all of its associated Accounts by clicking on the "Accounts" link in the left-side navigation panel. This view will show you a list of all Accounts that are contained in Account Stores mapped to the Directory.

The view itself has all of the same options and behavior as the regular `Accounts <https://api.stormpath.com/ui2/index.html#/accounts>`__ page. For more information about working with Accounts in the Admin Console, please see the :ref:`Accounts chapter <accounts>`.

.. _directories-workflows:

Set-up Workflows
--------------------

Workflows define how various processes take place in Stormpath. The two primary workflows that exist right are:

- Account Registration & Verification
- Password Reset

The settings for these can be found by going to a specific Directory's page, then clicking on **Workflows** on the left.

.. note::

  Workflows are only available on Cloud Directories.

.. _directories-workflows-registration:

Account Registration & Verification
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This workflow controls how Accounts are created and verified in this Directory. The three email components of this workflow each have their own tab:

- Verification Email
- Verification Success Email
- Welcome Email

All three emails are disabled by default.

**Verification Email**

If this email is enabled, a new user will need to visit their email inbox to click a link to verify their Account. Account verification is initialized automatically during Account creation. Accounts in Directories that have the Verification Email enabled will be created with an ``UNVERIFIED`` status.

**Verification Success Email**

If this email is enabled, a success email is sent to the Account's email when the Account has been verified.

**Welcome Email**

If this email is enabled, a email will be sent when a new Account is created (Verification Email Disabled) or when the account is verified (Verification Email Enabled). This email can be used to send important information about your application to the user.

Modifying the Emails
""""""""""""""""""""

From the any of the tabs, you can configure the various parts of the email. Once you are done, click **Save Changes**.

- **Enable / disable** this email
- **Link Base URL:** This is the URL that the verification token will be appended to in the email. It should point to an endpoint where you would like your users to end up after verifying their email address.
- **From Name:** This is the name that will appear as part of the email's "From" field.
- **From Email Address:** This is the email address that will appear as part of the email's "From" field. Any responses to this email will go to this address. *Modifying this requires a subscription level above Developer**
- **Subject** The "Subject" of the email.
- **Message Format:** Plain text, HTML, or both (i.e. ``multipart/alternative``). *HTML and multipart emails require a subscription level above Developer*
- **Message:** This text box contains the contents of your email. Stormpath emails use macros, which are listed and described at the bottom of the page. For more information about how macros work, please see the `REST API Guide <https://docs.stormpath.com/rest/product-guide/latest/accnt_mgmt.html#using-email-macros>`__.

.. _directories-workflows-password:

Password Reset
^^^^^^^^^^^^^^

This workflow controls how Account passwords are reset in this Directory. The two emails in this workflow each have their own tab:

- Password Reset Email
- Password Reset Success Email

Both emails are enabled by default.

**Password Reset Email**

If this email is enabled, when a user resets their Account password using Stormpath, they receive an email with a link and a secure reset token. The link sends the user to a password reset page where they submit a new password to Stormpath.

**Password Reset Success Email**

When the password is successfully reset, the user can also receive a configurable email.

Modifying the Emails
""""""""""""""""""""

From the any of the tabs, you can configure the various parts of the email. Once you are done, click **Save Changes**.

- **Enable / disable** this email
- **Link Base URL:** This is the URL that the reset token will be appended to in the email. It should point to an endpoint where you would like your users to end up after resetting their email address.
- **Expiration Window:** This defines how long the reset token will be valid for.
- **From Name:** This is the name that will appear as part of the email's "From" field.
- **From Email Address:** This is the email address that will appear as part of the email's "From" field. Any responses to this email will go to this address. *Modifying this requires a subscription level above Developer**
- **Subject** The "Subject" of the email.
- **Message Format:** Plain text, HTML, or both (i.e. ``multipart/alternative``). *HTML and multipart emails require a subscription level above Developer*
- **Message:** This text box contains the contents of your email. Stormpath emails use macros, which are listed and described at the bottom of the page. For more information about how macros work, please see the `REST API Guide <https://docs.stormpath.com/rest/product-guide/latest/accnt_mgmt.html#using-email-macros>`__.
