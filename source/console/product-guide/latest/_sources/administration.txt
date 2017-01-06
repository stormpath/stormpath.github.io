.. _administration:

***********************
Administering Stormpath
***********************

Wherever you are in the Stormpath Admin Console, you will always see the Admin Menu in the top right. Clicking on this will open up a drop-down menu. In this menu you will find your current Account's name. Clicking on this will take you to the Account's page. You will also find the following links:

- :ref:`My Subscription page <admin-subscriptions>`
- :ref:`Billing page <admin-billing>`
- :ref:`API Keys page <admin-api-keys>`
- :ref:`Tenant Admins page <admin-adding-admins>`
- Stormpath's Support page (https://support.stormpath.com/)
- Stormpath's Documentation page (https://docs.stormpath.com/)

.. _admin-subscriptions:

Subscription Levels
=======================

The `My Subscription page <https://api.stormpath.com/ui2/index.html#/subscription>`__ will tell you more about your current subscription with Stormpath, and also allow you to change it.

When the page opens you will land on the tab for your current Subscription tier. There will also be a green notice indicating that this is your current plan.

.. _admin-change-tier:

Changing Your Subscription Tier
-------------------------------

To change your subscription tier, click on the tab for the tier that you would like, and then click **Continue**. A confirmation prompt will appear, where you can then confirm you decision.

.. _admin-add-app:

Increasing Your Applications
----------------------------

On the left side of the "My Subscription" page you will see see:

- Your Current Plan
- The number of Active Applications that you have
- The total number of Available Applications
- The cost per application, which changes depending on your plan

If you would like to increase the number of applications available to you, it is simply a matter of changing the value beside "Available Applications".

Once this value is changed, your monthly total (if applicable) will update, and a green "Continue" box will appear at the bottom. Once you click this a confirmation dialog will appear. Click on **Change Subscription** to confirm.

.. _admin-billing:

Billing
=======================

The `Billing page <https://api.stormpath.com/ui2/index.html#/billing>`__ is where you can manage the credit card, if any, that you use to pay for your Stormpath subscription. If you are currently on a free tier, you will not see any credit cards here.

If you would like to remove your credit card information, please `contact support <support@stormpath.com>`__.

.. _admin-api-keys:

My API Keys
===========

Clicking on this will take you to the main page for your Account and then to the API Keys section therein. In this section you will find a list of the API Keys that you have generated for your Account. For more information, please see :ref:`accounts-apikeys`.

Any requests that you make to the Stormpath platform will require a valid API Key and Secret combo. For more about this, you can see the `REST API Reference section on Authentication <https://docs.stormpath.com/rest/product-guide/latest/reference.html#authentication>`__.

.. _admin-managing-admins:

Managing Tenant Administrators
==============================

This link will bring you to the `Tenant Administrators <https://api.stormpath.com/ui2/index.html#/admins>`__ page. Here you will find a list of Accounts that have Administrator status within your Tenant. In Stormpath, Administrator Accounts are any Accounts in the "Stormpath Administrators" Directory. On this page you can:

- Search for Administrators in the top-right search box
- Add new Administrators using the "Add Administrator" button (see :ref:`below <admin-adding-admins>`)
- Change the status of an Administrator Account to: `Enabled`, `Disabled` or `Unverified`
- Reset an Administrator's password.
- Resend the verification email for an Administrator Account
- Add an Administrator to a Group, or remove them from one in which they are already a member

Clicking **Edit** will take you to that Account's main page. For more information, see :ref:`accounts-edit`.

.. _admin-adding-admins:

Adding Administrators
----------------------

To add a new Administrator Account, click on the "Add Administrator" button. This will bring up the "Add Administrators" dialog. Here you will have to:

#. Add one (or more) email addresses. Each email address will have an invitation email sent, and if the user clicks on the link in the email, an Account will be made for them in the Stormpath Administrators Directory.
#. Either customize the "Subject" of the invitation email, or leave it as is.
#. Either customize the "Message" or body of the invitation email, or leave it as is.

.. note::

  All Stormpath Tenant Administrators have the same privileges. This means that any Administrators that you add will have full access to the Stormpath Admin Console, and their Account will be able to do everything that your Account can, including adding more Tenant Administrators.

.. _admin-changing-owner:

Changing Tenant Ownership
-------------------------

If you would like to change the Account that is the owner Administrator, then you have to change the email address on the tenant owner's Account to the new owner's email address. You can do this in the Admin Console or programatically. One option is to delete an existing Administrator, change the current tenant owner's email to the deleted Administrator's email, and then issue a password reset for that account.

.. note::

  The new email address you choose can't already exist in your Stormpath Administrators Directory.