.. _password-reset:

**************
Password Reset
**************

Password Reset in the Client API involves two endpoints:

- ``/forgot``
- ``/change``

The ``/forgot`` endpoint is used to trigger the Password Reset workflow, while the ``/change`` endpoint receives the ``sptoken`` from the reset email as well as the Account's updated ``password``.

Trigger Reset Workflow
======================

**URL**

  ``https://{DNS-LABEL}.apps.stormpath.io/forgot``

Sending a ``POST`` to the ``/forgot`` endpoint with a ``login`` will trigger the `Password Reset Email Workflow <https://docs.stormpath.com/rest/product-guide/latest/accnt_mgmt.html#password-reset-flow>`__. ``login`` corresponds to either an Account's ``email`` or ``username``. The workflow will only be triggered if the following conditions are met:

- the ``login`` corresponds to an ``email`` and/or ``username`` that exists in an Account in a Directory mapped to this Application, and
- that Directory has the Password Reset Email Workflow enabled

.. note::

  If the Account exists in multiple Directories, Workflow behavior is dictated by the login priority of the Directories. So if Directory A has the Workflow disabled, but Directory B has the Workflow enabled, then the email will still be sent only if Directory B has a higher login priority that Directory A. For more information, see `the REST Product Guide <https://docs.stormpath.com/rest/product-guide/latest/auth_n.html#how-login-attempts-work-in-stormpath>`__.

**Request**

.. code-block:: http

  POST /forgot HTTP/1.1
  Accept: application/json
  Content-Type: application/json; charset=utf-8
  Host: violet-peace.apps.stormpath.io

  {
    "login": "jakub@stormpath.com"
  }

**Response**

To prevent leaking Account state, this call will always return a ``200 OK``.

.. code-block:: none

  HTTP/1.1 200
  Content-Type: application/json
  Date: Fri, 28 Oct 2016 21:15:29 GMT

Change Password
===============

The Password Reset Email that Stormpath sends contains a link (configured as part of the Password Reset Email Workflow) that contains an ``sptoken``. This ``sptoken`` and its value can be passed to the ``/change`` endpoint, along with the updated password, as part of a ``POST``.

**URL**

  ``https://{DNS-LABEL}.apps.stormpath.io/change``

**Request**

.. code-block:: http

  POST /change HTTP/1.1
  Accept: application/json
  Content-Type: application/json; charset=utf-8
  Host: violet-peace.apps.stormpath.io

  {
    "sptoken": "eyJ0aWQiOiIyWnU4ekw2ZndvMjdUVEtBeGp0dmVtIiwic3R0IjoiYXNzZXJ0aW9uIiwiYWxnIjoiSFMyNTYifQ%2EeyJleHAiOjE0Nzc3NzUzNjIsImp0aSI6IjZFMWo0aTN4QkdPV1g2OXhrVDNSRG8ifQ%2ECOmIVRr3pQ4jsIhKl7wWjHkYTfX1Reg3BV0kAlMSQpc",
    "password": "Password1!"
  }

**Response**

.. code-block:: none

  HTTP/1.1 200
  Content-Type: application/json
  Date: Fri, 28 Oct 2016 21:22:02 GMT
  Content-Length: 0
  Connection: Close
