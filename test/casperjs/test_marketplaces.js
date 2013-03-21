var casper = require('casper').create();

casper.start('http://localhost:9876/index.html', function () {
    this.test.assertTitle('Balanced', 'The title *is* Balanced');
});

casper.then(function () {
    this.click('header nav ul li a');
});

casper.then(function() {
    this.log('clicked ok, new location is ' + this.getCurrentUrl());
    this.test.assertExists('a');
    this.test.assertTextExists('Rent my bike');
});

casper.run(function() {
//    this.test.done(5); // checks that 5 assertions have been executed
    this.test.renderResults(true);
});
