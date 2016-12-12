.. _email-verification:

******************
Email Verification
******************

**URL**

``https://{DNS-LABEL}.apps.stormpath.io/verify``

Email Verification in the Client API uses the ``/verify`` endpoint. A ``POST`` to this endpoint along with a ``login`` will trigger the Email Verification Workflow and send the user an email with an email verification link. A ``GET`` along with a valid ``sptoken`` (sent to the user in the email link) will verify an Account's email address.

Trigger Verification Workflow
=============================

Sending a ``POST`` to the ``/verify`` endpoint with a ``login`` will trigger the `Verification Email Workflow <https://docs.stormpath.com/rest/product-guide/latest/accnt_mgmt.html#verify-account-email>`__. ``login`` corresponds to either an Account's ``email`` or ``username``. The workflow will only be triggered if the following conditions are met:

- the ``login`` corresponds to an ``email`` and/or ``username`` that exists in an Account in a Directory mapped to this Application, and
- that Directory has the Email Verification Workflow enabled

.. note::

  If the Account exists in multiple Directories, Workflow behavior is dictated by the login priority of the Directories. So if Directory A has the Workflow disabled, but Directory B has the Workflow enabled, then the email will still be sent only if Directory B has a higher login priority that Directory A. For more information, see `the REST Product Guide <https://docs.stormpath.com/rest/product-guide/latest/auth_n.html#how-login-attempts-work-in-stormpath>`__.

**Request**

.. code-block:: http

  POST /verify HTTP/1.1
  Accept: application/json
  Content-Type: text/plain; charset=utf-8
  Host: violet-peace.apps.stormpath.io

  {
    "login": "jakub@stormpath.com"
  }

**Response**

To prevent leaking Account state, this call will always return a ``200 OK``.

.. code-block:: none

  HTTP/1.1 200
  Date: Wed, 09 Nov 2016 22:06:46 GMT

Verify Email Address
====================

The Verification Email that Stormpath sends contains a link (configured as part of the Verification Workflow) that contains an ``sptoken``. This ``sptoken`` and its value can be passed to the ``verify`` endpoint as part of a ``GET`` in order to verify the email and set the Account's ``emailVerificationStatus`` to ``VERIFIED``.

.. note::

  If the Account's ``status`` was ``UNVERIFIED`` then successfully verifying the email will change the ``status`` to ``ENABLED``. However, verifying the email address will not change a status of ``DISABLED`` to ``ENABLED``.

The way that this would be used by your Client application is that the link in the email would point towards a page in your application, and that page would then relay the ``sptoken`` as part of the ``GET`` to the ``verify`` endpoint.

**Request**

.. code-block:: http

  GET /verify?sptoken=31vhk0RvAag46NLFibasd HTTP/1.1
  Accept: application/json
  Host: violet-peace.apps.stormpath.io

**Response**

.. code-block:: none

  HTTP/1.1 200
  Date: Wed, 09 Nov 2016 22:50:20 GMT
  Content-Length: 0
  Connection: Close

The response will fail if the token is invalid, already used, or expired.
