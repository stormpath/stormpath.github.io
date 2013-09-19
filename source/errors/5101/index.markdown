---
layout: default
---

#Error: 5101
##The account storage location is disabled.

Example:

	{
	  "status": 409,
	  "code": 5101,
	  "message": "Oops! We encountered an unexpected error.  Please contact support and explain what you were doing at the time this error occurred.",
	  "developerMessage": "This application's default storage location for new accounts is disabled.  New accounts cannot be added to disabled groups or directories. The login source assigned to this application has been configured as the default storage location for newly created accounts.  To fix this problem: in the application's 'login sources' configuration, change the status of the login source used for storing new accounts to ENABLED."
	  "moreInfo": "http://www.stormpath.com/docs/errors/5101"
	}
