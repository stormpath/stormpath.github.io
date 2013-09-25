---
layout: doc
lang: ruby
title: Stormpath Ruby Quickstart
---

Welcome to Stormpath's Ruby SDK Quickstart!

This quickstart will get you up and running with Stormpath in about 10 minutes and give you a good initial feel for the Stormpath Ruby SDK.  During this quickstart, you will do the following:

* Register for a free Stormpath account
* Create an API Key that allows you to make REST API calls with Stormpath
* Register an application with Stormpath so you can automate that application's user management and authentication needs
* Create an account that can log in to the application
* Authenticate an account with the application

With Stormpath, you can offload repetitive security-sensitive logic to Stormpath and get back to building your application's core functionality.  Never worry about storing passwords again!

The Stormpath Ruby SDK can be found on [Github](https://github.com/stormpath/stormpath-sdk-ruby).

{% docs note %}
The Ruby SDK is compatible with Ruby version *1.9.3* and higher. The sample codes of this documentation are based on version *1.0.0.beta.2* of the Ruby SDK.
{% enddocs %}

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

## Add the Stormpath Ruby SDK to your Project

Add the [Stormpath Ruby SDK](https://github.com/stormpath/stormpath-sdk-ruby) gem to your application using `gem install`:

    $ gem install stormpath-sdk --pre

Once the gem is installed, add the Stormpath Ruby SDK .gem to your application using Rake, Bundler, or whatever gem-compatible tool you prefer:

    Gem::Specification.new do |s|
        ...
        s.add_dependency('stormpath-sdk', '>= 1.0.0.beta.2')
        ...
    end

***

## Working with the Stormpath Ruby SDK

### Configure your Ruby application

Create a Stormpath SDK [`Client`](http://www.stormpath.com/docs/ruby/product-guide#Client) instance based on your API key. The client instance is your starting point for all operations with the Stormpath service. For example:

    require "stormpath-sdk"
    ...

    client = Stormpath::Client.new api_key_file_location: File.join(ENV['HOME'], '.stormpath', 'apiKey.properties')

The `Client` instance is intended to be an application singleton. You should reuse this instance throughout your application code. You *should not* create multiple Client instances as it could negatively affect caching.

### Register your application with Stormpath

Registering an application with Stormpath allows that application to use Stormpath for its user management and authentication needs. Use the `client` "applications.create" method to create a new `Application` resource as follows:

    application = client.applications.create({
          name: 'This Is My Ruby App',
          description: 'This is my ruby app description'
        }, {createDirectory: true})

Once the application is created, it will automatically create a `Directory` resource based on the name of application and set it as the default account store. New accounts will be created in the default account store.

### Create an account

Now that we've created an `Application`, let's create an `Account` so someone can log in to (i.e. authenticate with) the application. To do so,

    account = application.accounts.create({ 
      given_name: 'John',
      surname: 'Smith',
      email: 'john.smith@example.com',
      username: 'johnsmith',
      password: '4P@$$w0rd!'
    })

### Authenticate an Account

Now that we have an account we can use, we can log in to the application. But how do we authenticate an account logging in to the application? We use the previously-created application instance to create an `UsernamePasswordRequest` request as follows:

      auth_request = Stormpath::Authentication::UsernamePasswordRequest.new 'johnsmith', '4P@$$w0rd!'
      auth_result = application.authenticate_account auth_request
      account = auth_result.account

If the authentication request is successful, the `auth_result` will return the account instance for the authorized account.

### Experiment! 

Use the client instance to interact with tenant data, such as applications, directories, and accounts:

    client.applications.each do |application|
      p "Application: #{application.name}"
    end

    client.directories.each do |directory|
      p "Directory: #{directory.name}"

      directory.accounts.each do |account|
          p "  Account: #{account.given_name}"
      end
    end

***

## Next Steps

We hope you have found this Quickstart helpful!

For full coverage of Stormpath's Ruby SDK, including how to edit application details, edit accounts, create groups and assign accounts to groups, resetting passwords via password reset emails, and more, please see our [Ruby Product Guide](http://www.stormpath.com/docs/ruby/product-guide).
