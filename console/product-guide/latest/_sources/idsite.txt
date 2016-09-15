.. _id-site:

*******
ID Site
*******

Stormpath ID Site is a set of hosted and pre-built user interface screens that take care of common identity functions for your applications. For a full description of what ID Site is and how it works, please see the `ID Site chapter of the REST Product Guide <https://docs.stormpath.com/rest/product-guide/latest/idsite.html>`__.

ID Site Set Up
===================

Your ID Site uses a default configuration for testing purposes, but can be fully configured to host customized code or to use your own custom domain.

To set up your ID Site, log into the `Administrator Console <https://api.stormpath.com/login>`_ and:

1. Click on the "ID Site" Tab.
2. Add your application URLs that will be allowed to process the callbacks from the ID Site to the "Authorized Redirect URIs" property. These URLs will be hosted by your application and will use the Stormpath SDK to process the security assertions about the user that ID Site sends back.
3. Click the "Update" button at the bottom of the page.

Once you configure your ID site, a default subdomain will be created on ``stormpath.io``. The default ID Site URL follows the format of ``tenant-name.id.stormpath.io`` where ``tenant-name`` is the name of your Stormpath Tenant.

.. note::

  Your ID Site URL can only be accessed via a redirect from a Stormpath-enabled application because ID Site expects a cryptographically signed token with specific data in it. Simply visiting your ID Site URL in a browser will give you an error.

For more advanced configurations, there are additional properties in the ID Site configuration that can help:

- Set a Logo to appear at the top of the default ID Site
- Set a custom domain name (like id.mydomain.com) and SSL certificate to host your ID Site from your domain, securely
- Set a custom GitHub repo to host your ID Site (to host custom code)

.. _idsite-custom-domain-ssl:

Setting Your Own Custom Domain Name and SSL Certificate
--------------------------------------------------------

By default, the address of your ID Site is ``tenant-name.id.stormpath.io``. However, you can change the address to a subdomain of your own website, such as ``id.mysite.com``. The Stormtrooper equipment application’s main website is ``imperialxchange.com``, so the initial address of the ID Site might be something like ``happy-rebel.id.stormpath.io``. You can change the ID Site’s address to a subdomain of your company website, like ``id.trooperxchange.com``. In our example, ImperialXchange.com is actually part of a family of sites owned by the parent company Galactic Gear. Galactic Gear wants single sign-on across its family of websites, so the ID Site is actually found at ``id.galacticgear.co``.

The workflow for changing the address consists of the following steps:

1. Get a domain name and a subdomain (if you have not already)
2. Configure the subdomain as an alias of your ID Site
3. Enable the custom domain in Stormpath’s ID Site configuration
4. Input SSL information for Stormpath to host

For more information on each of these steps, read on.

1. Get a Domain Name and a Subdomain
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Purchase and register a domain name with a domain registrar. You can purchase and register a domain name from any domain registrar, including GoDaddy, Yahoo! Domains, 1&1, Netregistry, or Register.com. For instructions, see the Help on the registrar’s website.

Create a subdomain for your domain for your ID Site. See the Help on the registrar’s website for instructions on adding a subdomain. You can call the subdomain “id”, “login” or something similar. Example: "id.galacticgear.com".

2. Make the Subdomain an Alias of your ID Site on Stormpath
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The next step is to make your subdomain an alias of your ID Site on Stormpath. An alias is simply an alternate address for a website. For example, you can make the addresses “id.galacticgear.com” and “happy-rebel.id.stormpath.io” interchangeable as far as web browsers are concerned.

To make your subdomain an alias of your ID Site website on Stormpath, you must use your domain registrar’s tools and UI. These steps will generally require you to:

- Log in to your domain registrar’s control panel.
- Look for the option to change DNS records.
- Locate or create the CNAME records for your domain.
- Point the CNAME record from your subdomain (ex. “id” or “login”) to your ID Site subdomain (ex. happy-rebel.id.stormpath.io)

.. note::

  It takes time for changes to the DNS system to be implemented. Typically, it can take anywhere from a few hours to a day, depending on your Time To Live (TTL) settings in the registrar’s control panel.


3. Enable the Custom Domain in Stormpath's ID Site Configuration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

After making your subdomain an alias of your ID Site on Stormpath, you must enable a custom domain in the Stormpath Admin Console. If you omit this step, your subdomain will point to a error page rather than your ID Site.

To set up a custom domain on ID Site, log into the Administrator Console and:

- Click on the "ID Site" Tab
- Click the "Custom" option under "Domain Name".
- Type in the subdomain for your ID Site (ex: id.galacticgear.com)
- Click the "Update" button at the bottom of the page

4. Set up SSL on your ID Site
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Since Stormpath is hosting the ID Site under your custom subdomain, to secure it using SSL you must provide the SSL certificate information to Stormpath. Creating SSL certificates is an involved task which requires working with a certificate authority such as Verisign and includes:

- Generating a certificate request (CSR) with a Distinguished Name (DN) that matches your subdomain (ex. id.galacticgear.com)
- Provide the CSR file to a certificate authority such as Verisign. The certificate authority generates a SSL certificate and gives it to you so that it can be installed on Stormpath’s servers.

Once the SSL certificate is retrieved from the certificate authority, you can log-in to the Administrator Console and configure SSL:

- Click on the ID Site Tab
- Open the zip to retrieve your .pem file if needed.
- Copy the text for the SSL certificate and Private Key to the appropriate text boxes on the ID Site Tab
- Click the Update button at the bottom of the page
- When the ID Site is updated, the SSL information is uploaded to Stormpath and will update your ID Site automatically.

.. _idsite-app-set-up:

Setting up your Application to use ID Site
===============================================

In order to set up your application to use ID Site, you will need to install the Stormpath SDK and register the application in Stormpath. The Stormpath SDK and hosted ID Site will do most of the work for your application, including signing and unpacking secure communication between themselves. For more information, please see the `relevant Stormpath SDK documentation <https://docs.stormpath.com/home/>`__.

.. _idsite-hosting:

Hosting ID Site Yourself
==============================

In Stormpath's Community Cloud (api.stormpath.com) and Enterprise Cloud (enterprise.stormpath.io), ID Site is automatically set up and hosted for you.

But sometimes customers might want full control and host ID site themselves.

.. note::

  These instructions can be followed for public cloud users as well if you determine that you want to host ID Site on your own.

ID Site is a static website and thus can be easily hosted on any type of web server. It must be secured with https. Below is one approach that is both robust and very low cost. It does require some knowledge of working on the command line and setting DNS (Domain Name Service) records.

The approach outlined below uses:

#. Amazon S3 to store and serve ID Site
#. Amazon Cloudfront to provide robust distributed delivery
#. Let's Encrypt to create free SSL certificates for your ID Site

.. _build-id-site:

Step 1: Build ID Site
---------------------
An in-depth discussion of customizing ID Site is out of scope for this documentation. More information can be found `here <https://github.com/stormpath/idsite-src>`__.

Before you start, ensure that you have the following installed:

- `npm <https://docs.npmjs.com/getting-started/installing-node>`_
- `bower <https://bower.io/>`_
- `grunt <http://gruntjs.com/>`_

To build ID Site, follow these steps:

.. code-block:: bash
   :linenos:

   git clone https://github.com/stormpath/idsite-src.git
   cd idsite-src
   npm install
   bower install
   grunt build

If you've followed the steps above, you will now have a built and minified ID Site in the ``dist`` folder.

.. _host-id-site-on-s3:

Step 2: Host ID Site on S3
-----------------------------

You will need to have an `AWS <http://aws.amazon.com/>`_ account setup for this step.

1. Log in to the Amazon AWS `Console <http://aws.amazon.com/console>`_.
2. Go to the `S3 services page <https://console.aws.amazon.com/s3>`_.
3. Click the **Create Bucket** button.

  .. figure:: images/idsite/create_bucket.png
    :align: center
    :scale: 100%
    :alt: Create Bucket button

4. Enter a name for the bucket and choose a region.

  .. figure:: images/idsite/bucket_name.png
    :align: center
    :scale: 100%
    :alt: Name the Bucket

5. Enable **Static Website Hosting** on the right side of the page, then click **Save**.

  .. figure:: images/idsite/enable_website.png
    :align: center
    :scale: 100%
    :alt: Name the Bucket

6. Update the bucket policy

   a. Open the **Permissions** section of the console

    .. figure:: images/idsite/bucket_permissions.png
      :align: center
      :scale: 100%
      :alt: Bucket permissions

   b. Click the **Add bucket policy** button

    .. figure:: images/idsite/bucket_policy_empty.png
      :align: center
      :scale: 100%
      :alt: Add bucket policy

   c. Enter the policy information

    .. code-block:: javascript

     {
       "Version":"2012-10-17",
       "Statement":[{
           "Sid":"PublicReadGetObject",
           "Effect":"Allow",
           "Principal": {
               "AWS": "*"
           },
           "Action":["s3:GetObject"],
           "Resource":["arn:aws:s3:::custom-idsite-host/*"]
       }]
     }

    .. note::

      Make sure that you use the name of your bucket for the "Resource" attribute.

7. Transfer the ID Site content to your bucket

  There are numerous tools you can use to transfer files to your S3 bucket.
  Below is an example using the AWS Command Line Interface.

  Here's the command to transfer the ID Site minified files to your S3 bucket:

  .. code-block:: bash

    AWS_ACCESS_KEY_ID=<your AWS access key> AWS_SECRET_ACCESS_KEY=<your AWS secret> \
    aws s3 sync dist/ s3://<your bucket name>

    upload: dist/images/logo.png to s3://<your bucket name>/images/logo.png
    upload: dist/favicon.ico to s3://<your bucket name>/favicon.ico
    upload: dist/robots.txt to s3://<your bucket name>/robots.txt
    upload: dist/error.html to s3://<your bucket name>/error.html
    upload: dist/styles/main.css to s3://<your bucket name>/styles/main.css
    upload: dist/scripts/iecompat.js to s3://<your bucket name>/scripts/iecompat.js
    upload: dist/scripts/app.js to s3://<your bucket name>/scripts/app.js
    upload: dist/index.html to s3://<your bucket name>/index.html
    upload: dist/scripts/vendor.js to s3://<your bucket name>/scripts/vendor.js

8. Confirm that ID Site is being served

  a. Make note of the **Endpoint** assigned to your S3 bucket

  .. figure:: images/idsite/website_domain_name.png
    :align: center
    :scale: 100%
    :alt: Endpoint

  b. Put that endpoint into your browser. You should see the "Sorry! There was a problem." message. This indicates that ID Site is, in fact, being served as a static website from Amazon S3.

  .. figure:: images/idsite/sorry.png
    :align: center
    :scale: 100%
    :alt: Sorry Message

.. _setup-cloudfront:

Step 3: Set up Cloudfront
-------------------------

Cloudfront speeds up response times for your static website and provides fault tolerance by automatically distributing it through a worldwide network of edge servers.

Follow these steps to set up Cloudfront:

1. Go the `Cloudfront Admin Console <https://console.aws.amazon.com/cloudfront>`_

  .. figure:: images/idsite/cloudfront_console.png
    :align: center
    :scale: 100%
    :alt: The CloudFront Console

2. Click the **Create Distribution** button

  .. figure:: images/idsite/cloudfront_delivery.png
    :align: center
    :scale: 100%
    :alt: Create Distribution

3. Click the **Get Started** button in the ``Web`` section

   Fill out the following on the form (leave the rest as defaults):

   #. Origin Domain Name: click in the field and you'll be able to select your S3 bucket
   #. Viewer Protocol Policy: Choose ``HTTP and HTTPS`` (we will circle back to this later to update)
   #. Object Caching: Choose **Customize**
   #. Default TTL: Set to ``360`` (you can make this a larger value once everything is set and working)
   #. Alternate Domain Names: Enter your custom domain name for your ID Site. You will need to setup a DNS CNAME for this later on.
   #. Default Root Object: Enter ``index.html`` here

   Scroll to the bottom and click the **Create Distribution** button.

   .. note::

     Pay attention to the Status column in the table of Cloudfront distributions. It can take some time until it's fully deployed. During this time, it will say: In Progress

   When the distribution is fully deployed, you should be able to browse to the assigned domain name. It will be something like: ``<random string>.cloudfront.net``. When you browse to ``https://<random string>.cloudfront.net`` you should see the "Sorry! There was a problem." message as before.

.. _setup-dns:

Step 4: Setup DNS to point to Cloudfront
----------------------------------------

You need to create a CNAME entry with your DNS provider. The source should be the domain you want to use for your ID Site, like: ``idsite.example.com``. The destination should be the assigned domain from Cloudfront, like: ``<random string>.cloudfront.net``

You should now be able to browse to the CNAME you setup. If you make an HTTPS connection to this domain name at this stage, you will see a certificate error in your browser. This is because the SSL certificate bound to ``cloudfront.net`` does not match your domain name. you will resolve this in the next step.

.. figure:: images/idsite/privacy_error.png
  :align: center
  :scale: 100%
  :alt: Privacy error

.. _create-ssl-cert:

Step 5: Install SSL Cert with Let's Encrypt
-------------------------------------------

There are any number of commercial SSL certificate providers with varying costs. For the purposes of this example, you are going to use the `Let's Encrypt <https://letsencrypt.org/>`_ service. There are two primary benefits:

1. Completely free SSL certificates and
2. There's a plugin for the Let's Encrypt client that will automatically install the SSL certificate into your Cloudfront distribution.

.. note::

  You will need the ``pip`` Python package installer to follow the steps in this section.

We'll start by installing the ``letsencrypt`` client and the ``s3front`` plugin.

.. code:: bash

   pip install letsencrypt
   pip install letsencrypt-s3front

Next, we'll use the s3front plugin to generate and install the certificate in your Cloudfront distribution

.. code:: bash

   AWS_ACCESS_KEY_ID=<your AWS access key> \
   AWS_SECRET_ACCESS_KEY=<your AWS secret> \
   letsencrypt --agree-tos -a letsencrypt-s3front:auth \
   --letsencrypt-s3front:auth-s3-bucket <your S3 bucket name> \
   -i letsencrypt-s3front:installer \
   --letsencrypt-s3front:installer-cf-distribution-id <your cloudfront distribution id> \
   -d <your custom domain name>

If all goes well, you will see a text-based confirmation screen.

.. figure:: images/idsite/letsencrypt_success.png
  :align: center
  :scale: 100%
  :alt: Letsencrypt Success

.. note::

  The Let's Encrypt SSL certificate is only valid for 90 days (that's what you get for free). However, you can simply re-run the command to install a new SSL certificate.

You can verify that your SSL backed ID Site is properly configured by going to the ``ssllabs`` test site:

``https://www.ssllabs.com/ssltest/analyze.html?d=<your DNS CNAME>``

To close out this section, you need to update the Cloudfront settings so that HTTP connections redirect to HTTPS.

#. Click on the the Cloudfront ID for your distribution to get into its settings.
#. Click the ``Behaviors`` tab.
#. Click the checkbox to the left of the configuration and click the ``Edit`` button.
#. Change the ``Viewer Protocol Policy`` to ``Redirect HTTP to HTTPS`` and click the ``Yes, Edit`` button on the bottom of the screen to save it.

.. _configure-stormpath:

Step 6: Configure Stormpath to use your ID Site
-----------------------------------------------

The last step is to set your Stormpath Admin Console to use your newly configured ID Site.

Browse to the `Admin Console <https://api.stormpath.com>`__ and click the ID Site tab. Enter your ID Site domain in the Domain Name field.

.. figure:: images/idsite/admin_console_idsite.png
  :align: center
  :scale: 100%
  :alt: Create distribution

Scroll to the bottom and click the ``Save`` button. That's all there is to it!

.. note::

  After ID Site is set up in this way, the ``SSL Public Certificate / Chain``, ``SSL Private Key``, ``Git Repository HTTPS URL``, and ``Git Repository Branch Name`` fields are all no longer used.

From this point forward, all you need to do to update your ID Site is to publish the minified contents to the S3 bucket like you did earlier. It may take some time for the updates to propagate to all the Cloudfront edge nodes.

Step 7: Make a test change
---------------------------

Let's test making a change to the ID Site content and see it in action.

1. Edit the ``app/views/login.html``

  Add ``<h2>Custom!</h2>`` just before the line containing ``<span>Log In</span>``.

  .. figure:: images/idsite/custom_login.png
    :align: center
    :scale: 100%
    :alt: Custom login

2. Build ID Site as before

  .. code:: bash

    grunt build

3. Publish the ``dist`` contents to your S3 bucket as before

  .. code:: bash

    AWS_ACCESS_KEY_ID=<your AWS access key> AWS_SECRET_ACCESS_KEY=<your AWS secret> \
    aws s3 sync dist/ s3://<your bucket name>

Now, you can see your change in action. You'll need to fire up an example application that uses ID Site.

The screenshot below shows the ``/login`` endpoint response from ID Site:

.. figure:: images/idsite/custom_login_response.png
  :align: center
  :scale: 100%
  :alt: Custom login response

As you can see, ID Site is using the custom domain you set up and is showing the customized content.