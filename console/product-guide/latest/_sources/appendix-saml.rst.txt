.. _directories-saml-sp:

***************
Appendix: SAML
***************

This section will show you how to set-up Stormpath to allow your users to log in with a SAML-enabled Identity Provider via either the Service Provider (SP) or Identity Provider (IdP) Initiated flows. Examples of Identity Providers that you can integrate with include Salesforce and OneLogin.

**What are the Service Provider and Identity Provider Initiated flows?**

In the Service Provider (SP) -initiated flow, the user starts at your application. From a login page (either ID Site or one inside your Stormpath-powered application), the user is redirected to the Identity Provider. After authenticating with the Identity Provider, the user is returned to the application in an authenticated state.

In the Identity Provider (IdP) Initiated flow, the user starts at the Identity Provider. After logging-in to the IdP, the user selects the Stormpath-enabled web application from within the IdP’s site, and is redirected to the application in an authenticated state.

For more, see the `Product Guide <https://docs.stormpath.com/rest/product-guide/latest/auth_n.html#the-stormpath-saml-flow>`__. Feel free to toggle to the language of your choice by clicking on "Switch Language" in the upper left-hand corner of the page.

**Configuring Service Provider vs Identity Provider Initiated**

The only difference in configuration steps between the two kinds of flows is that the Identity Provider-initiated flow requires you to generate a Default Relay State. For more information, see the configuration steps for your particular Identity Provider below.

**Requirements**

These instructions assume that you have two things:

- A Stormpath account with `a plan that supports SAML <https://stormpath.com/pricing>`__

- A developer Account with one of the following Identity Providers who support SAML:

    - :ref:`Salesforce <create-salesforce>`
    - :ref:`OneLogin <create-onelogin>`
    - :ref:`Okta <create-okta>`
    - :ref:`Ping Identity <create-ping>`
    - :ref:`G-Suite <create-gsuite>`

We also provide authentication against an **Active Directory** via :ref:`ADFS SAML <create-adfs>` and :ref:`Azure AD <create-azure>`.

.. note::

  These are not the only SAML-enabled Identity Providers that Stormpath can integrate with, but they are the ones that have been tested and verified as working.

  Currently, IdP-initiated SAML configuration instructions are only available for:

  - OneLogin
  - Okta
  - Ping Identity
  - G-Suite
  - Active Directory via ADFS

Test it out!
^^^^^^^^^^^^

Once you finish the below steps to get either SP-initiated or IdP-initiated SAML working with your Identity Provider, you can test out both workflows.

To test out the SP-initiated flow, click on your newly created Stormpath SAML Directory and navigate to the "Configuration Test" tab. Select the Stormpath Application that you mapped your SAML Directory to, and select the API key that you used to start your Application. Next, click on "Start Test" and follow the prompt.

If you run into any errors, click on the question mark by the step you're having trouble with. This will redirect you to the documentation that explains the process and provides helpful debugging hints.

To test out the IdP-initiated flow, navigate to your Identity Provider and log in. Next, launch your SAML Application. If everything has been set up correctly, you will be immediately redirected to the callback URI you configured with a secure JWT passed as a URL parameter. This callback URI will validate the JWT, exchange it for an access and refresh token, and redirect you to the nextUri that you configured.

.. _create-salesforce:

Salesforce
^^^^^^^^^^

Stormpath's Salesforce integration is only compatible with the Service Provider-initiated flow.

.. contents::
    :local:
    :depth: 1

Step 1: Set-up Salesforce
"""""""""""""""""""""""""

.. note::

    Before you start, make sure that you have set-up a Salesforce subdomain for your organization. You can do this under **Administer** > **Domain Management** > **My Domain**.

1.1. Set-up Salesforce
++++++++++++++++++++++++++++++++++

#. Under **Administer**, click on **Security Controls** > **Identity Provider**

#. Click on **Enable Identity Provider**.

#. You should now be on the "Identity Provider Setup" page, with a single security certificate in the drop down menu. Click on **Save**.

#. You will now be back on the "Identity Provider" page. Click **Download Certificate**, which will download a .crt file with a name starting with ``SelfSignedCert``.

#. Open this file in your text editor of choice. The contents will be an x509 certificate starting with the line ``-----BEGIN CERTIFICATE-----`` and ending with ``-----END CERTIFICATE-----``. The contents of this file are your "SAML X.509 Signing Cert".

#. Also click on **Download Metadata**, which will download an XML file which you will use in step 2.

1.2. Set-up Single Sign On
++++++++++++++++++++++++++

#. From **Administer**, click on **Security Controls** then **Single Sign-On Settings**.

#. Click **Edit**, and on the next page check "SAML Enabled" and then click **Save**.

#. Under "SAML Single Sign-On Settings" click on **New from Metadata File**.

#. Select the metadata XML file that you downloaded in step 1.1 above, then click **Create**.

1.3. Create a Connected App
+++++++++++++++++++++++++++

Every Salesforce app will need its own Stormpath Directory. The users for that Salesforce app will only be able to log in if that application's information is properly entered into a corresponding Stormpath Directory.

.. note::

  If you already have a Salesforce application with SAML enabled, you can skip to Step 4 here.

#. In the navigation pane on the left, under **Build**, find the **Create** section, then click on **Apps**.

#. From the "Apps" page, find the "Connected Apps" section and click the **New** button.

#. Enter in your information.

#. Click on **Enable SAML**

#. For the "Entity ID" field enter in ``changeme`` as a temporary value

#. For the "ACS URL" you will also enter in a temporary value: ``http://example.com``

#. For "Name ID Format" select the "emailAddress" format. Unlike the other two, this value is not temporary.

#. Click **Save**.

1.4. Get your SSO URLs
++++++++++++++++++++++

You will now be on your Connected App's page.

#. Click **Manage**

#. Under "SAML Login Information", copy the "SP-Initiated Redirect Endpoint". It will be a URL ending in ``idp/endpoint/HttpRedirect``. This value will be used for both your "SSO Login URL" and "SSO Logout URL" when you are setting up your Stormpath SAML Directory.

Step 2: Create Your SAML Directory in Stormpath
"""""""""""""""""""""""""""""""""""""""""""""""

You will now create your SAML Directory in Stormpath, using the values you gathered in the previous step. Then you will use information from this newly-created Directory to configure Stormpath as a Service Provider in Salesforce in the next step.

2.1. Create Your SAML Directory
+++++++++++++++++++++++++++++++

#. Log in to the Stormpath Admin Console: https://api.stormpath.com

#. Click on the **Directories** tab.

#. Click on **Create Directory**.

#. From the "Directory Type" drop-down menu, select "SAML", which will bring up a Directory creation dialog.

#. Next, enter in a name and (optionally) a description, then set the Directory's status to "Enabled".

#. For both the "SAML SSO Login Url" and "SAML SSO Logout Url" fields, you will enter in the URL gathered in step 1.4 above.

#. For the "SAML X.509 Signing Cert" field, paste in the text content from the IdP certificate you downloaded in step 1.1.

#. Finally, select "RSA-SHA256" as the "SAML Request Signature Algorithm".

#. Once all this information is entered, click on **Create Directory**. At this point, you will arrive back on the main Directories page.

2.2. Gather Your SAML Directory Information
+++++++++++++++++++++++++++++++++++++++++++

Find and click on your new SAML Directory.

On this page, you will need the follow information:

- The Directory's "HREF" found at the very top.

- The "Assertion Consumer Service URL" found in the "SAML Identity Provider Configuration" section:

We will now input these values into the Identity Provider.

Step 3: Configure Your Service Provider in Salesforce
""""""""""""""""""""""""""""""""""""""""""""""""""""""

Back on your Connected App's page (found under **Administer** > **Connected Apps**), click **Edit**.

You will now enter in your Directory information:

#. For the "Entity ID", you will need to enter in the Directory "HREF" for your SAML Directory.

#. The "ACS URL" is the "Assertion Consumer Service URL" from the previous step.

#. Click **Save**

#. Under the "Profiles" section, you will need to click on **Manage Profiles** and select profiles appropriate to the users that will be logging in to your app. For more information about profiles, see the `Salesforce documentation <https://help.salesforce.com/apex/HTViewHelpDoc?id=admin_userprofiles.htm&language=en>`__.

Step 4: Configure Your Application in Stormpath
"""""""""""""""""""""""""""""""""""""""""""""""

We will now complete the final steps in the Stormpath Admin Console: adding one or more Callback URIs to the Stormpath Application, and mapping your SAML Directory to your Application.

#. Switch back to the `Stormpath Admin Console <https://api.stormpath.com>`__ and go to the **Applications** tab.

#. Select the Application that will be using the SAML Directory.

#. On the main "Details" page, you will see "Authorized Callback URIs". You should include here a list of the URLs that your users will be redirected to at the end of the SAML authentication flow. Note that the Authorized Callback URIs cannot exceed 4000 characters in total length.

#. Next click on **Account Stores** in the navigation pane.

#. Once you are on your Application's Account Stores page, click **Add Account Store**. This will bring up the "Map Account Store" dialog.

#. Ensure that you are in the "Directories" tab and select your SAML Directory from the list.

#. Click **Create Mappings**.

You have now completed the initial steps of setting-up log in via Salesforce.

Step 5: (Optional) Configure Your Attribute Mappings
""""""""""""""""""""""""""""""""""""""""""""""""""""

When a new Account logs in via SAML, Salesforce sends along a number of SAML attributes. These attributes are mapped to Stormpath `Account attributes <https://docs.stormpath.com/rest/product-guide/latest/reference.html#account>`__ (such as ``givenName`` or ``email``) and these values are either stored, if the Account is new, or updated, if the Account exists but the values are different. In this step you will configure how these Salesforce SAML Attributes are mapped to Stormpath attributes.

5.1. Find the Existing SAML Attributes
++++++++++++++++++++++++++++++++++++++

If you have already successfully set-up SAML and authenticated a user with your app, you will be able to retrieve the SAML Attributes that Salesforce sends by retrieving the new user Account that was created inside Stormpath.

Specifically, you want that Account's ``providerData`` resource, which you can see by clicking on the "HREF" link on the Account's main page, then following the `providerData` `href` :

.. code-block:: json

  {
    "href":"https://api.stormpath.com/v1/accounts/xbKQemsqSForceXAMPLE/providerData",
    "createdAt":"2016-01-20T17:56:25.532Z",
    "modifiedAt":"2016-01-20T17:57:22.530Z",
    "email":"saml+testuser@email.com",
    "is_portal_user":"false",
    "providerId":"saml",
    "userId":"00536000000G4ft",
    "username":"saml+testuser@email.com"
  }

Everything here other than ``href``, ``createdAt`` and ``modifiedAt`` are Attributes passed by Salesforce.

Now the ``email`` Attribute has already been passed as part of the Account creation, but you can also map the other SAML Attributes to Stormpath Account attributes as well.

5.2. Add Any Additional Attributes You Want
++++++++++++++++++++++++++++++++++++++++++++++++++++++

If there are other attributes that you would like Salesforce to pass, you can configure this. From your Salesforce settings page:

#. Under **Administer**, click on **Connected Apps**.
#. Select the App you would like to configure.
#. On the App's page, find the "Custom Attributes" section and click on **New**
#. You will now be on the "Create Custom Attribute" page
#. Here you will specify a custom "Attribute key" and then select which Salesforce user information you want it to represent.

For example:

* You could make the "Attribute key": ``firstname``
* Then click on **Insert Field**
* From here you would select **$User >** and **First Name** then click **Insert**
* Click **Save**

You will now be returned to your App's main page, and you will see the attribute you just added in the "Custom Attributes" section. You can add as many attributes as you wish.

5.3. Specify Your Mapping
+++++++++++++++++++++++++

#. Go to your `Stormpath Admin Console <https://api.stormpath.com/>`__
#. Click on the **Directories** tab
#. Select your Salesforce SAML Directory
#. Under the "SAML Attribute Statement Mapping Rules" section you will see three fields: "Name", "Name Format", and "Stormpath Attributes"
#. Here you will enter the Salesforce attribute name under "Name"
#. (Optional) Under "Name Format" you can enter ``urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified``
#. Finally, enter the Account attribute(s) that you would like this Salesforce attribute to map to

For example, using the custom attribute from Step 4.2 above:

* For the "Name" enter ``firstname``
* For "Stormpath Attributes" enter ``givenName``

If a user now logs in, Stormpath will take the ``firstname`` SAML attribute and map it to the ``givenName`` field on the Stormpath Account resource.

.. _create-onelogin:

OneLogin
^^^^^^^^

OneLogin is compatible with both the Service Provider and Identity Provider -initiated flows. The steps are identical except where indicated.

.. contents::
    :local:
    :depth: 1

Step 1: Set-up OneLogin
"""""""""""""""""""""""

Every OneLogin application will need its own Stormpath Directory. The users for that OneLogin application will only be able to log in if that application's information is properly entered into a corresponding Stormpath Directory.

.. note::

  If you already have a OneLogin application of this type (``SAML Test Connector (IdP w/ attr w/ sign response)``), you can skip this step.

#. Complete the OneLogin set-up, including adding your subdomain, users, etc.

#. On the "Find Applications" page, search for "SAML"

#. Select **SAML Test Connector (IdP w/ attr w/ sign response)**

#. Give your app a name and click **Save**

Step 2: Gather Your OneLogin Information
"""""""""""""""""""""""""""""""""""""""""""""""""

You will now need to gather the following pieces of information from your OneLogin application:

- X.509 Signing Certificate
- SSO Login URL
- SSO Logout URL
- Request Signature Algorithm

To start, click on **SSO** in your App's navigation pane.

2.1 IdP Signing Certificate
+++++++++++++++++++++++++++

#. Under "X.509 Certificate", click on **View Details**. This will take you to the certificate details page.

#. Copy the contents of the "X.509 Certificate" text box, starting with the line ``-----BEGIN CERTIFICATE-----`` and ending with ``-----END CERTIFICATE-----``. The contents of this file are your "SAML X.509 Signing Cert".

2.2. The SSO Login / Logout URLs
++++++++++++++++++++++++++++++++

Return to the **App** > **SSO** section. On this page there are two different URLS:

#. Copy the "SAML 2.0 Endpoint (HTTP)", which is the "SSO Login URL" that Stormpath needs, and
#. Copy the "SLO Endpoint (HTTP)", which is the "SSO Logout URL".

Step 3: Create Your SAML Directory in Stormpath
"""""""""""""""""""""""""""""""""""""""""""""""

We will now create your SAML Directory in Stormpath, using the values you gathered in the previous step. Then you will use information from this newly-created Directory to configure Stormpath as a Service Provider in OneLogin in the next step.

3.1. Create Your SAML Directory
+++++++++++++++++++++++++++++++

#. Log in to the Stormpath Admin Console: https://api.stormpath.com

#. Click on the **Directories** tab.

#. Click on **Create Directory**.

#. From the "Directory Type" drop-down menu, select "SAML", which will bring up a Directory creation dialog.

#. Next, enter in a name and (optionally) a description, then set the Directory's status.

#. For "SAML SSO Login Url" paste in the "SAML 2.0 Endpoint (HTTP)" from the OneLogin site.

#. For "SAML SSO Logout Url" fields, paste in the "SLO Endpoint (HTTP)" from step 1.2 above.

#. For the "SAML X.509 Signing Cert" field, paste in the text content from the IdP certificate in step 1.1.

#. Finally, select "RSA-SHA256" as the "SAML Request Signature Algorithm".

#. Once all this information is entered, click on **Create Directory**. At this point, you will arrive back on the main Directories page.

3.2. Gather Your SAML Directory Information
+++++++++++++++++++++++++++++++++++++++++++

#. Find and click on your new SAML Directory.

#. Copy the "Assertion Consumer Service URL" found in the "Identity Provider" tab of the "SAML Configuration" section.

.. note::

    You should leave this page open, since you'll be back here in Step 4.

We will now input this value into the Identity Provider.

3.3. (IdP-initiated Flow Only) Generate a RelayState
++++++++++++++++++++++++++++++++++++++++++++++++++++

If you are looking to use the IdP-initiated flow, you will also need to click on **Generate Default RelayState**.

This will bring up a dialog box where you will have to specify the Application that you are generating the RelayState for, as well as the API Key that this Application uses.

Optionally, you can also indicate which Organization and Callback URI will use this RelayState.

.. note::

  All of the values here must be in some way associated to your Directory. So the Application you specify must have this Directory as an Account Store, the Callback URI should be one from the Application's list of URIs, etc.

Once you have selected all of the desired values, click **Generate**.

This will bring up the generated Default RelayState JWT. You will need this in the next step.

Step 4: Configure Your Service Provider in OneLogin
""""""""""""""""""""""""""""""""""""""""""""""""""""

1. Back in your OneLogin App's settings page (found under **Apps** > **Company Apps**), click **Configuration** in the App's navigation pane.

2. Copy your Directory's "Assertion Consumer Service URL" into both the "ACS (Consumer) URL Validator" and "ACS (Consumer) URL" fields.

3. *(IdP-initiated Flow Only)* Copy the RelayState JWT from Step 3.3 into the "RelayState" box.

4. Now click on **Parameters** in the App navigation pane. On this page, you need to ensure that your "Email (SAML NameID)" field has the value "Email", which it should by default.

Step 5: Configure Your Application in Stormpath
"""""""""""""""""""""""""""""""""""""""""""""""

We will now complete the final steps in the Stormpath Admin Console: adding one or more Callback URIs to the Application, and mapping your SAML Directory to your Application.

#. Switch back to the `Stormpath Admin Console <https://api.stormpath.com>`__ and go to the **Applications** tab.

#. Select the Application that will be using the SAML Directory.

#. On the main "Details" page, you will see "Authorized Callback URIs". You should include here a list of the URLs that your users will be redirected to at the end of the SAML authentication flow. Note that the Authorized Callback URIs cannot exceed 4000 characters in total length.

#. Next click on **Account Stores** in the navigation pane.

#. Once you are on your Application's Account Stores page, click "Add Account Store". This will bring up the "Map Account Store" dialog.

#. Ensure that you are in the "Directories" tab and select your SAML Directory from the list.

#. Click **Create Mappings**.

You have now completed the initial steps of setting-up log in via OneLogin.

Step 6: (Optional) Configure Your Attribute Mappings
""""""""""""""""""""""""""""""""""""""""""""""""""""

When a new Account logs in via SAML, OneLogin sends along a number of SAML attributes. These attributes are mapped to Stormpath `Account attributes <https://docs.stormpath.com/rest/product-guide/latest/reference.html#account>`__ (such as ``givenName`` or ``email``) and these values are either stored, if the Account is new, or updated, if the Account exists but the values are different. In this step you will configure how these OneLogin SAML Attributes are mapped to Stormpath attributes.

6.1. Find the Existing SAML Attributes
++++++++++++++++++++++++++++++++++++++

If you have already successfully set-up SAML and authenticated a user with your app, you will be able to retrieve the SAML Attributes that OneLogin sends by retrieving the new user Account that was created inside Stormpath.

Specifically, you want that Account's ``providerData`` resource, which you can see by clicking on the "HREF" link on the Account's main page, then following the `providerData` `href` :

.. code-block:: json

  {
    "href":"https://api.stormpath.com/v1/accounts/2i6RxkcOneLogineXaMPle/providerData",
    "createdAt":"2016-01-21T18:11:09.838Z",
    "modifiedAt":"2016-01-21T18:13:39.102Z",
    "PersonImmutableID":"samltestuser",
    "User.FirstName":"John",
    "User.LastName":"Samlton",
    "User.email":"saml+testuser@example.com",
    "providerId":"saml"
  }

Everything here other than ``href``, ``createdAt`` and ``modifiedAt`` are Attributes passed by OneLogin.

Now the ``email`` Attribute has already been passed as part of the Account creation, but you can also map the other attributes to Stormpath Account attributes as well.

6.2. Add Any Additional Attributes You Want
++++++++++++++++++++++++++++++++++++++++++++++++++++++

If there are other attributes that you would like OneLogin to pass, you can configure this. From your OneLogin settings page:

#. Click on **Apps** > **Company Apps**
#. Select the App that you want to configure
#. From the App's page, click on **Parameters**
#. If you want to add any additional parameters, click on **Add parameter**
#. In the "New Field" dialog box, give the attribute whatever name you wish, and select **Include in SAML assertion**
#. Back on the "Parameters" page, click on your new Attribute. This will bring up the "Edit Field" dialog
#. Select the "Value" that you would like this Attribute to represent. This is the piece of user information OneLogin stores that you would like to be transferred to Stormpath in your Attribute.
#. Click **Save**

For example:

* For "Field name" enter ``companyName`` and check "Include in SAML assertion"
* For the "Value" you would choose "Company"

You will now be returned to your App's main page, and you will see the attribute you just added in the "Custom Attributes" section. You can add as many attributes as you wish.

6.3. Specify Your Mapping
+++++++++++++++++++++++++

#. Go to your `Stormpath Admin Console <https://api.stormpath.com/>`__
#. Click on the **Directories** tab
#. Select your OneLogin SAML Directory
#. Under the "SAML Attribute Statement Mapping Rules" section you will see three fields: "Name", "Name Format", and "Stormpath Attributes"
#. Here you will enter the OneLogin attribute name under "Name"
#. (Optional) Under "Name Format" you can enter ``urn:oasis:names:tc:SAML:2.0:attrname-format:basic``
#. Finally, enter the Account attribute(s) that you would like this OneLogin attribute to map to

For example, you could enter:

* For the "Name" enter ``User.FirstName``
* For "Stormpath Attributes" enter ``givenName``

If a user now logs in, Stormpath will take the ``User.FirstName`` attribute and map it to the ``givenName`` field on the Account resource.

.. _create-okta:

Okta
^^^^

Okta is compatible with both the Service Provider and Identity Provider -initiated flows. The steps are identical except where indicated.

.. contents::
    :local:
    :depth: 1

Step 1: Set-up Okta
"""""""""""""""""""

Every Okta application will need its own Stormpath Directory. The users for that Okta application will only be able to log in if that application's information is properly entered into a corresponding Stormpath Directory.

.. note::

  If you already have an Okta application, you can skip to Step 5.

#. Log in to your Okta Administrator Account. From the landing page click on **Admin** to go to your Admin Dashboard.

#. From here, click on **Add Applications** in the shortcuts on the right.

#. Click on **Create New App**, which will bring up a "Create a New Application Integration" dialog.

#. Select "SAML 2.0" and click **Create**.

#. Enter in the information on the "General Settings" page and then click **Next**.

#. For now you will enter dummy data here, and then return later to input the actual values. For both the "Single sign on URL" and "Audience URI", enter in the dummy value ``http://example.com/``

#. For the "Name ID format" select "EmailAddress".

#. Click **Next** at the bottom of the page.

#. On the "Feedback" page, select **I'm an Okta customer adding an internal app** and **This is an internal app that you have created**, then select **Finish**.

You will now arrive at your App's Admin page.

#. Click on **View Setup Instructions**

Step 2: Gather Information From Okta
""""""""""""""""""""""""""""""""""""""""""""""""""""""

You will now need to gather the required information from Okta:

#. Copy the "Identity Provider Single Sign-On URL". This will be the value for both the "SSO Login URL" and "SSO Logout URL" in your Stormpath configuration.

#. Copy the contents of the "X.509 Certificate" text box, starting with the line ``-----BEGIN CERTIFICATE-----`` and ending with ``-----END CERTIFICATE-----``. The contents of this file are your "SAML X.509 Signing Cert".

#. By default, Okta uses the SHA-256 signature algorithm for all self-signed certificates. Click on the **General** tab in the App navigation pane, and look under "SAML Settings" to confirm that the Signature Algorithm is "RSA_SHA256".

.. note::

  It is recommended that you stay on this page, as you will be returning here in Step 3 to add more configuration details.

Step 3: Create Your SAML Directory in Stormpath
""""""""""""""""""""""""""""""""""""""""""""""""""""

We will now create your SAML Directory in Stormpath, using the values you gathered in the previous step. Then you will use information from this newly-created Directory to configure Stormpath as a Service Provider in the IdP in the next step.

3.1. Create Your SAML Directory
+++++++++++++++++++++++++++++++

#. Log in to the Stormpath Admin Console: https://api.stormpath.com

#. Click on the **Directories** tab.

#. Click on **Create Directory**.

#. From the "Directory Type" drop-down menu, select "SAML", which will bring up a Directory creation dialog.

#. Next, enter in a name and (optionally) a description, then set the Directory's status.

#. For both "SAML SSO Login Url" and "SAML SSO Logout URL" paste in the "Identity Provider Single Sign-On URL" from above.

#. For the "SAML X.509 Signing Cert" field, paste in the text content from the IdP certificate in Step 2.

#. Finally, select "RSA-SHA256" as the "SAML Request Signature Algorithm".

#. Once all this information is entered, click on **Create Directory**. At this point, you will arrive back on the main Directories page.

3.2. Gather Your SAML Directory Information
+++++++++++++++++++++++++++++++++++++++++++

#. Find and click on your new SAML Directory.

In the "SAML Identity Provider Configuration" section:

#. Copy the "Entity ID" URN.

#. Copy the "Assertion Consumer Service URL".

We will now input these values into the Identity Provider.

3.3. (IdP-initiated Flow Only) Generate a RelayState
++++++++++++++++++++++++++++++++++++++++++++++++++++

If you are looking to use the IdP-initiated flow, you will also need to click on **Generate Default RelayState**.

This will bring up a dialog box where you will have to specify the Application that you are generating the RelayState for, as well as the API Key that this Application uses.

Optionally, you can also indicate which Organization and Callback URI will use this RelayState.

.. note::

  All of the values here must be in some way associated to your Directory. So the Application you specify must have this Directory as an Account Store, the Callback URI should be one from the Application's list of URIs, etc.

Once you have selected all of the desired values, click **Generate**.

This will bring up the generated Default RelayState JWT. You will need this in the next step.

Step 4: Configure Your Service Provider in Okta
"""""""""""""""""""""""""""""""""""""""""""""""""""

#. Back in your App's "General" tab, find the "SAML Settings" section and click **Edit**.

#. From the "General Settings" page click **Next**.

#. You will now be on the "Configure SAML" page. Copy your Directory's "Assertion Consumer Service URL" into the "Single sign on URL" field, replacing the dummy value.

#. Copy the "Entity ID" URN into the "Audience URI (SP Entity ID)", also replacing the dummy value.

#. *(IdP-initiated Flow Only)* Copy the RelayState JWT from Step 3.3 into the "Default RelayState" box.

Step 5: Configure Your Application in Stormpath
"""""""""""""""""""""""""""""""""""""""""""""""

We will now complete the final steps in the Stormpath Admin Console: adding one or more Callback URIs to the Application, and mapping your SAML Directory to your Application.

#. Switch back to the `Stormpath Admin Console <https://api.stormpath.com>`__ and go to the **Applications** tab.

#. Select the Application that will be using the SAML Directory.

#. On the main "Details" page, you will see "Authorized Callback URIs". You should include here a list of the URLs that your users will be redirected to at the end of the SAML authentication flow. Note that the Authorized Callback URIs cannot exceed 4000 characters in total length.

#. Next click on **Account Stores** in the navigation pane.

#. Once you are on your Application's Account Stores page, click "Add Account Store". This will bring up the "Map Account Store" dialog.

#. Ensure that you are in the "Directories" tab and select your SAML Directory from the list.

#. Click **Create Mappings**.

You have now completed the initial steps of setting-up login via Okta.

Step 6: (Optional) Configure Your Attribute Mappings
""""""""""""""""""""""""""""""""""""""""""""""""""""

When a new Account logs in via SAML, Okta sends along a number of SAML attributes. These attributes are mapped to Stormpath `Account attributes <https://docs.stormpath.com/rest/product-guide/latest/reference.html#account>`__ (such as ``givenName`` or ``email``) and these values are either stored, if the Account is new, or updated, if the Account exists but the values are different. In this step you will configure how these IdP SAML Attributes are mapped to Stormpath attributes.

6.1. Find the Existing SAML Attributes
++++++++++++++++++++++++++++++++++++++

If you have already successfully set-up SAML and authenticated a user with your app, you will be able to retrieve the SAML Attributes that Okta sends by retrieving the new user Account that was created inside Stormpath.

Specifically, you want that Account's ``providerData`` resource, which you can see by clicking on the "HREF" link on the Account's main page, then following the `providerData` `href` :

.. code-block:: json

  {
    "href":"https://api.stormpath.com/v1/accounts/6Y2ViNhE5GOktaExample/providerData",
    "createdAt":"2016-03-09T18:16:16.116Z",
    "modifiedAt":"2016-03-25T14:49:30.098Z",
    "providerId":"saml"
  }

As you can see there are no default attributes passed by Okta, but you can map any attributes you like to the Stormpath Account attributes as well.

6.2. Add Any Additional Attributes You Want
++++++++++++++++++++++++++++++++++++++++++++++++++++++

If there are attributes that you would like Okta to pass, you can configure this. From your Okta Admin settings page:

#. Click on the **Applications** tab in the top navigation pane
#. Select your Application
#. In the "SAML Settings" section, click on **Edit**
#. You will arrive on "General Settings", click **Next**
#. On the "Configure SAML" page, you will see a section called "Attribute Statements". Here you can specify whatever additional attributes that you would like to be sent.

For example:

* For "Name" enter ``firstName``
* (Optional) For "Name format" you can select "Basic"
* For the "Value" you would choose "user:firstName"
* Click "Next" and on the next page "Finish"

You will now be returned to your App's "Sign on" page. If you click on the "General" tab, you will see the attribute you just added in the "Attribute Statements" section. You can add as many attributes as you wish.

6.3. Specify Your Mapping
+++++++++++++++++++++++++

#. Go to your `Stormpath Admin Console <https://api.stormpath.com/>`__
#. Click on the **Directories** tab
#. Select your Okta SAML Directory
#. Under the "SAML Attribute Statement Mapping Rules" section you will see three fields: "Name", "Name Format", and "Stormpath Attributes"
#. Here you will enter the Okta attribute name under "Name"
#. (Optional) Under "Name Format" you can enter ``Basic``.
#. Finally, enter the Account attribute(s) that you would like this Okta attribute to map to.

For example, you could enter:

* For the "Name" enter ``firstName``
* For "Stormpath Attributes" enter ``givenName``

If a user now logs in, Stormpath will take the ``firstName`` attribute and map it to the ``givenName`` field on the Account resource.

.. note::

  If you do choose to enter in an "Attribute Name Format" in Stormpath, it must match the SAML "NameFormat" passed by Okta. To ensure that you are entering the right one you can click on **Preview the SAML Assertion** on the "Configure SAML" page in your Okta application.

.. _create-ping:

Ping
^^^^^^^^^^

Ping is only compatible with the Service Provider-initiated flow.

.. contents::
    :local:
    :depth: 1

Step 1: Set-up Ping
"""""""""""""""""""""""""

#. Log in to your PingOne account: https://admin.pingone.com/web-portal/login
#. Click on the **Applications** tab on the top navigate pane.
#. Click on **Add Application** > **New SAML Application**
#. Fill in the information, the click on **Continue to Next Step**

Step 2: Gather Your Ping Information
""""""""""""""""""""""""""""""""""""""""""""""""""

You will now need to gather the following pieces of information:

- X.509 Signing Certificate
- SSO Login URL
- SSO Logout URL

Click on **Download** beside SAML Metadata, this will download ``saml2-metadata-idp.xml``, which you need to open in a text editor of your choice. you will now retrieve the above information from this XML file.

2.1 IdP Signing Certificate
+++++++++++++++++++++++++++

#. Inside the ``<ds:X509Certificate>`` assertion you will find the text of the x509 certificate. Unfortunately it is not in the PEM encoded format that Stormpath requires.
#. Copy and paste the content of this certificate into a new text file, ensuring that all of the text is fully left-justified.
#. Add a newline at the top of the certificate and add this: ``-----BEGIN CERTIFICATE-----``
#. Next add this to the bottom of the certificate: ``-----END CERTIFICATE-----``

What you should now have is something that looks like this:

.. code-block:: none

  -----BEGIN CERTIFICATE-----
  MIIDaDCCAlCgAwIBAgIGAVQ0xF8mMA0GCSqGSIb3DQEBCwUAMHUxCzAJBgNVBAYTAlVTMQswCQYD
  {More certificate content here}
  8bMh4fe2s1wR6pDkVjgEwu0DW2zBcXSg9KuT3lcWEUIq3Bct7Cdng12C0zXbgnQJAFtzHYbXAwkG
  sh3WzqLNeYeoU5sGPWhlvNR7n2R1
  -----END CERTIFICATE-----


2.2. The SSO Login / Logout URLs
+++++++++++++++++++++++++++++++++

#. For the "SSO Login URL", find the ``SingleSignOnService Location`` assertion, which should look something like this: ``https://sso.connect.pingidentity.com/sso/idp/SSO.saml2?idpid={hash}``
#. For the "SSO Logout URL", find the ``SingleLogoutService Location`` assertion, which should be exactly this: ``https://sso.connect.pingidentity.com/sso/SLO.saml2``


Step 3: Create Your SAML Directory in Stormpath
""""""""""""""""""""""""""""""""""""""""""""""""""

You will now create your SAML Directory in Stormpath, using the values you gathered in the previous step. Then you will use information from this newly-created Directory to configure Stormpath as a Service Provider in the IdP in the next step.

2.1. Create Your SAML Directory
++++++++++++++++++++++++++++++++++

#. Log in to the Stormpath Admin Console: https://api.stormpath.com

#. Click on the **Directories** tab.

#. Click on **Create Directory**.

#. From the "Directory Type" drop-down menu, select "SAML", which will bring up a Directory creation dialog.

#. Next, enter in a name and (optionally) a description, then set the Directory's status to "Enabled".

#. For both the "SAML SSO Login Url" and "SAML SSO Logout Url" fields, you will enter in the URL gathered in step 2.2 above.

#. For the "SAML X.509 Signing Cert" field, paste in the text content from the IdP certificate you created in step 2.1.

#. Finally, select "RSA-SHA256" as the "SAML Request Signature Algorithm".

#. Once all this information is entered, click on **Create Directory**. At this point, you will arrive back on the main Directories page.

2.2. Gather Your SAML Directory Information
+++++++++++++++++++++++++++++++++++++++++++++

Find and click on your new SAML Directory.

From this page, you will need the follow information:

- The Directory's "HREF" found at the very top.

- The "Assertion Consumer Service URL" found in the "SAML Identity Provider Configuration" section

We will now input these values into the Identity Provider.

Step 3: Configure Your Service Provider in Ping
"""""""""""""""""""""""""""""""""""""""""""""""""""

Back on your Ping Application's page (where you previously downloaded the SAML Metadata), you will now enter in your Directory information:

#. The "Assertion Consumer Service (ACS)" is the Stormpath "Assertion Consumer Service URL" from the previous step.

#. The "Entity ID" is the Directory "HREF" for your Stormpth SAML Directory.

#. Click **Continue to Next Step**, then click **Save & Publish**

Step 4: Configure Your Application in Stormpath
""""""""""""""""""""""""""""""""""""""""""""""""""

We will now complete the final steps in the Stormpath Admin Console: adding one or more Callback URIs to the Application, and mapping your SAML Directory to your Application.

#. Switch back to the `Stormpath Admin Console <https://api.stormpath.com>`__ and go to the **Applications** tab.

#. Select the Application that will be using the SAML Directory.

#. On the main "Details" page, you will see "Authorized Callback URIs". You should include here a list of the URLs that your users will be redirected to at the end of the SAML authentication flow. Note that the Authorized Callback URIs cannot exceed 4000 characters in total length.

#. Next click on **Account Stores** in the left-side navigation pane.

#. Once you are on your Application's Account Stores page, click **Add Account Store**. This will bring up the "Map Account Store" dialog.

#. Ensure that you are in the "Directories" tab and select your Ping Identity Directory from the list.

#. Click **Create Mappings**.

You have now completed the initial steps of configuring login via SAML for Ping Identity.

Step 5: (Optional) Configure Your Attribute Mappings
""""""""""""""""""""""""""""""""""""""""""""""""""""

When a new Account logs in via SAML, Ping sends along a number of SAML attributes. These attributes are mapped to Stormpath `Account attributes <https://docs.stormpath.com/rest/product-guide/latest/reference.html#account>`__ (such as ``givenName`` or ``email``) and these values are either stored, if the Account is new, or updated, if the Account exists but the values are different. In this step you will configure how these Ping SAML Attributes are mapped to Stormpath attributes.

4.1. Find the Existing SAML Attributes
+++++++++++++++++++++++++++++++++++++++++++++

If you have already successfully set-up SAML and authenticated a user with your app, you will be able to retrieve the SAML Attributes that Ping sends by retrieving the new user Account that was created inside Stormpath.

Specifically, you want that Account's ``providerData`` resource, which you can see by clicking on the "HREF" link on the Account's main page, then following the `providerData` `href` :

.. code-block:: json

  {
    "href": "https://api.stormpath.com/v1/accounts/4QwSP7tumdJJoCzPHiZ1Oq/providerData",
    "createdAt": "2016-04-22T19:01:07.281Z",
    "modifiedAt": "2016-04-22T19:01:07.291Z",
    "PingOne.AuthenticatingAuthority": "https://pingone.com/idp/cd-1935055751.stormpath",
    "PingOne.idpid": "4ad1f356-08f2-440d-955a-60873af45948",
    "providerId": "saml"
  }

Everything here other than ``href``, ``createdAt`` and ``modifiedAt`` are Attributes passed by Ping.

If you want, you can map other SAML Attributes to Stormpath Account attributes.

4.2. Add Any Additional Attributes You Want
++++++++++++++++++++++++++++++++++++++++++++++++++++++

If there are other attributes that you would like Ping to pass, you can configure this.

#. Make sure you are on the Ping Identity Admin Settings page, in the "My Applications" section: https://admin.pingone.com/web-portal/cas/connections
#. Find your application, and click the ▶ to the right of the "Remove" button. This will expand your Application details.
#. Click the **Edit** button.
#. On the "Application Details" page click **Continue to Next Step**
#. Click **Continue to Next Step** on the "Application Configuration" page as well.
#. Now you will arrive at "SSO Attribute Mapping".
#. Click **Add new attribute**
#. You can type whatever string you'd like under "Application Attribute". For example, "firstName".
#. Under "Identity Bridge Attribute or Literal Value" you can click on the textbox to see a list of available values. For this example, you'd select **First Name**.
#. Finally click on **Save & Publish** and, on the next page, **Finish**.

4.3. Specify Your Mapping
+++++++++++++++++++++++++

#. Go to your `Stormpath Admin Console <https://api.stormpath.com/>`__
#. Click on the **Directories** tab
#. Select your Ping SAML Directory
#. Under the "SAML Attribute Statement Mapping Rules" section you will see three fields: "Name", "Name Format", and "Stormpath Attributes"
#. Here you will enter the Ping attribute name under "Name"
#. Finally, enter the Account attribute(s) that you would like this Ping attribute to map to

For example, you could enter, using the custom attribute from Step 4.2 above:

* For the "Name" enter ``firstname``
* For "Stormpath Attributes" enter ``givenName``

If a user now logs in, Stormpath will take the ``firstname`` attribute and map it to the ``givenName`` field on the Account resource.

.. _create-gsuite:

G-Suite
^^^^^^^^^^

G-Suite is compatible with both Service Provider (SP)-initiated and Identity Provider (IdP)-initiated flows.

.. contents::
    :local:
    :depth: 1

Step 1: Set-up G-Suite
""""""""""""""""""""""

#. Log in to the Google Admin Console: https://admin.google.com
#. Click on the **Apps** box and then click on **SAML Apps**
#. Click the + button to add a new SAML Application
#. In the modal, click on **Setup my Own Custom App**

Step 2: Gather the Google IdP Information
"""""""""""""""""""""""""""""""""""""""""

You will now need to gather the following pieces of information:

- SSO URL
- Entity ID
- Certificate

Click on **Download** beside Certificate. This will download ``GoogleIDPCertificate-DOMAIN.pem``, which you need to open in a text editor of your choice.

Open the ``GoogleIDPCertificate-DOMAIN.pem`` file in a text editor of your choice, and copy its contents. The file should look like this:

.. code-block:: none

  -----BEGIN CERTIFICATE-----
  MIIDaDCCAlCgAwIBAgIGAVQ0xF8mMA0GCSqGSIb3DQEBCwUAMHUxCzAJBgNVBAYTAlVTMQswCQYD
  {More certificate content here}
  8bMh4fe2s1wR6pDkVjgEwu0DW2zBcXSg9KuT3lcWEUIq3Bct7Cdng12C0zXbgnQJAFtzHYbXAwkG
  sh3WzqLNeYeoU5sGPWhlvNR7n2R1
  -----END CERTIFICATE-----

Step 3: Create Your SAML Directory in Stormpath
"""""""""""""""""""""""""""""""""""""""""""""""

You will now create your SAML Directory in Stormpath, using the values you gathered in the previous step. Then you will use information from this newly-created Directory to configure Stormpath as a Service Provider in the IdP in the next step.

3.1. Create Your SAML Directory
+++++++++++++++++++++++++++++++

#. Log in to the Stormpath Admin Console: https://api.stormpath.com

#. Click on the **Directories** tab.

#. Click on **Create Directory**.

#. From the "Directory Type" drop-down menu, select "SAML", which will bring up a Directory creation dialog.

#. Next, enter in a name and (optionally) a description, then set the Directory's status to "Enabled".

#. For both the "SAML SSO Login Url" and "SAML SSO Logout Url" fields, you will enter in the "SSO URL" gathered in step 2.

#. For the "SAML X.509 Signing Cert" field, paste in the text content from the IdP certificate (the .pem file) you created in step 2.

#. Finally, select "RSA-SHA256" as the "SAML Request Signature Algorithm".

#. Once all this information is entered, click on **Create Directory**. At this point, you will arrive back on the main Directories page.

3.2. Gather Your SAML Directory Information
+++++++++++++++++++++++++++++++++++++++++++

Find and click on your new SAML Directory.

Click on the ‘Identity Provider’ tab. Copy the ‘Entity ID’ and the ‘Assertion Consumer Service URL’.

Under the "Identity Provider" tab, you will need to gather the follow information:

- The "Entity ID"

- The "Assertion Consumer Service URL"

We will now input these values into the Identity Provider.

Step 4: Configure Your Service Provider in G-Suite
""""""""""""""""""""""""""""""""""""""""""""""""""

Back on your G-Suite SAML Application page (where you previously downloaded the certificate), you will now enter in your Stormpath Directory information:

#. The "(ACS) URL" is the Stormpath "Assertion Consumer Service URL" from the previous step.

#. The "Entity ID" is the "Entity ID" from the previous step.

#. Check the box that says "Signed Response".

#. Set the "Name ID" fields to "Basic Information" and "Primary Email"

#. Set the "Name ID Format" to "Email"

#. Click **Continue to Next Step**, then click **Save & Publish**

#. On the G-Suite SAML Application you just created, turn the Application "ON". You can either turn this Application on for everyone, or for users in your Organization only.

Step 5: Configure Your Application in Stormpath
"""""""""""""""""""""""""""""""""""""""""""""""

We will now complete the final steps in the Stormpath Admin Console: adding one or more Callback URIs to the Application, and mapping your SAML Directory to your Application.

#. Switch back to the `Stormpath Admin Console <https://api.stormpath.com>`__ and go to the **Applications** tab.

#. Select the Application that will be using the SAML Directory.

#. On the main "Details" page, you will see "Authorized Callback URIs". You should include here a list of the URLs that your users will be redirected to at the end of the SAML authentication flow. Note that the Authorized Callback URIs cannot exceed 4000 characters in total length.

#. Next click on **Account Stores** in the left-side navigation pane.

#. Once you are on your Application's Account Stores page, click **Add Account Store**. This will bring up the "Map Account Store" dialog.

#. Ensure that you are in the "Directories" tab and select your Ping Identity Directory from the list.

#. Click **Create Mappings**.

You have now completed the initial steps of configuring login via SAML for G-Suite!

Step 6: (Optional) Configure Your Attribute Mappings
""""""""""""""""""""""""""""""""""""""""""""""""""""

When a new Account logs in via SAML, Ping sends along a number of SAML attributes. These attributes are mapped to Stormpath `Account attributes <https://docs.stormpath.com/rest/product-guide/latest/reference.html#account>`__ (such as ``givenName`` or ``email``) and these values are either stored, if the Account is new, or updated, if the Account exists but the values are different. In this step you will configure how these Ping SAML Attributes are mapped to Stormpath attributes.

6.1. Find the Existing SAML Attributes
+++++++++++++++++++++++++++++++++++++++++++++++++

If you have already successfully set-up SAML and authenticated a user with your app, you will be able to retrieve the SAML Attributes that G-Suite sends by retrieving the new user Account that was created inside Stormpath.

Specifically, you want that Account's ``providerData`` resource, which you can see by clicking on the "HREF" link on the Account's main page, then following the `providerData` `href` :

.. code-block:: json

  {
    "href": "https://api.stormpath.com/v1/accounts/4QwSP7tumdJJoCzPHiZ1Oq/providerData",
    "createdAt": "2017-01-11T01:38:18.211Z",
    "modifiedAt": "2017-01-11T23:55:02.413Z",
    "providerId": "saml"
  }

Everything here other than ``href``, ``createdAt`` and ``modifiedAt`` are Attributes passed by G-Suite.

If you want, you can map other SAML Attributes to Stormpath Account attributes.

6.2. Add Any Additional Attributes You Want
++++++++++++++++++++++++++++++++++++++++++++++++++++++

If there are other attributes that you would like G-Suite to pass, you can configure this.

#. Make sure you are on the G-Suite SAML Apps page.
#. Click on your application, and click on the "Attribute Mapping" box. This will expand the mapping details.
#. Click the **Add New Mapping** button.
#. You can type whatever string you'd like under "Application Attribute". For example, "firstName".
#. In the second box, you can click on the textbox to see a list of available values. For this example, you can select **Basic Information**.
#. Under "Select User Field", click on the box to see a list of available values. For this example, you can select **First Name**.
#. Finally click on **Save**.

6.3. Specify Your Mapping
++++++++++++++++++++++++++++++++++++

#. Go to your `Stormpath Admin Console <https://api.stormpath.com/>`__
#. Click on the **Directories** tab
#. Select your G-Suite SAML Directory
#. Under the "SAML Attribute Statement Mapping Rules" section you will see three fields: "Name", "Name Format", and "Stormpath Attributes"
#. Here you will enter the G-Suite attribute name under "Name"
#. Finally, enter the Account attribute(s) that you would like this G-Suite attribute to map to

For example, you could enter, using the custom attribute from the example above:

* For the "Name" enter ``firstname``
* For "Stormpath Attributes" enter ``givenName``

If a user now logs in, Stormpath will take the ``firstname`` attribute and map it to the ``givenName`` field on the Account resource.

Step 7: (IdP-initiated Flow Only) Generate a RelayState
"""""""""""""""""""""""""""""""""""""""""""""""""""""""

#. After going through the SP-initiated instructions above, navigate back to your Stormpath G-Suite SAML Directory in the Admin Console. Click on **Generate Default Relay State**.
#. In this box, you'll need to select the Application your Directory is mapped to, and select your API key. The API key you select should be the same API key you used to connect to Stormpath when you started your Application. You'll also need to add the same callback URI you added to your Application. Copy the generated default relay state and close out of the box.
#. Navigate back to your G-Suite SAML Application and click on "Service Provider Details". Under "Start URL", paste in the default relay state.

.. _create-adfs:

Active Directory Federation Services
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Stormpath's allows you to link your Active Directory to Stormpath via SAML and Active Directory Federation Services (ADFS). In order to link the two, you must configure your ADFS server with information about your Stormpath Directory, and vice versa. This will then allow users to log in to your application by authenticating with the ADFS server, and have their Active Directory user information mirrored into Stormpath.

These instructions assume that you have an instance of Windows Server 2012 R2 running ADFS 3.0, fully configured and with existing users.

Step 1: Download Your Signing Certificate
""""""""""""""""""""""""""""""""""""""""""""""

#. Go to Windows Server's Administrative Tools, and then to "AD FS Management".

#. Expand **Services**, then click on **Certificates** > **Token-Signing Certificate** > **View Certificate**.

#. Click **Details** and then **Copy to File** > **Next** > Select **Base-64 encoded X.509 (.CER)** and save the file somewhere.

#. Open this file in your text editor of choice. The contents will be an x509 certificate starting with the line ``-----BEGIN CERTIFICATE-----`` and ending with ``-----END CERTIFICATE-----``. The contents of this file are your “SAML X.509 Signing Cert”.

Step 2: Create your ADFS Directory in Stormpath
"""""""""""""""""""""""""""""""""""""""""""""""""

 First you must create a Directory in Stormpath that will mirror your ADFS users.

#. Log in to the Stormpath Admin Console: https://api.stormpath.com

#. Click on the **Directories** tab.

#. Click on **Create Directory**.

#. From the "Directory Type" drop-down menu, select "SAML", which will bring up a Directory creation dialog.

#. Next, enter in a name and (optionally) a description, then set the Directory's status.

#. For "SAML SSO Login Url" enter in: ``https://{HOST}:{PORT}/adfs/ls/idpinitiatedsignon.aspx``.

#. For "SAML SSO Logout Url" enter in: ``https://{HOST}:{PORT}/adfs/ls/idpinitiatedsignout.aspx``

#. For the "SAML X.509 Signing Cert" field, paste in the text content from the signing certificate you downloaded in Step 1.

#. Finally, select "RSA-SHA256" as the "SAML Request Signature Algorithm".

#. Once all this information is entered, click on **Create Directory**. At this point, you will arrive back on the main Directories page.

#. Find and click on your Directory to enter its information page.

#. On this page, in the "SAML Configuration" section, click on the **Identity Provider** tab. you will be returning here in the next step.

Step 3: Configure Your Relying Party Trust in ADFS
""""""""""""""""""""""""""""""""""""""""""""""""""

Now you will enter the information from the Stormpath Directory that you just created into ADFS.

3.1. Add a Relying Party Trust
++++++++++++++++++++++++++++++++

#. Back in Windows' Administrative Tools, click on **AD FS Management**.

#. **Expand** "Trust Relationships", then click on **Relying Party Trusts** and in the right-hand navigation panel click on **Add Relying Part Trust...**. This will open the "Add Relying Party Trust Wizard".

#. Click **Start** and make sure that "Import data about the relying party published online" is selected.

#. Back in the Stormpath Admin Console, in your Directory's "Identity Provider" information, you will see a "Service Provider Metadata Link". Copy this URL into the AD FS Management "Federation metadata address" text box and click **Next**. Keep your Admin Console tab open, you will be returning to it later.

#. Enter in whatever "Display name" that you wish, as well as any description. For this example we will name this "api.stormpath.com".

#. Make sure "I do not want to configure multi-factor authentication settings..." is selected and click **Next**.

#. Keep "Permit All" selected and click **Next**.

#. Review the settings if so desired and click **Next**.

#. Keep the "Open the Edit Claim Rules..." option selected and click "Close".

3.2. Add a Claim Rule
++++++++++++++++++++++++++++++++

#. In the "Edit Claim Rules" window, click **Add Rule** again.

#. Select "Transform an Incoming Claim" as your Rule Template. Then fill out the following information:

- Put "Add UPN as Name ID" into the "Claim rule name:" text box.
- For "Incoming claim type" select "UPN".
- For "Outgoing claim type" select "Name ID".
- For "Outgoing name ID format" select "Email".
- Keep "Pass through all claim values" selected.
- Click **Finish**.
- Back in the "Edit Claim Rules" window, click **OK**.

3.4. Finish Configuring the Relying Third Party
+++++++++++++++++++++++++++++++++++++++++++++++

#. In the main AD FS window, with "api.stormpath.com" selected under "Relying Party Trusts", click **Properties** on the right-hand side. This will open a "Properties" window and the "Monitoring" tab.

#. In the "Monitoring" tab, uncheck "Automatically update relying party" and click **Apply**.

#. Switch to the "Identifiers" tab, and copy your Stormpath Directory's HREF into the "Relying party identifier" text box, then click **Add**. Next click **OK**.

#. Finally, go to Windows and open a Powershell window. In Powershell, enter the following command: "Set-AdfsRelyingPartyTrust -TargetName api.stormpath.com -SigningCertificateRevocationCheck None".

Step 4: Configure Your Application in Stormpath
""""""""""""""""""""""""""""""""""""""""""""""""

#. Switch back to the `Stormpath Admin Console <https://api.stormpath.com>`__ and go to the **Applications** tab.

#. Select the Application that will be using the ADFS Directory.

#. On the main "Details" page, you will see "Authorized Callback URIs". You should include here a list of the URLs that your users will be redirected to at the end of the SAML authentication flow.

#. Next click on **Account Stores** in the navigation pane.

#. Once you are on your Application's Account Stores page, click "Add Account Store". This will bring up the "Map Account Store" dialog.

#. Ensure that you are in the "Directories" tab and select your SAML Directory from the list.

#. Click **Create Mappings**.

Step 5: (Optional) Configure Your Attribute Mappings
""""""""""""""""""""""""""""""""""""""""""""""""""""

By default, the only user information that is passed by ADFS is the User Principal Name (UPN). Stormpath will use this to populate the user Account's ``username`` and ``email`` attributes. Other attributes, like ``surname`` will appear as ``NOT_PROVIDED``. If you would like other Active Directory attributes to be passed to Stormpath and mapped to Account attributes, you can configure this now.

5.1. Add the Claim Rule
++++++++++++++++++++++++++++

#. Go to Administrative Tools and "AD FS Management", and on the left-hand side expand **Trust Relationships**. Select the "Relying Party Trust" for Stormpath, and then in the right-hand panel click on "Edit Claim Rules...".

#. In the "Edit Claim Rules" window, click on **Add Rule**.

#. For the "Claim rule template" make sure that "Send LDAP Attributes as Claims" is selected and click **Next**.

#. Enter a "Claim Rule Name" and for Attribute Store select "Active Directory".

#. Then specify whatever mapping you might want. Make sure that the "LDAP Attribute" matches whatever is in your Active Directory. From Stormpath's perspective the "Outgoing Claim Type" can have any value, since you will be specifying how this Outgoing Claim should be interpreted by Stormpath. For example, you could specify that the LDAP Attribute "Given-Name" maps to an Outgoing Claim Type "firstName".

5.2. Create the Attribute Mapping
+++++++++++++++++++++++++++++++++

#. Back in the Stormpath Admin Console, on your ADFS Directory page, find the "SAML Configuration" section, and go to the "Attribute Mappings" tab.

#. Here you can specify which of the ADFS Claims you would like to map to which Stormpath Account attribute. For example, if you mapped the LDAP Attribute ``Given-Name`` to the ADFS Claim ``firstName``, then you would put the "Attribute Name" as ``firstName`` and the "Stormpath Field Name" as ``givenName``.

.. note::

  There are two mappings here: LDAP to ADFS, then ADFS to Stormpath.

  .. code-block:: none

    LDAP Attribute --> ADFS Claim --> Stormpath Account Attribute
          |                 |                     |
      Given-Name   --> firstName  -->        givenName

  Since the ADFS Claim is what is being received by Stormpath, the Admin Console only needs to know the mapping between the ADFS Claim and the Account Attribute.

.. _create-azure:

Azure Active Directory
^^^^^^^^^^^^^^^^^^^^^^^

Stormpath's also supports linking your Azure Active Directory (AD) to Stormpath via SAML. In order to link the two, you must configure your Azure AD server with information about your Stormpath Directory, and vice versa. This will then allow users to log in to your application by authenticating with Azure server, and have their Active Directory user information mirrored into Stormpath.

These instructions assume that you have an instance of Windows Azure Active Directory, fully configured and with existing users as well as a Stormpath account with at least an Advanced tier.

Step 1: Add Your Application in Azure
""""""""""""""""""""""""""""""""""""""""""""""

1. Log in to Azure and select your AD directory.

2. Select the **Application** sub-heading and then click **Add** at the bottom of the page.

3. Click **Add an application my organization is developing**

4. Name your application and click the right **arrow**.

5. Add two temporary URLs. They can be any valid URL, since you will be changing them later. Then click the **checkmark**.

6. You will now arrive at your application/s main page.

Step 2: Create your Azure Directory in Stormpath
""""""""""""""""""""""""""""""""""""""""""""""""

Next you must create a Directory in Stormpath that will mirror your ADFS users. Keep your Azure window open, since you will be copying information back and forth between Azure and Stormpath.

2.1 Add the SSO Login/Logout URLs
+++++++++++++++++++++++++++++++++

#. Log in to the Stormpath Admin Console: https://api.stormpath.com

#. Click on the **Directories** tab.

#. Click on **Create Directory**.

#. From the "Directory Type" drop-down menu, select "SAML", which will bring up a Directory creation dialog.

#. Next, enter in a name and (optionally) a description, then set the Directory's status.

#. Switch to your Azure application and click on **View Endpoints** in the bottom navigation bar. This will bring up an "App Endpoints" dialog.

#. Your Azure "SAML-P Sign-on Endpoint" needs to be copied into your Stormpath Directory's "SAML SSO Login Url" field.

#. Similarly, the "SAML-P Sign-out Endpoint" goes into your Stormpath Directory's "SAML SSO Logout Url".

2.2 Add the x509 Certificate
++++++++++++++++++++++++++++

#. Take the URL in your Azure app's "Federate Metadata Document" and paste it into a new window.

#. Find the ``IDPSSODescriptor`` tag. Inside this tag there are multiple ``<X509Certificate>`` tags.

#. Take the first ``<X509Certificate>`` and copy it into your text editor of choice.

#. Add ``-----BEGIN CERTIFICATE-----`` as the first line and ``-----END CERTIFICATE-----`` as the last line.

#. Now take the entire contents inside your text editor and paste them into your Stormpath Directory's "SAML X.509 Signing Cert" field.

#. Finally, make sure that "RSA-SHA256" is selected as the "SAML Request Signature Algorithm".

#. Once all this information is entered, click on **Create Directory**. At this point, you will arrive back on the main Directories page.

#. Find and click on your Directory to enter its information page.

#. On this page, in the "SAML Configuration" section, click on the **Identity Provider** tab. you will be returning here in the next step.

Step 3: Configure SSO in Azure
"""""""""""""""""""""""""""""""

#. Back in Azure, click on **Configure** under your application's name.

#. Find the "Single Sign-on" section. you will be copying various fields from your Stormpath Directory page into these fields.

#. Set "App ID URI" as your Stormpath Directory's HREF.

#. Set "Reply URL" as your Stormpath Directory's "Assertion Consumer Service URL".

#. In the bottom of your Azure application's navigation pane, click on **Save**.

Step 4: Configure Your Application in Stormpath
""""""""""""""""""""""""""""""""""""""""""""""""

#. Switch back to the `Stormpath Admin Console <https://api.stormpath.com>`__ and go to the **Applications** tab.

#. Select the Application that will be using the Azure Directory.

#. On the main "Details" page, you will see "Authorized Callback URIs". You should include here a list of the URLs that your users will be redirected to at the end of the SAML authentication flow.

#. Next click on **Account Stores** in the navigation pane.

#. Once you are on your Application's Account Stores page, click "Add Account Store". This will bring up the "Map Account Store" dialog.

#. Ensure that you are in the "Directories" tab and select your Azure Directory from the list.

#. Click **Create Mappings**.

You should now be able to log-in to your Stormpath-powered application with Azure Active Directory!

.. todo::

  Step 5: (Optional) Configure Attribute Mappings
