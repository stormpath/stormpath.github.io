.. _id_site:

ID Site
=======

Stormpath ID Site is a hosted login portal that provides login, registration, and password reset functionality outside of your application. ID Site is hosted transparently on Stormpath's infrastructure and redirects back to your application with an authentication assertion token.

Who should use ID Site?
-----------------------

For most applications, the default login functionality provided by the Stormpath |framework| middleware is sufficient. However, you should use ID Site if you need:

* A **single sign-on** experience between multiple applications and/or
* A single, **shared login portal** for multiple applications


How does it work?
-----------------

If ID Site is :ref:`enabled <enable_id_site>`:

#. The default routes (``/login``, ``/register``, etc.) will automatically redirect to your hosted ID Site URL. By default, this URL is on a Stormpath domain, but you can customize it to something like ``https://login.example.com``.
#. The user will interact with ID Site to log in or register. The look and feel of the portal can be customized to match your site and branding.
#. Once the user has registered or logged in, they'll be redirected back to a callback route in your application. This callback is handled by the Stormpath middleware code automatically.
#. At this point, the user is treated exactly as if they had been logged in through the default :ref:`Login` route.

By default, ID site looks like this:

.. image:: /_static/images/id-site-login.png


.. _enable_id_site:

Enabling ID Site
................

First, log into the `Stormpath Admin Console`_ and click on the ID Site tab to view the ID Site server configuration. Edit the **Authorized Redirect URLs** field and add the full URL to the ``/stormpathCallback`` route on your application. For example:

* ``https://www.example.com/stormpathCallback`` or
* ``http://localhost:8080/stormpathCallback`` (if testing locally)

Make sure the address and port match your project settings.

Next, enable ID Site in your application's Stormpath middleware configuration. This can be done via any of the configuration methods described in the :ref:`Configuration` section. The easiest way is to enable it via code in ``Startup.cs``:

.. only:: aspnet

  .. literalinclude:: code/id_site/aspnet/enable_idsite.cs
      :language: csharp

.. only:: aspnetcore

  .. literalinclude:: code/id_site/aspnetcore/enable_idsite.cs
      :language: csharp

.. only:: nancy

  .. .literalinclude:: code/id_site/nancy/enable_idsite.cs
      :language: csharp

Setting this property will automatically cause the Stormpath middleware to redirect to ID Site for the appropriate routes, and ensures that the ``/stormpathCallback`` route is enabled.

That's it! Your application will now use ID Site for login, registration, and password reset.

.. note::

  For more information about how to use and customize the ID site, see the `ID Site documentation`_.


.. _Stormpath Admin Console: https://api.stormpath.com
.. _ID Site documentation: http://docs.stormpath.com/guides/using-id-site/
