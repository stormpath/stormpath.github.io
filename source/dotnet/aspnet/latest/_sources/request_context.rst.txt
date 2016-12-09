.. _request_context:

Request context
===============

When the Stormpath middleware is added to your |framework| application pipeline,
these objects will be available in the context of each request:

* Stormpath Client (``IClient``)
* Stormpath Application (``IApplication``)
* Current user's Stormpath Account (``IAccount``)

.. only:: aspnetcore

  This library uses the built-in dependency injection mechanism in ASP.NET Core to provide these types.

  You can use constructor injection to request these objects from the service container:

  .. literalinclude:: code/request_context/aspnetcore/controller_injection.cs
      :language: csharp

.. only:: aspnet

  In any MVC action or Web API route, you can use the ``GetStormpath`` extension methods on the ``Request`` object to retrieve these types:

  .. literalinclude:: code/request_context/aspnet/extension_methods.cs
    :language: csharp

.. only:: nancy

  .. .literalinclude:: code/request_context/nancy/extension_methods.cs
    :language: csharp

.. note::

  This section describes how to access these objects in the current request context. For more details on how to interact with these objects and the Stormpath SDK, see :ref:`using_the_sdk`.

Stormpath Client
----------------

The ``IClient`` type is the starting point of the `Stormpath .NET SDK`_. You can use it to perform any action against the Stormpath API.

.. note::
  For more information about the Client object, see :ref:`using_the_sdk` and the `Stormpath .NET SDK`_ documentation.


Stormpath Application
---------------------

The ``IApplication`` type is a .NET representation of the Stormpath Application resource associated with your |framework| application. You can use this object to perform actions like creating and searching for user accounts programmatically.

See :ref:`using_the_sdk` for an example of how to use the Application object.


Current Account
---------------

This library automatically checks incoming requests for authentication information, and resolves the user's identity to a Stormpath Account if the information is valid. This happens on **every** request, not just routes that require authentication.

.. tip::
  If you want to require authentication for a route or action, see the :ref:`authorization` section.

.. only:: aspnet or aspnetcore

  ClaimsIdentity
  ''''''''''''''

  A subset of the user's Stormpath Account details are automatically placed in the ``IIdentity`` object for the request. This makes it possible to quickly do things like update a view if the user is logged in:

  .. only:: aspnetcore

    .. literalinclude:: code/request_context/aspnetcore/user_iprincipal.cshtml
      :language: html

  .. only:: aspnet

    .. literalinclude:: code/request_context/aspnet/user_iprincipal.cshtml
      :language: html

  On each request, ``User.Identity`` is set to a ``ClaimsIdentity`` instance with these claims:

  * ``ClaimTypes.NameIdentifier`` (Stormpath Account ``href``)
  * ``ClaimTypes.Email``
  * ``ClaimTypes.Name`` (Stormpath username, usually the same as email)
  * ``ClaimTypes.GivenName``
  * ``ClaimTypes.Surname``
  * ``"FullName"`` (The computed ``fullName`` property in Stormpath)

Stormpath IAccount
''''''''''''''''''

.. only:: aspnetcore

  If you want full access to the Stormpath ``IAccount`` object, inject a ``Lazy<IAccount>`` in your controller:

  .. literalinclude:: code/request_context/aspnetcore/injecting_lazy_account.cs
      :language: csharp

  If the request is unauthenticated, the lazy value will resolve to ``null``. If the request represents a valid user, you'll get an ``IAccount`` instance representing the user's Stormpath Account.

.. only:: aspnet

  If you want full access to the Stormpath ``IAccount`` object, use the ``GetStormpathAccount()`` method in your MVC or Web API controller.

  If the request is unauthenticated, the value will be ``null``. If the request represents a valid user, you'll get an ``IAccount`` instance representing the user's Stormpath Account.

.. only:: nancy

  Nancy stuff.

.. only:: aspnetcore

  .. tip::
    If your route or action will *always* be authenticated (see the :ref:`authorization` section), you can drop the ``Lazy<>`` wrapper and inject ``IAccount`` directly. Don't do this on routes that can be accessed anonymously!

  You can also use the ``@inject`` directive to do the same injection directly in your views:

  .. literalinclude:: code/request_context/aspnetcore/injecting_user_view.cshtml
      :language: html


.. _Stormpath .NET SDK: https://docs.stormpath.com/csharp/product-guide/latest/
