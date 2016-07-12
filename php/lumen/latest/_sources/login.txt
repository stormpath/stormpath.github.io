.. _login:


Login
=====

Login is enabled out of the box for this package.  By default the login page
will be available at this URL:

http://localhost:8000/login

If the login attempt is successful, we will send the user to the Next URI
and create the proper session cookies.


Next URI
--------

A ``GET`` request to ``/login`` will provide you with the login form model.  This can be used
directly in your application to render a form with all required fields.

Posting to ``/login`` will handle all login needs and if successful, will return with
access and refresh tokens in the cookies.

If you wish to change this, use the ``nextUri`` config option in ``config/stormpath.php``::

    web:
      login:
        enabled: true
        uri: "/login"
        nextUri: "/"


.. _Stormpath Admin Console: https://api.stormpath.com