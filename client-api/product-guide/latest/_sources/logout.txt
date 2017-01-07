.. _logout:

***********
Logging Out
***********

.. _post-oauth-revoke:

OAuth 2.0 Logout
----------------

**URL**

``https://{DNS-LABEL}.apps.stormpath.io/oauth/revoke``

This endpoint takes a POST with your current OAuth token and revokes it. You can optionally specify whether you are passing an Access or Refresh token with the ``token_type_hint`` parameter.  Regardless of which token type is provided, all the related access and refresh tokens will be revoked.

**Request**

.. code-block:: http

  POST /oauth/revoke HTTP/1.1
  Accept: application/json
  Content-Type: application/x-www-form-urlencoded; charset=utf-8
  Host: perfect-rank.apps.stormpath.io

  token=eyJraWQ[...]urs4iqPY&token_type_hint=refresh_token

**Response**

.. code-block:: none

  HTTP/1.1 200
  Date: Mon, 07 Nov 2016 19:35:25 GMT
  Content-Length: 0
  Connection: Close