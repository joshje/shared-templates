define(function() {
    // Takesa URL, success callback function and error callback function
    return function(url, cb, cbErr) {
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
});
