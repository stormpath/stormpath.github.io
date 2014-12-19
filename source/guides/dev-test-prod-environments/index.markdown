---
layout: doc
lang: guides
description: Separate production users from development and testing data for easy, secure development against Stormpath.
title: Setting up Development and Production Environments
---

This guide is designed to quickly walk you through leveraging Stormpath’s data model to support your application's different runtime environments. We will also take a look at common questions new users run into. 

##Why Isolate Production Data?

When building your application, you might wish to isolate user management data among different runtime/deployment environments.  For example, you might wish to keep your development user accounts completely separate from your production user accounts.  Most Stormpath customers seem to have three environments they need to support: 1.  Production— where live user data is being processed 2. Staging/Test— Where a newer version of the application is being tested is an environment similar to Production 3. Active Development– Where developers are working on the newest, ever-changing, and untested version of the software.  Every organization is unique so your environments may be different.

We strongly recommend separating production user data from all other stages of the software development cycle like staging and active development. The goal is to ensure your production user accounts are protected from any changes or errors you might make during software development. 

Luckily, partitioning your data is easy to do in Stormpath in one of two ways.  The first and recommended strategy is to use Stormpath’s Directory objects to create the separation.  The second and more complex option is to create separate Stormpath tenants for your environments (that is, sign up for Stormpath multiple times).  While this is the strategy Stormpath uses for its own production data isolation, we only recommend it for larger teams with more stringent development processes. 

##Strategy 1: Using Stormpath Directory Resources

The easiest way to isolate your production data in Stormpath is to leverage Stormpath Directory resources.  They were designed for isolation of data for a variety of use cases and work well here, too.  

A Stormpath Application resource is typically a representation of a real world application.  For this example, we will call our application MyWebApp.  

In order to separate Production from Staging and other environments, we will create one new Directory to represent each stage of your development cycle. For example: 

* MyWebApp–Prod-Users
* MyWebApp–Staging-Users
* MyWebApp–Dev-Users

A Stormpath Directory is a top-level collection of groups and user accounts.  Directories are completely isolated from each other.  In addition, the collection of Directories and/or Groups associated with an Application make up that Application’s unique user base.  

Once the Directories are created, they can be mapped to your application giving the users in the Directories to login, reset their passwords, etc.  During development, you can make modifications to existing development Directory and test with the accounts in that directory without affecting production users.

{% docs tip %}
 Directories and Groups mapped to an Application are also referred to as AccountStores.  You can map any directories to any applications by changing your Application’s Account Store configuration in the Console or via API.  
{% enddocs %}

##Strategy 2: Separate Production into its own Stormpath Tenant

In some scenarios, you may want to isolate your production environment even further.  You can do that by creating a separate Stormpath tenant to just manage Production.

The primary value of this approach is limited access by your own development staff.  All the API keys that work in your other tenants will not work in this tenant and vice versa-- thereby further limiting your developers' ability to accidentally affect production.

To set up a second Stormpath tenant you will need to sign up for Stormpath a second time.  

{% docs note %}
 You can only _create_ one Stormpath tenant per email address.  So if you create a production tenant separate from your other tenant, you will need to use a different email to create it.  This does not prevent you from having the same email addresses for administrators on each tenant.
{% enddocs %}

Once the new Stormpath tenant has been created, you would configure your production applications and corresponding directories as usual.  And then invite only those people who _must_ have access to your production environment. 