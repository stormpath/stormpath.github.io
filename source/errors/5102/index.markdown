---
layout: default
---

#Error: 5102
##The group storage location is unspecified.

Example:

	{
	  "status": 409,
	  "code": 5102,
	  "message": "Oops! We encountered an unexpected error.  Please contact support and explain what you were doing at the time this error occurred.",
	  "developerMessage": "No login source assigned to this application has been configured as the default storage location for newly created groups.  To fix this problem: in the application's 'login sources' configuration, specify the login source that will be used to store newly created groups."
	  "moreInfo": "http://docs.stormpath.com/errors/5102"
	}
