---
layout: doc
lang: guides
title: Multi-Tenant SaaS Applications with Stormpath
---

In this guide, we discuss what a multi-tenant SaaS application is and how to model user data for SaaS apps serving many organizations. We will also show how to build a multi-tenant SaaS application faster and more securely with Stormpath, a cloud-hosted user management service, that easily supports multi-tenant user models.

## What is Stormpath?

Stormpath is a user management API that makes it easy for developers to launch applications with secure, scalable user infrastructure. It automates:

* User Account registration and login
* Authentication and authorization
* Flexible, secure user profile data
* Group and role management, including pre-built Role-Based Access Control (RBAC)
* Best-practice password security and data storage
* Integration with on-premise LDAP and Active Directory servers

You access Stormpath via a [beautiful](http://stormpath.com/blog/designing-rest-json-apis) REST+JSON API or our [language-specific SDKs](https://docs.stormpath.com).

While Stormpath is a great choice for any application, it excels for multi-tenant use cases.

## What is a Multi-Tenant SaaS Application?

Most web applications are designed to support only one user base or 'organization': typically the organization installs and maintains the application. This traditional software architecture usually has an application codebase that uses a primary database.  For example:

      Application
           |
           |
          \/
     -- Database --
    |     data     |
     --------------

A multi-tenant SaaS application by contrast is a single application that can service _multiple_ organizations _simultaneously_.  In these applications, each organization is referred to as a **tenant**. 

Just like in an apartment building, although there is a single building, there may be multiple _tenants_, each with their own apartment in the building. Similarly, a multi-tenant SaaS application needs to ensure that each Tenant or customer organization has its own private space that cannot be seen or interfered with by other Tenants/Organizations: when Organization A's users access the application, they cannot see Organization B's data, and vice versa. In this guide - and elsewhere in Stormpath documentation - "tenant" refers to the data partition specific to a customer organization. 


To ensure data separation, a multi-tenant SaaS application typically partitions each tenant's data virtually, so that the data is cleanly segmented in the data store.  This means a multi-tenant SaaS application architecture looks something like this:

            Application
                 |
                 |
                \/
     ------- Database ----------
    | org1 | org2 | ... | orgN |
     --------------------------

The application still uses a single (logical) database, but it now needs to know how to access only Tenant A's data when supporting Tenant A's users.

This poses a challenge: very few modern databases natively support tenant data partitioning. The application developer must figure out how to do this in application code. We'll talk about techniques for doing this this a little later.

## Why Build a Multi-Tenant SaaS Application?

Given the extra 'data partitioning' burden when building a multi-tenant SaaS application, why would you want to go through the effort?

The reality of today's technology landscape is that more and more organizations use web applications and no longer want to install, host, and maintain applications on their own servers. Maintaining local applications can be difficult, time consuming and frustrating, and requires additional in-house reseources.

Increasingly, companies that build web applications offer their applications as a Software-as-a-Service, or SaaS - they host and maintain their applications themselves, giving customer organizations access to the software over the internet. This has great appeal to customers: they can sign up for a service and start using it right away, and the maintenance burden goes away. 

## Multi-Tenant Design

There are a lot of ways to build multi-tenant SaaS applications. For the purpose of this article, we're going to focus on approaches to support the significant majority of multi-tenant SaaS apps:

A public (Internet-facing) multi-tenant web application with per-organization data partitioning. For example:

    https://myapplication.io


When an organization registers with `myapplication.io` a new `tenant` (partitioned data space) is created for them.  When users from that organization log in to the application, they will access and see only their own tenant/organization data, and the application must know which tenant/organization the user is attempting to access. This is almost always done by the user specifying a tenant identifier when accessing the application.

### Tenant Identifier

When a new organization signs up and their tenant is created, a globally-unique name identifier is almost always assigned to that tenant/organization. This identifier (unique across all tenants) is typically represented in some way on every request to the application.

The application then uses this identifier to restrict which (virtual) data partition is accessed during a request.

For example, let's say we have a multi-tenant e-commerce SaaS application that shows purchase history. If a user requests the `/purchases` view, they should only be able to see the purchases specific to their tenant/organization.  This means that instead of executing a query like this to a database:

    SELECT * from purchases;

The application needs to know the request user's tenant identifier so they can show _only_ the purchases for that tenant.  The application might instead execute the following query:

    SELECT * from purchases where tenant_id = ?;

where `?` is the tenant_id value obtained by inspecting the request.

So if an application needs this identifier with every request, how do you ensure it is transmitted to the application in the easiest possible way for your end users?  The three most common ways are to use one or more of the following:

1. [Subdomain Name](subdomainName)
2. [Tenant Selection After Login](#selectionAfterLogin)
3. [Login Form Field](#loginFormField)

More than one of these may be supported if you wish to give your customers convenience options.  We'll cover each one next.

####1. Subdomain Name <a name="subdomainName"></a>

When generating or assigning the tenant's name identifier, ensure it is a valid unique subdomain name.  This could allow users from an organization to access your application via a unique subdomain URL for all of their needs, for example:

https://organizationA.myapplication.io

This approach is really nice: the application never needs to ask the user for the tenant identifier, because it is inherently part of every request in the `HOST` header.

This is the most intuitive and convenient tenant identifier convention we've seen - we recommend this approach.

##### Subdomain Name Specification

This approach requires your name identifiers to be compliant with the [subdomain](http://en.wikipedia.org/wiki/Subdomain) naming specification.  The name must:

* Be between 1 and 63 characters long (64 or more is too long)
* Not contain any whitespace at all
* Contain only _lowercase_\*\* characters `a-z` or the dash character `-`
* Not start with or end with a dash `-`

\*\* Techically, subdomain names are case insensitive, but if you force them to be all lowercase in your application, you'll guarantee uniqueness and prevent unexpected collisions.

##### Subdomain Tips

* Keep your customer organization subdomains space _completely separate_ from your company's subdomain space by using a different top-level (aka 'apex') domain name for your SaaS application.

    Let's say your company's website url is `http://mycompany.com`.

    _We do NOT recommend_ supporting customer subdomains like this:

    `http://customerA.mycompany.com`
    `http://customerB.mycompany.com`

    In this scenario, it is possible that a customer's chosen subdomain can conflict with a subdomain your company might need, either now or in the future. For example, what if a customer chose the subdomain name of `docs`? This would mean that your own company couldn't use `http://docs.mycompany.com` later, because it is 'taken' by one of your customers.  It is also a difficult and unnecessarily time-consuming exercise to try to determine which domains you might use for your company in the future and block them off in your application. Even then, you may still have conflicts later.

    Instead, we believe it is better to have a separate top-level domain for the product.  For example:

    `http://mycompany.io`

    Then you can have as many subdomains for customers as necessary, and they will never conflict with your company's own subdomain needs.

    If you didn't want to use a separate top-level domain, you could also use _sub_-subdomains.  For example, the app could be accessible here:

    `http://myapp.mycompany.com`

    And customer organization subdomains for that app would be accessible via:

    `http://customerA.myapp.mycompany.com`

    `http://customerB.myapp.mycompany.com`

    etc.

    It is our opinion that the separate top-level domain, e.g. `http://mycompany.io` is the nicer alternative: it is shorter, easier to remember and type, and looks better.

* If a user from a customer organization ever accesses your app directly (`https://mycompany.io`) instead of using their subdomain (`https://customerA.mycompany.io`), you still might need to provide a tenant-aware login form (described below).  After login, you can redirect them to their tenant-specific url for all subsequent requests.

* Subdomain names that you expose to users should be easy to read and remember. `customerA` is _much_ easier for a user to remember than a UUID like `19C2C28D-0CC6-4FD1-B5BC-84F8E7A8E92D`.  You can (and should) still use UUIDs or `long` primary keys in your code, but your users shouldn't have to remember them.

* Ensure that you (or your customers) can change a tenant's subdomain identifier at any time.  It should not be permanent, and no part of the system should rely on it beyond initial request-to-tenant association logic.

    This means the application's tenant records _should_ have a globally unique immutable tenant _primary key_ that is not necessarily human-friendly, like a `long` number or `UUID`, for the application's own needs.  This type of key is called a [_surrogate_](http://en.wikipedia.org/wiki/Surrogate_key) key.

    In addition, a tenant should _also_ have globally unique, _mutable_, and human-readable subdomain name (like `customerA`) that gets used when executing requests to your application. This is known a [_natural_](http://en.wikipedia.org/wiki/Natural_key) key.

    After a request enters the application, the surrogate primary key identifier is used for all further data queries.  For example:

    1. Request is received referencing a human-readable tenant name - the natural key.
    2. The human-readable tenant name (natural key) is used to look up a tenant record, with that tenant's immutable `long` or `UUID` surrogate primary key.
    3. The surrogate key `long` or `UUID` is used for all subsequent data queries.  **This surrogate primary key is used for all data partitioning schemes and queries**, _not_ the human-friendly natural key.
    

    Why would you do this?

    If your application's tenant primary key is a permanent, immutable identifier like a `long` number or a `UUID`, and your software uses that id for all of its own needs (data inserts, queries), you (or your customers) can change their human-readable subdomain name _at any time_.

    This is so much nicer than telling your customers they are forced to create a new tenant with a new name if they want to change their tenant name. We promise: they *will* ask.

####2. Selection After Login <a name="selectionAfterLogin"></a>

If a user visits your web application directly without specifying a subdomain tenant name, and you have globally unique user identities across all tenants, you can simplify tenant association after login.

For example, let's assume a user visits your application's top-level (_apex_) domain directly, without specifying a subdomain:


    https://myapplication.io


and they are presented with a login form:

    Email   : ________________________
    Password: ________________________

                                Submit

After they login successfully, you can perform some checks:

* If the authenticated user is only assigned to a single tenant, you can immediately redirect them to their tenant URL for all future requests. For example, send an HTTP `302 Redirect` to `https://theirCustomerId.myapplication.io`.

* If you allow a user Account (user identity) to exist in more than one tenant (an advanced use case), you can allow them to choose the tenant they wish to use during their current session.  For example, You might show the user a secondary screen immediately after login:

        Please choose your organization for this session:

        * https://organizationA.myapplication.io

        * https://organizationB.myapplication.io

    The user selects the tenant (s)he wants to use, and all subsequent requests are handled based on the subdomain name as explained above.


#### 3. Login Form Field <a name="loginFormField"></a>

Finally, if your application does not support subdomains or tenant selection after login, your customers will need to specify their tenant identifier when they login.

For example, when visiting:


    https://myapplication.io


The login form, instead of looking like this:

    Email   : ________________________
    Password: ________________________

                                Submit

will now need to look something perhaps like this:

    Organization: ________________________
    Email       : ________________________
    Password    : ________________________

                                    Submit

Then, when the customer logs in successfully, you can store their tenant id (represented to the end-user as an 'Organization' field) in their HTTP Session.  Then, for all subsequent requests to your application, you can:

1. Inspect the session
2. Look up the tenant id
3. Customize data views and queries based on the session's tenant id

##### Login Form Field Tips

* We **STRONGLY** advise that, even if you do not support subdomains today, that your human-readable tenant identifiers *still* adhere to the domain name specification.  This allows you to support subdomains at any point in the future, as soon as you're able to setup network infrastructure to do so.  Do this in the beginning and you will likely eliminate many problems later.

* We advise that you auto-remember the login form tenant id value in a cookie so that field is pre-populated whenever a user returns to log in.  Users don't like having to remember and type that value in every time they log in.

**We strongly advise you start with the subdomain naming approach.  Although you can start with the Login Form-based approach, it can be a pain to retrofit the application for subdomains later.**  We speak from experience!

## Multi-Tenant User Management

Once you decide on a tenant id mechanism, probably the **first thing** you need to support in your application will be user management, so you can at least log in.  Once you can log in to the application, everything else can be associated with a user and customized from there.

Multi-tenant applications come with special user management considerations:

* How will tenants be represented?
* How will users be created?
* How will user data in one tenant be kept secure and separate from other tenant partitions?

As you might have guessed, you can plug in Stormpath and have immediate user support in your SaaS application.  Our data model _natively_ supports multi-tenant user management out-of-the-box.  You don't have to worry about building or managing this yourself, and you can move on to building your app's _real_ features.

## Why use Stormpath for Multi-Tenant SaaS Applications?

As we mentioned, database partitioning for can be quite challenging, especially _user data_ partitioning and all the security issues that implies. Large-scale security breaches in hosted web services [costing](http://www.bankinfosecurity.com/interviews/data-breach-i-1953/op-1) millions of [dollars](http://www.bloomberg.com/news/2011-03-08/security-breach-costs-climb-7-to-7-2-million-per-incident.html) are a risk that development teams shouldn't have to worry about.

Aside from security, setting up partitioning schemes and data models any application _takes time_. Very few, if any, development frameworks support multi-tenant use cases, so developer teams have to to build out multi-tenant user management themselves. That's custom code you need to secure, support and maintain - that isn't a core part of your product.

Stormpath's data model supports two different approaches for multi-tenant user partitioning, and we'll explain both approaches in just a second.  But first, let's quickly review Stormpath's data model.

### Stormpath Data Model Overview

Most application data models assign user Accounts and groups _directly_ to the application.  For example:

**Traditional Application User Management Model:**

                         +---------+
                  +----->| Account |
                  | 1..* +---------+
    +-------------+
    | Application |
    +-------------+
                  | 1..* +-------+
                  +----->| Group |
                         +-------+

But this isn't very flexible and can cause problems over time - especially if you need to support more applications or services in the future.

Stormpath is more powerful and flexible.  Instead of tightly coupling Accounts and Groups directly to a single Application, Accounts and Groups are 'owned' instead by a `Directory`, and an `Application` can reference one or more `Directory`s dynamically:

**Stormpath User Management Model:**

                                            +---------+
                                     +----->| Account |
                                     | 1..* +---------+
    +-------------+ 1..* +-----------+
    | Application |----->| Directory |
    +-------------+      +-----------+
                                     | 1..* +-------+
                                     +----->| Group |
                                            +-------+

A `Directory` isn't anything complicated - think of it just as a 'top level bucket for Accounts and Groups'.

This model gives you many benefits:

* Multiple applications can reference the same Directory and share users.
* You can segment user populations into multiple directories.
* An application can 'plug in' to multiple directories, so multiple user populations can access the same application.
* You can disassociate directories or groups from applications, preventing those users from logging in.
* Security policies for Accounts are configured at the Directory level, giving you tighter control over security requirements.
* It works perfectly well for single application uses cases too, allowing flexibility for future apps.
* And [more...](https://docs.stormpath.com).

And, most importantly, you can configure changes to *all* of this without changing your application code!  

This model gives us two approaches to easily support multi-tenant applications:

1. Single Directory with a Group-per-Tenant (recommended)
2. Directory-per-Tenant (advanced)

### Approach 1: Single Directory with a Group-per-Tenant

**We recommend this approach for most multi-tenant applications.**

This design approach uses a single `Directory`, which guarantees Account and Group uniqueness:

* A user `Account` is guaranteed to have a unique email address (and username) compared to any other Account within the same Directory.

* A `Group` is guaranteed to have a unique name compared to any other Group within the same Directory.

Knowing this, we can model multi-tenant SaaS applications so a Tenant is represented as a `Group` within a Directory, and you would have (at least) a Group per Tenant.

For example, let's assume `jsmith@customerA.com` signs up for your application by filling out a signup form.  Upon submit you would:

1.  Insert a new `Account` in your designated `Directory`.  This guarantees that there is - and only ever will be - a single `jsmith@customerA.com` `Account` record.

2.  Either generate a compatible subdomain name (or allow the user to specify one) and create a new `Group` in your designated `Directory` with the name of this subdomain.  This guarantees that there will only ever be a single `Group` named that subdomain.  Your 'Tenant' record is simply a `Group` in a Stormpath Directory.

3.  Assign the just-created `jsmith@customerA.com` `Account` to the new `Group`.  Any other Accounts added over time to this Group will also immediately be recognized as users for that Tenant.

This approach has the following benefits:

* All Accounts are guaranteed to be unique across all tenants, and there is no possibility of Account duplication.

* Unique Accounts ensure a single unified user identity no matter how many applications or services you bring online - this is a *huge* benefit to your users if/when you have multiple applications and you want to support Single Sign On (SSO) across your applications.  SSO is outside the scope of this guide, but will be available in the future.

* Using a Group to represent a Tenant/Organization guarantees subdomain uniqueness across all tenants/organizations because group names must be unique within a Directory.

* Using a Group to represent a Tenant allows you to associate multiple Accounts to a single tenant easily: just add them to the tenant Group.  You can find all users in a tenant just by requesting the Group, or, you can search across all users in a tenant just by searching in that Group only.

* You can store Tenant-specific data without having to roll your own database/tables, by assigning any ad-hoc data you want to a Stormpath Group as [custom data](https://docs.stormpath.com/rest/product-guide/#custom-data).

* Group [custom data](https://docs.stormpath.com/rest/product-guide/#custom-data) can be used to store tenant-specific [permisions or Access Control Lists](https://stormpath.com/blog/fine-grained-permissions-with-customData), so you can control what each users of each tenant are allowed to do in your application by simply assigning or removing specific values from their Tenant Group's `customData`.

* You could share Accounts across Tenants by adding an Account to more than one Tenant Group. This can be highly beneficial in certain use cases, where you might want to temporarily grant a user access to a tenant, but then revoke the access later, all the while not impacting their own tenant.

* Because all Accounts and Groups are in a single Directory, you can do a global search across all Accounts by querying the Directory's Accounts or all Tenants by querying the Directory's groups.

* You can create additional Directory groups that contain Accounts from multiple tenants.  This can be used for modeling hierarchical tenants or for more powerful permission schemes.

* Because Stormpath does not distinguish between a Group and a Role (they are the same thing to Stormpath), you can reference any tenant Group as a 'Role' for Role Based Access Control checks.

In summary, the Single Directory, Group-per-Tenant approach is the simplest model, easiest to understand, and provides many desirable features suitable for most multi-tenant SaaS applications.

Next, let's discuss how actual groups and roles are handled in this model.

#### Groups of Accounts Within Tenants

With the Group-per-Tenant approach, we're often asked, "How do I also represent regular groups of users _within_ a tenant?"

An immediate concern is that, because Group names must be entirely unique within a Directory, there is the potential for conflict: if `customerA` created an `administrators` group, then `customerB` would not be able to create their own `administrators` group.  At a cursory look, this _is_ true: group names cannot be identical in the same Directory.

What we've seen work well in practice is to use a group naming convention to guarantee uniqueness. Here is how it works:

1. When creating a Group to represent the Tenant within your Directory, that Group will have a _surrogate_ key - permanent, immutable, and globally-unique identifier  - embedded in its `href`.  For example, in this REST JSON representation of the Tenant Group...

        {
          "href": "https://api.stormpath.com/v1/groups/2gdhVFEQMXpaUMAPzLXen4"
          "name": "customerA"
          ... remaining fields omitted for brevity ...
        }

    ...the immutable globally-unique identifier is **`2gdhVFEQMXpaUMAPzLXen4`**.

2. Using this surrogate key, create any tenant-specific subgroup by prefixing the new Group name with the Tenant Group UID.

    For example, if a tenant end-user creates an `administrators` group, before saving to Stormpath, you would prefix that name with the Tenant Group UID and a delimiter, and create a group within the Stormpath Directory with that new name:

        POST https://api.stormpath.com/v1/directories/29E0XzabMwPGluegBqAl0Y/groups
        
        {
          "name": "2gdhVFEQMXpaUMAPzLXen4_administrators"
        }

    As you can see, the new tenant 'sub' group is concatenated:

    `tenant group UID` + `_` + `administrators`

    This guarantees that tenant subgroups never collide with other tenants.

    In this example, we used the underscore character `_` as the delimiter, but you can  also use a perod `.` or dash `-`.  To keep querying simple we recommend you use URL safe characters.

3.  When retrieving a tenant subgroup, you just strip off the tenant group id and delimiter prefix and display just the remaining name to the application end-users (pseudo-code example):

        underscore_index = stormpath_group.name.last_index_of('_')
        display_name = stormpath_group.name.substring(underscore_index)
        print("You are a member of the " + display_name + "group")

##### Why Use the Surrogate Key for Names?

By using the Tenant Group's UID, you guarantee that no matter what the tenant name is or if it ever changes, all of the tenant's subgroups will all still be relevant.

**Note:** You can use the tenant group's human-friendly name as the prefix if you like, but if you ever change the tenant name, you must ensure that all groups that are prefixed with the old name are renamed at the same time.

##### Querying

A nice side effect of this naming scheme is that it becomes very easy to find all subgroups 'owned' by a particular tenant.  Just query all for all groups in the Directory that start with the Tenant Group's UID.  For example:

        GET https://api.stormpath.com/v1/directories/29E0XzabMwPGluegBqAl0Y/groups?name=2gdhVFEQMXpaUMAPzLXen4_*

Notice the asterisk at the end of the query? Stormpath's [query support](https://docs.stormpath.com/rest/product-guide/#Directory-groups) supports starts-with matching, so the above query will return all groups that start with our ID + underscore prefix.

If you wanted to retrieve the tenant group and all of its subgroups, make the query a little less restrictive by removing the underscore:

        GET https://api.stormpath.com/v1/directories/29E0XzabMwPGluegBqAl0Y/groups?name=2gdhVFEQMXpaUMAPzLXen4*

### Approach 2: Directory-per-Tenant

In Stormpath, an Account is guaranteed to be unique only _within a Directory_.  This means:

{% docs note %}

Account `jsmith@gmail.com` in Directory A is **_not_** the same as Account `jsmith@gmail.com` in Directory B.

{% enddocs %}

As a result, you could create a Directory in Stormpath for each of your tenants, and your user Account identities will be 100% separate. With this Directory-per-Tenant approach, your application's user Accounts are guaranteed to be unique within a tenant (Directory) - but can exist independently in multiple directories.

Directory-per-Tenant is an advanced data model that offers more flexibility, but at the expense of complexity. It is the model that Stormpath itself uses and it is only recommended for more advanced applications or those with special requirements. As a result, we don't cover the approach in further detail here. If you feel the Directory-per-Tenant approach might be appropriate for your project, and you'd like some advice, please contact [support@stormpath.com](mailto:support@stormpath.com). We are happy to help you model out your user data, whether or not Stormpath is the right option for your application.

## We're Always Here to Help
Whether you're trying to figure out multi-tenant approaches for your SaaS application or have questions about how to use     Stormpath, we're always here to help. Please feel free to contact us at [support@stormpath.com](mailto:support@stormpath.com).