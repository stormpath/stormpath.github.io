---
layout: default
---

#Error: 5103
##The group storage location is disabled.

Example:

	{
	  "status": 409,
	  "code": 5103,
	  "message": "Oops! We encountered an unexpected error.  Please contact support and explain what you were doing at the time this error occurred.",
	  "developerMessage": "This application's default storage location for new groups is disabled.  New groups cannot be added to disabled directories. The login source assigned to this application has been configured as the default storage location for newly created groups.  To fix this problem: in the application's 'login sources' configuration, change the status of the login source used for storing new groups to ENABLED."
	  "moreInfo": "https://docs.stormpath.com/errors/5103"
	}
