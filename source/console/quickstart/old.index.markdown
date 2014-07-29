---
layout: doc
title: Stormpath Admin Quickstart Guide
lang: console
---

<p>To quickly get started using Stormpath to secure your online applications, please complete the following steps:</p>
<ol>
<li>
<p><a href="https://stormpath.com/">Sign up for service</a>.</p>
<ol type="a">
<li>On the main page, click <strong>Sign Up</strong>.</li>
<li>Provide your first and last name, email address, company, and a password.</li>
<li>When all fields are complete, click <strong>Start</strong>.<br>You will receive a registration successful email.</li>
<li>In the confirmation email, click the link.</li>
<li>Follow the onscreen instructions.<br>After completing this process, you are ready to use Stormpath for free!</li>
</ol></li>
<li>
<p>Create your API key.</p>
<p>All requests to the Stormpath <a href="/rest/product-guide#RESTAPIdef">REST API</a> must be authenticated with an <a href="/rest/product-guide#APIKey">API key</a>. To get an API key:</p>
<ol type="a">
<li>Log in to the Stormpath Admin Console using the email address and password provided during sign-up.</li>
<li>After logging in, navigate to your account page by clicking <strong>Settings</strong>, <strong>My Account</strong> in the top-right corner of the screen.</li>
<li>On the Account Details page, under Security Credentials, click <strong>Create API Key</strong>.
<ul>
<li>This will generate your API key and download it to your computer as an <code>apiKey.properties</code> file.</li>
<li>
<p>If you open the file in a text editor, you will see something similar to the following:</p>
<pre><code>  apiKey.id = 144JVZINOF5EBNCMG9EXAMPLE 

  apiKey.secret = lWxOiKqKPNwJmSldbiSkEbkNjgh2uRSNAb+AEXAMPLE 
</code></pre>
</li>
</ul>
</li>
<li>Save this file in a secure location, such as your home directory in a hidden .stormpath directory. <br>For example:
<pre><code> $HOME/.stormpath/apiKey.properties
</code></pre>
</li>
<li>
<p>Also change the file permissions to make the file readable by only you. For example, on *nix operating systems:</p>
<pre><code> $ chmod go-rwx $HOME/.stormpath/apiKey.properties
</code></pre>
</li>
</ol></li>
<li>
<p>Test that the key works by opening a client (such as a web browser window) and using the following URL:<br><br><a href="https://api.stormpath.com/v1/tenants/current" title="Stormpath API">https://api.stormpath.com/v1/tenants/current</a>/</p>
<p>If you see a successful JSON response for your Tenant data, you have successfully made an API request! You are now ready to make REST requests to access all of your data using our <a href="/docs/rest/product-guide" title="Stormpath REST API">full REST API</a>.</p>
</li>
<li>
<p>Configure your REST client with HTTP basic <a href="/rest/api#Authentication" title="REST API Authentication">authentication</a> and to accept JSON content.</p>
<ul>
<li>
<p>Depending on your REST library or client, you typically accept JSON by setting the <code>Accept</code> header with a value of <code>application/json</code>:</p>
<pre><code>  Accept: application/json
</code></pre>
<ul>
<li>
<p>This makes sure the Stormpath API server responds with JSON data.</p>
</li>
<li>
<p>When your REST client can authenticate and accept JSON, you can access all data using our full REST API.</p>
</li>
</ul>
</li>
<li>
<p>Use the API Key <code>id</code> as the username and the API Key <code>secret</code> as the password.</p>
<ul>
<li>
<p>For example, if using <a href="http://curl.haxx.se" target="_blank" title="Curl command line http client">curl</a>:</p>
<pre><code>  curl --user YOUR_API_KEY_ID:YOUR_API_KEY_SECRET --header "Accept: application/json" https://api.stormpath.com/v1/tenants/current
</code></pre>
</li>
<li>
<p>If using <a href="https://github.com/jkbr/httpie" title="HTTPIE command line http client">httpie</a> (which assumes <code>application/json</code> by default):</p>
<pre><code>  http -a YOUR_API_KEY_ID:YOUR_API_KEY_SECRET https://api.stormpath.com/v1/tenants/current
</code></pre>
</li>
</ul>
</li>
</ul>
</li>
<li>
<p><a href="https://api.stormpath.com/login">Log in to Stormpath</a> as the tenant administrator.</p>
</li>
<li>
<p>Create the necessary directories:</p>
<ol type="a">
<li>Click the <strong>Directories</strong> tab.</li>
<li>Click <strong>Create Directory</strong>.</li>
<li>Click <strong>Cloud</strong>.
<p><img src="https://stormpath.com/sites/default/files/docs/CreateCloudDirectory.png" alt="Create Cloud Directory" title="Create Cloud Directory" width="650" height="440"></p>
</li>
<li>Complete the field values as follows: <br>
<table>
<thead>
<tr><th align="left">Attribute</th><th align="left">Description</th></tr>
</thead>
<tbody>
<tr>
<td align="left">Name</td>
<td align="left">The name used to identify the directory within Stormpath. This value must be unique.</td>
</tr>
<tr>
<td align="left">Description</td>
<td align="left">Details about this specific directory.</td>
</tr>
<tr>
<td align="left">Status</td>
<td align="left">By default, this value is set to Enabled. Change the value to Disabled if you want to prevent all user accounts in the directory from authenticating even where the directory is set as a login source to an application.</td>
</tr>
<tr>
<td align="left">Min characters</td>
<td align="left">The minimum number of acceptable characters for the account password.</td>
</tr>
<tr>
<td align="left">Max characters</td>
<td align="left">The maximum number of acceptable characters for the account password.</td>
</tr>
<tr>
<td align="left">Mandatory characters</td>
<td align="left">The required character patterns which new passwords will be validated against. For example, for an alphanumeric password of at least 8 characters with at least one lowercase and one uppercase character, select the abc, ABC, and 012 options. The more patterns selected, the more secure the passwords but the more complicated for a user.</td>
</tr>
</tbody>
</table>
</li>
<li>Click <strong>Create</strong>.
<p></p>
</li>
</ol></li>
<li>
<p>Register applications.</p>
<p>To authenticate a user account in your <a href="/rest/product-guide#Application">application</a>, you must first register the application with Stormpath.<br>To register an application:</p>
<ol type="a">
<li>Click the <strong>Applications</strong> tab.</li>
<li>Click <strong>Register Application</strong>.
<p><img src="https://stormpath.com/sites/default/files/docs/ApplicationRegistrationWizard.png" alt="Register Application Wizard" title="Register Application Wizard" width="700"></p>
</li>
<li>Complete the fields as follows:<br>
<table>
<thead>
<tr><th align="left">Attribute</th><th align="left">Description</th></tr>
</thead>
<tbody>
<tr>
<td align="left">Name</td>
<td align="left">The name used to identify the application within Stormpath. This value must be unique.</td>
</tr>
<tr>
<td align="left">Description</td>
<td align="left">A short description of the application.<br> <strong>Note:</strong> A URL for the application is often helpful.</td>
</tr>
<tr>
<td align="left">Status</td>
<td align="left">By default, this value is set to Enabled. Change the value to Disabled if you want to prevent accounts from logging in to the application.</td>
</tr>
</tbody>
</table>
</li>
<li>
<p>For the associated directory, you can:</p>
<ul>
<li>Create a new directory, which can be named to match the application or have a distinct name.</li>
<li>Add users from other directories or groups.</li>
<li>After specifying the directory parameters, you can specify the login priority order.</li>
</ul>
</li>
<li>
<p>When all information is complete, click <strong>Save</strong>.</p>
</li>
</ol></li>
<li>
<p>Create accounts.</p>
<ol type="a">
<li>Click the <strong>Accounts</strong> tab.</li>
<li>Click <strong>Create an Account</strong>.
<p><img src="https://stormpath.com/sites/default/files/docs/CreateAccount.png" alt="Create Account" title="Create Account" width="640" height="380"></p>
</li>
<li>
<p>Complete the fields as follows:</p>
<table>
<thead>
<tr><th align="left">Attribute</th><th align="left">Description</th></tr>
</thead>
<tbody>
<tr>
<td align="left">Directory</td>
<td align="left">The directory to which the account will be added.<br><strong>Note:</strong> The account cannot be moved to a different directory after it has been created.</td>
</tr>
<tr>
<td align="left">Username</td>
<td align="left">The login name of the account for applications using username instead of email. The value must be unique within its parent directory.</td>
</tr>
<tr>
<td align="left">First Name</td>
<td align="left">The account owner first name.</td>
</tr>
<tr>
<td align="left">Middle Name</td>
<td align="left">The account owner middle name.</td>
</tr>
<tr>
<td align="left">Last Name</td>
<td align="left">The account owner last name.</td>
</tr>
<tr>
<td align="left">First Name</td>
<td align="left">The account owner first name.</td>
</tr>
<tr>
<td align="left">Email</td>
<td align="left">The account owner email address. This is can be used by applications, such as the Stormpath Admin Console, that use an email address for logging in. The value must be unique within its parent directory.</td>
</tr>
<tr>
<td align="left">Status</td>
<td align="left">The status is set to Enabled by default. It is only set to Disabled if you want to deny access to the account to Stormpath-connected applications.</td>
</tr>
<tr>
<td align="left">Password</td>
<td align="left">The credentials used by an account during a login attempt. The specified value must adhere to the password policies set for the parent directory.</td>
</tr>
<tr>
<td align="left">Confirm Password</td>
<td align="left">Confirmation of the account credentials. This value must match the value of the Password attribute.</td>
</tr>
</tbody>
</table>
</li>
<li>Click <strong>Create Account</strong>.
<p>If workflow automation is configured:</p>
<ul>
<li>Creating an account automatically initiates an Account Registration &amp; Verification workflow that sends the account owner an email.</li>
<li>You can suppress emails by selecting Suppress Registration and Verification emails.</li>
</ul>
<p>After adding an account, you can specify its group membership, specify any administrator rights to Stormpath, and set the API keys.</p>
</li>
</ol></li>
<li>
<p>Authenticate accounts.</p>
<p><strong>cURL</strong></p>
<ol type="a">
<li>
<p>Base64 encode the user-submitted username (or email), colon character ':', and password. For example, on *nix:</p>
<pre><code> $ echo 'account_username:account_password' | openssl base64
 YWNjb3VudF91c2VybmFtZTphY2NvdW50X3Bhc3N3b3JkCg==
</code></pre>
</li>
<li>
<p>Use your API key ID and secret and the base64 <code>value</code> and POST to your application loginAttempts URL:</p>
<pre><code> $ curl --user API_KEY_ID:API_KEY_SECRET \
 -H "Accept: application/json" \
 -H "Content-Type: application/json" 
 -d '{"type": "basic", \
 "value":"YWNjb3VudF91c2VybmFtZTphY2NvdW50X3Bhc3N3b3JkCg=="}' \
 https://api.stormpath.com/v1/applications/APP_UID/loginAttempts
</code></pre>
</li>
</ol>
<p></p>
<p><strong>httpie</strong></p>
<p></p>
<ol type="a">
<li>
<p>Base64 encode the user-submitted username (or email), colon character ':', and password. For example, on *nix:</p>
<pre><code> $ echo 'account_username:account_password' | openssl base64
  YWNjb3VudF91c2VybmFtZTphY2NvdW50X3Bhc3N3b3JkCg==
</code></pre>
</li>
<li>
<p>Use your API key ID and secret and the base64 <code>value</code> and POST to your application loginAttempts URL:</p>
<pre><code> $ http -a API_KEY_ID:API_KEY_SECRET POST \
   https://api.stormpath.com/v1/applications/APP_UID/loginAttempts \
   type=basic value=YWNjb3VudF91c2VybmFtZTphY2NvdW50X3Bhc3N3b3JkCg==
</code></pre>
</li>
</ol></li>
</ol>
<p>For information about performing other functions such as password reset, creating groups, and disabling accounts, see the <a href="/console/product-guide">product guide</a>.</p>
