.. _logout:


Logout
======

If you are using browser-based sessions, you'll need a way for the user to
logout and destroy their session cookies.

This library will automatically provide a POST route at ``/logout``.  Simply send
a ``POST`` request to this route and all tokens will be removed.  You will need to
remove the cookies set on your end.  This route is to trigger the removal of
tokens from Stormpath to invalidate them for Stormpath verification.


Configuration Options
---------------------

If you wish to change the logout URI or the redirect url, you can provide the
following configuration::

    web:
      logout:
        enabled: true
        uri: "/logout"
        nextUri: "/"

Token Based Logging Out
-----------------------

If you logged in based on Oauth tokens, you will need to remove the token from the storage mechanism you used.
After you do that, you will need to also delete the token from Stormpath.  Issue a request to the access
token herf to get the object.  Then call the delete method::

    $token = \Stormpath\Resource\AccessToken::get($accessTokenHref);
    $token->delete();