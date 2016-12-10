.. _api_authentication:

API authentication
==================

If you're building an API service that other developers will consume, the Stormpath |framework| library provides two ways to authenticate users and machines:

  * For simple services that will always use HTTPS, you can use :ref:`http_basic`.

  * For services that require stronger security, you can use the :ref:`oauth2_client_credentials_grant`.

If you're building a web or mobile application, head over to :ref:`authentication` instead.


.. _issuing_api_keys:

Issuing API keys
----------------

Regardless of the authentication mechanism you choose, you'll need a way to distribute API keys to your users.

You can manually provision API keys for your users by using the `Stormpath Admin Console`_:

#. Click on the Accounts tab
#. Open up the details for the Account you want to create an API key for
#. Expand the Security Credentials panel
#. Click Create API Key

You'll need a way to securely distribute these API keys to your users. In a production application, you can use the `Stormpath .NET SDK`_ to generate the API keys programmatically and allow your users to view or download the key pairs.

For more details, see the `API Key Authentication`_ topic in the .NET SDK documentation.

.. _http_basic:

HTTP Basic authentication
-------------------------

Basic authentication is a simple way for your users to make authenticated calls to your API service. The API key ID and secret are included with every request, which makes calling the API very straightforward.

.. warning::

  Because the API credentials are sent in the clear on every request, it is important to **always** use TLS (HTTPS) when building a service that uses Basic authentication. Services that need stronger security should use the :ref:`oauth2_client_credentials_grant` instead.

The Stormpath |framework| library supports Basic authentication out-of-the-box. Once your user has an :ref:`API key <issuing_api_keys>`, they can use it to authenticate against your API by constructing the appropriate HTTP ``Authorization`` header:

.. code-block:: none

  Authorization: Basic <base64UrlSafe(apiKeyId + ":" + apiKeySecret)>

If the API key ID and secret are valid, the Stormpath middleware will authenticate the request, and the user will be authorized to access protected endpoints.

.. note::

  See the :ref:`authorization` section for details on requiring authentication for controllers and routes.


.. _oauth2_client_credentials_grant:

OAuth 2.0 client credentials grant
----------------------------------

Instead of using Basic authentication and sending the API credentials with every request, you can require your users to exchange their API credentials for an OAuth 2.0 access token. This flow is slightly more complicated, but is more secure because the credentials are only sent over the wire once.

Once your user has an :ref:`API key <issuing_api_keys>`, they will need to POST to the ``/oauth/token`` endpoint to obtain an access token:

.. code-block:: none

  POST /oauth/token
  Content-Type: application/x-www-form-urlencoded
  Authorization: Basic <base64UrlSafe(apiKeyId + ":" + apiKeySecret)>

  grant_type=client_credentials

If the API key ID and secret are valid, the server will return a JSON response:

.. code-block:: json

  {
    "access_token": "eyJ0eXAiOiJKV1QiL...",
    "token_type": "bearer",
    "expires_in": 3600
  }

The response has the following properties:

  - ``access_token`` - The access token itself.
  - ``token_type`` - This will always be ``bearer``.
  - ``expires_in`` - The number of seconds the token is valid.

The user can then make requests to your API by including the access token:

.. code-block:: none

  GET /secret
  Authorization: Bearer eyJ0eXAiOiJKV1QiL...

If the access token is valid and has not expired, the Stormpath middleware will authenticate the request, and the user will be authorized to access protected endpoints.

.. note::

  See the :ref:`authorization` section for details on requiring authentication for controllers and routes.

The client credentials grant type is enabled by default. You can disable it, or change the access token TTL, by changing the :ref:`OAuth 2.0 route configuration <oauth2_config_options>`.

.. warning::

  The client credentials flow requires the API credentials to be sent in the clear at the start of the session, so using TLS (HTTPS) is still important.


.. _Stormpath Admin Console: https://api.stormpath.com/login
.. _Stormpath .NET SDK: https://docs.stormpath.com/csharp/product-guide/latest/
.. _API Key Authentication: https://docs.stormpath.com/csharp/product-guide/latest/auth_n.html#how-api-key-authentication-works-in-stormpath
