.. _accounts:

********
Accounts
********

An Account is a unique identity within a Directory, with a unique username and email. An Account can log in to an Application using either the email or username. Accounts can represent your end users (people), but they can also be used to represent services, daemons, processes, or any “entity” that needs to log in to a Stormpath-enabled application.

Additionally, an Account may only exist in a single Directory but may be associated with multiple Groups owned by that Directory.

The `Accounts page <https://api.stormpath.com/ui2/index.html#/accounts>`__ contains the list of Accounts in your Stormpath Tenant. On this page you can quickly:

- Search for Accounts in the top-right search box
- :ref:`Add new Accounts <accounts-create>` using the "Create Account" button
- :ref:`Change the status <accounts-change-status>` of one or more Accounts to: `Enabled` or `Disabled`
- :ref:`Delete one or more Accounts <accounts-delete>`
- :ref:`Edit an Account <accounts-edit>`
- Filter Accounts by various criteria (see below)

**Filtering Accounts**

You can filter the entries in the main Accounts list by any of the following criteria:

- Directory membership
- Group membership
- Application
- Status (Enabled, Disabled, Unverified)

All of these are available on the left-hand side of the main `Accounts page <https://api.stormpath.com/ui2/index.html#/accounts>`__. Selecting one will refresh the list of Accounts, and the number in the upper left of the page will change, to show you how many Accounts of the total are represented in this view (e.g. "20/1000" means that you are viewing 20 of the 1000 Accounts in this Tenant)

Find an Account's URL
==========================

To find an Account's unique URL, first click on its name from the main list of Accounts. Its URL can be found at the top of the Account's page, in the field marked "HREF".

Clicking on this URL will open your Account's information in JSON format and display it in your browser.

.. _accounts-create:

Create Accounts
========================

To create a new Account, start by clicking on **Create Account** in the top right of the main `Accounts page <https://api.stormpath.com/ui2/index.html#/accounts>`__. This will bring up the "Create Account" dialog.

From here you must enter in the following required fields:

- **Account Location:** the owning Directory that the Account will be created in
- **First Name**
- **Last Name**
- **Email**
- **Password:** Must be entered twice

Optionally, you can also:

- Enter in a "Username" for the Account. If you do not enter one in, Stormpath will simply copy the email address into this field.
- Enter in a "Middle Name"
- Toggle the status from its default "Enabled" status to "Disabled" or "Unverified"
- Add the new Account to a Group. Clicking on this field will show a list of possible Groups, if any.

After you have completed this, click **Create** and the "Create Account" dialog will close and you will see your new Account in the list of Accounts.

.. _accounts-edit:

Edit Accounts
========================

To edit an Account, first click on its name from the main list of Accounts. This will bring you to the Account's page, with the Account's name displayed on the top.

Here you can edit the Account's:

- Username
- First, middle and last name
- Email
- Status (Enabled, Disabled or Unverified)
- Custom Data
- Password
- API Keys

On the left-hand side you will see a set of links to various resources associated with this Account, such as Accounts and Groups. For more information about these, see :ref:`accounts-othertasks` below.

Add Custom Data to an Account
------------------------------------

In the "Custom Data" section of the Account page, you will see two tabs: "Editor" and "JSON".

To add a new Custom Data entry, click the chevron. This will open a menu with the different kinds of fields that you can add. Click on the kind that you want, and a dummy entry will be created, into which you can then enter whatever values you like.

Once you are finished, a green "Saved" notification will appear in the top right of the "Editor" section. If you would like to undo your latest entry, simply click on **Revert**.

To see what your Custom Data would look like as JSON, click on the "JSON" tab.

.. _accounts-password:

Change or Reset an Account's Password
-------------------------------------

If you expand the "Reset Password" section, you are given two options for changing an Account's password:

1. You can send a Reset Password email. The email that is sent can be configured as part of the owning Directory's :ref:`Password Reset Workflow <directories-workflows-password>`.

2. You can also manually enter in a new password for the Account.

.. _accounts-apikeys:

Manage Account API Keys
-------------------------

In the "API Keys" section you can:

- **View existing API Keys** (ID only)
- **Enable and disable existing API Keys:** Disabling an API key will prevent it from being used to authenticate calls made to your Tenant.
- **Delete existing API keys:** Deleting will prevent it from being used to authenticate calls made to your Tenant.
- **Create new API keys:** This will create an ``apiKey-{apiKeyId}.properties`` file which will be downloaded to your computer. Inside this file you will find a Stormpath API key ID and Secret that can be used to authenticate calls made by this Account to your Stormpath Tenant.

.. note::

  For more information about how to use API Keys, see one of our `language-specific Quickstarts <https://docs.stormpath.com/home/>`__.

.. _accounts-change-status:

Enable & Disable Accounts
================================

Disabling an Account will prevent it from authenticating with Stormpath.

You can enable or disable Accounts either from:

1. The main list of Accounts found on the main `Accounts page <https://api.stormpath.com/ui2/index.html#/accounts>`__, via the drop-down menus in the "Status" column, or
2. On the page for any individual Account, via the "Status" field.

Choosing to disable an Account will bring up a confirmation dialog.

Bulk Status Changes
-------------------

You can change the status of multiple Accounts from the Account list view. Select as many Accounts as you like using the check boxes in the left-most column, then click on the "Bulk Actions" button. This will open a menu where you can select "Enabled", "Disabled" or "Unverified".

.. _accounts-delete:

Delete Accounts
========================

.. warning::

  Deleting an Account permanently and completely erases it and any of its related data from Stormpath.
  we recommend that you disable Accounts instead of deleting them if you anticipate that you might use the Account again or if you want to retain its data for historical reference.

Deleting an Account is done from the `Accounts page <https://api.stormpath.com/ui2/index.html#/accounts>`__. In the "Action" column, click on **Delete**. This will bring up a confirmation dialog. Once you have read the dialog, select the "I Understand" checkbox and then click on **Delete Account**.

Bulk Account Deletion
-------------------------

You can delete multiple Accounts from the Account list view. Select as many Accounts as you like using the check boxes in the left-most column, then click on the "Bulk Actions" button. This will open a menu where you can select "Delete Account".

Find Related Resources
=======================

When you are looking at the page for a specific Account, the left-side navigation bar has links to lists of resources related to that Account. Specifically, you can find:

- **Applications:** A list of Applications that this Account is mapped to.
- **Groups:** A list of Groups that this Account is a member of.
- **OAuth Tokens:** A list of OAuth 2.0 tokens that were created for this Account.

For more information about what you can do with these lists, see :ref:`below <accounts-othertasks>`.

.. _accounts-othertasks:

Other Tasks
=============

.. _accounts-groups:

Managing an Account's Groups
----------------------------

When viewing the page for a specific Account, you can see all of its associated Groups by clicking on the "Groups" link in the left-side navigation panel.

Here you will see a list of all of the Groups that are associated with this Account.

.. note::

  Accounts can only be associated with Groups found inside the same owning Directory.

From this view you can:

- Search for Groups using the search box in the top right
- Add new the Account to a Group inside its owning Directory using the "Add to Group button".

.. _accounts-oauth:

Managing an Account's OAuth Tokens
----------------------------------

When viewing the page for a specific Account, you can see all of its OAuth 2.0 tokens by clicking on the "OAuth Tokens" link in the left-side navigation panel.

Here you will see a list of all of the OAuth Tokens have been generated for this Account.

.. note::

  You are not able to generate OAuth tokens from the Stormpath Admin Console. For more information about generating OAuth 2.0 tokens, please see the `REST API Guide <https://docs.stormpath.com/rest/product-guide/latest/auth_n.html#generating-an-oauth-2-0-access-token>`__.

For both Access and Refresh Tokens, there are a number of actions that you can perform.

You can **sort** the existing tokens by:

- The date and time they were issued at
- The date and time they are set to expire
- The Application they were generated for

To sort by any of these, just click on the corresponding column.

You can also **delete** any tokens. To delete a token, either click **Delete** in the "Actions" column, or select multiple tokens using the left-most check boxes, then click **Bulk Actions** in the top right and then select **Delete Token**.

.. note::

  Deleting an Access Token does not delete the Refresh Token that was generated alongside it.

For more information about OAuth tokens in Stormpath, please see `the REST Product Guide <https://docs.stormpath.com/rest/product-guide/latest/auth_n.html#configuring-token-based-authentication>`__.