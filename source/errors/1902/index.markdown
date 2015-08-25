---
layout: default
---
                 
#Error: 1902

##Reserved application limit reached. Please add more applications in the admin console


###Explanation
This error will occur when creating a Stormpath `Application` when your Stormpath `Tenant` has reached its application limit.  To view your application limit, log into the [Stormpath Admin Console](https://api.stormpath.com/login), click the drop down in the top right corner, and select `Subscription`.  Your `Available Applications` is your application limit and the `Active Applications` is the current number of Applications in your Tenant.  To be able to create additional applications, delete unused applications, or update your subscription to include more applications.
