.. _social-login:

************
Social Login
************

- ``/authorize``
- ``/authorize/callback``

The ``/authorize`` endpoint is used to start the social login flow, while the ``/authorize/callback`` endpoint accepts the social provider's response and then redirects the user back to your application's authorized callback URI.

.. _social-login-flow:

The Social Login Flow
======================

At a high level, social login involves the following steps:

1. The user clicks on a "Login with X" link pointing at the appropriate ``/authorize`` endpoint
2. Stormpath handles the login and redirects the user back to your app with a Stormpath Token JWT response
3. Your application passes that Stormpath token to the ``/oauth/token`` endpoint and receives back OAuth 2.0 access and refresh tokens

If you'd like a more detailed overview:

#. User clicks provider-specific link pointing at Client API. This link is returned as part of the login view model retrieved from the ``/login`` endpoint.
#. Your app sends a GET request to the Client API's ``/authorize`` endpoint along with ``response_type`` and ``account_store_href``
#. Client API responds with 302 redirect to appropriate URL at social provider
#. Your app sends GET request to redirect URL at social provider
#. User logs in to social provider
#. Social provider redirects back to Client API's ``/authorize/callback`` endpoint along with authorization code
#. Client API takes the authorization code and exchanges it with the social provider for a social provider access token, and uses the access token to create/retrieve a user from the Stormpath API.
#. Client API constructs a Stormpath assertion JWT, and redirects the user to your app. If no ``redirect_uri`` is specified in the first step, it will be to the first redirect URI in the Application.
#. Your app sends the Stormpath assertion JWT to Client API's :ref:`/oauth/token endpoint <post-oauth-token-stormpath-token>` to exchange the assertion JWT for an access/refresh token pair
#. WOOT!

Before You Start
=================

Before you can use Social Login, you must:

1. Configure your social provider
2. Create a Stormpath Directory for that social provider and map that Directory to your Stormpath Application as an Account Store

Once all of these steps are complete, social login will be ready to go!

1. Configuring Your Social Provider
-----------------------------------

Each social login provider will require you to create an application and configure it in order for login to work.

Facebook
^^^^^^^^

#. Head over to the Facebook App Dashboard: https://developers.facebook.com/apps

#. If you haven't already, create a Facebook app. Instructions for creating a Facebook application can be found here: https://developers.facebook.com/docs/apps/register

#. Once you have an application, you should add Facebook Login: https://developers.facebook.com/docs/facebook-login

#. Inside the Facebook Login settings, add the full ``/authorize/callback`` endpoint to the "Valid OAuth redirect URIs" (e.g. ``https://cold-diver.apps.dev.stormpath.io/authorize/callback``)

Google
^^^^^^^^

#. Head over to the Google Developer Console: https://console.developers.google.com/

#. If you haven't already, create a Google API Console project. Instructions for creating a project can be found here: https://developers.google.com/identity/sign-in/web/devconsole-project

#. Inside the OAuth 2.0 client ID settings, add the Client API's full ``/authorize/callback`` endpoint to your "Authorized redirect URIs" (e.g. ``https://cold-diver.apps.dev.stormpath.io/authorize/callback``)

GitHub
^^^^^^^^

#. If you haven't already, register a new GitHub OAuth application here: https://github.com/settings/applications/new

#. Add the full ``/authorize/callback`` endpoint under "Authorization callback URL" (e.g. ``https://cold-diver.apps.dev.stormpath.io/authorize/callback``)

LinkedIn
^^^^^^^^

#. If you haven't already, create a LinkedIn application here: https://www.linkedin.com/developer/apps

#. Once you've created application, go its authentication settings and add the full ``/authorize/callback`` endpoint under "Authorized Redirect URLs" (e.g. ``https://cold-diver.apps.dev.stormpath.io/authorize/callback``)

2. Create a Stormpath Social Directory
--------------------------------------

Instructions for creating a Stormpath Social Directory and mapping it to your Application can be found in the `Admin Console Guide <https://docs.stormpath.com/console/product-guide/latest/directories.html#create-a-social-directory>`__.

Now that set-up is complete, you can try out the social login flow.

.. _start-social-flow:

Initiate Social Login
==================================

**URL**

``https://{DNS-LABEL}.apps.stormpath.io/authorize``

The pre-populated ``authorize`` endpoints for all Social Directories associated with your Application are returned as part of the :ref:`JSON login view model <get-login>`.

The Authorize endpoint takes the following parameters:

.. list-table::
  :widths: 30 20 50
  :header-rows: 1

  * - Parameter
    - Value Values
    - Description

  * - ``response_type``
    - ``stormpath_token``
    - (Required) This specifies what sort of response you would like at the end of this flow. The only possible value currently is ``stormpath_token``.

  * - ``account_store_href``
    - Valid HREF
    - (Required) The HREF of a Social Directory associated with your Application.

  * - ``state``
    - String
    - (Optional) Any state that you would like to be sent to the provider.

  * - ``scope``
    - Space-delimited String
    - (Optional) The scopes to request from the Social Provider. The values of these scopes depend on the provider.

  * - ``redirect_uri``
    - Valid URI
    - (Optional) Any URI in the list of Authorized Callback URIs. If you do not include this, the user will be returned to the first entry in this list.

  * - ``organization_href``
    - 1 valid HREF
    - The HREF of an Organization associated with your Application. This allows you to route the login attempt to a particular Organization.

  * - ``organization_name_key``
    - 1 valid nameKey
    - The nameKey of an Organization associated with your Application. This allows you to route the login attempt to a particular Organization.


**Example Request**

.. code-block:: http

  GET /authorize?response_type=stormpath_token&account_store_href=https:%2F%2Fdev.i.stormpath.com%2Fv1%2Fdirectories%2F2TRsNjHx8DB6Ca3rBal536 HTTP/1.1
  Accept: application/json
  Host: cold-diver.apps.stormpath.io
  Connection: close
  User-Agent: Paw/3.0.13 (Macintosh; OS X/10.12.2) GCDHTTPRequest


**Success Response**

As explained :ref:`above <social-login-flow>`, this will result in a series of 302 redirects that will lead to the social provider's login page. After the user logs in they will arrive at the URI that was specified in the ``redirect_uri`` parameter, or, if a ``redirect_uri`` was not specified, they will arrive back on the first entry in your Application's list of Authorized Callback URIs along with a Stormpath Token. At this point, you can exchange this token for  OAuth 2.0 access/refresh tokens using the :ref:`/oauth/token endpoint <post-oauth-token-stormpath-token>`.


