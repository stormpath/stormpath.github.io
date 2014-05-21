---
layout: doc
lang: java
description: "7-minute Tutorial for Java"
image: https://stormpath.com/images/tutorial/java-icon.png
title: Stormpath Java Quickstart
---


Welcome to Stormpath's Java Quickstart!

This quickstart will get you up and running with Stormpath in about 7 minutes
and give you a good initial feel for the Stormpath Java SDK.  During this
quickstart, you will do the following:

 * Add the Stormpath SDK to your project.
 * Create an API Key that allows you to make REST API calls with Stormpath.
 * Register an Application.
 * Create a User Account.
 * Search for a User Account.
 * Authenticate a User Account.

Stormpath also can do a lot more (*like Groups, Multitenancy, Social
Integration, and Security workflows*) which you can learn more about at the end
of this quickstart.

Let's get started!


***


## Add the Stormpath SDK

Add the [Stormpath Java SDK](https://github.com/stormpath/stormpath-sdk-java) .jars to your application using Maven, Ant+Ivy, Grails, SBT, or whichever Maven Repository-compatible tool you prefer:

    <dependency>
        <groupId>com.stormpath.sdk</groupId>
        <artifactId>stormpath-sdk-api</artifactId>
        <version>1.0.beta</version>
    </dependency>
    <dependency>
        <groupId>com.stormpath.sdk</groupId>
        <artifactId>stormpath-sdk-httpclient</artifactId>
        <version>1.0.beta</version>
        <scope>runtime</scope>
    </dependency>

If you are not using a Maven Repository-compatable tool, follow these [instructions](/java/product-guide#appendix).

More information on different ways to configure and retrieve information from this file can be found in the [Client Builder](https://github.com/stormpath/stormpath-sdk-java/blob/master/api/src/main/java/com/stormpath/sdk/client/ClientBuilder.java) API documentation.


***


## Get an API Key

All requests to Stormpath must be authenticated with an API Key.

1. If you haven't already,
   [Sign up for Stormpath here](https://api.stormpath.com/register).  You'll
   be sent a verification email.

2. Click the link in the verification email.

3. Log in to the [Stormpath Admin Console](https://api.stormpath.com) using
   the email address and password you used to register with Stormpath.

4. Click the **Manage Existing Keys** button in the middle of the page.

5. Under **Security Credentials**, click **Create API Key**.

   This will generate your API Key and download it to your computer as an
   `apiKey.properties` file.  If you open the file in a text editor, you will
   see something similar to the following:

        apiKey.id = 144JVZINOF5EBNCMG9EXAMPLE
        apiKey.secret = lWxOiKqKPNwJmSldbiSkEbkNjgh2uRSNAb+AEXAMPLE

6. Save this file in a secure location, such as your home directory, in a
   hidden `.stormpath` directory. For example:

        $ mkdir ~/.stormpath
        $ mv ~/Downloads/apiKey.properties ~/.stormpath/

5. Change the file permissions to ensure only you can read this file.  For
   example:

        $ chmod go-rwx ~/.stormpath/apiKey.properties

The `apiKey.properties` file holds your API key information, and can be used to
easily authenticate with the Stormpath SDK.


***


## Create a Client

The first step to working with Stormpath is creating a Stormpath
[Client](/java/product-guide#client) using your `apiKey.properties` file.
The `Client` object is what allows you to communicate with Stormpath.

    import com.stormpath.sdk.client.*;
	
	ApiKey apiKey = ApiKeys.builder().setFileLocation(path).build();
	Client client = Clients.builder().setApiKey(apiKey).build();
	
	//If using Google App Engine, you must use Basic authentication:
    //Client client = Clients.builder().setApiKey(apiKey)
	//    .setAuthenticationScheme(AuthenticationScheme.BASIC)
	//    .build();

The `client` instance is intended to be an application singleton.  You should
reuse this instance throughout your application code.  You *should not*
create multiple `Client` instances as it could negatively affect caching.


***


## Create an Application

Before you can create user Accounts you'll need to create a Stormpath
Application.  An Application in Stormpath is the same thing as a project.  If
you're building a web app named "Lightsabers Galore", you'd want to name your
Stormpath Application "Lightsabers Galore" as well.

You can create an Application using the Client you created in the previous step:

    import com.stormpath.sdk.tenant.*;
    import com.stormpath.sdk.application.*;
	
    Application application = client.instantiate(Application.class);
    application.setName("My Awesome Application"); //must be unique among your other apps
    application = client.getCurrentTenant()
        .createApplication(Applications.newCreateRequestFor(application).createDirectory().build());

The code above will create a new Application, which we can use later to do stuff
like:

- Create user accounts.
- Log users into their account.
- etc.

{% docs note %}
The only required field when creating an Application is `name`.  Descriptions
are optional!
{% enddocs %}


***


## Create a User Account

Now that we've created an Application, let's create a user Account!  To do
this, you'll need to use your application (*created in the previous step*):

    import com.stormpath.sdk.account.*;
    import com.stormpath.sdk.application.*;
    import com.stormpath.sdk.directory.*;
	
    //Create the account object
    Account account = client.instantiate(Account.class);
	
    //Set the account properties
    account.setGivenName("Joe");
    account.setSurname("Stormtrooper");
    account.setUsername("tk421"); //optional, defaults to email if unset
    account.setEmail("tk421@stormpath.com");
    account.setPassword("Changeme1");
    CustomData customData = account.getCustomData();
    customData.put("favoriteColor", "white");
	
    //Create the account using the existing Application object
    application.createAccount(account);

Stormpath Accounts have several basic fields (`givenName`, `surname`, `email`,
etc...), but also support storing schema-less JSON data through the `customData`
field.  `customData` allows you to store any user profile information (*up to
10MB per user!*).

{% docs note %}
The required fields are: `givenName`, `surname`, `email`, and `password`.
{% enddocs %}

Once you've created an Account, you can access the Account's data by referencing
the attribute names, for instance:

    account.getGivenName();
    
	account.getCustomData().get("favoriteColor");


***


## Search for a User Account

Finding user Accounts is also simple.  You can search for Accounts by field:

	Map<String, Object> queryParams = new HashMap<String, Object>();
	queryParams.put("email", "tk421@stormpath.com");
	AccountList accounts = application.getAccounts(queryParams);


You can also use wild cards such as `("email", "*@stormpath.com")` to return
all accounts with a stormpath.com domain.

***


## Authenticate a User Account

Authenticating users is equally simple -- you can specify either a `username` or
`email` address, along with a `password`:

    import com.stormpath.sdk.application.*;
    import com.stormpath.sdk.account.*;
    import com.stormpath.sdk.authc.*;
    import com.stormpath.sdk.resource.ResourceException;
    ...

    //Capture the username and password, such as via an SSL-encrypted web HTML form.
    //We'll just simulate a form lookup and use the values we used above:
    String usernameOrEmail = "tk421@stormpath.com"; 
    String rawPassword = "Changeme1"; 

    //Create an authentication request using the credentials
    AuthenticationRequest request = new UsernamePasswordRequest(usernameOrEmail, rawPassword);

    //Now let's authenticate the account with the application:
    try {
        return application.authenticateAccount(request).getAccount();
    } catch (ResourceException name) {
        //...catch the error and print it to the syslog
        log.error("Auth error: " + name.getDeveloperMessage());
        return null;
    } finally {
        //Clear the request data to prevent later memory access
        request.clear();
    }


***


## Other Things You Can Do with Stormpath

In addition to user registration and login, Stormpath can do a lot more!

- Create and manage user groups.
- Partition multi-tenant account data.
- Simplify social login with providers like Google and Facebook.
- Manage developer API keys and access tokens.
- Verify new users via email.
- Automatically provide secure password reset functionality.
- Centralize your user store across multiple applications.
- Plug into your favorite security framework (*like [Apache Shiro](/integrations/#sample-apps-java-container-jump) or [Spring Security](/integrations/#sample-apps-java-container-jump)*).


***


## Next Steps

We hope you found this Quickstart helpful!

You've just scratched the surface of what you can do with Stormpath.  Want to
learn more?  Here are a few other helpful resources you can jump into.

* Dig in deeper with the [Official Java Product Guide](/java/product-guide).
* [Build an Apache Shiro + Stormpath Web App in 30 minutes](http://shiro.apache.org/webapp-tutorial.html).
* Checkout our integrations to [Apache Shiro](/integrations/#sample-apps-java-container-jump) or [Spring Security](/integrations/#sample-apps-java-container-jump).
* Learn to easily partition user data with our [Guide to Building Multitenant Applications](/guides/multi-tenant/).
* Easily support Social Login with [Google](/java/product-guide/#integrating-with-google) and [Facebook](/java/product-guide#integrating-with-facebook) integrations in Java.


***


## Help Us Spread the Word

Like Stormpath?  If you enjoyed playing around with our new Java SDK,
please help spread the word with a quick tweet!

<!-- AddThis Button BEGIN -->
<div class="addthis_toolbox addthis_default_style addthis_32x32_style" addthis:title="Checkout @goStormpath, it let's you set up complete user management in your Java app in minutes."
addthis:url="https://stormpath.com">
  <a class="addthis_button_twitter"></a>
  <a class="addthis_button_preferred_2"></a>
  <a class="addthis_button_preferred_3"></a>
  <a class="addthis_button_preferred_4"></a>
  <a class="addthis_button_compact"></a>
</div>
<script type="text/javascript">var addthis_config = {"data_track_addressbar":true};</script>
<script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-4f5ed709512978e9"></script>
<!-- AddThis Button END -->
<p>
