// Require the templates we need
define([
    'hgn!../templates/form',
    'hgn!../templates/hello',
    'hgn!../templates/loading'
],function(
    form,
    hello,
    loading
) {
    // Map routes to templates
    var routes = {
        '/': form,
        '/hello': hello
    };
    // Find the elements we need to render templates
    var wrap = document.querySelector('.wrap');
    var content = wrap.querySelector('.content');

    return {
        // routes.render renders a path with optional data
        render: function(path, data) {
            data = data || {};
            // Animations!
            wrap.className += ' animate-out';
            setTimeout(function() {
                // We wait 500ms for the animation to complete before removing the class
                content.innerHTML = routes[path](data);
                wrap.className = wrap.className.replace('animate-out', '');
            }, 500);
        },
        // routes.loading renders the loading template
        loading: function() {
            content.innerHTML = loading();
        },
        // routes.has checks that a route exists
        has: function(path) {
            return routes[path] ? true : false;
        },

    };
});
