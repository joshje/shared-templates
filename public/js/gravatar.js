define([
    'md5',
], function(
    md5
) {
    var users = {}; // To cache users returned from Gravatar
    // Use a larger image size on retina screens:
    var imageSize = (window.devicePixelRatio > 1.5) ? 400 : 200;

    // Takes a URL, success callback function and error callback function
    var ajax = function(url, cb, cbErr) {
        var errorTimeout;
        // A random callback function name each time
        var cbName = 'ajaxcallback' + Math.floor(Math.random() * 1000);

        // Add our callback function name to the URL
        url += (url.indexOf('?') == -1) ? '?' : '&';
        url += 'callback=' + cbName;

        // Add the callback function to the window
        window[cbName] = function(data) {
            clearTimeout(errorTimeout);
            cb(data);
        };

        // If we don't get a reply within 2s we assume an error
        errorTimeout = setTimeout(function() {
            if (cbErr) cbErr();
        }, 2000);

        // Add the URL to a script and attach to the body
        var script = document.createElement('script');
        script.src = url;
        document.body.appendChild(script);
    };

    // Get a user from the cache, or Gravatar API
    var getUser = function(email, cb) {
        // Generate a hash from the email
        var hash = md5(email.replace(/^\s+|\s+$/g, ''));
        // Return the user if we already have them
        if (users[hash]) return cb(null, users[hash]);

        ajax('http://en.gravatar.com/' + hash + '.json', function(res) {
            var user = res.entry[0];
            user.thumbnailUrl += '?s=' + imageSize;
            users[hash] = user;
            var img = document.createElement('img');
            // Wait for the image to load
            img.addEventListener('load', function() {
                // Return the user
                cb(null, user);
            });
            img.src = user.thumbnailUrl;
        }, function() {
            // On error, call the callback with an error.
            cb('Failed to fetch user');
        });
    };

    return {
        getUser: getUser
    };
});
