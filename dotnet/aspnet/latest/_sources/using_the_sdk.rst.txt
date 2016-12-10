.. _using_the_sdk:

Using the Stormpath SDK
=======================

The Stormpath |framework| library uses the low-level `Stormpath .NET SDK`_ to communicate with the Stormpath API.

If you need to send your own requests to Stormpath through code, you can use the Stormpath Client reference available in the :ref:`request context <request_context>`. This allows you use access the Stormpath SDK and easily build custom functionality beyond what is provided in the Stormpath |framework| library.

.. note::

  For information on using the Stormpath .NET SDK, check out the `C# documentation`_ or `Visual Basic documentation`_.

Tasks and Cancellation
''''''''''''''''''''''

Every method in the Stormpath SDK that makes a network call returns a ``Task`` and is fully awaitable. Each method also has an optional overload that accepts a ``CancellationToken``, if you need to support request cancellation.

Making synchronous calls
''''''''''''''''''''''''

We recommend interacting with the API asynchronously, but if your application isn't ready to be fully async, the SDK supports synchronous calls as well.

Simply import the ``Stormpath.SDK.Sync`` namespace at the top of your code file, and you'll see a new non-asynchronous counterpart method for each asynchronous one. For example, instead of calling ``await account.SaveAsync()``, you can simply call ``account.Save()``.

For more details, see the `SDK documentation <https://docs.stormpath.com/csharp/product-guide/latest/quickstart.html#asynchronous-and-synchronous-support>`_.

Examples
''''''''

Search for an account by email address
......................................

Given an ``IClient`` or ``IApplication`` object, you could search for user accounts by email address:

.. only:: aspnetcore

  .. literalinclude:: code/request_context/aspnetcore/injecting_application.cs
    :language: csharp

.. only:: aspnet

  .. literalinclude:: code/request_context/aspnet/injecting_application.cs
    :language: csharp

.. only:: nancy

  .. .literalinclude:: code/request_context/nancy/injecting_application.cs
    :language: csharp


Update a user's password
........................

Given an ``IAccount`` object, it's easy to update details such as the user's password:

.. only:: aspnetcore

  .. literalinclude:: code/request_context/aspnetcore/update_user_password.cs
      :language: csharp

.. only:: aspnet

  .. literalinclude:: code/request_context/aspnet/update_user_password.cs
      :language: csharp

.. only:: nancy

  .. .literalinclude:: code/request_context/nancy/update_user_password.cs
      :language: csharp


.. _Stormpath .NET SDK: https://github.com/stormpath/stormpath-sdk-dotnet
.. _Stormpath .NET API documentation: http://docs.stormpath.com/dotnet/api/
.. _C# documentation: https://docs.stormpath.com/csharp/product-guide/latest/
.. _Visual Basic documentation: https://docs.stormpath.com/vbnet/product-guide/latest/
