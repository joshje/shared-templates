define(function() {
    return function(url, cb, cbErr) {
        var errorTimeout;
        var cbName = 'ajaxcallback' + Math.floor(Math.random() * 1000);

        url += (url.indexOf('?') == -1) ? '?' : '&';
        url += 'callback=' + cbName;

        window[cbName] = function(data) {
            clearTimeout(errorTimeout);
            cb(data);
        };

        errorTimeout = setTimeout(function() {
            if (cbErr) cbErr();
        }, 2000);

        var script = document.createElement('script');
        script.src = url;
        document.body.appendChild(script);
    };
});
