define([
    'hgn!../templates/form',
    'hgn!../templates/hello',
    'hgn!../templates/loading'
],function(
    form,
    hello,
    loading
) {
    var routes = {
        '/': form,
        '/hello': hello
    };
    var wrap = document.querySelector('.wrap');
    var content = wrap.querySelector('.content');

    return {
        render: function(path, data) {
            data = data || {};
            wrap.className += ' animate-out';
            setTimeout(function() {
                content.innerHTML = routes[path](data);
                wrap.className = wrap.className.replace('animate-out', '');
            }, 500);
        },
        loading: function() {
            content.innerHTML = loading();
        },
        has: function(path) {
            return routes[path] ? true : false;
        },

    };
});
