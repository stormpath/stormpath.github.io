---
layout: doc
lang: python
title: Stormpath Python Quickstart
---

The Python SDK can be found on [Github](https://github.com/stormpath/stormpath-sdk-python).

To quickly get started using Stormpath to secure your online applications, please complete the following steps:

1. [Sign up for service](https://api.stormpath.com/register).
	1. Provide your first and last name, email address, company, and a password.
	2. When all fields are complete, click **Start**.<br>You will receive a registration successful email.
	3. In the confirmation email, click the link.
	4. Follow the onscreen instructions.<br>After completing this process, you are ready to use Stormpath for free!

2. Download the Python SDK:

	* [stormpath-sdk-python](https://github.com/stormpath/stormpath-sdk-python) - Official Python SDK for the Stormpath REST+JSON API</p>

3. Create your API key.

	All requests to the Stormpath [REST API](http://www.stormpath.com/docs/python/product-guide#RESTAPIdef) must be authenticated with an [API key](http://www.stormpath.com/docs/python/product-guide#APIKey). To get an API key:
	
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

	5. Copy your existing `apiKey.properties` file to a new file and make sure it is readable only by you:

			> cd $HOME/.stormpath
			> chmod go-rwx apiKey.properties

4. Configure your application to create a Stormpath SDK [client](http://www.stormpath.com/docs/python/product-guide#Client) instance based on your API key. The client instance is your starting point for all operations with the Stormpath service. For example:

		from stormpath import Client
		...

        api_key_file = "/home/myhomedir/.stormpath/apiKey.properties"

        client = Client(api_key_file_location=api_key_file)

5. Use the client instance to interact with your tenant data, such as applications, directories, and accounts:

		tenant_href = client.tenant.href
		print(tenant.href)

		applications = client.applications

		for application in applications:
		    print('Application ' + application.name)

		directories = client.directories

		for directory in directories:
		    print('Directory ' + directory.name)

		   accounts = directory.accounts

			for account in accounts:
		    	print('Account ' + account.given_name)

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

	To authenticate a user account in your [application](http://www.stormpath.com/docs/python/product-guide#Application), you must first register the application with Stormpath.

	To register an application you must create it from the client instance:

	application = client.applications.create({
      'name': 'This Is My Python App',
      'description': 'This is my python app description'
    })

You can also register an application, create a directory and link the application with the directory in one step:

	application = client.applications.create({
      "name": 'This Is My Python App',
      "description": 'This is my python app description'
    }, create_directory="Directory")

If `True` is used instead of a string that represents the directory name, a generic directory name is derived from the name of the newly created application.
This is useful if you don't want to be bothered with organizing your directories and prefer to start using the application functionality as soon as possible.

8. Create accounts.

	To create a user account, you must:

	1. Get the directory instance from the client and the directory href.
	2. Create the account from the directory instance.

	directory_href = 'https://api.stormpath.com/v1/directories/YOUR_DIRECTORY_ID'

    directory = client.directories.get(directory_href)

    account = directory.accounts.create({
      'givenName': 'John',
      'surname': 'Smith',
      'email': 'john.smith@example.com',
      'username': 'johnsmith',
      'password': '4P@$$w0rd!'
    })

	If you want to associate the account to a group, add the following:

		account.add_group(group)


9. Authenticate accounts.

	To authenticate an account you must have the application the account authenticates against. With the application, the account is authenticated by providing the username and password as follows:

		application_href = 'https://api.stormpath.com/v1/applications/YOUR_APPLICATION_ID'
		application = client.applications.get(application_href)

		account = application.authenticate_account('johnsmith', '4P@$$w0rd!')

## Next Steps

We hope you have found this Quickstart helpful!

For full coverage of Stormpath's Python SDK, including how to edit application details, edit accounts, create groups and assign accounts to groups, resetting passwords via password reset emails, and more, please see our [Python Product Guide](http://www.stormpath.com/docs/python/product-guide)
