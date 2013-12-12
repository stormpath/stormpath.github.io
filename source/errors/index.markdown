---
layout: doc
title: Stormpath Error Codes
alias: [/stormpath-error-codes]
---

##<a id="GeneralValidation"></a>2XXX: General Validation

<a id="2000"></a>[**2000**](errors/2000): The property value is required; it cannot be null, empty, or blank.

<a id="2001"></a>[**2001**](errors/2001): The property value must be unique.

<a id="2002"></a>[**2002**](errors/2002): The property value is invalid. This is a generic property invalid error. For example, supplying a fraction of 15/0 - cannot divide by zero.
Only use this code if a more accurate status code is not available. For example, an email without an '@' should return error code [2006](errors/2006), not 2002.

<a id="2003"></a>[**2003**](errors/2003): The property value is unsupported. For example, enum 'enabled' or 'disabled' is expected, but the value passed was 'foo'.

<a id="2004"></a>[**2004**](errors/2004): The property value is an invalid type. For example, specifying a string when a number is required.

<a id="2005"></a>[**2005**](errors/2005): The property value uses an invalid character encoding.

<a id="2006"></a>[**2006**](errors/2006): The property value format is invalid. For example, specifying the  "12/15/2012" date format when "2012-12-15" is expected.

<a id="2007"></a>[**2007**](errors/2007): The property value minimum length is not satisfied.

<a id="2008"></a>[**2008**](errors/2008): The property value maximum length is not satisfied.

<a id="2009"></a>[**2009**](errors/2009): The property minimum value is not satisfied.

<a id="2010"></a>[**2010**](errors/2010): The property maximum value is exceeded.

<a id="2011"></a>[**2011**](errors/2011): The property minimum date/time is not satisfied.

<a id="2012"></a>[**2012**](errors/2012): The property maximum date/time is exceeded.

<a id="2013"></a>[**2013**](errors/2013): The property value is not within range.

<a id="2014"></a>[**2014**](errors/2014): The property value is an invalid reference. For example, linking to an object that is not allowed to be linked to a 'constraint violation'.

<a id="2015"></a>[**2015**](errors/2015): Unknown property. For example, trying to set a 'srname' property instead of 'surname'.

<a id="2016"></a>[**2016**](errors/2016): Unsupported Query Property: specifying a property not recognized as queryable.

<a id="2017"></a>[**2017**](errors/2017): Unsupported Order Property: specifying a property for sort order when the property cannot be used for sort ordering.

<a id="2018"></a>[**2018**](errors/2018): Unsupported Expand Property: specifying a property for expansion when the property is not expandable.

<a id="2100"></a>[**2100**](errors/2100): Malformed query. One or more query criteria parameters was not specified correctly.

<a id="2101"></a>[**2101**](errors/2101): The supplied query parameter must have a corresponding value.

<a id="2102"></a>[**2102**](errors/2102): The supplied query parameter may only have a single value and the parameter cannot be specified more than once.

<a id="2103"></a>[**2103**](errors/2103): The supplied query parameter value is invalid or an expected type.

<a id="2104"></a>[**2104**](errors/2104): The `orderBy` query parameter value contains an invalid order statement.

<a id="2105"></a>[**2105**](errors/2105): Unsupported Query Property: specifying a property not recognized as queryable.

<a id="2106"></a>[**2106**](errors/2106): Unsupported Order Property: specifying a property for sort order when the property cannot be used for sort ordering.

<a id="2107"></a>[**2107**](errors/2107): Unsupported Expand Property: specifying a property for expansion when the property is not expandable.


</p>

***

##<a id="Application"></a>5XXX: Application
<br>
<a id="5100"></a>[**5100**](errors/5100): The account storage location is unspecified. 

<a id="5101"></a>[**5101**](errors/5101): The account storage location is disabled.

<a id="5102"></a>[**5102**](errors/5102): The group storage location is unspecified. 

<a id="5103"></a>[**5103**](errors/5103): The group storage location is disabled.

<a id="5114"></a>[**5114**](errors/5114): The specified application account store reference is invalid.

</p>

***


##<a id="Directory"></a>6XXX: Directory

<a id="6100"></a>[**6100**](errors/6100): The directory does not allow creation of new accounts or groups.

</p>

***

##<a id="Agent"></a>9XXX: Agent

<a id="9000"></a>[**9000**](errors/9000): Stormpath, while acting as a gateway/proxy to your directory service, was not able to reach the Stormpath Directory Agent that communicates with your Directory Server. Please ensure that your directory's Stormpath Agent is online and successfully communicating with Stormpath.

<a id="9001"></a>[**9001**](errors/9001): Stormpath, while acting as a gateway/proxy to your directory service, was not able to reach your Directory Server. Please ensure that the Stormpath Agent is configured correctly and successfully communicating with your Directory Server.

<a id="9002"></a>[**9002**](errors/9002): Stormpath, while acting as a gateway/proxy to your directory service, did not receive a timely response from the Stormpath Directory Agent that communicates with your Directory Server. Please ensure that your directory's Stormpath Agent is online and successfully communicating with Stormpath.

<a id="9003"></a>[**9003**](errors/9003): Stormpath, while acting as a gateway/proxy to your Directory server, did not receive a timely response from the Directory Server. Please ensure that your directory's Stormpath Agent is configured correctly and successfully communicating with your Directory Server.

<a id="9004"></a>[**9004**](errors/9004): Stormpath, while acting as a gateway/proxy to your directory service, received an invalid response from the Stormpath Directory Agent. Please ensure you are running the latest stable version of the Stormpath Directory Agent for your Directory Server.

<a id="9005"></a>[**9005**](errors/9005): Stormpath, while acting as a gateway/proxy to your directory service, received an invalid response from your Directory Server. Please ensure that you are using a supported directory service version and that the Stormpath Directory Agent is configured correctly to communicate with that Directory Server.

<a id="9006"></a>[**9006**](errors/9006): Stormpath, while acting as a gateway/proxy to your Active Directory server, encountered a referral error while communicating with the AD server. Potential solutions are to ensure that your AD server's DNS settings are correctly configured or to log in to the Stormpath UI Console and change your AD server's Stormpath Agent configuration to 'Ignore Referral Issues'.

</p>