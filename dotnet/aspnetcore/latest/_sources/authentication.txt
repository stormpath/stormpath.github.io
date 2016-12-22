.. _authentication:

Authentication
==============

This library offers several options for securing your web or mobile application and authenticating your users.  Which strategy should you use?  The answer depends on your use case, and we'll discuss each one in detail. At a high level,
your choices look like this:

  * If you are building a traditional web app or single page application, you
    should use :ref:`cookie_authentication`.

  * If you are building a mobile application, you should use the :ref:`oauth2_password_grant`.

If you're building an API service that other developers will use, head over to :ref:`api_authentication` instead.


.. _cookie_authentication:

Cookie authentication
---------------------

If you are building a web application that serves traditional HTML pages, or a
Single Page Application (such as Angular/React), this library will handle cookie authentication for you automatically.

By default, the library hosts a login route at ``/login`` that can be used to log in with a username and password.

Behind the scenes, the Stormpath middleware creates OAuth 2.0 Access and Refresh Tokens for the user (via the Stormpath API), and stores them in secure, HTTP-only cookies. After the user has logged in, these cookies will be supplied on every request. The Stormpath middleware will assert that the Access Token is valid.  If the Access Token is expired, it will attempt to refresh it with the Refresh Token.

.. note::
    By default, the cookie names are ``access_token`` and ``refresh_token``. See :ref:`configuring_cookie_flags` if you want to change the defaults.

This all works out of the box; you don't have to write any code! If you want to restrict parts of your application to logged-in users only, see :ref:`requiring_login` in the Authorization section.


.. _setting_token_expiration_time:

Setting token expiration time
.............................

If you need to change the expiration time of the Access Token or Refresh Token, log in to the `Stormpath Admin Console`_ and navigate to the OAuth Policy of your Stormpath Application. You can configure the time-to-live (TTL) for both Access and Refresh Tokens.


.. _configuring_cookie_flags:

Configuring cookie flags
........................

This library creates two cookies, one for the Access Token and one for the
Refresh Token. The cookie details are configurable via code or markup (see the :ref:`Configuration` section).

The default cookie configuration (in YAML) is:

.. code-block:: yaml

  web:
    accessTokenCookie:
      name: "access_token"
      domain: null
      httpOnly: true
      path: "/"
      secure: null

    refreshTokenCookie:
      name: "refresh_token"
      domain: null
      httpOnly: true
      path: "/"
      secure: null

The flags behave as follows:

* **name** - Controls the name of the cookie stored in the user's browser.

* **domain** - Set this if needed; e.g. "subdomain.mydomain.com". (Default: ``null``.)

* **httpOnly** - Controls the ``HttpOnly`` flag on the cookie. Be careful if changing this, because ``false`` exposes cookies to XSS attacks. (Default: ``true``.)

* **path** - Unless explicitly set, this property will inherit ``stormpath.web.basePath``. (Default: ``/``.)

* **secure** - Controls the ``Secure`` flag on the cookie. A value of ``null`` means that the Secure flag will be automatically set in HTTPS environments (as detected by the request URI). This can be explicitly set, but we recommend leaving automatic detection on. (Default: ``null``.)


.. _token_validation_strategy:

Token validation strategy
.........................

When a request comes in to your server, the Stormpath middleware will use the Access Token
and Refresh Token cookies to make an authentication decision. The first step is to validate the Access Token to make sure it hasn't been tampered with.

There are two validation strategies: local validation (the default) and Stormpath validation. Local validation does **not** make a network request to the Stormpath API, while Stormpath validation does make a network request and supports token revocation.

Both validation strategies follow the same pattern:

- If the Access Token is valid, accept the request.

- If the Access Token is expired or invalid, attempt to get a new one from the Stormpath API by using the Refresh Token.

- Deny the request if no new Access Token can be obtained.

With the ``local`` strategy, the middleware only checks the signature and expiration of
the Access Token to determine whether it is valid.  It does not check whether the token has been revoked.

If you want the ability to revoke Access Tokens, you'll need to update your configuration to opt-in to the ``stormpath`` validation strategy. This will make a network call to the Stormpath API on every incoming request. If the Access Token has been revoked, or the Stormpath Account has been disabled or deleted, the Access Token will not be considered valid.

The validation strategy can be changed via :ref:`Configuration`. The default configuration (in YAML) is:

.. code-block:: yaml

  web:
    oauth2:
      password:
        validationStrategy: "local"

.. warning::

  When using local validation, your server will not be aware of token revocation
  or any changes to the associated Stormpath account.  **This is a security
  trade-off that optimizes for performance.**  If you prefer extra security, use
  the ``stormpath`` validation option.

  If you prefer local validation for the performance benefit, you can add a little more
  security by using a short expiration time for your Access Tokens (such as five minutes or
  less).  This will limit the amount of time that the Access Token can be used
  for validation.


.. _oauth2_password_grant:

OAuth 2.0 password grant
------------------------

This is the authentication strategy that you'll want to use for mobile clients, and it's also supported out-of-the-box.

In this scenario, the end-user supplies their username and password to your
mobile application.  The mobile application sends that username and password to
your |framework| server, which then verifies the password with Stormpath.

If the account is valid and the password is correct, Stormpath will generate
an Access and Refresh Token for the user.  Your server gets these tokens from Stormpath and then sends them down to your mobile application. The mobile application then stores the tokens in a secure location, and
uses them for future requests to your |framework| application.

When a user wants to login to your mobile application, the mobile application
should make this request to your application:

.. code-block:: none

    POST /oauth/token
    Host: myapi.com
    Accept: application/json
    Content-Type: application/x-www-form-urlencoded

    grant_type=password
    &username=user@example.com
    &password=theirPassword

If the authentication is successful, your server will return a token response to your mobile application.  The response will look like this::

    {
      "refresh_token": "eyJraWQiOiI2...",
      "stormpath_access_token_href": "https://api.stormpath.com/v1/accessTokens/3bBAHmSuTJ64DM574awVen",
      "token_type": "Bearer",
      "access_token": "eyJraWQiOiI2Nl...",
      "expires_in": 3600
    }

.. note::

  For details on how to configure the ``/oauth/token`` endpoint, see the :ref:`oauth2` section.

Your mobile application should store the Access and Refresh Tokens in a secure location.

.. note::
  By default the Access Token is valid for 1 hour, and the Refresh Token is valid for 60 days. You can configure this in the Stormpath Admin Console; see :ref:`setting_token_expiration_time`.

Each subsequent request the mobile application makes to your |framework| application should include the Access Token as a ``Bearer`` header:

.. code-block:: none

    GET /profile
    Host: myapi.com
    Accept: application/json
    Authorization: Bearer eyJraWQiOiI2Nl...

Incoming requests authenticated with Bearer authentication can be further authorized using the techniques described in the :ref:`authorization` section.

Getting a new access token
..........................

When the Access Token expires, you can use the Refresh Token to obtain a new Access Token:

.. code-block:: none

    POST /oauth/token
    Host: myapi.com
    Accept: application/json
    Content-Type: application/x-www-form-urlencoded

    grant_type=refresh_token
    &refresh_token=eyJraWQiOiI2...

The response will contain a new Access Token.  Once the Refresh Token expires,
the user will have to re-authenticate with a username and password.

For full documentation on our OAuth 2.0 and token management features, please see
`Using Stormpath for OAuth 2.0 and Access/Refresh Token Management`_


.. _Stormpath Admin Console: https://api.stormpath.com/login
.. _Using Stormpath for OAuth 2.0 and Access/Refresh Token Management: http://docs.stormpath.com/guides/token-management/
