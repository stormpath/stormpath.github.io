***************
Getting Started
***************

This chapter will show you how to get started with some basic tasks in the Stormpath Admin Console. It assumes only that you have already signed-up for Stormpath and are able to login.

Before we start, the following resources are created inside  Stormpath as soon as you register:

**Two Application resources**

- "My Application", which is automatically created for use with our Quickstarts.
- "Stormpath" which is the Application that represents Stormpath within your Tenant. Because it represents Stormpath, it is used to control who can access the Stormpath Admin Console and API.

**A Directory resource**

There is a "Stormpath Administrators" Directory that is mapped to your Stormpath Application resource. Any Accounts added to this Directory will have access to your Stormpath Admin Console and API.

**An Account**

There is one Account resource which is your Account within Stormpath. If you disable or delete this Account, it will no longer be able to access Stormpath.

**One Tenant**

All of these resources exist within a private data space called your Tenant:

.. raw:: html

  <p align="center">
    <img src="https://docs.stormpath.com/rest/product-guide/latest/_images/default_resources.png" alt="Default Stormpath Resources">
  </p>

Now that we know what exists already, you can familiarize yourself with how the Stormpath Admin Console works by creating a few additional resources yourself.

Create An Application
=====================

The Application resource represents your real-world application that communicates with Stormpath. Usually, you will have as many Application resources as you have applications that are using Stormpath, though the Stormpath data model is extremely flexible.

From `the Home page <https://api.stormpath.com/ui2/index.html#/>`__, click on the "Applications" tab.

.. figure:: images/gettingstarted/getting_started_app_tab.png
  :align: center
  :scale: 100%
  :alt: Application Tab

The `main Applications page <https://api.stormpath.com/ui2/index.html#/>`__ shows you the list view of all of your Applications. From here, click **Create Application**.

.. figure:: images/gettingstarted/getting_started_create_app.png
  :align: center
  :scale: 100%
  :alt: Create Application Button

This will bring up the "Create Application" dialog. Here you can enter whatever information you want, the only mandatory field is the "Name". Be sure to keep the "Create new Directory" box checked. This means that when we create our Application, we will also create a new Directory to store all of its user Accounts.

.. figure:: images/gettingstarted/getting_started_create_app_box.png
  :align: center
  :scale: 100%
  :alt: Create Application Dialog

When you are done filling out the information, click **Create**.

You will now be back on the main Applications page, and you will see the new Application you created in the list of Applications.

.. figure:: images/gettingstarted/getting_started_new_app.png
  :align: center
  :scale: 100%
  :alt: Applications list view

We also indicated that we wanted to create a Directory alongside this Application. There are two ways we can get to this Directory:

1. We can click on the "Directories" tab, where we will see it in the list of Directories.

.. figure:: images/gettingstarted/getting_started_new_dir_list.png
  :align: center
  :scale: 100%
  :alt: Directories list view

2. We can click on our newly-created Application, and then click on the **Account Stores** link on the left.

.. figure:: images/gettingstarted/getting_started_app_as.png
  :align: center
  :scale: 100%
  :alt: Application Account Stores

Here you will see a list of all of the Directories associated with this Application. Any Directory in this list is mapped to this Application, and its users can log in to the Application. If we click on its name, we will be taken to the page for that Directory.

.. figure:: images/gettingstarted/getting_started_new_dir.png
  :align: center
  :scale: 100%
  :alt: Directory main page

Now that we have an Application and a Directory, we can create a Group.

Create an Account
=================

Accounts in Stormpath are used to model anything that requires access to your application. This means that you can create Accounts for your application's users, but also for things like microservices.

From wherever you are, click on the "Accounts" tab at the top.

.. figure:: images/gettingstarted/getting_started_accnt_tab.png
  :align: center
  :scale: 100%
  :alt: Accounts tab

This will bring you to the Accounts list view, where you will see all of the Accounts currently in your Tenant.

On this page, click **Create Account**.

.. figure:: images/gettingstarted/getting_started_create_accnt.png
  :align: center
  :scale: 100%
  :alt: Create Account button

This will bring up the "Create Account" dialog. For "Account Location" select the Directory we made in the previous step. For "First Name" and "Last Name" you can enter whatever you wish, but the email should be one that you control, since an email will be sent to that address inviting them to your Directory.

.. figure:: images/gettingstarted/getting_started_create_accnt_box.png
  :align: center
  :scale: 100%
  :alt: Create Account dialog

Once you click **Create** you will be brought to that Account's main page.

Now that we have an Application, a Directory, and an Account, we can create a Group for that Account to be associated with.

Add Some Groups
===============

Groups have many uses in Stormpath, but the easiest analogy might be to think of them as labels that are applied to Accounts. These labels can indicate many different things.

For example, a Group can be used to model membership in a particular company. This Group is used to model Company A, and every user Account associated with this Group is an employee of Company A.

As another example, a Group can be used to model an Authorization role. So this Group is used to model the Administrator role, and every user Account associated with this Group has the permissions associated with an Administrator user.

For the purposes of this introduction, you will create a role Group for regular users and add the existing user Account to it.

From wherever you are, click on the "Groups" tab at the top.

.. figure:: images/gettingstarted/getting_started_groups_tab.png
  :align: center
  :scale: 100%
  :alt: Groups tab

The `main Groups page <https://api.stormpath.com/ui2/index.html#/>`__ shows you the list view of all of your Groups. From here, click **Create Group**.

.. figure:: images/gettingstarted/getting_started_groups_list_view.png
  :align: center
  :scale: 100%
  :alt: Groups list view

This will bring up the "Create Group" dialog. First you must indicate which Directory you would like to create this Group inside. Choose the Directory that you created in the last step.

For the name you can enter anything you like, but for our example we will be creating a role Group for regular, non-administrator users. When you are done entering in your information, click **Create**.

.. figure:: images/gettingstarted/getting_started_create_group_box.png
  :align: center
  :scale: 100%
  :alt: Group creation dialog

You will now be back on the main Groups list view, and you will see the new Group that you created.

Add an Account to the Group
===========================

From the Groups view, click on the Group that you just created. From that Group's main page, click on the **Accounts** link on the left hand side.

.. figure:: images/gettingstarted/getting_started_group_accnts.png
  :align: center
  :scale: 100%
  :alt: Group Accounts

On this page, click on **Add Existing Account**.

.. figure:: images/gettingstarted/getting_started_add_accnt_to_group.png
  :align: center
  :scale: 100%
  :alt: Add Existing Account button

This will bring up the "Add Existing Accounts" dialog. Here select the Account we created in the previous step and then click **Add Accounts**.

.. figure:: images/gettingstarted/getting_started_add_accnt_box.png
  :align: center
  :scale: 100%
  :alt: Add Existing Account dialog

You will now be back on the "Regular User" Group's main page, and you will see the Account that you added in the list of Accounts.

Add Some Custom Data to the Group
===================================

Primary resources in Stormpath, like Applications, Directories, Groups and Accounts, have Custom Data resources associated with them. Custom Data is able to hold arbitrary data in JSON format. A stored value can be a string, boolean, or number value, as well as an array or entire JSON object.

In this case, you will use the Group's Custom Data resource to store some permissions which you would like all "Regular Users" in your application to have.

The permissions are as follows:

.. code-block:: none

  "access_settings": false
  "page_crud": "disabled"

To add these to our Group, you go back to the Group's main page by clicking on **Details**.

.. figure:: images/gettingstarted/getting_started_group_details.png
  :align: center
  :scale: 100%
  :alt: Group main page

On this page you click on the chevron in the Custom Data Editor.

.. figure:: images/gettingstarted/getting_started_add_cd.png
  :align: center
  :scale: 100%
  :alt: Add Custom Data

From this menu, select "Boolean". For "Name" enter in "access_admin_settings", and for the value select "False".

Click on the chevron again, and this time select "String". For "Name" enter in "page_crud" and for the value type "disabled".

.. figure:: images/gettingstarted/getting_started_custom_data.png
  :align: center
  :scale: 100%
  :alt: Custom Data

These values are now available on this Group for your application to use as part of its authorization process.

Next Steps
=========================

You've just scratched the surface of what you can do with Stormpath.

Want to learn more? Here are a few other helpful resources you can jump into.

- Try out Stormpath in your favorite programming language with one of our language-specific `quickstarts <https://docs.stormpath.com/home/>`_. Simply choose the integration of your choice, and then click on Quickstart.
- Learn to easily partition user data in the `Multi-Tenancy Chapter <https://docs.stormpath.com/rest/product-guide/latest/multitenancy.html#multitenancy>`__.
- Easily support Google and Facebook Login by learning how `Social Authentication Works <https://docs.stormpath.com/rest/product-guide/latest/auth_n.html#social-authn>`__.
- Or simply jump into the next section and learn about :ref:`the Home Page <home>`.