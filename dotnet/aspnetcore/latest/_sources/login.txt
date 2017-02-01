.. _login:


Login
=====

The login feature of this library allows you to accept login attempts from any active Stormpath account in the Stormpath directory linked to your application. If the attempt is successful, cookies are created automatically for the user (see :ref:`cookie_authentication`).

By default, this library will serve an HTML login page at ``/login``.  You can change this URI, or disable the feature entirely if you wish.

.. note::

  See the :ref:`social_login` section if you want users to log in with external providers like Facebook or Google.


.. _login_configuration:

Configuration options
---------------------

This feature supports several options that you can configure using code or markup (see the :ref:`Configuration` section):

* **enabled**: Whether the feature is enabled. (Default: ``true``)
* **uri**: The path for this feature. (Default: ``/login``)
* **nextUri**: The location to send the user after logging in. (Default: ``/``)
* **view**: The view to render; see :ref:`templates`. (Default: ``login``)
* **form**: The fields that will be displayed on the form; see :ref:`login_customizing_form`.

.. note::
  Any unchanged options will retain their default values. See the :ref:`login_default_configuration` section to view the defaults.

Configuration example
.....................

You could, for example, change the endpoint path by setting this configuration (shown as YAML):

.. code-block:: yaml

  web:
    login:
      uri: "/logMeIn"

You could also set this configuration via code:

.. only:: aspnetcore

  .. literalinclude:: code/login/aspnetcore/configure_uri.cs
    :language: csharp

.. only:: aspnet

  .. literalinclude:: code/login/aspnet/configure_uri.cs
    :language: csharp

.. only:: nancy

  .. .literalinclude:: code/login/nancy/configure_uri.cs
    :language: csharp


See the :ref:`configuration` section for more details on how configuration works, or :ref:`login_default_configuration` to see the default values for this route.


Next URI
--------

If the login attempt is successful, the user will be redirected to ``/`` by default. If you want to change this, set the ``nextUri`` option:

.. code-block:: yaml

  web:
    login:
      nextUri: "/dashboard"


Pre-login handler
-----------------

If you need to run code before a login attempt is sent to Stormpath, you can attach a pre-login handler when you configure the Stormpath middleware:

.. only:: aspnet

  .. literalinclude:: code/login/aspnet/prelogin_handler.cs
      :language: csharp

.. only:: aspnetcore

  .. literalinclude:: code/login/aspnetcore/prelogin_handler.cs
      :language: csharp

.. only:: nancy

  .. .literalinclude:: code/login/nancy/prelogin_handler.cs
      :language: csharp

The signature of the handler is a ``Func`` that accepts a ``PreLoginContext`` and a ``CancellationToken``, and returns a ``Task``. It can be declared as a method instead of with lambda syntax:

.. literalinclude:: code/login/prelogin_handler_method.cs
    :language: csharp

.. note::

  The handler will run regardless of the login mechanism. Logins through the :ref:`login` route, the :ref:`json_login_api`, :ref:`social_login`, and so on will all trigger the handler.

Targeting an Account Store
..........................

A common use for the pre-login handler is to target a specific Account Store or Organization during login:

.. literalinclude:: code/login/prelogin_target_dir.cs
    :language: csharp

.. note::

  For more information about how targeting an Account Store works, see the `token generation section <https://docs.stormpath.com/rest/product-guide/latest/auth_n.html#generating-an-oauth-2-0-access-token>`_ of the Product Guide.


Post-login handler
------------------

If you need to run code after a successful login attempt has occurred, you can attach a post-login handler when you configure the Stormpath middleware:

.. only:: aspnet

  .. literalinclude:: code/login/aspnet/postlogin_handler.cs
      :language: csharp

.. only:: aspnetcore

  .. literalinclude:: code/login/aspnetcore/postlogin_handler.cs
      :language: csharp

.. only:: nancy

  .. .literalinclude:: code/login/nancy/postlogin_handler.cs
      :language: csharp

The signature of the handler is a ``Func`` that accepts a ``PostLoginContext`` and a ``CancellationToken``, and returns a ``Task``. It can be declared as a method instead of with lambda syntax:

.. literalinclude:: code/login/postlogin_handler_method.cs
    :language: csharp

.. note::

  The handler will run regardless of the login mechanism. Logins through the :ref:`login` route, the :ref:`json_login_api`, :ref:`social_login`, and so on will all trigger the handler.

Modifying Custom Data on login
..............................

One use for the post-login handler is to automatically save data to the Account's Custom Data when a user logs in. For example, you could save the current time to Custom Data:

.. literalinclude:: code/login/postlogin_save_time.cs
    :language: csharp


.. _login_customizing_form:

Customizing the form
--------------------

The login form will render these required fields by default:

* Username or Email
* Password

You can change the label and placeholder text that is displayed by changing the configuration, as shown in YAML below:

.. code-block:: yaml

  web:
    login:
      form:
        fields:
          login:
            enabled: true
            visible: true
            label: "Email"
            placeholder: "you@yourdomain.com"
            required: true
            type: "text"
          password:
            enabled: true
            visible: true
            label: "Password"
            placeholder: "Tip: Use a strong password!"
            required: true
            type: "password"

Or, through code:

.. only:: aspnetcore

  .. literalinclude:: code/login/aspnetcore/configure_labels.cs
    :language: csharp

.. only:: aspnet

  .. literalinclude:: code/login/aspnet/configure_labels.cs
    :language: csharp

.. only:: nancy

  .. .literalinclude:: code/login/nancy/configure_labels.cs
    :language: csharp

.. note::
  If you want to go beyond customizing the fields on the form, see :ref:`templates`.


.. _json_login_api:

Mobile/JSON API
---------------

If you are using this library from a mobile application, or a client framework like Angular or React, you'll interact with this endpoint via GET and POST requests.


Making a login attempt
......................

Simply POST to the ``/login`` endpoint with the user's credentials:

.. code-block:: none

    POST /login
    Accept: application/json
    Content-Type: application/json

    {
      "login": "foo@bar.com",
      "password": "myPassword"
    }

If the login attempt is successful, you will receive a 200 OK response and the
session cookies will be set on the response. (See :ref:`cookie_authentication`)

If an error occurs, you'll get an error response:

.. code-block:: json

  {
    "status": 400,
    "message": "Invalid username or password."
  }


Getting the form view model
...........................

By making a GET request to the login endpoint with the ``Accept:
application/json`` header, you can retreive a JSON view model that describes the login form and the social account stores that are mapped to your Stormpath
Application.

Here's an example view model that shows you an application that has the default login form, and a mapped Google directory:

.. code-block:: javascript

  {
    "accountStores": [
      {
        "name": "express-stormpath google",
        "href": "https://api.stormpath.com/v1/directories/gc0Ty90yXXk8ifd2QPwt",
        "provider": {
          "providerId": "google",
          "href": "https://api.stormpath.com/v1/directories/gc0Ty90yXXk8ifd2QPwt/provider",
          "clientId": "422132428-9auxxujR9uku8I5au.apps.googleusercontent.com",
          "scope": "email profile"
        }
      }
    ],
    "form": {
      "fields": [
        {
          "label": "Username or Email",
          "placeholder": "Username or Email",
          "required": true,
          "type": "text",
          "name": "login"
        },
        {
          "label": "Password",
          "placeholder": "Password",
          "required": true,
          "type": "password",
          "name": "password"
        }
      ]
    }
  }

.. tip::

  You may have to explicitly tell your client library that you want a JSON
  response from the server. Not all libraries do this automatically. If the
  library does not set the ``Accept: application/json`` header on the request,
  you'll get back the HTML login form instead of the JSON response that you
  expect!


.. _login_default_configuration:

Default configuration
---------------------

Options that are not overridden by explicit configuration (see :ref:`configuration`) will retain their default values.

For reference, the full default configuration for this route is shown as YAML below:

.. code-block:: yaml

  web:
    login:
      enabled: true
      uri: "/login"
      nextUri: "/"
      view: "login"
      form:
        fields:
          login:
            enabled: true
            visible: true
            label: "Username or Email"
            placeholder: "Username or Email"
            required: true
            type: "text"
          password:
            enabled: true
            visible: true
            label: "Password"
            placeholder: "Password"
            required: true
            type: "password"
        fieldOrder:
          - "login"
          - "password"

.. tip::
  You can also refer to the `Example Stormpath configuration`_ to see the entire default library configuration.

.. _Stormpath Admin Console: https://api.stormpath.com
.. _Example Stormpath configuration: https://github.com/stormpath/stormpath-framework-spec/blob/master/example-config.yaml
