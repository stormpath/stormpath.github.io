.. _setup:


Quickstart
==========

This section walks you through adding Stormpath to a new |framework| project. By the end of this short tutorial you'll have working login and registration features added to your application!


Create a Stormpath account
--------------------------

If you haven't already, the first thing you'll want to do is `create a new Stormpath account <https://api.stormpath.com/register>`_.


Create an API Key pair
----------------------

Once you've created a new account, you need to create an API key pair. These are your credentials for the Stormpath API. A new API key pair is easily created by logging into your dashboard and clicking the "Create an API Key" button. This will generate a new key pair for you, and prompt you to download the key pair as a file.

.. note::
    Please keep the API key file safe!  This key and secret
    allows you to make Stormpath API requests, and should be properly protected.

We recommend storing your API credentials in local environment variables. Once you've downloaded your ``apiKey.properties`` file, open it in your favorite text editor, and find the **API Key ID** and **API Key Secret** values.

In a bash-like shell, you can set environment variables by running these commands:

.. code-block:: bash

    export STORMPATH_CLIENT_APIKEY_ID=your_id_here
    export STORMPATH_CLIENT_APIKEY_SECRET=your_secret_here

On Windows, the commands are:

.. code-block:: powershell

    setx STORMPATH_CLIENT_APIKEY_ID your_id_here
    setx STORMPATH_CLIENT_APIKEY_SECRET your_secret_here

.. tip::

  You can also load your credentials straight from the ``apiKey.properties`` file, or include them in your project code. See the :ref:`configuration` section for more information.


Find your Stormpath Application
-------------------------------

To get you up and running quickly, all new Stormpath Tenants come with a Stormpath Application called "My Application". You'll generally want one application per project, and we can use this default application to get started.

.. note::
  To learn more about Stormpath Applications, please see the
  `Application Resource`_ section of our REST API documentation.

Every Stormpath Application has unique URL, which looks something like this:

.. code-block:: none

    https://api.stormpath.com/v1/applications/l0ngr4nd0mstr1ngh3r3

From inside the `Admin Console`_, you can find the URL (also called the REST URL or href) by navigating to the "My Application" item in the Applications list.

We recommend saving this URL as an environment variable as well:

.. code-block:: bash

    export STORMPATH_APPLICATION_HREF=your_app_href

Or, on Windows:

.. code-block:: powershell

    setx STORMPATH_APPLICATION_HREF your_app_href


Now that your API credentials and Stormpath Application are set, you're ready to plug Stormpath into your project!


Example projects
----------------

If you're feeling lazy (as all good programmers should!), you can download one of our example projects to get up and running super fast:

- `ASP.NET Core 1.0 MVC Example Project`_
- `ASP.NET MVC 5 Example Project`_

.. todo::
  Add Nancy example project when available


Create a new project
--------------------

If you are adding Stormpath to an existing application, skip to the next section!

.. only:: aspnetcore

  Creating a New Project in Visual Studio
  '''''''''''''''''''''''''''''''''''''''

  1. Click on **File - New Project**.
  2. Under **Visual C# - .NET Core**, pick the **ASP.NET Core Web Application (.NET Core)** template.
  3. In the New ASP.NET Core Project dialog, pick the **Web Application** template.
  4. Click **Change Authentication** and pick **No Authentication**. (You'll be adding it yourself!)

  Creating a New Project Without Visual Studio
  ''''''''''''''''''''''''''''''''''''''''''''

  If you're on Mac or Linux, or just prefer the command line, you can use the `ASP.NET Yeoman Generator`_ to scaffold a new project:

  1. Run ``yo aspnet``.
  2. Pick the **Web Application Basic [without Membership and Authorization]** template. Done!

.. only:: aspnet

  First, create a new project using the ASP.NET template in Visual Studio:

  1. Click on **File - New Project**.
  2. Under **Visual C# - Web**, pick the **ASP.NET Web Application** template.
  3. In the New ASP.NET Project dialog, pick the **MVC** or **Web API** template.
  4. Click **Change Authentication** and pick **No Authentication**. (You'll be adding it yourself!)

.. only:: nancy

  .. todo::
    Add instructions


Install the library
-------------------

.. only:: aspnetcore

  The ``Stormpath.AspNetCore`` package comes with everything you need to plug Stormpath into an ASP.NET Core project.

.. only:: aspnet

  The ``Stormpath.AspNet`` package comes with everything you need to plug Stormpath into an ASP.NET project.

.. only:: nancy

  .. todo::
    Add blurb.

It includes the `Stormpath .NET SDK`_, the Stormpath OWIN middleware, and pre-rendered views that work out of the box.

The package can be installed with the NuGet Package Manager interface, or using the Package Manager Console in Visual Studio:

.. only:: aspnetcore

  .. code-block:: none

    PM> install-package Stormpath.AspNetCore

  .. todo::

    Include Linux-friendly instructions.

.. only:: aspnet

  .. code-block:: none

    PM> install-package Stormpath.AspNet

  .. note::

    Older versions of NuGet might fail to install the package. If you get an error, make sure `NuGet is up to date <https://docs.nuget.org/consume/installing-nuget#updating-nuget-in-visual-studio>`_.

.. only:: aspnetcore

  If you aren't using Visual Studio, simply edit the ``project.json`` file and add this line to the ``dependencies`` section::

    "dependencies": {
      "Stormpath.AspNetCore": "*"
    }

  Then, run ``dotnet restore`` to download and install the package.

.. only:: nancy

  .. code-block:: none

    PM> install-package Stormpath.Nancy


Initialize the middleware
----------------------------

.. only:: aspnetcore

  Once the package is installed, you need to add it to your application in ``Startup.cs``. First, add the required services in ``ConfigureServices()``:

  .. literalinclude:: code/quickstart/aspnetcore/configure_services.cs
      :language: csharp

  Next, add Stormpath to your middleware pipeline in ``Configure()``:

  .. literalinclude:: code/quickstart/aspnetcore/configure.cs
      :language: csharp

  .. note:: It's important that the Stormpath middleware is added **before** any middleware that needs to be protected, such as MVC!

.. only:: aspnet

  Once the package is installed, you need to add it to your OWIN startup class (usually called ``Startup.cs``).

  .. tip::

    If you don't have a ``Startup.cs`` file, right-click on your project and select **Add - OWIN Startup class**. If this option doesn't appear for you, or you see OWIN errors when your application starts, see the `OWIN Startup Class documentation <http://www.asp.net/aspnet/overview/owin-and-katana/owin-startup-class-detection>`_.

  .. literalinclude:: code/quickstart/aspnet/startup.cs
    :language: csharp

.. only:: nancy

  .. todo::
    Add steps

  .. note:: It's important that the Stormpath middleware is added **before** any middleware that needs to be protected, such as <todo>!


With this minimal configuration, the library will do the following:

- Look for Stormpath API credentials and Application URL in your local environment variables.

- Discover your Stormpath Application and its configuration and account stores.

- Attach the :ref:`default_features` to your application, such as the
  login and registration routes.

That's it, you're ready to go! Compile and run your project, and try navigating to these URLs:

.. only:: aspnetcore

  - http://localhost:5000/login
  - http://localhost:5000/register

.. only:: aspnet

  - http://localhost:50000/login
  - http://localhost:50000/register

.. only:: nancy

  .. todo::
    Add info

.. only:: aspnetcore

  .. note::
    Your port number may differ. To find the port assigned to your project, right-click on the project in the Solution Explorer and choose **Properties**. Switch to the **Debug** tab and check the URL listed under **Web Server Settings - App URL**.

.. only:: aspnet

  .. note::
    Your port number will differ. To find the port assigned to your project, right-click on the project in the Solution Explorer and choose **Properties**. Switch to the **Web** tab and check the URL listed in **Servers - Project Url**.

You should be able to register for an account and log in. The newly created
account will be placed in the directory that is mapped to "My Application".

.. note::

    By default, we don't require email verification for new accounts, but we
    highly recommend you use this workflow. See the :ref:`email_verification` section for details.

There are many more features beyond basic login and registration. You can jump to any of the features using the sidebar menu on the left, or continue to the next section to learn how to configure the library.


.. _Admin Console: https://api.stormpath.com/login
.. _Application Resource: https://docs.stormpath.com/rest/product-guide/latest/reference.html#application
.. _Directory Resource: https://docs.stormpath.com/rest/product-guide/latest/reference.html#directory
.. _ASP.NET Yeoman Generator: https://github.com/OmniSharp/generator-aspnet
.. _Modeling Your User Base: https://docs.stormpath.com/rest/product-guide/latest/accnt_mgmt.html#modeling-your-user-base
.. _ASP.NET Core 1.0 MVC Example Project: https://github.com/stormpath/stormpath-aspnetcore-example
.. _ASP.NET MVC 5 Example Project: https://github.com/stormpath/stormpath-aspnet-example
.. _Stormpath .NET SDK: https://github.com/stormpath/stormpath-sdk-dotnet
