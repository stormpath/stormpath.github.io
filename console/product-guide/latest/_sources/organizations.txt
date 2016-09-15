.. _organizations:

*************
Organizations
*************

The Organization resource is two things: A top-level container for both Directories and Groups, as well as a pseudo-Account Store that can be mapped to an Application (just like a Directory or Group) for the purposes of user login. Unlike Directories and Groups, however, they do not themselves own Accounts, and Accounts and Groups cannot be associated to them without also being associated with a Directory.

Organizations are primarily intended to represent “tenants” in multi-tenant applications.

The `Organizations page <https://api.stormpath.com/ui2/index.html#/organizations>`__ contains the list of Organizations in your Stormpath Tenant. On this page you can quickly:

- Search for Organizations in the top-right search box
- :ref:`Add new Organizations <organizations-create>` using the "Create Organization" button
- :ref:`Change the status of one or more Organizations <organizations-change-status>` to: `Enabled` or `Disabled`
- :ref:`Delete one or more Organizations <organizations-delete>`
- :ref:`Edit an Organization <Organizations-edit>`

Find an Organization's URL
================================

To find an Organization's unique URL, first click on its name from the main list of Organizations. Its URL can be found at the top of the Organization's page, in the field marked "HREF".

Clicking on this URL will open your Organization's information in JSON format and display it in your browser.

.. _organizations-create:

Create Organizations
========================

To create a new Organization, start by clicking on **Create Organization** in the top right of the main `Organizations page <https://api.stormpath.com/ui2/index.html#/organizations>`__. This will bring up the "Create Organization" dialog.

From here you must enter in a "Name" for your Organization. The name must be unique within your Stormpath Tenant. The uniqueness constraint is case insensitive.

You must also enter in a "Name Key". This is a shorter, URL-friendly identifier for your Organization. Just like the "Name" it must be unique across all Organizations within your Stormpath Tenant. Unlike the "Name" it must also follow `DNS hostname rules <http://www.ietf.org/rfc/rfc0952.txt>`__. That is, it may only consist of: ``a-z``, ``0-9``, and ``-``. It must not start or end with a hyphen. The uniqueness constraint is case insensitive.

You can also optionally enter in a "Description" for the Organization.

After you have completed this, click **Create** and the "Create Organization" dialog will close and you will see your new Organization in the main list view.

.. _organizations-edit:

Edit Organizations
========================

To edit an Organization, first click on its name from the main list of Organizations. This will bring you to the Organization's page, with the Organization's name displayed on the top.

Here you can edit the Organization's:

- Name
- Name Key
- Description
- Status (Enabled or Disabled)
- Custom Data

On the left-hand side you will see a link to the Organization's Account Stores. For more information, see  :ref:`organizations-account-stores` below.

Add Custom Data to an Organization
--------------------------------------

In the "Custom Data" section of the Organization page, you will see two tabs: "Editor" and "JSON".

To add a new Custom Data entry, click the chevron. This will open a menu with the different kinds of fields that you can add. Click on the kind that you want, and a dummy entry will be created, into which you can then enter whatever values you like.

Once you are finished, a green "Saved" notification will appear in the top right of the "Editor" section. If you would like to undo your latest entry, simply click on **Revert**.

To see what your Custom Data would look like as JSON, click on the "JSON" tab.

.. _organizations-change-status:

Enable & Disable Organizations
===================================

If an Organization serves as an Account Store for an Organization, then login attempts to that Organization can be directed to the Organization and its associated Directories and Groups. If the Organization is the only mapping point between your Organization and one or more Directories and Groups, then disabling that Organization will prevent all of the Accounts in those Directories and Groups from logging in.

.. note::

  For more information about logging in to an Organization, see `Authenticating an Account against an Organization <https://docs.stormpath.com/rest/product-guide/latest/multitenancy.html#authenticating-an-account-against-an-organization>`__ in the REST Product Guide.

  For more about Organizations, see `Multi-Tenancy and the Stormpath Data Model <https://docs.stormpath.com/rest/product-guide/latest/multitenancy.html#multi-tenancy-and-the-stormpath-data-model>`__.

You can enable or disable Organizations either from:

1. The main list of Organizations found on the main `Organizations page <https://api.stormpath.com/ui2/index.html#/organizations>`__, via the drop-down menus in the "Status" column, or
2. On the page for any individual Organizations, via the "Status" field.

Choosing to Disable an Organizations will bring up a confirmation dialog.

Bulk Status Changes
-------------------

You can change the status of multiple Organizations from the Organization list view. Select as many Organizations as you like using the check boxes in the left-most column, then click on the "Bulk Actions" button. This will open a menu where you can select "Enabled" or "Disabled".

.. _organizations-delete:

Delete Organizations
========================

.. warning::

  Deleting an Organization permanently and completely erases it and any of its related data from Stormpath.
  we recommend that you disable Organizations instead of deleting them if you anticipate that you might use the Organization again or if you want to retain its data for historical reference.

Deleting an Organization is done from the `Organizations page <https://api.stormpath.com/ui2/index.html#/organizations>`__. In the "Action" column, click on **Delete**. This will bring up a confirmation dialog. Once you have read the dialog, select the "I Understand" checkbox and then click on **Delete Organization**.

Bulk Organization Deletion
---------------------------

You can delete multiple Organizations from the Organization list view. Select as many Organizations as you like using the check boxes in the left-most column, then click on the "Bulk Actions" button. This will open a menu where you can select "Delete Organization".

.. _organizations-account-stores:

Manage an Organization's Account Stores
=========================================

When viewing the page for a specific Organization, you can see all of its associated Account Stores by clicking on the "Account Stores" link in the left-side navigation panel. This list is composed of all of the **Directories** and **Groups** that have **Account Store Mappings** to this Organization.

From this view, you can do a number of things:

- Add new Account Stores with the "Add Account Store" in the top right
- :ref:`Sort Account Stores <organizations-sort-account-stores>` by login priority
- Unmap an Account Store. This will prevent all Accounts within this Account Store from logging in to this Organization.
- :ref:`Set an Account Store <organizations-default-account-stores>` as the default location for new Accounts and/or Groups

.. _organizations-sort-account-stores:

Sort Account Stores
----------------------

Every login attempt to your Organization is made against that Organization's mapped Account Stores. The Account Stores in this view are ordered according to the left-most "Priority" column. This priority ranking represents the order in which the Account Stores are checked for every login attempt.

.. note::

  For more information about logging in to Organizations, see `Authenticating an Account against an Organization <https://docs.stormpath.com/rest/product-guide/latest/multitenancy.html#authenticating-an-account-against-an-organization>`__ in the REST Product Guide.

To change the order of these Account Stores, hover your mouse over the "Priority" column. Your cursor should change into a double-arrow and you will be able to click and drag the Account Store into whatever position you wish.

.. _organizations-default-account-stores:

Set Default Account and Groups Locations
--------------------------------------------

It is possible to set which Account Store should be the default for new Accounts or Groups. This means that if an Account Store is not specified at the time of Account/Group creation, it will automatically go into that Account Store.

- Directories can be chosen as the default location for both new Accounts and Groups
- Groups can be chosen as the default location for new Accounts

To set an Account Store as the default, make sure you are in the Account Store list view for your Organization, and then select one of the options in either the "Default Account Location" or "Default Group Location" columns.

.. note::

  Mirrored Directories (e.g. Social, LDAP, SAML) cannot be set as either the default Account or Group location.