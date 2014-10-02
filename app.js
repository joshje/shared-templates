var express = require('express');
var hogan = require('hogan-express');
var request = require('request');
var md5 = require('MD5');

var app = express();
app.set('view engine', 'mustache');
app.set('views', 'templates');
app.set('layout', 'layout');
app.engine('mustache', hogan);

app.get('/', function(req, res) {
    res.render('form');
});

app.get('/hello', function(req, res) {
    var email = req.query.email;
    var hash = md5(email.replace(/^\s+|\s+$/g, ''));
    var url = 'http://www.gravatar.com/' + hash + '.json';

    request({
        url: url,
        headers: { 'User-Agent': 'Node' }
    }, function (err, response, body) {
        if (err || response.statusCode !== 200) {
            res.status(response.statusCode);
            res.render('form', {
                error: true,
                email: email
            });
        } else {
            var json = JSON.parse(body);
            var user = json.entry[0];
            res.render('hello', user);
        }
    });


});

app.use('/templates', express.static(__dirname + '/templates'));
app.use(express.static(__dirname + '/public'));

var server = app.listen(1234, function() {
    console.log('Listening on port %d', server.address().port);
});
