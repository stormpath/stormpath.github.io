.. _cors:

Cross-Origin Requests
=====================

`Cross-Origin Resource Sharing`_ (CORS) support on both the client and server is neccessary when your client and server are on different domains. For example, a single-page application running on ``mydomain.com`` but communicating to an API on ``api.mydomain.com`` will require CORS to be configured.

The Stormpath |framework| library works with existing CORS solutions for |framework|, provided that the middleware pipeline is configured properly.

Configuring the Pipeline
------------------------

.. note::
  In order to enable CORS support for the responses sent by the Stormpath middleware, the CORS middleware must be added to the pipeline **before** the Stormpath middleware.

.. only:: aspnetcore

  The ``Microsoft.AspNetCore.Cors`` package provides a simple middleware component that can be added to your application pipeline in ``Startup.cs``.

  First, add the services needed for CORS in ``ConfigureServices``:

  .. literalinclude:: code/cors/aspnetcore/configure_services.cs
    :language: csharp

  Then, add CORS to your pipeline in ``Configure``:

  .. literalinclude:: code/cors/aspnetcore/configure.cs
    :language: csharp

.. only:: aspnet

  The ``Microsoft.Owin.Cors`` package provides a simple middleware component that can be added to your application pipeline in ``Startup.cs``:

  .. literalinclude:: code/cors/aspnet/configure.cs
    :language: csharp

  If you have trouble with this configuration, make sure CORS is not being handled separately by MVC or Web API, or by IIS. The ``handlers`` section of ``system.webServer`` in ``web.config`` should include this item:

  .. code-block:: xml

    <remove name="OPTIONSVerbHandler" />

.. only:: nancy

  .. todo::

    Nancy stuff.





.. _Cross-Origin Resource Sharing: https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
