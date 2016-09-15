.. _groups:

******
Groups
******

Groups are collections of Accounts found within a Directory. They can be thought of as labels applied to Accounts. Aside from the relatively simple task of grouping together Accounts, Groups can also be used to implement “roles” for authorization purposes.

The `Groups page <https://api.stormpath.com/ui2/index.html#/groups>`__ contains the list of Groups in your Stormpath Tenant. On this page you can quickly:

- Search for Groups in the top-right search box
- :ref:`Add new Groups <groups-create>` using the "Create Group" button
- :ref:`Change the status <groups-change-status>` of one or more Groups to: `Enabled` or `Disabled`
- :ref:`Delete one or more Groups <groups-delete>`
- :ref:`Edit a Group <groups-edit>`

Find a Group's URL
================================

To find a Group's unique URL, first click on its name from the main list of Groups. Its URL can be found at the top of the Group's page, in the field marked "HREF".

Clicking on this URL will open your Group's information in JSON format and display it in your browser.

.. _groups-create:

Create Groups
========================

To create a new Group, start by clicking on **Create Group** in the top right of the main `Groups page <https://api.stormpath.com/ui2/index.html#/groups>`__. This will bring up the "Create Group" dialog.

From here you must specify a Directory to create the Group in, as well as a "Name" for your Group. The name must be unique within that Directory.

Optionally, you can also:

- Enter in a "Description" for the Group.
- Toggle the status from its default "Enabled" status to "Disabled"

After you have completed this, click **Create** and the "Create Group" dialog will close and you will see your new Group in the list of Groups.

.. _groups-edit:

Edit Groups
========================

To edit a Group, first click on its name from the main list of Groups. This will bring you to the Group's page, with the Group's name displayed on the top.

Here you can edit the Group's:

- Name
- Description
- Status (Enabled or Disabled)
- Custom Data

On the left-hand side you will see a set of links to various resources associated with this Group, such as Accounts and Groups. For more information about these, see :ref:`groups-othertasks` below.

Adding Custom Data to a Group
-----------------------------

In the "Custom Data" section of the Group page, you will see two tabs: "Editor" and "JSON".

To add a new Custom Data entry, click the chevron. This will open a menu with the different kinds of fields that you can add. Click on the kind that you want, and a dummy entry will be created, into which you can then enter whatever values you like.

Once you are finished, a green "Saved" notification will appear in the top right of the "Editor" section. If you would like to undo your latest entry, simply click on **Revert**.

To see what your Custom Data would look like as JSON, click on the "JSON" tab.

.. _groups-change-status:

Enable & Disable Groups
================================

Groups are one of the resources via which Accounts are mapped to Applications for the purposes of user login. As a result, if a Group has a "Disabled" status then any login attempts made to that Group will fail.

.. note::

  For more information about logging in to Stormpath, see `How Login Attempts Work <https://docs.stormpath.com/rest/product-guide/latest/auth_n.html#how-login-attempts-work-in-stormpath>`__ in the REST Product Guide.

You can enable or disable Groups either from:

1. The main list of Groups found on the main `Groups page <https://api.stormpath.com/ui2/index.html#/groups>`__, via the drop-down menus in the "Status" column, or
2. On the page for any individual Group, via the "Status" field.

Choosing to disable a Group will bring up a confirmation dialog.

Bulk Status Changes
-------------------

You can change the status of multiple Groups from the Group list view. Select as many Groups as you like using the check boxes in the left-most column, then click on the "Bulk Actions" button. This will open a menu where you can select "Enabled" or "Disabled".

.. _groups-delete:

Delete Groups
========================

.. warning::

  Deleting a Group erases the Group and all its membership relationships. User Accounts that are members of the Group will not be deleted.

  we recommend that you disable a Group rather than delete it, if you believe you might need to retain the user data or application connections.

Deleting a Group is done from the `Groups page <https://api.stormpath.com/ui2/index.html#/groups>`__. In the "Action" column, click on **Delete**. This will bring up a confirmation dialog. Once you have read the dialog, select the "I Understand" checkbox and then click on **Delete Group**.

Bulk Group Deletion
-------------------------

You can delete multiple Groups from the Group list view. Select as many Groups as you like using the check boxes in the left-most column, then click on the "Bulk Actions" button. This will open a menu where you can select "Delete Group".

Find Related Resources
================================

When you are looking at the page for a specific Group, the left-side navigation bar has links to lists of resources related to that Group. Specifically, you can find:

- **Accounts:** A list of Accounts found in the Account Stores that are mapped to this Group.
- **Applications:** A list of Applications that this Group is mapped to, either directly or via an owning Directory.

For more information about what you can do with these lists, see :ref:`groups-othertasks`.

.. _groups-othertasks:

Other Tasks
===========

.. _group-accounts:

Manage a Group's Accounts
-----------------------------------

When viewing the page for a specific Group, you can see all of its associated Accounts by clicking on the "Accounts" link in the left-side navigation panel. This view will show you a list of all Accounts that are contained in Account Stores mapped to the Group.

The view itself has all of the same options and behavior as the regular `Accounts <https://api.stormpath.com/ui2/index.html#/accounts>`__ page. For more information about working with Accounts in the Admin Console, please see the :ref:`Accounts chapter <accounts>`.

Manage an Group's Applications
--------------------------------

When viewing the page for a specific Group, you can see all of its associated Applications by clicking on the "Applications" link in the left-side navigation panel.

Here you will see a list of all of the Applications that are associated with this Group. The right-most "Mapped Via" column specifies which Directory the Application is mapped to.

From this view you can:

- Search for Applications using the search box in the top right
- Add new Account Store Mappings between this Group and an Application, via the "Map Application" button.