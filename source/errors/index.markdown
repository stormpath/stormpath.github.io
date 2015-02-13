---
layout: doc
description: Stormpath error code documentation plus examples
title: Stormpath Error Codes
alias: [/stormpath-error-codes]
lang: rest
---

##<a id="GeneralValidation"></a>2XXX: General Validation

<a id="2000"></a>[**2000**](/errors/2000): The property value is required; it cannot be null, empty, or blank.

<a id="2001"></a>[**2001**](/errors/2001): The property value must be unique.

<a id="2002"></a>[**2002**](/errors/2002): The property value is invalid. This is a generic property invalid error. For example, supplying a fraction of 15/0 - cannot divide by zero.
Only use this code if a more accurate status code is not available. For example, an email without an '@' should return error code [2006](/errors/2006), not 2002.

<a id="2003"></a>[**2003**](/errors/2003): The property value is unsupported. For example, enum 'enabled' or 'disabled' is expected, but the value passed was 'foo'.

<a id="2004"></a>[**2004**](/errors/2004): The property value is an invalid type. For example, specifying a string when a number is required.

<a id="2005"></a>[**2005**](/errors/2005): The property value uses an invalid character encoding.

<a id="2006"></a>[**2006**](/errors/2006): The property value format is invalid. For example, specifying the  "12/15/2012" date format when "2012-12-15" is expected.

<a id="2007"></a>[**2007**](/errors/2007): The property value minimum length is not satisfied.

<a id="2008"></a>[**2008**](/errors/2008): The property value maximum length is not satisfied.

<a id="2009"></a>[**2009**](/errors/2009): The property minimum value is not satisfied.

<a id="2010"></a>[**2010**](/errors/2010): The property maximum value is exceeded.

<a id="2011"></a>[**2011**](/errors/2011): The property minimum date/time is not satisfied.

<a id="2012"></a>[**2012**](/errors/2012): The property maximum date/time is exceeded.

<a id="2013"></a>[**2013**](/errors/2013): The property value is not within range.

<a id="2014"></a>[**2014**](/errors/2014): The property value is an invalid reference. For example, linking to an object that is not allowed to be linked to a 'constraint violation'.

<a id="2015"></a>[**2015**](/errors/2015): Unknown property. For example, trying to set a 'srname' property instead of 'surname'.

<a id="2016"></a>[**2016**](/errors/2016): Property value does not match a known resource.

<a id="2100"></a>[**2100**](/errors/2100): Malformed query. One or more query criteria parameters was not specified correctly.

<a id="2101"></a>[**2101**](/errors/2101): The supplied query parameter must have a corresponding value.

<a id="2102"></a>[**2102**](/errors/2102): The supplied query parameter may only have a single value and the parameter cannot be specified more than once.

<a id="2103"></a>[**2103**](/errors/2103): The supplied query parameter value is invalid or an expected type.

<a id="2104"></a>[**2104**](/errors/2104): The `orderBy` query parameter value contains an invalid order statement.

<a id="2105"></a>[**2105**](/errors/2105): Unsupported Query Property: specifying a property not recognized as queryable.

<a id="2106"></a>[**2106**](/errors/2106): Unsupported Order Property: specifying a property for sort order when the property cannot be used for sort ordering.

<a id="2107"></a>[**2107**](/errors/2107): Unsupported Expand Property: specifying a property for expansion when the property is not expandable.

***

##<a id="CustomData"></a>3XXX: Custom Data

<a id="3000"></a>[**3000**](/errors/3000): Property names cannot be null, empty or blank.

<a id="3001"></a>[**3001**](/errors/3001): Property name is invalid.  Property names cannot exceed 255 characters.

<a id="3002"></a>[**3002**](/errors/3002): Property name is invalid.  Property names may contain only alphanumeric characters, underscores, or dashes, but cannot start with a dash.

<a id="3003"></a>[**3003**](/errors/3003): Property names may not equal any of the following reserved names: 'href', createdAt', modifiedAt', 'meta', 'spMeta', 'spmeta', 'ionmeta', or 'ionMeta'.

<a id="3004"></a>[**3004**](/errors/3004): Property value exceeded maximum size. The value exceeds the maximum storage size limit of 10 MB per resource.

***

##<a id="Tenant"></a> 4XXX: Tenant

<a id="4001"></a>[**4001**](/errors/4001): Your Stormpath tenant owner account cannot be deleted.

<a id="4002"></a>[**4002**](/errors/4002): Your Stormpath tenant owner account's status cannot be modified.

***


##<a id="Application"></a>5XXX: Application

<a id="5010"></a>[**5010**](/errors/5010): The specified directory name is already in use by another directory and cannot be used to auto-create a directory for the new application. Please choose a different directory name for the auto-created directory.

<a id="5100"></a>[**5100**](/errors/5100): The account storage location is unspecified. 

<a id="5101"></a>[**5101**](/errors/5101): The account storage location is disabled.

<a id="5102"></a>[**5102**](/errors/5102): The group storage location is unspecified. 

<a id="5103"></a>[**5103**](/errors/5103): This application's default storage location for new groups is disabled.  New groups cannot be added to disabled directories. 

<a id="5104"></a>[**5104**](/errors/5104): The specified account store is already mapped to that Application. Please choose another group or directory. 

<a id="5106"></a>[**5106**](/errors/5106): The specified directory account store is a read-only mirror of an externally managed directory. It cannot be used to directly store new accounts. 

<a id="5108"></a>[**5108**](/errors/5108): The specified group account store is a read-only mirror of an externally managed group. It cannot be used to directly store new accounts. 

<a id="5110"></a>[**5110**](/errors/5110): The specified directory account store is a read-only mirror of an externally managed directory. It cannot be used to directly store new groups. 

<a id="5112"></a>[**5112**](/errors/5112): Specifying a group as a defaultGroupStore is not currently supported. 

<a id="5114"></a>[**5114**](/errors/5114): The specified account store reference is invalid.

***

##<a id="Directory"></a>6XXX: Directory

<a id="6100"></a>[**6100**](/errors/6100): The directory does not allow creation of new accounts or groups.

<a id="6101"></a>[**6101**](/errors/6101): The account's directory is not enabled for the verification email workflow.

<a id="6201"></a>[**6201**](/errors/6201): This directory cannot be converted to an external provider directory.

<a id="6202"></a>[**6202**](/errors/6202): The directory cannot be updated to reflect a different identity provider. Please create a new directory instead.
***
##<a id="Agent"></a>7XXX: Account

<a id="7100"></a>[**7100**](/errors/7100): Login attempt failed because the specified password is incorrect.

<a id="7101"></a>[**7101**](/errors/7101): Login attempt failed because the Account is disabled.

<a id="7102"></a>[**7102**](/errors/7102): Login attempt failed because the Account is not verified.

<a id="7103"></a>[**7103**](/errors/7103): Login attempt failed because the Account is locked.

<a id="7104"></a>[**7104**](/errors/7104): Login attempt failed because there is no Account in the Application's associated Account Stores with the specified username or email.

<a id="7200"></a>[**7200**](/errors/7200): Stormpath was not able to complete the request to Facebook or Google: this can be caused by either a bad Facebook or Google directory configuration, or the provided account credentials are not valid.

<a id="7201"></a>[**7201**](/errors/7201): Stormpath is unable to create or update the account because the Facebook or Google response did not contain the required property.

<a id="7202"></a>[**7202**](/errors/7202): This property is a read-only property on a externally managed directory account, it cannot be modified.

***
##<a id="Agent"></a>9XXX: Agent

<a id="9000"></a>[**9000**](/errors/9000): Stormpath, while acting as a gateway/proxy to your directory service, was not able to reach the Stormpath Directory Agent that communicates with your Directory Server. Please ensure that your directory's Stormpath Agent is online and successfully communicating with Stormpath.

<a id="9001"></a>[**9001**](/errors/9001): Stormpath, while acting as a gateway/proxy to your directory service, was not able to reach your Directory Server. Please ensure that the Stormpath Agent is configured correctly and successfully communicating with your Directory Server.

<a id="9002"></a>[**9002**](/errors/9002): Stormpath, while acting as a gateway/proxy to your directory service, did not receive a timely response from the Stormpath Directory Agent that communicates with your Directory Server. Please ensure that your directory's Stormpath Agent is online and successfully communicating with Stormpath.

<a id="9003"></a>[**9003**](/errors/9003): Stormpath, while acting as a gateway/proxy to your Directory server, did not receive a timely response from the Directory Server. Please ensure that your directory's Stormpath Agent is configured correctly and successfully communicating with your Directory Server.

<a id="9004"></a>[**9004**](/errors/9004): Stormpath, while acting as a gateway/proxy to your directory service, received an invalid response from the Stormpath Directory Agent. Please ensure you are running the latest stable version of the Stormpath Directory Agent for your Directory Server.

<a id="9005"></a>[**9005**](/errors/9005): Stormpath, while acting as a gateway/proxy to your directory service, received an invalid response from your Directory Server. Please ensure that you are using a supported directory service version and that the Stormpath Directory Agent is configured correctly to communicate with that Directory Server.

<a id="9006"></a>[**9006**](/errors/9006): Stormpath, while acting as a gateway/proxy to your Active Directory server, encountered a referral error while communicating with the AD server. Potential solutions are to ensure that your AD server's DNS settings are correctly configured or to log in to the Stormpath UI Console and change your AD server's Stormpath Agent configuration to 'Ignore Referral Issues'.

