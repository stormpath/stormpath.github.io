---
layout: default
---

#Error: 7102
Login attempt failed because the Account is not verified.

##Explanation
During a login attempt, Stormpath found an account from the specified user name or email, but the account had a status of `UNVERIFIED`.  Accounts with the `UNVERIFIED` status can not login.


