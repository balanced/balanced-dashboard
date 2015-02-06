# Balanced Dashboard Changelog

### master

* Fixing restart verification button not showing after the wait period is over
* Refactoring how model sidebars are displayed
* Turning off marketplace application process temporarily

### 1.2.1

* Adding formatted input library
* Toggling marketplace application process

### 1.2.0

* Refactoring marketplace application flow to use balanced-addon-models

### 1.1.10

* Fixes #1614: Display correct succeeded bank account credit count
* Fix reversals not showing sometimes on search results.
* Fix incorrect status showing up for holds
* Fixes #1611: Display debits associated to disputes in the customer page

### 1.1.9

* Fixing filtering on search results.
* Fixing "Card name on card log page shows 'undefined'" (#1603)
* Fixes #1588: Do not truncate values in the side panel
* Fixes #1591: Display transaction failure reason in log page
* Fixes #1597: Reorder associated transactions
* Fixes #1598: Align buttons correctly
* Fixes #1601: Update dispute text

### 1.1.8

* Showing related resource links on log page (#717)
* Adding UPS tracking number to disputes
* Fixing payments filter on marketplace settings page
* Fixing style error on disputes table
* Not displaying duplicate holds, refunds, and reversals on transactions timeline (#1569)
* Using internal description for transaction list (#1565)

### 1.1.7

* Added full screen search and keyboard shortcuts
* Fixed broken sorting on transactions table
* Update dispute status from 'new' to 'needs attention' (#1554)
* Display expected credit date in create credit modal (#1556)
* Wrap text for API keys and webhook URIs (#1552)
* Enable 'start verification' button after 3 business days or verification failure. (#1535)
* Disable search shortcut trigger when the user is already typing in an input (#1564)

### 1.1.6

* Updated search results view (#1489)
* Added keyboard shortcuts to open and close the search modal
* Added mixpanel events for routes

### 1.1.5

* Mixpanel tracking (reverted)

### 1.1.4

* Fixing some tracking bugs.

### 1.1.3

* Adding some events to mixpanel.
* Fixed bug with internal description not showing on some transaction pages

### 1.1.2

* Removed the orders messages from old marketplaces

### 1.1.1

* Bug fixes for order views

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
