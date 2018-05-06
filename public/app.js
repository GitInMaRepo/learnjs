'use strict';
var learnjs = {};

learnjs.problemView = function(parameter) {
    var title = 'Problem ' + parameter + ' coming soon';
    return $('<div class="problem-view">').text(title);
}

learnjs.showView = function(hash) {
    var routes = {
        '#problem' : learnjs.problemView
    };

    var routeAndParams = hash.split('-');

    var funcToCall = routes[routeAndParams[0]];
    if(funcToCall) {
        $('.view-container').empty().append(funcToCall(routeAndParams[1]));
    }
}

learnjs.appOnReady = function() {
    window.onhashchange = function() {
        learnjs.showView(window.location.hash)
    }
    learnjs.showView(window.location.hash);
};
