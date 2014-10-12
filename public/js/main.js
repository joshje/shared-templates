// Configure paths to our dependencies:
require.config({
    baseUrl: '/js',
        paths : {
        text: 'lib/requirejs-text/text',
        hogan: 'lib/requirejs-hogan-plugin/hogan',
        hgn: 'lib/requirejs-hogan-plugin/hgn',
        md5: 'lib/md5-jkmyers/md5.min'
    }
});

// Require the modules we need here:
require([
    'ajax',
    'md5',
    'routes'
], function(
    ajax,
    md5,
    routes
) {
    var content = document.querySelector('.content'); // We will bind events to this element
    var users = {}; // To cache users returned from Gravatar
    // Use a larger image size on retina screens:
    var imageSize = (window.devicePixelRatio > 1.5) ? 400 : 200;

    // Get a user from the cache, or Gravatar API
    var getUser = function(email) {
        // Generate a hash from the email
        var hash = md5(email.replace(/^\s+|\s+$/g, ''));
        // Return the user if we already have them
        if (users[hash]) return routes.render('/hello', users[hash]);

        routes.loading(); // Render the loading screen
        ajax('http://en.gravatar.com/' + hash + '.json', function(res) {
            // On success, render the /hello route
            var user = res.entry[0];
            user.thumbnailUrl += '?s=' + imageSize;
            users[hash] = user;
            var img = document.createElement('img');
            img.addEventListener('load', function() {
                routes.render('/hello', user);
            });
            img.src = user.thumbnailUrl;
        }, function() {
            // On error, render the / route with an error message
            routes.render('/', {
                error: true,
                email: email
            });
        });
    };

    // This event fires as a user navigates the history:
    window.addEventListener('popstate', function(e) {
        var state = e.state || {};
        if (state.getUser) {
            getUser(state.getUser);
        } else {
            routes.render(window.location.pathname, state);
        }
    });

    // Handle link clicks and use the history API
    content.addEventListener('click', function(e) {
        var el = e.target;
        var url = el && el.getAttribute('href');
        if (routes.has(url)) {
            e.preventDefault();
            window.history.pushState({}, '', url);
            routes.render(url);
        }
    }, true);

    // Handle the form submission
    content.addEventListener('submit', function(e) {
        var emailEl = e.target.querySelector('input.email');
        if (emailEl) {
            var email = emailEl.value;
            e.preventDefault();
            // Store the email in this current history state
            window.history.replaceState({
                email: email
            }, '', '/');
            // Update the URL to the /hello page
            window.history.pushState({
                getUser: email
            }, '', '/hello?email=' + encodeURIComponent(email));
            // Get the new user
            getUser(email);
        }
    }, true);
});
