---
layout: doc
title: Stormpath Error Codes
---

#Stormpath Error Codes

* [**General Validation**](#GeneralValidation)
	* [2000](#2000)	
	* [2001](#2001)	
	* [2002](#2002)
	* [2003](#2003)	
	* [2004](#2004)	
	* [2005](#2005)
	* [2006](#2006)
	* [2007](#2007)
	* [2008](#2008)
	* [2009](#2009)
	* [2010](#2010)
	* [2011](#2011)
	* [2012](#2012)
	* [2013](#2013)
	* [2014](#2014)
	* [2015](#2015)	
	* [2016](#2016)	
	* [2017](#2017)
	* [2018](#2018)	
	* [2100](#2100)	
	* [2101](#2101)
	* [2102](#2102)
	* [2103](#2103)
	* [2104](#2104)
	* [2105](#2105)
	* [2106](#2106)
	* [2107](#2107)
	</p>

* [**Application**](#Application)
	* [5100](#5100): [Example](#5100Ex)
	* [5101](#5101): [Example](#5101Ex)
	* [5102](#5102): [Example](#5102Ex)
	* [5103](#5103): [Example](#5103Ex)
	</p>

* [**Directory**](#Directory)
	* [6100](#6100)
	<p>

* [**Agent**](#Agent)
	* [9000](#9000)	
	* [9001](#9001)	
	* [9002](#9002)
	* [9003](#9003)	
	* [9004](#9004)	
	* [9005](#9005)
	* [9006](#9006)
</p>
	
* [**Error Code Examples**](#ErrorCodeExamples)

</p>

***

##<a id="GeneralValidation"></a>2XXX: General Validation

<a id="2000"></a>**2000**: The property value is required; it cannot be null, empty, or blank.

<a id="2001"></a>**2001**: The property value must be unique.

<a id="2002"></a>**2002**: The property value is invalid. This is a generic property invalid error. For example, supplying a fraction of 15/0 - cannot divide by zero.
Only use this code if a more accurate status code is not available. For example, an email without an '@' should return error code [2006](#2006), not 2002.

<a id="2003"></a>**2003**: The property value is unsupported. For example, enum 'enabled' or 'disabled' is expected, but the value passed was 'foo'.

<a id="2004"></a>**2004**: The property value is an invalid type. For example, specifying a string when a number is required.

<a id="2005"></a>**2005**: The property value uses an invalid character encoding.

<a id="2006"></a>**2006**: The property value format is invalid. For example, specifying the  "12/15/2012" date format when "2012-12-15" is expected.

<a id="2007"></a>**2007**: The property value minimum length is not satisfied.

<a id="2008"></a>**2008**: The property value maximum length is not satisfied.

<a id="2009"></a>**2009**: The property minimum value is not satisfied.

<a id="2010"></a>**2010**: The property maximum value is exceeded.

<a id="2011"></a>**2011**: The property minimum date/time is not satisfied.

<a id="2012"></a>**2012**: The property maximum date/time is exceeded.

<a id="2013"></a>**2013**: The property value is not within range.

<a id="2014"></a>**2014**: The property value is an invalid reference. For example, linking to an object that is not allowed to be linked to a 'constraint violation'.

<a id="2015"></a>**2015**: Unknown property. For example, trying to set a 'srname' property instead of 'surname'.

<a id="2016"></a>**2016**: Unsupported Query Property: specifying a property not recognized as queryable.

<a id="2017"></a>**2017**: Unsupported Order Property: specifying a property for sort order when the property cannot be used for sort ordering.

<a id="2018"></a>**2018**: Unsupported Expand Property: specifying a property for expansion when the property is not expandable.

<a id="2100"></a>**2100**: Malformed query. One or more query criteria parameters was not specified correctly.

<a id="2101"></a>**2101**: The supplied query parameter must have a corresponding value.

<a id="2102"></a>**2102**: The supplied query parameter may only have a single value and the parameter cannot be specified more than once.

<a id="2103"></a>**2103**: The supplied query parameter value is invalid or an expected type.

<a id="2104"></a>**2104**: The `orderBy` query parameter value contains an invalid order statement.

<a id="2105"></a>**2105**: Unsupported Query Property: specifying a property not recognized as queryable.

<a id="2106"></a>**2106**: Unsupported Order Property: specifying a property for sort order when the property cannot be used for sort ordering.

<a id="2107"></a>**2107**: Unsupported Expand Property: specifying a property for expansion when the property is not expandable.


</p>

***

##<a id="Application"></a>5XXX: Application
<br>
<a id="5100"></a>**5100**: The account storage location is unspecified. [Example](#5100Ex)

<a id="5101"></a>**5101**: The account storage location is disabled. [Example](#5101Ex)

<a id="5102"></a>**5102**: The group storage location is unspecified. [Example](#5102Ex)

<a id="5103"></a>**5103**: The group storage location is disabled. [Example](#5103Ex)

</p>

***


##<a id="Directory"></a>6XXX: Directory

<a id="6100"></a>**6100**: The directory does not allow creation of new accounts or groups.

</p>

***

##<a id="Agent"></a>9XXX: Agent

<a id="9000"></a>**9000**: Stormpath, while acting as a gateway/proxy to your directory service, was not able to reach the Stormpath Directory Agent that communicates with your Directory Server. Please ensure that your directory's Stormpath Agent is online and successfully communicating with Stormpath.

<a id="9001"></a>**9001**: Stormpath, while acting as a gateway/proxy to your directory service, was not able to reach your Directory Server. Please ensure that the Stormpath Agent is configured correctly and successfully communicating with your Directory Server.

<a id="9002"></a>**9002**: Stormpath, while acting as a gateway/proxy to your directory service, did not receive a timely response from the Stormpath Directory Agent that communicates with your Directory Server. Please ensure that your directory's Stormpath Agent is online and successfully communicating with Stormpath.

<a id="9003"></a>**9003**: Stormpath, while acting as a gateway/proxy to your Directory server, did not receive a timely response from the Directory Server. Please ensure that your directory's Stormpath Agent is configured correctly and successfully communicating with your Directory Server.

<a id="9004"></a>**9004**: Stormpath, while acting as a gateway/proxy to your directory service, received an invalid response from the Stormpath Directory Agent. Please ensure you are running the latest stable version of the Stormpath Directory Agent for your Directory Server.

<a id="9005"></a>**9005**: Stormpath, while acting as a gateway/proxy to your directory service, received an invalid response from your Directory Server. Please ensure that you are using a supported directory service version and that the Stormpath Directory Agent is configured correctly to communicate with that Directory Server.

<a id="9006"></a>**9006**: Stormpath, while acting as a gateway/proxy to your Active Directory server, encountered a referral error while communicating with the AD server. Potential solutions are to ensure that your AD server's DNS settings are correctly configured or to log in to the Stormpath UI Console and change your AD server's Stormpath Agent configuration to 'Ignore Referral Issues'.

</p>

***


##<a id="ErrorCodeExamples"></a>Error Code Examples:

<a id="5100Ex"></a>**5100**: The account storage location is unspecified.

	{
	  "status": 409,
	  "code": 5100,
	  "message": "Oops! We encountered an unexpected error.  Please contact support and explain what you were doing at the time this error occurred.",
	  "developerMessage": "No login source assigned to this application has been configured as the default storage location for newly created accounts.  To fix this problem: in the application's 'login sources' configuration, specify the login source that will be used to store newly created accounts."
	  "moreInfo": "http://www.stormpath.com/docs/errors/5100"
	}

<a id="5101Ex"></a>**5101**: The account storage location is disabled.

	{
	  "status": 409,
	  "code": 5101,
	  "message": "Oops! We encountered an unexpected error.  Please contact support and explain what you were doing at the time this error occurred.",
	  "developerMessage": "This application's default storage location for new accounts is disabled.  New accounts cannot be added to disabled groups or directories. The login source assigned to this application has been configured as the default storage location for newly created accounts.  To fix this problem: in the application's 'login sources' configuration, change the status of the login source used for storing new accounts to ENABLED."
	  "moreInfo": "http://www.stormpath.com/docs/errors/5101"
	}

<a id="5102Ex"></a>**5102**: The group storage location is unspecified.

	{
	  "status": 409,
	  "code": 5102,
	  "message": "Oops! We encountered an unexpected error.  Please contact support and explain what you were doing at the time this error occurred.",
	  "developerMessage": "No login source assigned to this application has been configured as the default storage location for newly created groups.  To fix this problem: in the application's 'login sources' configuration, specify the login source that will be used to store newly created groups."
	  "moreInfo": "http://www.stormpath.com/docs/errors/5102"
	}

<a id="5103Ex"></a>**5103**: The group storage location is disabled.

	{
	  "status": 409,
	  "code": 5103,
	  "message": "Oops! We encountered an unexpected error.  Please contact support and explain what you were doing at the time this error occurred.",
	  "developerMessage": "This application's default storage location for new groups is disabled.  New groups cannot be added to disabled directories. The login source assigned to this application has been configured as the default storage location for newly created groups.  To fix this problem: in the application's 'login sources' configuration, change the status of the login source used for storing new groups to ENABLED."
	  "moreInfo": "http://www.stormpath.com/docs/errors/5103"
	}

</p>

***
