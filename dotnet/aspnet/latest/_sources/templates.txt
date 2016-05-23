.. _templates:


View Templates
==============

This library includes built-in views that are rendered automatically for HTML requests. You can use these views as-is, customize them via configuration, or replace them with custom views.


Default Views
-------------

By default, this library will use pre-built views for the following routes:

* Login Page (``/login``)
* Registration Page (``/register``)
* Forgot Password Page (``/forgot``)
* Change Password Page (``/change``)
* Email Verifiation Page (``/verify``)

In the case of the the :ref:`Registration <register_customizing_form>` and :ref:`Login <login_customizing_form>` routes, the forms fields can be customized simply by changing their configuration.


.. _templates_custom_views:

Custom Views
------------

If you want full control over the look and feel of the view, you can set a route's ``view`` option to the name of (or the path to) a Razor view available in your project.

For example, to use a custom view for the login route, use this configuration (shown as YAML):

.. code-block:: yaml

  web:
    login:
      view: "~/Views/Login/MyLogin.cshtml"

You could also set this configuration via code:

.. only:: aspnetcore

  .. literalinclude:: code/templates/aspnetcore/custom_view.cs
    :language: csharp

.. only:: aspnet

  .. literalinclude:: code/templates/aspnet/custom_view.cs
    :language: csharp

  .. warning::
    This feature is not yet available in ASP.NET 4.x Please subscribe to `this Github issue <https://github.com/stormpath/stormpath-aspnet/issues/1>`_ to be notified when it is available.

.. only:: nancy

  .. .literalinclude:: code/templates/nancy/custom_view.cs
    :language: csharp

Feel free to copy and modify our `pre-built view templates`_, and use them as a starting point!

.. todo::
  Update this section when it's possible to simply update the included Razor files.


View Models
...........

Each route has a view model class defined in the ``Stormpath.Owin.Abstractions.ViewModel`` namespace. If you are supplying your own views, use these models:

+--------------------------------------------+---------------------------------------------------------------------+
| **Route**                                  | **View Model**                                                      |
+--------------------------------------------+---------------------------------------------------------------------+
| :ref:`login`                               | ``Stormpath.Owin.Abstractions.ViewModel.ExtendedLoginViewModel``    |
+--------------------------------------------+---------------------------------------------------------------------+
| :ref:`registration`                        | ``Stormpath.Owin.Abstractions.ViewModel.ExtendedRegisterViewModel`` |
+--------------------------------------------+---------------------------------------------------------------------+
| :ref:`Forgot Password <password_reset>`    | ``Stormpath.Owin.Abstractions.ViewModel.ForgotPasswordViewModel``   |
+--------------------------------------------+---------------------------------------------------------------------+
| :ref:`Change Password <password_reset>`    | ``Stormpath.Owin.Abstractions.ViewModel.ChangePasswordViewModel``   |
+--------------------------------------------+---------------------------------------------------------------------+
| :ref:`email_verification`                  | ``Stormpath.Owin.Abstractions.ViewModel.VerifyEmailViewModel``      |
+--------------------------------------------+---------------------------------------------------------------------+

.. _pre-built view templates: https://github.com/stormpath/stormpath-dotnet-owin-middleware/tree/master/src/Stormpath.Owin.Views
