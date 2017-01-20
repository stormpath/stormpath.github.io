.. _registration:

*****************
User Registration
*****************

**URL**

``https://{DNS-LABEL}.apps.stormpath.io/register``

Registering a user is performed against the ``/register`` endpoint. A ``GET`` will retrieve the current registration view model, while a ``POST`` can pass the data for the new user Account that is to be created.

Get Registration View Model
---------------------------

The registration view model is returned in the form of JSON. It includes a ``form`` object that contains a ``fields`` collection to be rendered in the login form, and a collection of ``accountStores``.

**Form Fields**

Each returned ``field`` has the following information:

.. list-table::
  :widths: 30 70
  :header-rows: 1

  * - Attribute
    - Description

  * - ``name``
    - The name of this field.

  * - ``label``
    - The label element for this field.

  * - ``placeholder``
    - Placeholder text, if any, to put in this field when it is empty.

  * - ``required``
    - Indicates whether this field is required or not.

  * - ``type``
    - The input type for this field (e.g. ``text``, ``email``, ``password``).

**Account Stores**

Any non-Cloud Account Stores mapped to this Application will also return as part of the response here, in order to allow for the rendering of Social Login buttons. They will return in an order determined by their order in the Account Store Mapping priority index. For more about this topic, please see `How Login Attempts Work <https://docs.stormpath.com/rest/product-guide/latest/auth_n.html#how-login-attempts-work-in-stormpath>`__ in the REST Product Guide.

Each returned ``accountStore`` has an ``href`` and a ``name``. It also contains an embedded ``provider`` object which contains the following information:

.. list-table::
  :widths: 30 70
  :header-rows: 1

  * - Attribute
    - Description

  * - ``href``
    - The location of the Provider resource for this Directory.

  * - ``providerId``
    - The ID for this Provider. For more information, see `the REST Reference chapter <https://docs.stormpath.com/rest/product-guide/latest/reference.html#provider>`__.

  * - ``clientId``
    - (Social Directories only) The OAuth 2.0 Client ID for this Provider.

  * - ``scope``
    - (Social Directories only) An array containing the scope(s) that are being requested from the social provider, as configured for this account store.

**Example Request**

.. code-block:: http

  GET /register HTTP/1.1
  Accept: application/json
  Host: smooth-ensign.apps.stormpath.io

**Success Response**

``200 OK`` along with the JSON view model.

.. code-block:: json

  {
    "form": {
      "fields": [
        {
          "name": "givenName",
          "label": "First Name",
          "placeholder": "First Name",
          "required": false,
          "type": "text"
        },
        {
          "name": "surname",
          "label": "Last Name",
          "placeholder": "Last Name",
          "required": false,
          "type": "text"
        },
        {
          "name": "email",
          "label": "Email",
          "placeholder": "Email",
          "required": true,
          "type": "email"
        },
        {
          "name": "password",
          "label": "Password",
          "placeholder": "Password",
          "required": true,
          "type": "password"
        }
      ]
    },
    "accountStores": [
      {
        "provider": {
          "href": "https://api.stormpath.com/v1/directories/2TRsNjHx8DB6Ca3rBal536/provider",
          "providerId": "facebook",
          "clientId": "1401818363453044"
        },
        "href": "https://api.stormpath.com/v1/directories/2TRsNjHx8DB6Ca3rBal536",
        "name": "My Facebook Dir"
      }
    ]
  }


Create New Account
--------------------

Sending a ``POST`` to ``/register`` with an ``email`` and ``password`` will create a new Account in the Application's default Account Store.

.. note::

  To require that additional attributes be passed you must configure the Directory's Account Schema. For more information about this, see `the REST Product Guide <https://docs.stormpath.com/rest/product-guide/latest/accnt_mgmt.html#how-to-manage-an-account-s-required-attributes>`__.

**Request**

.. code-block:: http

  POST /register HTTP/1.1
  Content-Type: application/json; charset=utf-8
  Host: violet-peace.apps.stormpath.io

  {
    "email": "jakub@stormpath.com",
    "password": "APassword!"
  }

**Response**

``200 OK`` along with the Account information.

.. code-block:: json

  {
    "account": {
      "href": "https://api.stormpath.com/v1/accounts/5kYvdJyROImkrMHVD2fhSG",
      "createdAt": "2016-10-28T20:40:18.463Z",
      "modifiedAt": "2016-10-28T20:40:18.463Z",
      "username": "jakub+test9@stormpath.com",
      "email": "jakub+test9@stormpath.com",
      "givenName": "Jakub",
      "middleName": null,
      "surname": "S",
      "status": "ENABLED",
      "fullName": "Jakub S",
      "emailVerificationStatus": "UNVERIFIED"
    }
  }