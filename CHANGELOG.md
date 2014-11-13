# Balanced Dashboard Changelog

### 1.1.0

* Combined Orders and Transactions list into Payments tab
* Changed Orders table into cards view
* Updated Order details page to display transactions grouped by customers
* Updated Transaction details page to include associated orders and transactions
* Added "Unlinked transactions" tooltips in the Transactions table
* Indicate overdue Orders
* Readded disputes table to customer page

### 1.0.4

* Fixed error handling for create bank account modal
* Restored input field name in login page to fix 1password functionality
* Updated readme

### 1.0.3

* Fixed images in import payouts page.
* Fixed duplicate "Logs" tab in search results
* Fixed csv import flow.
* Fixed funding instrument title in disputes page.

### 1.0.2

* Fixed bug where new marketplaces would not link to the user after being created.
* Fixed bug where dispute documentation could not be uploaded.
* Fixed bug with displaying hold information on capture hold modal.
* Fixed bug where changing password was failing on validation.
* Fixed bug where the lastLoginUri was overriden after log-in.
* Using latest version of phantomjs on CI through npm.

### 1.0.1

* Fix for blinking "Upload dispute document" banner.
* Uploading assets directory into production deployment (#1512)
* Specifying hard version numbers on packages (#1512)

### 1.0.0

* Converted application to ember-cli (version 0.1.2)
* Upgraded ember to 1.8.0-beta.1
* Added coffeescript support through `ember-cli-coffeescript`
