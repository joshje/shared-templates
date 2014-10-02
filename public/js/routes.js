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
    var content = document.querySelector('.content');

    return {
        render: function(url, data) {
            data = data || {};
            content.innerHTML = routes[url](data);
        },
        loading: function() {
            content.innerHTML = loading();
        },
        has: function(url) {
            return routes[url] ? true : false;
        },

    };
});
