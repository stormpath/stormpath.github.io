.. _client-config:

***********************
Configuring Your Client
***********************

Overview
--------

Angular
-------

For an Angular application, the relevant configuration is found in ``app.js``. Add the following line to the ``config`` function:

``STORMPATH_CONFIG.ENDPOINT_PREFIX = 'https://{DNS-LABEL}.apps.stormpath.io';``

Android
-------

For an Android application, in your Application class, change the ``.baseUrl`` in the ``onCreate`` method:

.. code-block:: java

  StormpathConfiguration stormpathConfiguration = new StormpathConfiguration.Builder()
          .baseUrl("https://{DNS-LABEL}.apps.stormpath.io")
          .build();
  Stormpath.init(this, stormpathConfiguration);

iOS
---

For a Swift-based iOS application, in ``AppDelegate.swift``, under ``application(application:didFinishLaunchingWithOptions:)``, change the ``APIURL``:

``Stormpath.sharedSession.configuration.APIURL = URL(string: "https://{DNS-LABEL}.apps.stormpath.io")!``

React
-----

For a React application, the URL is passed as part of the ``ReactStormpath.init();`` call:

.. code-block:: none

  ReactStormpath.init({
    endpoints: {
      baseUri: `https://{DNS-LABEL}.apps.stormpath.io`
    }
  });