---
layout: doc
lang: php
title: Stormpath PHP Quickstart
---

The PHP SDK can be found on [Github](https://github.com/stormpath/stormpath-sdk-php).

To quickly get started using Stormpath to secure your online applications, please complete the following steps:

1. [Sign up for service](https://api.stormpath.com/register).
	1. Provide your first and last name, email address, company, and a password.
	2. When all fields are complete, click **Start**.<br>You will receive a registration success email.
	3. In the confirmation email, click the link.
	4. Follow the onscreen instructions.<br>After completing this process, you are ready to use Stormpath for free!

2. Download the PHP SDK:
 
    [stormpath-sdk-php](https://github.com/stormpath/stormpath-sdk-php) - Official PHP SDK for the Stormpath REST+JSON API</p>

3. Follow the installation/configuration directions located on the [README.md file](https://github.com/stormpath/stormpath-sdk-php/blob/master/README.md).

4. Create your API key.
	
	All requests to the Stormpath [REST API](/php/product-guide#RESTAPIdef) must be authenticated with an [API key](/php/product-guide#APIKey). To get an API key:
	
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
	
	   Because Stormpath generates an `apiKey.properties` file and PHP tends to work better with YAML files, you'll want to create an `apiKey.yml` file.
	
	5. Copy your existing `apiKey.properties` file to a new file and make sure it is readable only by you:

			> cd $HOME/.stormpath
			> cp apiKey.properties apiKey.yml
			> chmod go-rwx apiKey.yml

	6. Then open and edit `apiKey.yml` to change its contents to use a colon : delimiter for key/value pairs instead of the equals = delimiter to make sure it is YAML compliant:

			apiKey.id: 144JVZINOF5EBNCMG9EXAMPLE
			apiKey.secret: lWxOiKqKPNwJmSldbiSkEbkNjgh2uRSNAb+AEXAMPLE

	   More information on different ways to configure and retrieve information from this file can be found in the [Client Builder](https://github.com/stormpath/stormpath-sdk-php/blob/master/Services/Stormpath/Client/ClientBuilder.php) API documentation.

5. Configure your application to create a Stormpath SDK [client](/php/product-guide#Client) instance based on your API key. The client instance is your starting point for all operations with the Stormpath service. For example:


		$path = '/home/myhomedir/.stormpath/apiKey.yml';
		$builder = new Services_Stormpath_Client_ClientBuilder;
		$client = $builder->setApiKeyFileLocation($path)->build(); 

6. Use the client instance to interact with your tenant data, such as applications, directories, and accounts:

		$tenant = $client->getCurrentTenant();

		$applications = $tenant->getApplications();

		foreach ($applications as $application) {
		   echo 'Application ' . $application->getName() .PHP_EOL;
		}

		$directories = $tenant->getDirectories();

		foreach ($directories as $directory) {

		    echo 'Directory ' . $directory->getName() .PHP_EOL;

		    $accounts = $directory->getAccounts();

		    foreach ($accounts as $account) {
		       echo '  Account ' . $account->getGivenName() .PHP_EOL;
		    }
		}

7. Create the necessary directories:

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


8. Register applications.

	To authenticate a user account in your [application](/php/product-guide#Application), you must first register the application with Stormpath.

	To register an application, you must:
	  1. Retrieve your current tenant from the client instance.
	  2. Instantiate an application object.
	  3. Set the application properties.
	  4. Create the application from your current tenant.

    </br>
	To create applications, use the `_setters_` of a new application instance to set the values and then create the application from the tenant, as follows:

		$tenant = $client->getCurrentTenant();
 
		$application = $client->getDataStore()->instantiate(Services_Stormpath::APPLICATION); //the Services_Stormpath class provides the resources' classes' names
		$application->setName('Application Name');
		$application->setDescription('Application Description');
 
		$application = $tenant->createApplication($application);


9. Create accounts. 

	To create a user account, you must:
	  1. Get the datastore instance from the client.
	  2. Get the directory where you want to create the account from the datastore with the directory href.
	  3. Set the account properties.
	  4. Create the account from the directory.

	</br>
    To create accounts, use the `_setters_` of a new account instance to set the values and create the account in a directory as follows:

		$href = 'https://api.stormpath.com/v1/directories/DIR_UID_HERE';
		$directory = $client->getDataStore()->getResource($href, Services_Stormpath::DIRECTORY);
 
		$account = $client->getDataStore()->instantiate(Services_Stormpath::ACCOUNT);
		$account->setEmail('my@email.com');
		$account->setGivenName('Given Name');
		$account->setPassword('Password');
		$account->setSurname('Surname');
		$account->setUsername('Username');
 
		$account = $directory->createAccount($account);

	If you want to override the registration workflow and have the account created with ENABLED status right away, pass false as second argument, for example:

		 $account = $directory->createAccount($account, false);

	If you want to associate the account to a group, add the following:

		$account->addGroup($group);


10. Authenticate accounts.

	To authenticate an account you must have the application the account authenticates against. With the application, the account is authenticated by providing the username and password as follows:

		$path = '/home/myhomedir/.stormpath/apiKey.yml';
		$builder = new Services_Stormpath_Client_ClientBuilder;
		$client = $builder->setApiKeyFileLocation($path)->build();
	 
		$href = 'https://api.stormpath.com/v1/applications/APP_UID_HERE';
		$application = $client->getDataStore()->getResource($href, Services_Stormpath::APPLICATION);
	 
		// when the account is authenticated, it produces an AuthenticationResult
		$un = 'usernameOrEmail';
		$pw = 'rawPassword';
		$req = new Services_Stormpath_Authc_UsernamePasswordRequest($un,$pw);
		$authResult = $application->authenticateAccount($req);
		 
		// from the result, we obtain the authenticated Account
		$account = $authResult->getAccount();
		
## Next Steps

We hope you have found this Quickstart helpful!

For full coverage of Stormpath's PHP SDK, including how to edit application details, edit accounts, create groups and assign accounts to groups, resetting passwords via password reset emails, and more, please see our [PHP Product Guide](/php/product-guide)
