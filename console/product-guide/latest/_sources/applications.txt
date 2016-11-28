.. _applications:

************
Applications
************

An Application resource in Stormpath models your application that uses Stormpath. You control who may log in to your application by assigning (or ‘mapping’) one or more Directory, Group, or Organization resources to your Application resource. The Accounts in these associated Directories and Groups collectively form your application’s user base.

The `Applications page <https://api.stormpath.com/ui2/index.html#/applications>`__ contains the list of Applications in your Stormpath Tenant. On this page you can quickly:

- Search for Applications in the top-right search box
- :ref:`Add new Applications <applications-creating>` using the "Create Application" button
- :ref:`Change the status <applications-changing-status>` of one or more Applications to: `Enabled` or `Disabled`
- :ref:`Delete one or more Applications <applications-deleting>`
- :ref:`Edit an Application <applications-editing>`

Finding an Application's URL
================================

To find an Application's unique URL, first click on its name from the main list of Applications. Its URL can be found at the top of the Application's page, in the field marked "HREF".

Clicking on this URL will open your Application's information in JSON format and display it in your browser.

.. _applications-creating:

Creating Applications
========================

To create a new Application, start by clicking on **Create Application** in the top right of the main `Applications page <https://api.stormpath.com/ui2/index.html#/applications>`__. This will bring up the "Create Application" dialog.

From here you must enter in a "Name" for your Application.

Optionally, you can also:

- Enter in a "Description" for the Application.
- Toggle the status from its default "Enabled" status to "Disabled"
- Enable or disable the automatic creation of a Directory for this Application. If you check "Match Application Name", the Directory's name will be whatever the Application's "Name" is, plus the word "Directory".

After you have completed this, click **Create** and the "Create Application" dialog will close and you will see your new Application in the list of Applications.

.. _applications-editing:

Editing Applications
========================

To edit an Application, first click on its name from the main list of Applications. This will bring you to the Application's page, with the Application's name displayed on the top.

Here you can edit the Application's:

- Name
- Description
- Status (Enabled or Disabled)
- Authorized Callback URIs (for more on this, please see the Directory chapter sections on Social and SAML login)
- Custom Data

On the left-hand side you will see a set of links to various resources associated with this Application, such as Accounts and Groups. For more information about these, see :ref:`applications-othertasks` below.

Adding Custom Data to an Application
------------------------------------

In the "Custom Data" section of the Application page, you will see two tabs: "Editor" and "JSON".

To add a new Custom Data entry, click the chevron. This will open a menu with the different kinds of fields that you can add. Click on the kind that you want, and a dummy entry will be created, into which you can then enter whatever values you like.

Once you are finished, a green "Saved" notification will appear in the top right of the "Editor" section. If you would like to undo your latest entry, simply click on **Revert**.

To see what your Custom Data would look like as JSON, click on the "JSON" tab.

.. _applications-changing-status:

Enabling & Disabling Applications
=================================

All login attempts in Stormpath are made against a specific Application. As a result, if an Application has a "Disabled" status then any login attempts made to that Application will fail.

.. note::

  For more information about logging in to Stormpath, see `How Login Attempts Work <https://docs.stormpath.com/rest/product-guide/latest/auth_n.html#how-login-attempts-work-in-stormpath>`__ in the REST Product Guide.

You can enable or disable Applications either from:

1. The main list of Applications found on the main `Applications page <https://api.stormpath.com/ui2/index.html#/applications>`__, via the drop-down menus in the "Status" column, or
2. On the page for any individual Application, via the "Status" field.

Choosing to disable an Application will bring up a confirmation dialog.

Bulk Status Changes
-------------------

You can change the status of multiple Applications from the Application list view. Select as many Applications as you like using the check boxes in the left-most column, then click on the "Bulk Actions" button. This will open a menu where you can select "Enabled" or "Disabled".

.. _applications-deleting:

Deleting Applications
========================

.. warning::

  Deleting an Application permanently and completely erases it and any of its related data from Stormpath.
  we recommend that you disable Applications instead of deleting them if you anticipate that you might use the Application again or if you want to retain its data for historical reference.

Deleting an Application is done from the `Applications page <https://api.stormpath.com/ui2/index.html#/applications>`__. In the "Action" column, click on **Delete**. This will bring up a confirmation dialog. Once you have read the dialog, select the "I Understand" checkbox and then click on **Delete Application**.

Bulk Application Deletion
-------------------------

You can delete multiple Applications from the Application list view. Select as many Applications as you like using the check boxes in the left-most column, then click on the "Bulk Actions" button. This will open a menu where you can select "Delete Application".

Finding Related Resources
================================

When you are looking at the page for a specific Application, the left-side navigation bar has links to lists of resources related to that Application. Specifically, you can find:

- **Accounts:** A list of Accounts found in the Account Stores that are mapped to this Application.
- **Account Stores:** A list of the Groups, Directories, and Organizations that are mapped to this Application via Account Store Mappings.
- **Groups:** A list of Groups that exist within this Application. These Groups do not have to mapped as Account Stores for the Application.

For more information about what you can do with these lists, see :ref:`applications-othertasks`.

.. _applications-othertasks:

Other Tasks
===========

.. _applications-accounts:

Managing an Application's Accounts
-----------------------------------

When viewing the page for a specific Application, you can see all of its associated Accounts by clicking on the "Accounts" link in the left-side navigation panel. This view will show you a list of all Accounts that are contained in Account Stores mapped to the Application.

The view itself has all of the same options and behavior as the regular `Accounts <https://api.stormpath.com/ui2/index.html#/accounts>`__ page. For more information about working with Accounts in the Admin Console, please see the :ref:`Accounts chapter <accounts>`.

.. _applications-accountstores:

Managing an Application's Account Stores
----------------------------------------

When viewing the page for a specific Application, you can see all of its associated Account Stores by clicking on the "Account Stores" link in the left-side navigation panel. This list is composed of all of the **Organizations**, **Directories** and **Groups** that have **Account Store Mappings** to this Application.

From this view, you can do a number of things:

- Add new Account Stores with the "Add Account Store" in the top right
- :ref:`Sort Account Stores <applications-sorting-account-stores>` by login priority
- Unmap an Account Store. This will prevent all Accounts within this Account Store from logging in to this Application.
- :ref:`Set an Account Store <applications-default-account-stores>` as the default location for new Accounts and/or Groups

.. _applications-sorting-account-stores:

Sorting Account Stores
^^^^^^^^^^^^^^^^^^^^^^

Every login attempt to your Application is made against that Application's mapped Account Stores. The Account Stores in this view are ordered according to the left-most "Priority" column. This priority ranking represents the order in which the Account Stores are checked for every login attempt.

.. note::

  For more information about logging in to Stormpath, see `How Login Attempts Work <https://docs.stormpath.com/rest/product-guide/latest/auth_n.html#how-login-attempts-work-in-stormpath>`__ in the REST Product Guide.

To change the order of these Account Stores, hover your mouse over the "Priority" column. Your cursor should change into a double-arrow and you will be able to click and drag the Account Store into whatever position you wish.

.. _applications-default-account-stores:

Setting Default Account and Groups Locations
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

It is possible to set which Account Store should be the default for new Accounts or Groups. This means that if an Account Store is not specified at the time of Account/Group creation, it will automatically go into that Account Store.

- Organizations can be chosen as the default location for new Accounts
- Directories can be chosen as the default location for both new Accounts and Groups
- Groups can be chosen as the default location for new Accounts

To set an Account Store as the default, make sure you are in the Account Store list view for your Application, and then select one of the options in either the "Default Account Location" or "Default Group Location" columns.

.. note::

  Mirrored Directories (e.g. Social, LDAP, SAML) cannot be set as either the default Account or Group location.

.. _applications-groups:

Managing an Application's Groups
--------------------------------

When viewing the page for a specific Application, you can see all of its associated Groups by clicking on the "Groups" link in the left-side navigation panel.

Here you will see a list of all of the Groups that are associated with this Application. The right-most "Mapped Via" column specifies which Directory the Group belongs to.

From this view you can:

- Search for Groups using the search box in the top right
- Add new Groups to this Application, via the "Create Group" button.

.. _applications-accountlinking:

Managing an Application's Account Linking Policy
------------------------------------------------

Clicking the "Policies" link in the left-side navigation panel will bring you to your Application's Account Linking Policy information. For more information about Account Linking, please see the `REST Product Guide's Account Management chapter <https://docs.stormpath.com/rest/product-guide/latest/accnt_mgmt.html#what-s-in-the-account-linking-policy>`__.

Specifically, you can toggle the following settings:

- **Status:** Enables or disables the entire policy. If this is set to "Disabled" then the other settings will be unavailable.
- **Automatic Provisioning:** This setting controls whether new Accounts will be automatically created in the default Account Store.
- **Matching Property:** Allows you to select the Account attribute that is used as a basis for automatically creating account links. Currently the only available attribute is "email".

.. _applications-oauth:

Managing an Application's OAuth Policy
--------------------------------------

The next tab after Account Linking is for your Application's OAuth policy. Here you will find:

- Your **OAuth Token URL**, which is used to generate and validate tokens
- Your **Access Token** and **Refresh Token** Time-to-Live durations. For more information about these, please see the `REST API Reference <https://docs.stormpath.com/rest/product-guide/latest/reference.html#oauth-policy>`__.

.. _applications-saml:

Managing an Application's SAML Policy
--------------------------------------

The Application's "SAML Policy" tab contains the "SAML SSO Initiation Endpoint" that is used as part of the Service-Provider-initiated SAML flow. For more information about this, please see the `REST Product Guide's Authentication chapter <https://docs.stormpath.com/rest/product-guide/latest/auth_n.html#the-service-provider-initiated-flow>`_.