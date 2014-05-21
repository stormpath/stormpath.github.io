---
layout: doc
lang: guides
title: Using Stormpath to Secure Your API Services
---

{% codetab id:code-for-login langs:rest java python%}
  ------
  //Sup Homies
  curl -u $API_KEY_ID:$API_KEY_SECRET \
     -H "Accept: application/json" \
     "https://api.stormpath.com/v1/tenants/23mq7BPIxNgPUPZDwj04SZ/applications?name=My%20Application"
  ------
  //Good Morning
  System.out.println("Hello World");
  ------
  //Python is for pimps
  for app in client.applications[1:5]:
    print(app.name)
  ------
{% endcodetab %}

{% codetab id:code-for-login langs:rest java python%}
  ------
  //
  rest code
  ------
  //Good Morning
  System.out.println("Hello World");
  ------
  for app in client.applications[1:5]:
    print(app.name)
  ------
{% endcodetab %}

{% codetab id:code-for-login langs:python%}
  ------
  for app in client.applications[1:5]:
    print(app.name)
  ------
{% endcodetab %}

In this guide, we discuss how to set up Stormpath to manage and authenticate API Keys and Secrets for developers that are using your API Services.  Stormpath provides not only the user management piece around API Keys, but also allows you to associate permissions and custom data with the accounts for advanced use-cases.  

{% docs note %}

Prerequisite:  Complete one of the [Quickstart Guides](http://docs.stormpath.com/home/).  This will get you familiar with Stormpath and will set up an `Application` to use with this guide.

{% enddocs %}

## What is Stormpath? 

Stormpath is a user management API that makes it easy for developers to launch applications and APIs with secure, scalable user infrastructure. It automates:

* User Account registration and login
* Authentication and authorization
* Flexible, secure user profile data
* Group and role management, including pre-built Role-Based Access Control (RBAC)
* Best-practice password security and data storage

You access Stormpath via a [beautiful](http://stormpath.com/blog/designing-rest-json-apis) REST+JSON API or our [language-specific SDKs](http://docs.stormpath.com).

{% docs note %}

Currently supported SDKs for this feature include: Java, REST API
{% enddocs %}

## Why should I use Stormpath for to Secure my API?

Stormpath makes it easy to secure your REST API by using best practices in the security space. Stormpath provides an end-to-end solution for creating/managing accounts,reseting passwords, creating/managing API keys, and generating OAuth 2.0 bearer tokens to support token authentication.  Using one of the Stormpath SDKs and a few lines of code, you can quickly verify API Key and Secret and access the account associated with the key and secret.

----

## How do I use Stormpath for API Key / Secret Management?

After you familiarize yourself with Stormpath with one of the [Quickstart](docs.stormpath.com) Guides, using Stormpath for API Key management is as simple as:

+ Creating Accounts in Stormpath
+ Creating and Managing API Keys / Secret pairs for Accounts
+ Using an SDK to authenticate and generate tokens for securing your API

The general workflow here is when a user signs up for your API, and an account is created in Stormpath.  When the user logs into your API console, you can create, update, and delete API keys for your API using Stormpath.  When the developer sends their API key and secret to the your API, you can use Stormpath to return the account associated with the request keys

## Creating Accounts in Stormpath

To start creating and authenticating API Keys in Stormpath, there needs to be accounts that represent your developers in Stormpath.  Accounts can represent your end users (people), but they can also be used to represent services, daemons, processes, or any “entity” that needs to login to a Stormpath-enabled application.

### Register a new Account for an Application

If your application wants to register a new account, you create a new `account` resource on the application's `accounts` endpoint.

`POST` the account resource attributes required and any additional ones you desire.

**Example Request**

    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
         -H "Accept: application/json" \
         -H "Content-Type: application/json" \
         -d '{
             "username" : "jlpicard",
             "email" : "capt@enterprise.com",
             "givenName" : "Jean-Luc",
             "middleName" : "",
             "surname" : "Picard",
             "password" : "uGhd%a8Kl!"
             "status" : "ENABLED",
         }' \
     "https://api.stormpath.com/v1/applications/WpM9nyZ2TbaEzfbRvLk9KA/accounts"

The response will contain the newly saved resource:

**Example Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8;

    {
      "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA",
      "username" : "jlpicard",
      "email" : "capt@enterprise.com",
      "fullName" : "Jean-Luc Picard",
      "givenName" : "Jean-Luc",
      "middleName" : "",
      "surname" : "Picard",
      "status" : "ENABLED",
      "apiKeys": {
        "href": "http://api.jose.com:8080/v1/accounts/PZX1E5DWi7TL0cT5nthXB/apiKeys"
      },
      "customData": {
        "href": "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/customData"
      },
      "groups" : {
        "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/groups"
      },
      "groupMemberships" : {
        "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/groupMemberships"
      },
      "directory" : {
        "href" : "https://api.stormpath.com/v1/directories/1FaQ6kZxTL4DVJXWeXtUh7"
      },
      "tenant" : {
        "href" : "https://api.stormpath.com/v1/tenants/Ad8mIcavSty7XzD-xZdP3g"
      },
      "emailVerificationToken" : null
    }

{% docs note %}

{% enddocs %}

## Creating and Managing API Keys / Secret Pairs for Accounts

Once accounts are created, you can create and manage API Keys and Secrets associated with the account.

Each account will have an `apiKeys` property that will contain a collection of API Keys for an account.

### Creating API Keys for an Account

Creating an API Key is as simple as doing a `POST` to the account's `apiKeys` href.

For example, if the account object is represented as:

    {
      "href" : "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA",
      "username" : "jlpicard",
      "email" : "capt@enterprise.com",
      "fullName" : "Jean-Luc Picard",
      "givenName" : "Jean-Luc",
      "middleName" : "",
      "surname" : "Picard",
      "status" : "ENABLED",
      "apiKeys": {
        "href": "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/apiKeys"
      }
      ...
    }

You can create an API Key for an account by:

    curl -X POST --user $YOUR_API_KEY_ID:$YOUR_API_KEY_SECRET \
         -H "Accept: application/json" \
         -H "Content-Type: application/json" \
     "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA/apiKeys"

Which will return:

    HTTP/1.1 201 OK
    Content-Type: application/json;charset=UTF-8;
    {
        href: "https://api.stormpath.com/v1/apiKeys/31804d9a5f0b5e4f53055467cd258e1c"
        id: "31804d9a5f0b5e4f53055467cd258e1c"
        secret: "dd02c7c2232759874e1c205587017bed",
        status: "ENABLED"
        account : {
            href: "https://api.stormpath.com/v1/accounts/cJoiwcorTTmkDDBsf02AbA"
        }
        tenant : {
            href: "https://api.stormpath.com/v1/tenants/cJoiwcorTTmkDDBsf02AbA"
        }
    }

### Getting a List of API Keys for an Account

An `account` will describe it's `apiKeys` with a HTTP `GET` to the accounts apiKeys href

#### Updating an API Key

Under some circumstances, you may need to update the 
