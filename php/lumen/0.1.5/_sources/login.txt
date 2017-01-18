.. _login:


Login
=====

Working with an API, we suggest that you work with OAuth tokens.  We have created a route for your, `/oauth/tokens` where
you can do `client_credentials`, `password`, or `refresh` grant types.


Client Credentials
------------------

In this workflow, an api key and secret is provisioned for a stormpath account. These credentials can be exchanged for
an access token by making a POST request to `/oauth/token` on the web application. The request must look like this::

    POST /oauth/token
    Authorization: Basic <base64UrlEncoded(apiKeyId:apiKeySecret)>

    grant_type=client_credentials


Password Grant
--------------
In this workflow, an account can post their login (username or email) and password to the ``/oauth/token` endpoint,
with the following body data::


  POST /oauth/token

  grant_type=password
  &username=<username>
  &password=<password>

Refresh Grant
-------------
The refresh grant type is required for clients using the password grant type to refresh their access_token.
Thus, it's automatically enabled alongside the password grant type.

An account can post their refresh_token with the following body data::


  POST /oauth/token
  grant_type=refresh_token&
  refresh_token=<refresh token>


The product guide for token management: http://docs.stormpath.com/guides/token-management

.. _Stormpath Admin Console: https://api.stormpath.com