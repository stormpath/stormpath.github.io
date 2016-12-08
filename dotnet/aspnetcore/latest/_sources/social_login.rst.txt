.. _social_login:

Social Login
============

Do you want users to authenticate with a social provider, such as Facebook?
Stormpath provides integrations with the following services:

* :ref:`Facebook Login <facebook_login>`
* :ref:`Google Login <google_login>`
* :ref:`Github Login <github_login>`
* :ref:`LinkedIn Login <linkedin_login>`


Overview
--------

Setting up social login in your Stormpath-powered application is easy. Follow the steps in the appropriate section below to set up the external provider and configure a Social Directory in the `Stormpath Admin Console`_. Then, map the new Social Directory to your existing Stormpath Application.

Once the Social Directory is mapped, your |framework| application is ready to go! If you are using the included :ref:`default views <templates>`, the appropriate buttons will appear on the :ref:`login route <login>` automatically.

When users log into your application with a social provider, they will be redirected to one of two locations:

* If the user has never logged in before (a new account), they will be redirected to the location set of the ``nextUri`` option in the :ref:`registration route configuration <registration_configuration>`.
* If the user is a returning account, they will be redirected to the location set in the ``nextUri`` option of the :ref:`login route configuration <login_configuration>`.


.. _facebook_login:

Setting up Facebook Login
-------------------------

To use Facebook Login with your |framework| application, you simply need to:

1. Create a Facebook Application through the `Facebook Developer Site`_ .
2. Configure a Stormpath Directory with the Facebook Application credentials.


Create a Facebook Application
.............................

First, log into the `Facebook Developer Site`_ and
create a new Facebook App. You can do this by clicking the "My Apps" menu at the top of the screen, and then clicking on the "Add a New App" button.  You should see something like the following:

.. image:: /_static/images/facebook-new-project.png

Enter a "Display Name" (the name of your app), and choose a
category for your app.  Once you've done this, click the "Create App ID" button.

Next, click on Settings on the left side, and make note of the **App ID** and **App Secret**. You'll need those later when you connect your Facebook Application to Stormpath.


Specify Allowed URLs
....................

The next step is to tell Facebook what URLs we'll be using Facebook
Login from.

From the Settings page, click the "Add Platform" button. When prompted, select "Website" as your platform type.

In the "Site URL" box, enter your private and public root URLs.  This should be
something like ``http://localhost:5000`` or ``http://mysite.com``.  If you
want to allow Facebook Login from multiple URLs (local development, production,
etc.) you can just click the "Add Platform" button again and enter another URL.

Click the "Save Changes" button at the bottom of the page.

Next, click on "Add Product" on the left side of the page, and add Facebook Login. In the "Valid OAuth redirect URIs" field, add the callback URI provided by this library, which is ``/callbacks/facebook`` by default. If your site is hosted locally on port 5000, your callback URI is ``http://localhost:5000/callbacks/facebook``.

Your configuration should look something like this:

.. image:: /_static/images/facebook-url-settings.png

Lastly, click the "Save Changes" button once more to save the changes.


Create a Facebook Directory
...........................

Now that you've created a Facebook Application, you need to create a Stormpath Directory that contains the Facebook Application credentials. This allows Stormpath to interact with the Facebook API on your |framework| application's behalf.

To do this, visit the `Stormpath Admin Console`_ and click on Directories in the navigation bar. Click "Create Directory" and choose Facebook as the Directory type. Next, enter the following information:

- **Name**: Any descriptive name for the Directory.
- **Facebook Client ID**: Insert your Facebook App ID from the previous steps.
- **Facebook Client Secret**: Insert your Facebook App Secret.

Your Directory configuration should look like this:

.. image:: /_static/images/facebook-social-directory.png

Click "Create" to finish creating the Directory.


Mapping the Directory
.....................

The new Facebook Directory needs to be associated (mapped) to your existing Application as an Account Store. This can also be done from the `Stormpath Admin Console`_.

To do this, click on Applications in the navigation bar, and select your Application from the list. On the details page, click on Account Stores on the left side. Next, click "Add Account Store" and pick the Facebook Directory you created. Click "Create Mappings".

That's it!


Testing Facebook Login
......................

Now that you've connected your Facebook Application to Stormpath, you're ready to test your |framework| application.

Restart |framework| (if it's running) and try visiting the login page (``/login``) in your browser. If you're using the default views included with this library, you should see the following:

.. image:: /_static/images/login-page-facebook.png

Try logging in! When you click the Facebook button you'll be prompted to authorize the application using your Facebook account:

.. image:: /_static/images/login-page-facebook-permissions.png

After authorizing, you'll be redirected back to your website. If you've never logged into this application with Facebook before, you'll be redirected to the ``nextUri`` set in the :ref:`registration route configuration <registration_configuration>`. If you have logged into this application with Facebook before, you'll be redirected to the ``nextUri`` set in the :ref:`login route configuration <login_configuration>`.


.. _github_login:

Setting up Github Login
-------------------------

To use Github Login with your |framework| application, you simply need to:

1. Create a Github Application on Github.
2. Configure a Stormpath Directory with the Github Application credentials.


Create a Github Application
...........................

First, log into Github and navigate to `Developer applications`_ and click on "Register a new application". You should see something like the following:

.. image:: /_static/images/github-new-application.png

Fill out the fields on the form:

- **Application name**: The name of your application.
- **Homepage URL**: The base URL of your application.
- **Application description**: A basic description of your application.
- **Authorization callback URL**: By default, this library hosts a callback route at ``/callbacks/github``. For example, if your application is running locally on port 5000, your callback URL would be ``http://localhost:5000/callbacks/github``.

Click "Register application" to finish creating the new application. Make a note of the **Client ID** and **Client Secret**. You'll need those in the next step.


Create a Github Directory
.........................

Now that you’ve created a Github Application, you need to create a Stormpath Directory that contains the Github Application credentials. This allows Stormpath to interact with the Github API on your |framework| application’s behalf.

To do this, visit the `Stormpath Admin Console`_ and click on Directories in the navigation bar. Click “Create Directory” and choose Github as the Directory type. Next, enter the following information:

- **Name**: Any descriptive name for the Directory.
- **Github Client ID**: Insert your Github Client ID from the previous step.
- **Github Client Secret**: Insert your Github Client Secret.

Your Directory configuration should look like this:

  .. image:: /_static/images/github-social-directory.png

Finally, click "Create Directory" to add the Directory to Stormpath.


Mapping the Directory
.....................

The new Github Directory needs to be associated (mapped) to your existing Application as an Account Store. This can also be done from the `Stormpath Admin Console`_.

To do this, click on Applications in the navigation bar, and select your Application from the list. On the details page, click on Account Stores on the left side. Next, click “Add Account Store” and pick the new Facebook Directory you created. Click “Create Mappings”.


Configuring Your Server URI
...........................

The Stormpath |framework| package requires one more bit of configuration to enable Github Login from your application. The ``stormpath.web.serverUri`` property needs to contain the base URL of your web server.

You can configure this using a :ref:`YAML or JSON file <config_markup>`. For example, in YAML:

.. code-block:: yaml

  ---
  stormpath:
    web:
     serverUri: http://localhost:5000

Alternatively, you can set this property in code when you configure the Stormpath middleware:

.. only:: aspnetcore

  .. literalinclude:: code/configuration/aspnetcore/server_uri.cs
    :language: csharp

.. only:: aspnet

  .. literalinclude:: code/configuration/aspnet/server_uri.cs
    :language: csharp

.. only:: nancy

  .. .literalinclude:: code/configuration/nancy/anonymous_inline_config.cs
    :language: csharp

.. note::

  For more information on configuration, see the :ref:`configuration` section.


That's it!


Testing Github Login
......................

Now that you’ve connected your Github Application to Stormpath, you’re ready to test your |framework| application.

Restart |framework| (if it’s running) and try visiting the login page (``/login``) in your browser. If you’re using the default views included with this library, you should see the following:

.. image:: /_static/images/login-page-github.png

Try logging in!  When you click the Github button you'll be redirected to Github, and prompted to authenticate your Github account:

.. image:: /_static/images/github-permissions-page.png

You'll then be prompted to accept any requested permissions. After authorizing, you'll be redirected back to your website. If you've never logged into this application with Github before, you'll be redirected to the ``nextUri`` set in the :ref:`registration route configuration <registration_configuration>`. If you have logged into this application with Github before, you'll be redirected to the ``nextUri`` set in the :ref:`login route configuration <login_configuration>`.


.. _google_login:

Setting up Google Login
-----------------------

To use Google Login with your |framework| application, you simply need to:

1. Create a Google Application in the `Google Developer Console`_.
2. Configure a Stormpath Directory with the Google Application credentials.


Create a Google Project
.......................

First, log into the `Google Developer Console`_ and create a new Google Project. When you click on "Create Project", you should see this:

.. image:: /_static/images/google-new-project.png

Pick a "Project Name" (usually the name of your app), and optionally a "Project ID".


Enable Google Login
...................

In order to use Google Login with the new Project you created, you have to enable the Google+ API.

To do this, click on the Project and select "APIs & Auth" on the side panel. Scroll through the API until you see "Google+ API", then click the
"OFF" button to enable it.  You should now see the "Google+ API" as
"ON" in your API list:

.. image:: /_static/images/google-enable-login.png


Create OAuth Credentials
........................

Next, you'll need to create an OAuth client ID. The client ID is what allows your application (and Stormpath) to talk to Google securely.

From the "APIs & Auth" menu, click on "Credentials". Click the "Create New Client ID" button and follow these steps:

1. Select "Web application" for your "Application Type".
2. Remove everything from the "Authorized Javascript Origins" box.
3. Add the callback URI of your site (both publicly and locally) into the
   "Authorized Redirect URI" box.  This tells Google where to
   redirect users after they've logged in with Google.  The default callback
   URI for this library is ``/callbacks/google``.

In the end, your settings should look like this:

.. image:: /_static/images/google-oauth-settings.png

Once you've specified your settings, click the "Create Client ID"
button.

Make note of the **Client ID** and **Client secret**. You'll need those in the next step.


Create a Google Directory
.........................

Now that you've created a Google Project, you need to create a Stormpath Directory that contains the Google Project credentials. This allows Stormpath to interact with the Google API on your |framework| application's behalf.

To do this, visit the `Stormpath Admin Console`_ and click on Directories in the navigation bar. Click "Create Directory" and choose Google as the Directory type. Next, enter the following information:

- **Name**: Any descriptive name for the Directory.
- **Google Client ID**: Insert your Google Client ID from the previous step.
- **Google Client Secret**: Insert your Google Client secret.
- **Google Authorized Redirect URI**: Insert your Google Redirect
  URL from the previous step.

.. tip::

  Only enter the URI you're currently using! For example, if you are running your app in development mode, set it to your local URL. When you deploy your application, set it to your production URI.

Your Directory configuration should look like this:

  .. image:: /_static/images/google-social-directory.png

Finally, click "Create Directory" to add the Directory to Stormpath.


Mapping the Directory
.....................

The new Google Directory needs to be associated (mapped) to your existing Application as an Account Store. This can also be done from the `Stormpath Admin Console`_.

To do this, click on Applications in the navigation bar, and select your Application from the list. On the details page, click on Account Stores on the left side. Next, click “Add Account Store” and pick the Google Directory you created. Click “Create Mappings”.


Configuring Your Server URI
...........................

The Stormpath |framework| package requires one more bit of configuration to enable Google Login from your application. The ``stormpath.web.serverUri`` property needs to contain the base URL of your web server.

You can configure this using a :ref:`YAML or JSON file <config_markup>`. For example, in YAML:

.. code-block:: yaml

  ---
  stormpath:
    web:
     serverUri: http://localhost:5000

Alternatively, you can set this property in code when you configure the Stormpath middleware:

.. only:: aspnetcore

  .. literalinclude:: code/configuration/aspnetcore/server_uri.cs
    :language: csharp

.. only:: aspnet

  .. literalinclude:: code/configuration/aspnet/server_uri.cs
    :language: csharp

.. only:: nancy

  .. .literalinclude:: code/configuration/nancy/anonymous_inline_config.cs
    :language: csharp

.. note::

  For more information on configuration, see the :ref:`configuration` section.

That's it!


Testing Google Login
....................

Now that you’ve connected your Google Project to Stormpath, you’re ready to test your |framework| application.

Restart |framework| (if it’s running) and try visiting the login page (``/login``) in your browser. If you’re using the default views included with this library, you should see the following:

.. image:: /_static/images/login-page-google.png

Try logging in!  When you click the Google button you'll be redirected to Google, and prompted to select your Google account:

.. image:: /_static/images/login-page-google-account.png

You'll then be prompted to accept any requested permissions. After authorizing, you'll be redirected back to your website. If you've never logged into this application with Google before, you'll be redirected to the ``nextUri`` set in the :ref:`registration route configuration <registration_configuration>`. If you have logged into this application with Google before, you'll be redirected to the ``nextUri`` set in the :ref:`login route configuration <login_configuration>`.


.. _linkedin_login:

Setting up LinkedIn Login
-------------------------

To use LinkedIn Login with your |framework| application, you simply need to:

1. Create a LinkedIn Application in the `LinkedIn Developer Console`_.
2. Configure a Stormpath Directory with the LinkedIn Application credentials.


Create a LinkedIn Application
.............................

First, log into the `LinkedIn Developer Console`_ and create a new LinkedIn Application by clicking the "Create Application" button. Fill out the fields on the form, in particular:

- **Name**: The name of your application.
- **Application Use**: Pick the intended use of your application.
- **Website URL**: The base URL of your application.

Click "Submit" to finish creating the new application.


Enable LinkedIn Permissions
...........................

In order to use the new LinkedIn Application with Stormpath, you need to enable the correct LinkedIn permissions.

Under the "Default Application Permissions" section, enable the ``r_basicprofile`` and the ``r_emailaddress`` permissions. These permissions allow Stormpath to access the basic profile properties like email and first, middle, and last name.

You'll also need to add our application callback URIs to the "OAuth 2.0" section. The default callback in this library is ``/callbacks/linkedin``. For instance, if your site is running locally on port 3000, as well as under the "www.example.com" domain, you'd add two redirect URIs:

- http://localhost:3000/callbacks/linkedin
- https://www.example.com/callbacks/linkedin

.. image:: /_static/images/linkedin-oauth-configuration.png

Make a note of the **Client ID** and **Client Secret**. You'll need those in the next step.


Create a LinkedIn Directory
...........................

Now that you’ve created a LinkedIn Application, you need to create a Stormpath Directory that contains the LinkedIn Application credentials. This allows Stormpath to interact with the LinkedIn API on your |framework| application’s behalf.

To do this, visit the `Stormpath Admin Console`_ and click on Directories in the navigation bar. Click “Create Directory” and choose LinkedIn as the Directory type. Next, enter the following information:

- **Name**: Any descriptive name for the Directory.
- **LinkedIn Client ID**: Insert your LinkedIn Client ID from the previous step.
- **LinkedIn Client Secret**: Insert your LinkedIn Client Secret.

Your Directory configuration should look like this:

  .. image:: /_static/images/linkedin-social-directory.png

Finally, click "Create Directory" to add the Directory to Stormpath.


Mapping the Directory
.....................

The new LinkedIn Directory needs to be associated (mapped) to your existing Application as an Account Store. This can also be done from the `Stormpath Admin Console`_.

To do this, click on Applications in the navigation bar, and select your Application from the list. On the details page, click on Account Stores on the left side. Next, click “Add Account Store” and pick the new Facebook Directory you created. Click “Create Mappings”.


Configuring Your Server URI
...........................

The Stormpath |framework| package requires one more bit of configuration to enable LinkedIn Login from your application. The ``stormpath.web.serverUri`` property needs to contain the base URL of your web server.

You can configure this using a :ref:`YAML or JSON file <config_markup>`. For example, in YAML:

.. code-block:: yaml

  ---
  stormpath:
    web:
     serverUri: http://localhost:5000

Alternatively, you can set this property in code when you configure the Stormpath middleware:

.. only:: aspnetcore

  .. literalinclude:: code/configuration/aspnetcore/server_uri.cs
    :language: csharp

.. only:: aspnet

  .. literalinclude:: code/configuration/aspnet/server_uri.cs
    :language: csharp

.. only:: nancy

  .. .literalinclude:: code/configuration/nancy/anonymous_inline_config.cs
    :language: csharp

.. note::

  For more information on configuration, see the :ref:`configuration` section.


That's it!


Testing LinkedIn Login
......................

Now that you’ve connected your LinkedIn Application to Stormpath, you’re ready to test your |framework| application.

Restart |framework| (if it’s running) and try visiting the login page (``/login``) in your browser. If you’re using the default views included with this library, you should see the following:

.. image:: /_static/images/login-page-linkedin.png

Try logging in!  When you click the LinkedIn button you'll be redirected to LinkedIn, and prompted to select your LinkedIn account:

.. image:: /_static/images/linkedin-permissions-page.png

You'll then be prompted to accept any requested permissions. After authorizing, you'll be redirected back to your website. If you've never logged into this application with LinkedIn before, you'll be redirected to the ``nextUri`` set in the :ref:`registration route configuration <registration_configuration>`. If you have logged into this application with LinkedIn before, you'll be redirected to the ``nextUri`` set in the :ref:`login route configuration <login_configuration>`.



.. _Stormpath Admin Console: https://api.stormpath.com/login
.. _Facebook Developer Site: https://developers.facebook.com/
.. _Google Developer Console: https://console.developers.google.com/project
.. _LinkedIn Developer Console: https://www.linkedin.com/developer/apps
.. _Developer applications: https://github.com/settings/developers
