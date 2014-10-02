require.config({
    baseUrl: '/js',
    paths : {
        text: 'lib/requirejs-text/requirejs-text',
        hogan: 'lib/requirejs-hogan-plugin/hogan',
        hgn: 'lib/requirejs-hogan-plugin/hgn',
        md5: 'lib/md5-jkmyers/md5-jkmyers'
    }
});

require([
    'ajax',
    'md5',
    'routes'
], function(
    ajax,
    md5,
    routes
) {
    var content = document.querySelector('.content');
    var users = {};
    var imageSize = (window.devicePixelRatio > 1.5) ? 400 : 200;

    var getUser = function(email) {
        var hash = md5(email.replace(/^\s+|\s+$/g, ''));
        if (users[hash]) return routes.render('/hello', users[hash]);

        var url = 'http://en.gravatar.com/' + hash + '.json';
        routes.loading();
        ajax(url, function(res) {
            var user = res.entry[0];
            user.thumbnailUrl += '?s=' + imageSize;
            users[hash] = user;
            var img = document.createElement('img');
            img.addEventListener('load', function() {
                routes.render('/hello', user);
            });
            img.src = user.thumbnailUrl;
        }, function() {
            routes.render('/', {
                error: true,
                email: email
            });
        });
    };

    window.addEventListener('popstate', function(e) {
        var state = e.state || {};
        if (state.email) {
            getUser(state.email);
        } else {
            routes.render(window.location.pathname, state);
        }
    });

    content.addEventListener('click', function(e) {
        var el = e.target;
        var url = el && el.getAttribute('href');
        if (routes.has(url)) {
            e.preventDefault();
            window.history.pushState({}, '', url);
            routes.render(url);
        }
    }, true);

    content.addEventListener('submit', function(e) {
        var emailEl = e.target.querySelector('input.email');
        if (emailEl) {
            var email = emailEl.value;
            e.preventDefault();
            window.history.pushState({
                email: email
            }, '', '/hello?email=' + encodeURIComponent(email));
            getUser(email);
        }
    }, true);
});

