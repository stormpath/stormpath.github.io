.. _help:


Troubleshooting
===============

If you run into problems while using this library, there are a few things you can do.

.. only:: aspnetcore

  Logging
  -------

  ``Stormpath.AspNetCore`` uses the ASP.NET logging system to expose debug and trace logs. By inspecting the logs (using ``AddConsole``, or another log viewer), you can follow what the Stormpath middleware is doing behind the scenes and see any exceptions that are thrown.

.. only:: aspnet

  .. todo::

    Add logging info

.. only:: nancy

  .. todo::

    Nancy.

Inspecting Traffic
------------------

Using a web debugging proxy like `Fiddler`_ or `Charles`_ will allow you to inspect the traffic between the Stormpath SDK and the Stormpath REST API. This can be helpful when troubleshooting communication problems.

Getting Help
------------

Have a question you can't find an answer to?  Things not working as expected?
We can help!

All of the official Stormpath libraries (including this one) are
officially supported by Stormpath's incredibly amazing-and-helpful support team!

If you have a question, or need in-depth technical help, you can drop us an
email anytime: support@stormpath.com

If you visit our website (https://stormpath.com/), you can also click the "Chat
with us!" button near the bottom right of the page to chat with us live, in
real-time!

.. _Fiddler: http://www.telerik.com/fiddler
.. _Charles: http://www.charlesproxy.com/
