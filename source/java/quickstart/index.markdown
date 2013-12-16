---
layout: doc
lang: java
title: Stormpath Java Product Guide
---

Welcome to Stormpath's Java SDK Quickstart!

This quickstart will get you up and running with Stormpath in about 10 minutes and give you a good initial feel for the Stormpath Java SDK.  During this quickstart, you will do the following:

* Register for a free Stormpath account
* Create an API Key that allows you to make REST API calls with Stormpath
* Register an application with Stormpath so you can automate that application's user management and authentication needs
* Create an account that can log in to the application
* Authenticate an account with the application

With Stormpath, you can offload repetitive security-sensitive logic to Stormpath and get back to building your application's core functionality.  Never worry about storing passwords again!

The Java SDK can be found on [Github](https://github.com/stormpath/stormpath-sdk-java).

***

## Sign Up for Stormpath

1. Fill out and submit the [Stormpath registration form](https://api.stormpath.com/register).  This will send a confirmation email.
2. Click the link in the confirmation email.

## <a name="apiKey"></a> Get an API Key

All requests back to Stormpath using the Stormpath SDK must be authenticated with an API Key. To get an API key:

1. Log in to the [Stormpath Admin Console](https://api.stormpath.com) using the email address and password you used to register with Stormpath.

2. In the top-right corner of the resulting page, visit **Settings** > **My Account**.

    <!-- TODO: SCREENSHOT (arrow calling attention to the 'My Accounts' menu item)   -->

3. On the Account Details page, under **Security Credentials**, click **Create API Key**.

    <!-- TODO: SCREENSHOT (arrow calling attention to the 'Create API Key' button) -->

    This will generate your API Key and download it to your computer as an `apiKey.properties` file. If you open the file in a text editor, you will see something similar to the following:

        apiKey.id = 144JVZINOF5EBNCMG9EXAMPLE
        apiKey.secret = lWxOiKqKPNwJmSldbiSkEbkNjgh2uRSNAb+AEXAMPLE

4. Save this file in a secure location, such as your home directory in a hidden `.stormpath` directory. For example:

        $HOME/.stormpath/apiKey.properties
5. Also change the file permissions to ensure only you can read this file. For example, on \*nix operating systems:

        $ chmod go-rwx $HOME/.stormpath/apiKey.properties

***

## Add the Stormpath Java SDK to your Project

Add the [Stormpath Java SDK](https://github.com/stormpath/stormpath-sdk-java) .jars to your application using Maven, Ant+Ivy, Grails, SBT, or whichever Maven Repository-compatible tool you prefer:

    <dependency>
        <groupId>com.stormpath.sdk</groupId>
        <artifactId>stormpath-sdk-api</artifactId>
        <version>0.9.1</version>
    </dependency>
    <dependency>
        <groupId>com.stormpath.sdk</groupId>
        <artifactId>stormpath-sdk-httpclient</artifactId>
        <version>0.9.1</version>
        <scope>runtime</scope>
    </dependency>

If you are not using a Maven Repository-compatable tool, follow these [instructions](/java/product-guide#Appendix).

More information on different ways to configure and retrieve information from this file can be found in the [Client Builder](https://github.com/stormpath/stormpath-sdk-java/blob/master/api/src/main/java/com/stormpath/sdk/client/ClientBuilder.java) API documentation.

***

## Working with the Stormpath Java SDK

### Configure your Java application

Create a Stormpath SDK [`Client`](/java/product-guide#Client) instance based on your API key. The client instance is your starting point for all operations with the Stormpath service. For example:

    import com.stormpath.sdk.client.*;
    ...

    String path = System.getProperty("user.home") + "/.stormpath/apiKey.properties";
    Client client = new ClientBuilder().setApiKeyFileLocation(path).build();	

The `Client` instance is intended to be an application singleton. You should reuse this instance throughout your application code. You *should not* create multiple Client instances as it could negatively affect caching.

### Register your application with Stormpath

Registering an application with Stormpath allows that application to use Stormpath for its user management and authentication needs.
In this example, we'll create a Star Trek 'Captain's Log' application:

    import com.stormpath.sdk.tenant.*;
    import com.stormpath.sdk.application.*;

    Application application = client.instantiate(Application.class);
    application.setName("Captain's Log"); //must be unique among your other apps

    application = client.getCurrentTenant()
        .createApplication(Applications.newCreateRequestFor(application).createDirectory().build());

Once the application is created, it will automatically create a `Directory` resource based on the name of application and set it as the default account store. New accounts will be created in this default account store.

### Create an account 

Now that we've created an `Application`, let's create an `Account` so someone can log in to (i.e. authenticate with) the application.

    import com.stormpath.sdk.account.*;
    import com.stormpath.sdk.application.*;
    import com.stormpath.sdk.directory.*;
    ...

    //Create the account object
    Account account = client.instantiate(Account.class);

    //Set the account properties
    account.setGivenName("Jean-Luc");
    account.setSurname("Picard");
    account.setUsername("jlpicard"); //optional, defaults to email if unset
    account.setEmail("jlpicard@starfleet.com");
    account.setPassword("Changeme1!");

    //Create the account using the existing Application object
    application.createAccount(account);

### Authenticate an Account

Now we have an account that can use your application.  But how do you authenticate an account logging in to the application? You use the application instance and an `AuthenticationRequest` as follows:

    import com.stormpath.sdk.application.*;
    import com.stormpath.sdk.account.*;
    import com.stormpath.sdk.authc.*;
    import com.stormpath.sdk.resource.ResourceException;
    ...

    //Capture the username and password, such as via an SSL-encrypted web HTML form.
    //We'll just simulate a form lookup and use the values we used above:
    String usernameOrEmail = "jlpicard@starfleet.com"; //todo: get from form
    String rawPassword = "Changeme1!"; //todo: get from form

    //Create an authentication request using the credentials
    AuthenticationRequest request = new UsernamePasswordRequest(usernameOrEmail, rawPassword);

    //Now let's authenticate the account with the application:
    try {
        return application.authenticateAccount(request).getAccount();
    } catch (ResourceException name) {
        //...catch the error and print it to the syslog if it wasn't.
        log.error("Auth error: " + name.getDeveloperMessage());
        return null;
    } finally {
        //Clear the request data to prevent later memory access
        request.clear();
    }

If the authentication attempt fails, you will receive a `ResourceException` which contains details of the error.

### Experiment! 

Use the client instance to interact with your tenant data, such as applications, directories, and accounts:

    import com.stormpath.sdk.tenant.Tenant;
    import com.stormpath.sdk.application.*;
    import com.stormpath.sdk.directory.*;
    ...

    Tenant tenant = client.getCurrentTenant();

    //Print application name
    ApplicationList applications = tenant.getApplications();
    for (Application application : applications) {
        log.error("Application " + application.getName());
    }

    //Print directory names
    DirectoryList directories = tenant.getDirectories();
    for (Directory directory : directories) {
        log.error("Directory " + directory.getName());
    }

***

## Next Steps

We hope you have found this Quickstart helpful!

For full coverage of Stormpath's Java SDK, including how to edit application details, edit accounts, create groups and assign accounts to groups, reset passwords via password reset emails, and more, please see our [Java Product Guide](/java/product-guide).
