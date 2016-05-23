.. _stormpath_objects:

Request Objects
===============

When the Stormpath middleware is added to your |framework| application pipeline,
these types will be available for each request:

* Stormpath Client (``IClient``)
* Stormpath Application (``IApplication``)
* Current user's Stormpath Account (``IAccount``)

.. only:: aspnetcore

  This library uses the built-in dependency injection mechanism in ASP.NET Core to provide these types.

  You can request any of these objects from the container using the ``[FromServices]`` attribute:

  .. literalinclude:: code/request_objects/aspnetcore/controller_fromservices.cs
      :language: csharp

  Or, if you prefer, you can use constructor injection:

  .. literalinclude:: code/request_objects/aspnetcore/controller_injection.cs
      :language: csharp

.. only:: aspnet

  In any MVC action or Web API route, you can use the ``GetStormpath`` extension methods on the ``Request`` object to retrieve these types:

  .. literalinclude:: code/request_objects/aspnet/extension_methods.cs
    :language: csharp

.. only:: nancy

  .. todo::
    Add detail here.

  .. .literalinclude:: code/request_objects/nancy/extension_methods.cs
    :language: csharp

Stormpath Client
----------------

The ``IClient`` type is the starting point of the `Stormpath .NET SDK`_. You can use it to perform any action against the Stormpath API.

.. note::
  For more information about the Client object, see the `Stormpath .NET API documentation`_.

.. todo::
  Update this link to the One Product Guide when done.


Stormpath Application
---------------------

The ``IApplication`` type is a .NET representation of the Stormpath Application resource associated with your |framework| application. You can use this object to perform actions like creating and searching for user accounts programmatically.

For example, to search for an account by email address:

.. only:: aspnetcore

  .. literalinclude:: code/request_objects/aspnetcore/injecting_application.cs
    :language: csharp

.. only:: aspnet

  .. literalinclude:: code/request_objects/aspnet/injecting_application.cs
    :language: csharp

.. only:: aspnetcore

  .. .literalinclude:: code/request_objects/nancy/injecting_application.cs
    :language: csharp

.. note::

  This type is provided by the `Stormpath .NET SDK`_. See the `Stormpath .NET API documentation`_ for a complete reference.

.. todo::
  Update this link to the One Product Guide when done.


Current User Account
--------------------

This library automatically checks incoming requests for authentication information, and resolves the user's identity to a Stormpath Account if the information is valid. This happens on **every** request, not just routes that require authentication.

.. tip::
  If you want to *require* authentication for a route or action, see the :ref:`authentication` section.

.. only:: aspnet or aspnetcore

  A subset of the user's Stormpath Account details are automatically placed in the ``IIdentity`` object for the request. This makes it possible to quickly do things like update a view if the user is logged in:

  .. only:: aspnetcore

    .. literalinclude:: code/request_objects/aspnetcore/user_iprincipal.cshtml
      :language: html

  .. only:: aspnet

    .. literalinclude:: code/request_objects/aspnet/user_iprincipal.cshtml
      :language: html

  On each request, ``User.Identity`` is set to a ``ClaimsIdentity`` instance with these claims:

  * ``ClaimTypes.NameIdentifier`` (Stormpath Account href)
  * ``ClaimTypes.Email``
  * ``ClaimTypes.Name`` (Stormpath username, usually the same as email)
  * ``ClaimTypes.GivenName``
  * ``ClaimTypes.Surname``

.. only:: aspnetcore

  If you want full access to the Stormpath ``IAccount`` object, inject a ``Lazy<IAccount>`` in your controller.

  If the request is unauthenticated, the lazy value will resolve to ``null``. If the request represents a valid user, you'll get an ``IAccount`` instance representing the user's Stormpath Account.

.. only:: aspnet

  If you want full access to the Stormpath ``IAccount`` object, use the ``GetStormpathAccount()`` method in your MVC or Web API controller.

  If the request is unauthenticated, the value will be ``null``. If the request represents a valid user, you'll get an ``IAccount`` instance representing the user's Stormpath Account.

.. only:: nancy

  .. todo::
    Add description

To update the user's password, for example:

.. only:: aspnetcore

  .. literalinclude:: code/request_objects/aspnetcore/update_user_password.cs
      :language: csharp

.. only:: aspnet

  .. literalinclude:: code/request_objects/aspnet/update_user_password.cs
      :language: csharp

.. only:: nancy

  .. .literalinclude:: code/request_objects/nancy/update_user_password.cs
      :language: csharp

.. only:: aspnetcore

  .. tip::
    If your controller or action will *always* be authenticated (see the :ref:`authentication` section), you can drop the wrapper and inject ``IAccount`` directly. Don't do this on routes that can be accessed anonymously!

  You can also use the ``@inject`` directive to do the same injection directly in your views:

  .. literalinclude:: code/request_objects/aspnetcore/injecting_user_view.cshtml
      :language: html


Working with the Stormpath API
------------------------------

By accessing one of the available types (``IClient``, ``IApplication``, or ``IAccount``), you can use the `Stormpath .NET SDK`_ to interact with the Stormpath API. This allows you to easily build custom functionality beyond what is provided in the Stormpath |framework| library.

For information on using the Stormpath .NET SDK, check out the `Stormpath .NET API documentation`_.

.. todo::
  Update to One Product Guide when it's ready.

Tasks and Cancellation
''''''''''''''''''''''

Every method in the Stormpath .NET SDK that makes a network call returns a ``Task`` and is fully awaitable. Each method also has an optional overload that accepts a ``CancellationToken``, if you need to support request cancellation.

Making Synchronous Calls
''''''''''''''''''''''''

We recommend interacting with the SDK asynchronously, but if your application isn't ready to be fully async, the SDK supports synchronous calls as well.

Simply import the ``Stormpath.SDK.Sync`` namespace at the top of your code file, and you'll see a new non-asynchronous counterpart method for each asynchronous one. For example, instead of calling ``await account.SaveAsync()``, you can simply call ``account.Save()``.

.. todo::
  Link to OPG section on sync here when it's ready.


.. _Stormpath .NET SDK: https://github.com/stormpath/stormpath-sdk-dotnet
.. _Stormpath .NET API documentation: http://docs.stormpath.com/dotnet/api/
