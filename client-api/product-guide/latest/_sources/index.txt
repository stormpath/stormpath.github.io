******************************************
Welcome to the Stormpath Client API Guide!
******************************************

The Stormpath Client API is intended for developers of Single Page Applications (SPAs), mobile, and desktop applications. Using the Client API endpoints, your application can:

- Authenticate an existing user and get back OAuth 2.0 tokens
- Retrieve the current user's Account information
- Revoke the user's OAuth tokens
- Register a new user
- Trigger the email verification workflow, as well as send a verification of that email
- Trigger the password reset email, as well as send an updated password

All Client API endpoints do not require an administrative API Key, so you don't have to worry about storing one on your client application, or having to inject one via a proxy server.

**How is this different from using Stormpath without the Client API?**

Stormpath is a cloud service allows you to register users, authenticate them, and store information about them, and all without having to implement your own encryption or user databases. However, access to the Stormpath API normally requires that your application pass an administrative API Key to authenticate each request, and client-side applications are not able to securely store API Keys.

To accommodate these client applications, the Client API allows for basic user registration and authentication tasks to be performed without requiring an administrative API key. This means that your client applications can use these endpoints in order to, for example, authenticate a user and get back a session. With this session in hand, the client application can then continue on with its own functionality, or securely communicate with a back-end application server.

.. todo::

  [A diagram here would be helpful]

How does the Client API Work?
=============================

The Client API exposes a configurable set of endpoints to your applications. The endpoints are hosted by Stormpath, in URLs that are customized for each one of your Stormpath Applications:

``https://{DNS-LABEL}.apps.stormpath.io/{endpoint}``

The DNS label is a word pair (for example ``violet-peace``) that is randomly-assigned when you create an Application. For more information about Client API configuration, see the :ref:`configuration` chapter.

The list of currently-available endpoints is as follows:

.. list-table::
  :widths: 20 80
  :header-rows: 1

  * - Endpoint
    - Functionality

  * - ``/oauth/token``
    - Authenticates a user and returns an OAuth token. [:ref:`More info<authentication>`]

  * - ``/oauth/revoke``
    - Revokes a user's existing OAuth tokens. [:ref:`More info <logout>`]

  * - ``/register``
    - Registers a new user. Can also be used to retrieve the Registration view data for your application. [:ref:`More info <registration>`]

  * - ``/verify``
    - Verifies an email address. [:ref:`More info <email-verification>`]

  * - ``/forgot``
    - Initiates the password reset workflow. [:ref:`More info <password-reset>`]

  * - ``/change``
    - Sends an updated password. [:ref:`More info <password-reset>`]

  * - ``/login``
    - Retrieves the login view data for your Application. [:ref:`More info <authentication>`]

  * - ``/me``
    - Retrieves the current user's information. [:ref:`More info <user-context>`]

An example user flow using these endpoints could look as follows:

1. The user lands on your web application's login page. The information needed to generate this page is pulled-in via a request to the ``/login`` endpoint.
2. They fill out and submit their username and password.
3. The username and password is sent to the Client API's ``/oauth/token`` endpoint over HTTPS.
4. Stormpath validates the credentials and responds with OAuth 2.0 Access and Refresh tokens.
5. Your app stores these tokens in, for example, local storage. If you are using a Stormpath SDK then this step is handled for you.
6. The tokens can now be passed along with a request to the ``/me`` endpoint in order to fetch the user's data, for use in your profile page.
7. The user chooses to log out, and the "Logout" button sends a request to ``/oauth/revoke``, which revokes the existing OAuth Access and Refresh tokens.

For more information, continue on to one of these sections:

.. toctree::
  :maxdepth: 1

  configuration
  client_config
  registration
  authentication
  user_context
  logout
  email_verification
  password_reset


.. Indices and tables
  ==================

