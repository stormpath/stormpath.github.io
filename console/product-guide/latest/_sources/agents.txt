.. _agents:

******
Agents
******

The `Agents page <https://api.stormpath.com/ui2/index.html#/agents>`__ is for the creation and management of Stormpath LDAP Agents. The Stormpath LDAP Agent is a web application daemon that is installed locally. It maintains a connection out through your firewall, monitors your LDAP directories (including Active Directory), and pushes out any changes to Stormpath.

LDAP Agents have a 1:1 relationship with LDAP Directories, so the creation of an LDAP Directory requires the creation of an LDAP Agent.

On the main page you can see a list of existing LDAP Directories as well as their Agent statuses.

- To create a new LDAP Directory and Agent, click the **Create Agent** button in the top right.
- To edit an existing Agent, click **Edit** in the "Action" column.

.. _agents-create:

Creating an LDAP Directory
=============================

To create a new LDAP Directory, start from the `Agents page <https://api.stormpath.com/ui2/index.html#/agents>`__, and click on **Create Agent**. This will start the Agent creation process.

Creating your LDAP Agent
------------------------

There are 5 steps to creating a new LDAP Agent, each corresponding to a tab on the "Create New Agent" page.

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
- **Directory Port:** The port of the LDAP Directory server. (Default: `636`)
- **Require SSL:** Should the Agent require SSL for the socket connection? If so, the Directory's port must be configured to accept SSL.
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

Once you have reviewed all the information, click **Create Agent**. You will now arrive on the "Installation" page.

Installing Your LDAP Agent
--------------------------

Follow the instructions on the page here to download, configure and start your LDAP Agent.


