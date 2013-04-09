balanced-dashboard
==================

The Balanced Dashboard

[![Build Status](https://secure.travis-ci.org/balanced/balanced-dashboard.png?branch=master)](http://travis-ci.org/balanced/balanced-dashboard)

## What

Welcome to the Balanced Dashboard.

As an open company we want to put as much of our company in the public view as
possible. We're creating our new dashboard as a javascript application that
anyone can fork, comment on, contribute to, or generally tinker with.

## Why

Found a spelling mistake? Want to run your own version with customised
functionality? Jump in and contribute!

## How

### Running locally

You will need node installed as a development dependency. See
[node's site](http://nodejs.org/) for help with that.

1. `npm install -g grunt-cli`
2. `npm install`
3. Build - `grunt`
4. To view in a browser `open index.html`
5. To run unit tests `grunt test`
6. To run browser tests `grunt itest`

### Building and Deploying

1. To build everything `grunt build`
2. To deploy `grunt deploy`

    **Note**: You must have the appropriate `AWS_ACCESS_KEY_ID` and
        `AWS_SECRET_ACCESS_KEY` environment variables set

### Contributing

You can contribute to this project in one of two ways:

1. Browse our issues, comment on proposals, report bugs.
2. Clone the balanced-dashboard repo, make some changes according to our
   development guidelines and issue a pull-request with your changes.

### Development guidelines

1. Fork it (`git clone git://github.com/balanced/balanced-dashboard.git`)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Write your code **and unit tests**
4. Ensure all tests still pass (`grunt test`)
5. [Lint](https://github.com/jshint/jshint/) your code
6. Commit your changes (`git commit -am 'Add some feature'`)
7. Push to the branch (`git push origin my-new-feature`)
8. Create new [pull request](https://help.github.com/articles/using-pull-requests)
