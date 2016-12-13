.. _logout:

Logout
======

If you are using browser-based sessions, you'll need a way for the user to log out and destroy their session cookies. Similarly, in a mobile application, you'll need a way to destroy the user's tokens if they want to log out. The logout feature does both.

By default, this library will provide a POST route at ``/logout``.
Simply make a POST request to this URI and the user's tokens and cookies will be destroyed. You can change this URI, or disable the feature entirely if you wish.


How it works
------------

For security reasons, GET requests to the logout route are **not supported**. The endpoint only responds to POST.

In a browser-based application, you can create a Log Out link with the following HTML:

.. code-block:: html

  <form action="/logout" method="post" id="logout_form">
    <a onclick="document.getElementById('logout_form').submit();" style="cursor: pointer;">
      Log Out
    </a>
  </form>


Configuration options
---------------------

This feature supports several options that you can configure using code or markup (see the :ref:`Configuration` section):

* **enabled**: Whether the feature is enabled. (Default: ``true``)
* **uri**: The path for this feature. (Default: ``/logout``)
* **nextUri**: The location to send the user after logging out. (Default: ``/``)

.. note::
  Any unchanged options will retain their default values. See the :ref:`logout_default_configuration` section to view the defaults.


Configuration example
.....................

You can easily change the logout route URI and post-logout location by changing the configuration, as shown in YAML below:

.. code-block:: yaml

  web:
    logout:
      uri: "/logMeOut"
      nextUri: "/goodbye"

You could also set this configuration via code:

.. only:: aspnetcore

  .. literalinclude:: code/logout/aspnetcore/configure_uris.cs
    :language: csharp

.. only:: aspnet

  .. literalinclude:: code/logout/aspnet/configure_uris.cs
    :language: csharp

.. only:: nancy

  .. .literalinclude:: code/logout/nancy/configure_uris.cs
    :language: csharp

See the :ref:`configuration` section for more details on how configuration works, or :ref:`logout_default_configuration` to see the default values for this route.


Pre-logout handler
------------------------

If you need to run code before a user logs out, you can attach a pre-logout handler when you configure the Stormpath middleware:

.. only:: aspnet

  .. literalinclude:: code/logout/aspnet/prelogout_handler.cs
      :language: csharp

.. only:: aspnetcore

  .. literalinclude:: code/logout/aspnetcore/prelogout_handler.cs
      :language: csharp

.. only:: nancy

  .. .literalinclude:: code/logout/nancy/prelogout_handler.cs
      :language: csharp

The signature of the handler is a ``Func`` that accepts a ``PreLogoutContext`` and a ``CancellationToken``, and returns a ``Task``. It can be declared as a method instead of with lambda syntax:

.. literalinclude:: code/logout/prelogout_handler_method.cs
    :language: csharp


Post-logout handler
-------------------------

If you need to run code after user logs out, you can attach a post-logout handler when you configure the Stormpath middleware:

.. only:: aspnet

  .. literalinclude:: code/logout/aspnet/postlogout_handler.cs
      :language: csharp

.. only:: aspnetcore

  .. literalinclude:: code/logout/aspnetcore/postlogout_handler.cs
      :language: csharp

.. only:: nancy

  .. .literalinclude:: code/logout/nancy/postlogout_handler.cs
      :language: csharp

The signature of the handler is a ``Func`` that accepts a ``PostLogoutContext`` and a ``CancellationToken``, and returns a ``Task``. It can be declared as a method instead of with lambda syntax:

.. literalinclude:: code/logout/postlogout_handler_method.cs
    :language: csharp


.. _logout_default_configuration:

Default configuration
---------------------

Options that are not overridden by explicit configuration (see :ref:`configuration`) will retain their default values.

For reference, the full default configuration for this route is shown as YAML below:

.. code-block:: yaml

  web:
    logout:
      enabled: true
      uri: "/logout"
      nextUri: "/"

.. tip::
  You can also refer to the `Example Stormpath configuration`_ to see the entire default library configuration.


.. _Example Stormpath configuration: https://github.com/stormpath/stormpath-framework-spec/blob/master/example-config.yaml
