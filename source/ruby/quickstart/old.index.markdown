---
layout: doc
lang: ruby
title: Stormpath Ruby Quickstart
---

The Stormpath Ruby SDK can be found on [Github](https://github.com/stormpath/stormpath-sdk-ruby).

This SDK is compatible with the *1.9.3* and later versions of Ruby. The sample codes of this documentation are based on version *1.0.0.beta.2* or greater of the Ruby SDK.

To quickly get started using Stormpath to secure your online applications, please complete the following steps:

1. [Sign up for service](https://api.stormpath.com/register).
	1. Provide your first and last name, email address, company, and a password.
	2. When all fields are complete, click **Start**.<br>You will receive a registration success email.
	3. In the confirmation email, click the link.
	4. Follow the onscreen instructions.<br>After completing this process, you are ready to use Stormpath for free!

2. Install the [Stormpath Ruby SDK](https://github.com/stormpath/stormpath-sdk-ruby):

        $ gem install stormpath-sdk --pre

3. Add the Stormpath Ruby SDK .gem to your application using Rake, Bundler, or whatever gem-compatible tool you prefer:

		Gem::Specification.new do |s|
	    	...
		    ...
			s.add_dependency('stormpath-sdk', '>= 1.0.0.beta.2')
		end

4. Create your API key.
	
	All requests to the Stormpath [REST API](/ruby/product-guide#RESTAPIdef) must be authenticated with an [API key](/ruby/product-guide#APIKey). To get an API key:
	
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

	More information on different ways to configure and retrieve information from this file can be found in the [README file](https://github.com/stormpath/stormpath-sdk-ruby/blob/master/README.md) of the Ruby SDK.

5. Configure your application to create a Stormpath SDK [client](/ruby/product-guide#Client) instance based on your API key. The client instance is your starting point for all operations with the Stormpath service. For example:

		require "stormpath-sdk"
		...

		client = Stormpath::Client.new api_key_file_location: File.join(ENV['HOME'], '.stormpath', 'apiKey.properties')

6. Use the client instance to interact with your tenant data, such as applications, directories, and accounts:

		client.applications.each do |application|
          p "Application: #{application.name}"
        end

        client.directories.each do |directory|
          p "Directory: #{directory.name}"

          directory.accounts.each do |account|
            p "  Account: #{account.given_name}"
          end
        end

7. Create the necessary directories:

    To create a directory you must create it from the client instance:

	    require "stormpath-sdk"
    	...
    	...
        directory = client.directories.create({
          name: "New Directory",
          description: "New Directory Description"
        })


8. Register applications.

	To authenticate a user account in your [application](/ruby/product-guide#Application), you must first register the application with Stormpath.

	To register an application you must create it from the client instance:

        application = client.applications.create({
          name: 'This Is My Ruby App',
          description: 'This is my ruby app description'
        })


9. Create accounts. 

	To create a user account, you must:

	1. Get the directory instance from the client and the directory href.
	2. Create the account from the directory instance.

            directory_href = 'https://api.stormpath.com/v1/directories/YOUR_DIRECTORY_ID'

            directory = client.directories.get directory_href

            account = directory.accounts.create({
                given_name: 'John',
                surname: 'Smith',
                email: 'john.smith@example.com',
                username: 'johnsmith',
                password: '4P@$$w0rd!'
            })

	If you want to override the registration workflow and have the account created with ENABLED status right away, pass an account instance and _false_ as second argument, for example:

         account = Stormpath::Resource::Account.new({
           given_name: 'John',
           surname: 'Smith',
           email: 'john.smith@example.com',
           username: 'johnsmith',
           password: '4P@$$w0rd!'
         }, client)

		 account = directory.create_account account, false

	If you want to associate the account to a group, add the following:

		account.add_group group


10. Authenticate accounts.

	To authenticate an account you must have the application the account authenticates against. With the application, the account is authenticated by providing the username and password as follows:

		application_href = 'https://api.stormpath.com/v1/applications/YOUR_APPLICATION_ID'
		application = client.applications.get application_href
	 
		auth_request = Stormpath::Authentication::UsernamePasswordRequest.new 'johnsmith', '4P@$$w0rd!'
        auth_result = application.authenticate_account auth_request
        account = auth_result.account
		
## Next Steps

We hope you have found this Quickstart helpful!

For full coverage of Stormpath's Ruby SDK, including how to edit application details, edit accounts, create groups and assign accounts to groups, resetting passwords via password reset emails, and more, please see our [Ruby Product Guide](/ruby/product-guide)
