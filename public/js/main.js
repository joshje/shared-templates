// Configure paths to our dependencies:
require.config({
    baseUrl: '/js',
    paths : {
        text: '/bower_components/requirejs-hogan-plugin/text',
        hogan: '/bower_components/requirejs-hogan-plugin/hogan',
        hgn: '/bower_components/requirejs-hogan-plugin/hgn',
        md5: '/bower_components/md5-jkmyers/md5.min',
        templates: '../templates'
    }
});

// Require the modules we need here:
require([
    'gravatar',
    'routes'
], function(
    gravatar,
    routes
) {
    var content = document.querySelector('.content'); // We will bind events to this element

    // Get a user from Gravatar and then render them
    var renderUser = function(email) {
      // Render the loading screen
      routes.loading();

      gravatar.getUser(email, function(error, user) {
        if (error) {
          routes.render('/', {
              error: true,
              email: email
          });
        } else {
          routes.render('/hello', user);
        }
      });
    };

    // This event fires as a user navigates the history:
    window.addEventListener('popstate', function(e) {
        var state = e.state || {};
        if (state.getUser) {
            renderUser(state.email);
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
                getUser: true,
                email: email
            }, '', '/hello?email=' + encodeURIComponent(email));
            // Get the new user
            renderUser(email);
        }
    }, true);
});
