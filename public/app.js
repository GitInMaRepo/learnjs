'use strict';
var learnjs = {};

learnjs.problems = [
    {
        description: "Make this evaluate truthy",
        code: "function problem() { return ___; }"
    },
    {
        description: "Do some maths",
        code: "function problem() { 6 * ___ === 42; }"
    }
]

learnjs.problemView = function(parameter) {
    var problemNumber = parseInt(parameter);
    var view = $('.templates .problems-view').clone();
    view.find('.title').text('Problem #' + parameter);
    return learnjs.applyBindings(view, learnjs.problems[problemNumber-1]);
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
}

learnjs.applyBindings = function(element, data) {
    for(var key in data) {
        element.find('[data-name="'+key+'"]').text(data[key]);
    }
    return element;
};
