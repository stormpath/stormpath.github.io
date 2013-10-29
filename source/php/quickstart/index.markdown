---
layout: doc
lang: php
title: Stormpath PHP Quickstart
---

Welcome to Stormpath's PHP SDK Quickstart!

This quickstart will get you up and running with Stormpath in about 10 minutes and give you a good initial feel for the Stormpath PHP SDK.  During this quickstart, you will do the following:

* Register for a free Stormpath account
* Create an API Key that allows you to make REST API calls with Stormpath
* Register an application with Stormpath so you can automate that application's user management and authentication needs
* Create an account that can log in to the application
* Authenticate an account with the application

With Stormpath, you can offload repetitive security-sensitive logic to Stormpath and get back to building your application's core functionality.  Never worry about storing passwords again!

The PHP SDK can be found on [Github](https://github.com/stormpath/stormpath-sdk-php).

{% docs note %}
The PHP SDK is built upon Zend's note of a Service and is thus only compatible with version *2.2* and higher of the [Zend Framework|http://framework.zend.com/].
{% enddocs %}

***

## Sign Up for Stormpath

1. Fill out and submit the [Stormpath registration form](https://api.stormpath.com/register).  This will send a confirmation email.
2. Click the link in the confirmation email.

***

## <a name="apiKey"></a> Get an API Key

All requests back to Stormpath using the Stormpath SDK must be authenticated with an API Key. To get an API key:

1. Log in to the [Stormpath Admin Console](https://api.stormpath.com) using the email address and password you used to register with Stormpath.

2. In the top-right corner of the resulting page, visit **Settings** > **My Account**.

    <!-- TODO: SCREENSHOT (arrow calling attention to the 'My Accounts' menu item -->

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

## Add the Stormpath PHP SDK to your Project

The [Stormpath PHP SDK](https://github.com/stormpath/stormpath-sdk-php) is built upon the Zend Framework. In order to add it to your application, you'll need to use Composer:

1. Navigate to your project folder. If you're new to Zend, consider cloning the [Zend skeleton application](https://github.com/zendframework/ZendSkeletonApplication) and using that as your first project.

2. Copy the "test" and "src" folders provided in the SDK into the "module/Application" folder of your project. Likewise, copy the "vendor" folder to your project root. 

3. Modify your project's "composer.json" to add in the dependencies found in the SDK's "composer.json".

4. Install dependencies via Composer 
    
        $ php composer.phar install

Your project should now be set up to use the Stormpath PHP SDK. For additional details about installing and configuring the PHP SDK, be sure to review the SDK's [README.md file](https://github.com/stormpath/stormpath-sdk-php/blob/master/README.md).

***

## Working with the Stormpath PHP SDK

### Configure your PHP application

To get started, you'll need to configure your application to include the SDK. Given your ApiKey, configure the service as follows:

    //Include Stormpath SDK
    use Stormpath\Service\StormpathService;

    //Read API key file
    try {
        $reader = new Zend\Config\Reader\Ini();
        $config = $reader->fromFile('/Users/frankcaron/.stormpath/apiKey.properties');    
    } catch (Exception $e) {
        throw new Exception("Dayum", 0, $e);
    }

    //Get values from file
    $key = $config['apiKey']['id'];
    $secret = $config['apiKey']['secret'];

    //Configure the service to connect given the API key file values
    StormpathService::configure($key, $secret);
<!-- {.php} -->

Once the application is configured with your key, create a Stormpath SDK [`ResourceManager`](/PHP/product-guide#Client) instance. The ResourceManager instance is your starting point for all operations with the Stormpath service:

    $resourceManager = StormpathService::getResourceManager();
<!-- {.php} -->

The `ResourceManager` instance is intended to be an application singleton. You should reuse this instance throughout your application code. You *should not* create multiple ResourceManager instances as it could negatively affect caching.

### Register your application with Stormpath

Registering an application with Stormpath allows that application to use Stormpath for its user management and authentication needs. Use the `ResourceManager` you instantiated and a new `Application` resource to do so as follows:

    use Stormpath\Resource\Application;

    //Create an Application resource
    $app = new Application;
    $app->setName('My Test PHP App');
    $app->setDescription('Test App created via PHP application');
    $app->setStatus('ENABLED');
    $app->setAutoCreateDirectory(true); //Automatically create a directory

    //Add the application to the ResourceManager
    $resourceManager->persist($app);
    
    try {
        //Create the application
        $resourceManager->flush();
    } catch (Exception $e) {
        throw new Exception("Error creating application: ", 0, $e);
    }
<!-- {.php} -->

Once the application is created, it will automatically create a `Directory` resource based on the name of application and set it as the default account store. New accounts will be created in the default account store.

### Create an account 

Now that we've created an `Application`, let's create an `Account` so someone can log in to (i.e. authenticate with) the application. To do so, use the `_setters_` of a new account instance to set the values and create the account in a directory as follows:

    //Use the applicationId to target your application (not the full href)
    $applicationId = $YOUR_APP_ID; //retrieve from $app.getHref() or Admin console
    $application = $resourceManager->find('Stormpath\Resource\Application', $applicationId);

    //Create the account resource
    $account = new Account;
    $account->setUsername("username");
    $account->setEmail("email");
    $account->setPassword("password");
    $account->setGivenName('First Name');
    $account->setMiddleName('Middle Name');
    $account->setSurname('Last Name');
    $account->setStatus('Enabled');

    //Assign the account to the application instantiated previously
    $account->setApplication($application);

    //Add the application to the ResourceManager
    $resourceManager->persist($account);

    //Create the application
    $resourceManager->flush();
<!-- {.php} -->

### Authenticate an Account

Now we have an account that can use your application.  But how do you authenticate an account logging in to the application? You use the application instance and a `LoginAttempt` resource as follows:

    use Stormpath\Exception\ApiException;
    use Stormpath\Resource\LoginAttempt;

    //Capture the username and password from the form
    $usernameOrEmail = "usernameOrEmail";
    $rawPassword = "password";

    //Create a new LoginAttempt
    $loginAttempt = new LoginAttempt;
    $loginAttempt->setUsername($usernameOrEmail); //get from form
    $loginAttempt->setPassword($rawPassword); //get from form
    $loginAttempt->setApplication($application);

    //Add the loginAttempt to the resourceManager
    $resourceManager->persist($loginAttempt);
  
    try {
        //Process the log in attempt
        $resourceManager->flush();
        //Get the authorized account back
        $authorizedAccount = $loginAttempt->getAccount();
    } catch (ApiException $e) {
        if ($e->getCode() == 400) {
            $userMessage = $e->getMessage();  # will = There is no account with that email address.
        }
    }
<!-- {.php} -->

If the authentication attempt fails, you will receive a `ApiException` which contains details of the error.

### Experiment! 

Use the ResourceManager instance to interact with your tenant data, such as applications, directories, and accounts:

    use Stormpath\Resource\Tenant;

    $currentTenant = $resourceManager->find('Stormpath\Resource\Tenant', 'current');

    //Print application name
    $applications = $currentTenant->getApplications();
    foreach ($applications as $application) {
        echo "Application Name: " . $application->getName() . "<br />";
    }

    //Print directory names
    $directories = $currentTenant->getDirectories();
    foreach ($directories as $directory) {
        echo "Application Name: " . $directory->getName() . "<br />";
    }
<!-- {.php} -->

***

## Next Steps

We hope you have found this Quickstart helpful!

For full coverage of Stormpath's PHP SDK, including how to edit application details, edit accounts, create groups and assign accounts to groups, reset passwords via password reset emails, and more, please see our [PHP Product Guide](/PHP/product-guide).