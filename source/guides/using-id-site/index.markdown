---
layout: doc
lang: guides
title: Using Stormpath's ID Site to Host your User Management UI
---

{% docs info %}
  **This feature is currently in Beta.**  If you have any questions, bug reports, or enhancement requests please email support@stormpath.com. 
{% enddocs %}

In this guide, we discuss how to set up Stormpath to host a set of web pages that will allow your applications to leverage Stormpath infrastructure for login, registration, and password reset pages.

## Why should I use Stormpath to host my UI

With a few lines of code, you can quickly and easily leverage Stormpath in your Application to host identity management pages.  These pages can include login, user registration, and password reset.  In Stormpath terms, these pages together are an ID Site.  Since Stormpath is hosting and managing these sites, their is little to no development that needs to occur on UI's related to user sign up and login workflows.

## What is an ID Site?

An ID Site by default consists of set of web pages that allow your end-users to register, login, and reset their passwords.  Hosted on Stormpath infrastructure gives your ID Site, a reliable, fast and inexpensive way to provide this functionality to your applications.

The ID Site uses best practices in security when communicating between Stormpath REST API and communicating with your application

![](/images/guides/Login.png =700x)

By default, Stormpath provides a default ID Site that can be white-labeled for your applications with the source available on [github]().  

An ID Site can host the login, registration, and password reset pages for one or multiple applications.  Making it possible to provide the same login / registration page for multiple applications

## Setting up your ID Site

## Using the Stormpath SDK Enable your App to use your ID Site




