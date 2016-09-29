# stormpath.github.io

*The public facing Stormpath documentation website.*


## Purpose

This project is what renders the public facing Stormpath documentation website:
https://docs.stormpath.com

Any changes made to this project will be automatically deployed to
https://docs.stormpath.com.


## Technology

This project is a [Jekyll](https://jekyllrb.com/) powered static website.  It is
deployed to [Amazon S3](https://aws.amazon.com/s3/) and uses the [Amazon
Cloudfront CDN](https://aws.amazon.com/cloudfront/) to deliver the site quickly
to users all over the world.

This site is built and deployed automatically using [Travis
CI](https://travis-ci.org/stormpath/stormpath.github.io).


## Structure

The way this project is structured is a tad bit unusual.  This will likely
change in the future, but is important to understand if you plan on working with
(*or contributing to*) this project.

The `master` branch of this project contains static, compiled assets ONLY.
These are the assets that are publicly deployed to the Amazon web servers / CDN.

I know what you're thinking: *"Why do you have compiled assets in version
control?"*  The answer is that this is the *jekyll* way of doing things.  And
no, I'm not a fan.

Anyhow: all the actual source files are contained on the aptly named `source`
branch.  So, if you plan on contributing to this project, please ONLY submit
pull requests to the `source` branch, and nowhere else.

Next: many of the project specific documentation in this project is NOT written
in this project at all, but is instead copied into this project from other
github repositories.

For instance: if you wanted to change some
[express-stormpath](https://github.com/stormpath/express-stormpath)
documentation, you would do so in the
[express-stormpath](https://github.com/stormpath/express-stormpath) repository,
NOT this one.


## Contributing

First off: if you want to contribute to this project, you are awesome.  We
appreciate anyone who goes out of their way to help us with documentation fixes,
etc.

There are only a few things you need to do to contribute:

- Clone this repository.
- Check out the `source` branch of this repository.
- Create a new branch based on the `source` branch.
- Make your code changes.
- Push your branch to Github.
- Open a pull request from your branch (*with changes*) into the `source` branch
  of this repository.

This process usually looks something like this (*once you've forked this
repository*):

```console
$ cd stormpath.github.io
$ git fetch origin source:source
$ git checkout -b some-fix
$ # ... make your changes now ...
$ git add .
$ git commit -m "Adding my changes!"
$ git push origin some-fix
$ # now go open a pull request
```

Once you've submitted a pull request, someone who maintains this repository will
review your changes and merge them in, at which point your changes will be live
on the website!

Any questions?  [Email me!](mailto:randall@stormpath.com)
