---
layout: doc
lang: java
title: Stormpath Java Quickstart
---

The Java SDK can be found on [Github](https://github.com/stormpath/stormpath-sdk-java).

To quickly get started using Stormpath to secure your online applications, please complete the following steps:

1. [Sign up for service](https://api.stormpath.com/register).
	1. Provide your first and last name, email address, company, and a password.
	2. When all fields are complete, click **Start**.<br>You will receive a registration successful email.
	3. In the confirmation email, click the link.
	4. Follow the onscreen instructions.<br>After completing this process, you are ready to use Stormpath for free!

2. Add the Stormpath Java SDK .jars to your application using Maven, Ant+Ivy, Grails, SBT, or whichever Maven Repository-compatible tool you prefer:

		<dependency>
		    <groupId>com.stormpath.sdk</groupId>
		    <artifactId>stormpath-sdk-api</artifactId>
	    	<version>0.7.0</version>
		</dependency>
		<dependency>
		    <groupId>com.stormpath.sdk</groupId>
		    <artifactId>stormpath-sdk-httpclient</artifactId>
		    <version>0.7.0</version>
		    <scope>runtime</scope>
		</dependency>

	If you are not using a Maven Repository-compatable tool, follow these [instructions](http://www.stormpath.com/docs/java/product-guide#Appendix).

3. Create your API key.
	
	All requests to the Stormpath [REST API](http://www.stormpath.com/docs/java/product-guide#RESTAPIdef) must be authenticated with an [API key](http://www.stormpath.com/docs/java/product-guide#APIKey). To get an API key:
	
	1. Log in to the Stormpath Admin Console using the email address and password provided during sign-up.
	2. After logging in, navigate to your account page by clicking **Settings**, **My Account** in the top-right corner of the screen.
	3. On the Account Details page, under Security Credentials, click **Create API Key**.
		
		* This will generate your API key and download it to your computer as an `apiKey.properties` file.
		* If you open the file in a text editor, you will see something similar to the following:

				apiKey.id = 144JVZINOF5EBNCMG9EXAMPLE 

				apiKey.secret = lWxOiKqKPNwJmSldbiSkEbkNjgh2uRSNAb+AEXAMPLE 
		
	4. Store your API key file somewhere secure (readable only by you), for example:

			/home/myhomedir/.stormpath/apiKey.properties

		The file contents should contain the following name/value pairs (using your own values of course):
	
			$ cat /home/myhomedir/.stormpath/apiKey.properties

			apiKey.id = YOURAPIKEYIDHEREREPLACEME
			apiKey.secret = YoUrReAlLyLongSecretValueHereReplaceMeWithYourValue

	5. Change the file permissions to make sure only you can read the file:

			$ chmod go-rw /home/myhomedir/.stormpath/apiKey.properties

		More information on different ways to configure and retrieve information from this file can be found in the [Client Builder](https://github.com/stormpath/stormpath-sdk-java/blob/master/api/src/main/java/com/stormpath/sdk/client/ClientBuilder.java) API documentation.

4. Configure your application to create a Stormpath SDK [client](http://www.stormpath.com/docs/java/product-guide#Client) instance based on your API key. The client instance is your starting point for all operations with the Stormpath service. For example:

		import com.stormpath.sdk.client.*;
		...

		String path = System.getProperty("user.home") + "/.stormpath/apiKey.properties";
		Client client = new ClientBuilder().setApiKeyFileLocation(path).build();

5. Use the client instance to interact with your tenant data, such as applications, directories, and accounts:

		import com.stormpath.sdk.tenant.Tenant;
		import com.stormpath.sdk.application.*;
		import com.stormpath.sdk.directory.*;
		...

		Tenant tenant = client.getCurrentTenant();

		ApplicationList applications = tenant.getApplications();

		for (Application application : applications) {
		    System.out.println("Application " + application.getName());
		}

		DirectoryList directories = tenant.getDirectories();

		for (Directory directory : directories) {
		    System.out.println("Directory " + directory.getName());
		}

6. Create the necessary directories:

	To create a directory, you must log in to the Stormpath Admin Console.

	1. Click the <strong>Directories</strong> tab.
	2. Click <strong>Create Directory</strong>.
	3. Click <strong>Cloud</strong>.
<img src="http://www.stormpath.com/sites/default/files/docs/CreateCloudDirectory.png" alt="Create Cloud Directory" title="Create Cloud Directory" width="650" height="440">
	4. Complete the field values as follows: <br>

		Attribute | Description
:----- | :-----
Name | The name used to identify the directory within Stormpath. This value must be unique. |
Description | Details about this specific directory.|
Status | By default, this value is set to Enabled. Change the value to Disabled if you want to prevent all user accounts in the directory from authenticating even where the directory is set as a login source to an application. |
Min characters | The minimum number of acceptable characters for the account password. |
Max characters | The maximum number of acceptable characters for the account password. |
Mandatory characters | The required character patterns which new passwords will be validated against. For example, for an alphanumeric password of at least 8 characters with at least one lowercase and one uppercase character, select the abc, ABC, and 012 options. The more patterns selected, the more secure the passwords but the more complicated for a user.|
	5. Click **Create**. </p>


7. Register applications.

	Before users can be added to Stormpath for authentication, you must first register the application with Stormpath.

	To register an application:

	1. Retrieve your current tenant from the client instance.
	2. Instantiate an application object.
	3. Set the application properties.
	4. Create the application from your current tenant.

	To create applications, use the `_setters_` of a new application instance to set the values and then create the application from the tenant, as follows:

		import com.stormpath.sdk.tenant.*;
		import com.stormpath.sdk.application.*;
		...
		...
		Tenant tenant = client.getCurrentTenant();
 
		Application application = client.getDataStore().instantiate(Application.class);
		application.setName("Application Name");
		application.setDescription("Application Description");
 
		tenant.createApplication(application);


8. Create accounts. 

	To create a user accounts:

	1. Get the datastore instance from the client.
	2. Get the directory where you want to create the account from the datastore with the directory href.
	3. Set the account properties.
	4. Create the account from the directory.

	To create accounts, use the `_setters_` of a new account instance to set the values and create the account in a directory as follows:

		import com.stormpath.sdk.account.*;
		import com.stormpath.sdk.directory.*;
		...
		...
		String href = "https://api.stormpath.com/v1/directories/DIR_UID_HERE";
		Directory directory = client.getDataStore().getResource(href, Directory.class);

		Account account = client.getDataStore().instantiate(Account.class);
		account.setGivenName("Given Name");	
		account.setSurname("Surname");
		account.setUsername("Username");
		account.setEmail("my@emaill.com"); 
		account.setMiddleName("Middle Name");
		account.setPassword("Password123");

		directory.createAccount(account);

	If you want to override the registration workflow and have the account created with ENABLED status right away, pass false as second argument, for example:

		directory.createAccount(account, false);

	If you want to associate the account to a group, add the following:

		account.addGroup(group);


9. Register and verify a user account.

	By default, the **Account Registration and Verification** workflow automation is disabled. By leaving this workflow off, all accounts created in the directory are enabled, unless otherwise specified, and the user does not receive any registration or verification emails from Stormpath.
	By only enabling <strong>Enable Registration and Verification Workflow</strong> and not also enabling <strong>Require newly registered accounts to verify their email address</strong>, new accounts are marked as enabled and the users receive a registration success email.
	You configure Account Registration and Verification in the [Stormpath Admin Console](http://www.stormpath.com/docs/java/product-guide#ConfigureAccountRegistration).
	
	If the **Account Registration and Verification** workflow is enabled, an account registration is automatically initiated during an account creation. 

	If a directory has the the account verification workflow enabled:

	1. A newly created account in the directory has an `UNVERIFIED` status until the email address has been verified.
	2. When a new user is registered for the first time, Stormpath sends an email to the user with a secure verification link, which includes a secure verification token.
	3. When the user clicks the link in the email, they are sent to the verification URL set up in the verification workflow. 
		* To verify the account email address (which sets the account status to `ENABLED`), the verification token in the account verification email must be obtained from the link account holders receive in the email. 
		* This is achieved by implementing the following logic:

				import com.stormpath.sdk.tenant.*;
				import com.stormpath.sdk.account.*;
				...
				...
				String verificationToken = // obtain it from query parameter, according to the workflow configuration of the link

				Tenant tenant = client.getCurrentTenant();

				// when the account is correctly verified it gets activated and that account is returned in this verification
				Account account = tenant.verifyAccountEmail(verificationToken);


10. Authenticate accounts.

	To authenticate an account you must have the application the account authenticates against. With the application, the account is authenticated by providing the username and password as follows:

		import com.stormpath.sdk.client.*;
		import com.stormpath.sdk.ds.*;
		import com.stormpath.sdk.application.*;
		import com.stormpath.sdk.account.*;
		import com.stormpath.sdk.authc.*;
		...

		String userHome = System.getProperty("user.home");
		String path = userHome + "/.stormpath/apiKey.properties";
		Client client = new ClientBuilder().setApiKeyFileLocation(path).build();
		DataStore dataStore = client.getDataStore();
	 
		String href = "https://api.stormpath.com/v1/applications/APP_UID_HERE";
		Application application = dataStore.getResource(href, Application.class);
	 
		// when the account is authenticated, it produces an AuthenticationResult
		String un = "usernameOrEmail"; //get from form
		String pw = "password"; //get from form
		AuthenticationRequest request = new UsernamePasswordRequest(un,pw);
		AuthenticationResult result = application.authenticateAccount(request);
		
		// from the result instance we get the authenticated Account
		Account account = result.getAccount();

## Next Steps

We hope you have found this Quickstart helpful!

For full coverage of Stormpath's Java SDK, including how to edit application details, edit accounts, create groups and assign accounts to groups, reset passwords via password reset emails, and more, please see our [Java Product Guide](http://www.stormpath.com/docs/java/product-guide)
