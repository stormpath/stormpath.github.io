.. _configuration:

****************************
Configuring the Client API
****************************

While the recommended way to configure the behavior of your Application's Client API is via the Stormpath Admin Console (jakub.todo), the full configuration information can be retrieved and updated via REST.

**webConfig URL**

Every Stormpath Application has a linked `webConfig` resource, which can be retrieved with it's href:

  ``https://api.stormpath.com/v1/applicationWebConfigs/$WEB_CONFIG_ID``

**Web Configuration Attributes**

  .. list-table::
    :widths: 10 10 20 60
    :header-rows: 1

    * - Attribute
      - Type
      - Valid Value(s)
      - Description

    * - ``href``
      - String
      - N/A
      - The configuration's fully qualified location URL.

    * - ``createdAt``
      - String
      - ISO-8601 Datetime
      - Indicates when this configuration was created.

    * - ``modifiedAt``
      - String
      - ISO-8601 Datetime
      - Indicates when this configuration's attributes were last modified.

    * - ``dnsLabel``
      - String
      - DNS-compatible string
      - The random two-word name that is prepended to the Stormpath endpoints for your Application.

    * - ``domainName``
      - String
      - N/A
      - The full domain name for the Client API endpoints.

    * - ``status``
      - String (enum)
      - ``ENABLED``, ``DISABLED``
      - Indicates whether the Client API is enabled or not. It is enabled by default for any new Applications.

    * - ``oauth2.enabled``
      - Object
      - N/A
      - Enables or disables the ``/oauth/token`` endpoint.

    * - ``register.enabled``
      - Object
      - Boolean
      - Enables or disables the ``/register`` endpoint.

    * - ``login.enabled``
      - Object
      - Boolean
      - Enabled or disables the ``/login`` endpoint.

    * - ``verifyEmail.enabled``
      - Object
      - Boolean | null
      - Enables or disables the ``/verify`` endpoint. If null, this is automatically enabled if the default Account Store for this Stormpath Application has the email verification workflow enabled.

    * - ``forgotPassword.enabled``
      - Object
      - Boolean | null
      - Enables or disables the ``/forgot`` endpoint. If null, this is automatically enabled if the default Account Store for this Stormpath Application has the forgot password workflow enabled.

    * - ``changePassword.enabled``
      - Object
      - Boolean | null
      - Enables or disables the ``/change`` endpoint. If null, this is automatically enabled if the default Account Store for this Stormpath Application has the forgot password workflow enabled.

    * - ``me``
      - Object
      - N/A
      - Enables or disables the ``/me`` endpoint. This object also allows you to configure which Account attributes can be returned expanded using the ``?expand=`` parameter. Each of the configurable attributes is inside the ``expand`` object. For a full list of attributes, see the :ref:`user-context` chapter.

    * - ``signingApiKey``
      - Link
      - N/A
      - A link to the API Key used to the sign the Access and Refresh tokens.

    * - ``application``
      - Link
      - N/A
      - A link to the Application resource that this configuration is for.

    * - ``tenant``
      - Link
      - N/A
      - A link to the Tenant resource that this configuration's Application belongs to.

**webConfig Example**

.. code-block:: json

  {
    "href": "https://api.stormpath.com/v1/applicationWebConfigs/6LAKEHwvKrVWffRv89b0SC",
    "createdAt": "2016-11-08T19:16:13.308Z",
    "modifiedAt": "2016-11-08T19:16:13.308Z",
    "dnsLabel": "cold-diver",
    "domainName": "cold-diver.apps.stormpath.io",
    "status": "ENABLED",
    "oauth2": {
      "enabled": true
    },
    "register": {
      "enabled": true
    },
    "login": {
      "enabled": true
    },
    "verifyEmail": {
      "enabled": null
    },
    "forgotPassword": {
      "enabled": null
    },
    "changePassword": {
      "enabled": null
    },
    "me": {
      "enabled": true,
      "expand": {
        "applications": false,
        "customData": false,
        "groupMemberships": false,
        "groups": false,
        "providerData": false,
        "apiKeys": false,
        "directory": false,
        "tenant": false
      }
    },
    "signingApiKey": {
      "href": "https://api.stormpath.com/v1/apiKeys/430N8CJFF0ACJ73X2VZQ7APZH"
    },
    "application": {
      "href": "https://api.stormpath.com/v1/applications/6L98jNxoKNUy4mHcpkvpEK"
    },
    "tenant": {
      "href": "https://api.stormpath.com/v1/tenants/2Zu8zL6fwo27TTKAxjtvem"
    }
  }

Updating the Configuration via REST
===================================

Although it is recommended that you use the Admin Console (jakub.todo) to configure your Client API, the following settings can be updated via an HTTP POST:

- ``status``
- ``oauth2``
- ``register``
- ``login``
- ``verifyEmail``
- ``forgotPassword``
- ``changePassword``
- ``me`` (along with all fields inside ``expand``)
- ``signingApiKey``