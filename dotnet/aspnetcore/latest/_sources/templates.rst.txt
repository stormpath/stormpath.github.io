.. _templates:


View templates
==============

This library includes built-in views that are rendered automatically for HTML requests. You can use these views as-is, customize them via configuration, or replace them with custom views.


Default views
-------------

By default, this library will use pre-built views for the following routes:

* Login Page (``/login``)
* Registration Page (``/register``)
* Forgot Password Page (``/forgot``)
* Change Password Page (``/change``)
* Email Verifiation Page (``/verify``)

In the case of the the :ref:`Registration <register_customizing_form>` and :ref:`Login <login_customizing_form>` routes, the form fields can be customized simply by changing their configuration, no view code required!


.. _templates_custom_views:

Custom views
------------

If you want full control over the look and feel of the view, you can set a route's ``view`` option to the name of (or the path to) a Razor view available in your project:

* If you supply a **view name**, Razor will attempt to load ``~/Views/Stormpath/[viewname].cshtml``.
* If you supply a fully-qualified path starting with ``~/``, that view will be loaded.

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

.. only:: nancy

  .. .literalinclude:: code/templates/nancy/custom_view.cs
    :language: csharp

Feel free to copy and modify our `pre-built view templates`_, and use them as a starting point!

.. todo::
  Update this section when it's possible to simply update the included Razor files.


View models
...........

Each route has a view model class defined in the ``Stormpath.Owin.Abstractions.ViewModel`` namespace. If you are supplying your own views, use these models:

+--------------------------------------------+-----------------------------------------------------------------------+
| **Route**                                  | **View Model**                                                        |
+--------------------------------------------+-----------------------------------------------------------------------+
| :ref:`login`                               | ``Stormpath.Owin.Abstractions.ViewModel.LoginFormViewModel``          |
+--------------------------------------------+-----------------------------------------------------------------------+
| :ref:`registration`                        | ``Stormpath.Owin.Abstractions.ViewModel.RegisterFormViewModel``       |
+--------------------------------------------+-----------------------------------------------------------------------+
| :ref:`Forgot Password <password_reset>`    | ``Stormpath.Owin.Abstractions.ViewModel.ForgotPasswordFormViewModel`` |
+--------------------------------------------+-----------------------------------------------------------------------+
| :ref:`Change Password <password_reset>`    | ``Stormpath.Owin.Abstractions.ViewModel.ChangePasswordFormViewModel`` |
+--------------------------------------------+-----------------------------------------------------------------------+
| :ref:`email_verification`                  | ``Stormpath.Owin.Abstractions.ViewModel.VerifyEmailFormViewModel``    |
+--------------------------------------------+-----------------------------------------------------------------------+

.. _pre-built view templates: https://github.com/stormpath/stormpath-dotnet-owin-middleware/tree/master/src/Stormpath.Owin.Views
