.. _home:

*********************
The Home Page
*********************

The Home page is the first page that you see upon logging in to the Stormpath Admin Console.

.. _home-log-in:

Logging in to the Admin Console
===============================

If you do not have a Stormpath account, you will need to sign-up for one. The sign-up page can be found here: https://api.stormpath.com/register

To log in to the Stormpath Admin Console you will need to enter 3 pieces of information:

- **Your Stormpath Tenant name:** This a unique name for your private Stormpath partition, represented by two words linked by a hyphen (e.g. "strong-cerberus"). You received this in your first "Welcome to Stormpath" email.
- **Your Email**
- **Your Password**

The only users that can log-in to your tenant's Admin Console are those who have Accounts inside the **Stormpath Administrators** Directory. For more information about adding tenant administrators, please see :ref:`admin-adding-admins`.

Session Timeout
---------------

Your authenticated session with the Stormpath Admin Console will terminate when any of the following occur:

- Upon detection that your computer has been locked, gone into sleep mode, or been shut down
- You close all tabs that the Admin Console is open in
- You open a new tab and visit http://api.stormpath.com from there
- After 30 minutes of inactivity

Before you are logged out due to inactivity you will receive a warning and be given the option to extend the session.

.. _home-log-out:

Logging Out
-----------

To log out at any time, you can click on the drop-down menu in the top right, which has your Stormpath tenant's name on it. At the bottom of this menu you will see the "Logout" button.

As mention above, you will also be logged out when you close the tab(s) that the Admin Console is open in.

Navigation Pane
===============

The **Navigation Pane** sits above any of the pages that you visit in the Admin Console. It contains:

- Quick Links to things like the :ref:`Quick Starts <home-quickstarts>`, `Documentation <https://docs.stormpath.com/>`__, and :ref:`the Administrator Menu <administration>`.

- Links to the major sections of the Admin Console, one for each of the primary Stormpath resources, such as Applications and Directories. There are also dedicated sections for LDAP Agents and ID Site.

Support
-------

Where ever you are in the Admin Console, you will see a box that says "Questions" on the bottom right of your screen. Clicking on this will bring up a window that will allow you to submit a question to our Support team. Don't hesitate to click this if you have any questions!

.. _home-about:

The Home Page
=============

The Home page that you first see upon logging-in is designed to give you quick access to the most common functions required to administrate your Stormpath tenant. [`Click here to go there now <https://api.stormpath.com/ui2/index.html#/>`__]

On the right-hand side you will find:

- An **Overview** of your Tenant, including the Name, Subscription level, and how many Active Applications you have. Clicking on the Subscription level will take you to :ref:`your tenant's subscription page <admin-subscriptions>`.
- A **Developer Tools** section where you will be able to :ref:`create new API Keys <admin-api-keys>`.
- A **Support** section with links to our documentation, as well as the Knowledge Base and a quick link that will allow you to submit a support ticket.

.. _home-quickstarts:

Quickstarts
-----------

The majority of the Home page is taken-up by a collection of Stormpath **Quickstarts**. These are also accessible at any time by click on the "QuickStart" link in the top navigation pane, which will bring you here: https://api.stormpath.com/ui2/index.html#/quickstart

Clicking on any of these will bring you to quickstart documentation for that specific language. The documentation has been further customized for your specific Stormpath tenant.

This means that, for all relevant code samples, the following have been pre-populated:

- Your Stormpath Application HREF
- Your tenant Administrator Account's API Key ID and Secret

Each of the code block's with the pre-populated Application HREF has a drop-down menu in the upper right that allows you to choose a different Application's HREF, if applicable.

