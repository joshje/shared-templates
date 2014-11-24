var express = require('express');
var hogan = require('hogan-express');
var request = require('request');
var md5 = require('MD5');

var app = express(); // This is our express app.
app.set('view engine', 'mustache'); // Templates have an extension of *.mustache...
app.set('views', 'templates'); // and reside within the /templates directory.
app.set('layout', 'layout'); // Use templates/layout.mustache for the page layout
app.engine('mustache', hogan); // Use hogan to render mustache templates

app.get('/', function(req, res) {
    // Render a form for all requests to the root (/)
    res.render('form');
});

app.get('/hello', function(req, res) {
    // Get the email query parameter
    var email = req.query.email;
    // MD5 hash it
    var hash = md5(email.replace(/^\s+|\s+$/g, ''));

    // Fetch the user info from the Gravatar API
    request({
        url: 'http://www.gravatar.com/' + hash + '.json',
        headers: { 'User-Agent': 'Node' }
    }, function (err, response, body) {
        if (err || response.statusCode !== 200) {
            // On error, render a form with an error message
            res.status(response.statusCode);
            res.render('form', {
                error: true,
                email: email
            });
        } else {
            // On success, render the hello template with the user data
            var json = JSON.parse(body);
            var user = json.entry[0];
            res.render('hello', user);
        }
    });
});

// Make the /templates folder available to the web at /templates
app.use('/templates', express.static(__dirname + '/templates'));
// Make bower components available at /bower_components
app.use('/bower_components', express.static(__dirname + '/bower_components'));
// Make the /public folder available to the web at /
app.use(express.static(__dirname + '/public'));

// Start our server on port 3000
var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
