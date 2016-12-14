.. _user-context:

************
User Context
************

**URL**

``https://{DNS-LABEL}.apps.stormpath.io/me``

An authenticated ``GET`` to the ``/me`` endpoint will return the current session's Account information according to the :ref:`Client API configuration <configuration>`. This is the only endpoint in the Client API that requires authentication.

**Request**

To make a request to this endpoint, you need to provide a previously issued access token as the ``Authorization: Bearer <access_token>`` header:

.. code-block:: http

  GET /me HTTP/1.1
  Content-Type: application/json; charset=utf-8
  Authorization: Bearer eyJraW[...]tIUxpdhBJz74LR0dd90RQTnl-u-_hgOOkpA
  Host: smooth-ensign.apps.stormpath.io

**Response**

``200 OK`` along with current session's Account information:

.. code-block:: json

  {
    "account": {
      "href": "https://api.stormpath.com/v1/accounts/7gzK1RBUk2tF3VNhZ3AYFI",
      "createdAt": "2016-10-26T16:48:14.457Z",
      "modifiedAt": "2016-10-26T16:48:14.457Z",
      "username": "jakub",
      "email": "jakub@stormpath.com",
      "givenName": "Jakub",
      "middleName": "",
      "surname": "Sw",
      "status": "ENABLED",
      "fullName": "Jakub Sw"
      "emailVerificationStatus":"VERIFIED"
    }
  }

By default this call will return:

- ``href``
- ``createdAt``
- ``modifiedAt``
- ``username``
- ``email``
- ``givenName``
- ``middleName``
- ``surname``
- ``status``
- ``fullName``
- ``emailVerificationStatus``
- ``passwordModifiedAt``

But you can also configure this endpoint to return these Account properties:

- API Keys
- Applications
- Custom Data
- Group Memberships
- Groups
- Provider Data
- Directory
- Tenant

The above Account could be returned with its Directory information embedded:

.. code-block:: json

  {
    "account": {
    "href": "https://api.stormpath.com/v1/accounts/7gzK1RBUk2tF3VNhZ3AYFI",
    "createdAt": "2016-10-26T16:48:14.457Z",
    "modifiedAt": "2016-10-26T16:48:14.457Z",
    "username": "jakub",
    "email": "jakub@stormpath.com",
    "givenName": "Jakub",
    "middleName": "",
    "surname": "Sw",
    "status": "ENABLED",
    "fullName": "Jakub Sw"
    "emailVerificationStatus":"VERIFIED"
    "passwordModifiedAt": "2016-11-09T21:56:21.000Z",
    "directory": {
      "href": "https://api.stormpath.com/v1/directories/1RU4exzcEKVaEoJTz3rDjw",
      "createdAt": "2016-10-25T21:55:10.574Z",
      "modifiedAt": "2016-10-25T21:55:10.574Z",
      "name": "Directory",
      "description": "",
      "status": "ENABLED"
    }
  }

For more information see the :ref:`configuration` chapter.