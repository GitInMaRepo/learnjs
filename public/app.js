'use strict';
var learnjs = {};

learnjs.DO_NOT_RELOAD_THE_PAGE = false;

learnjs.problems = [
    {
        description: "Make this evaluate truthy",
        code: "function problem() { return ___; }"
    },
    {
        description: "Do some maths",
        code: "function problem() { return 42 === ___ * 7; }"
    }
]

learnjs.problemView = function(parameter) {
    var problemNumber = parseInt(parameter);
    var problemData = learnjs.problems[problemNumber-1];
    var view = $('.templates .problems-view').clone();
    var resultArea = view.find('.result');

    function checkAnswer() {
        var answer = view.find('.answer').val();
        var sourceCode = problemData.code.replace('___', answer) + '; problem();';
        return eval(sourceCode);
    }
    function checkAnswerClick() {
        if(checkAnswer()) {
            learnjs.flashElement(resultArea, 'Correct!');
        }
        else {
            learnjs.flashElement(resultArea, 'Incorrect!');
        }
        return learnjs.DO_NOT_RELOAD_THE_PAGE;
    }

    view.find('.title').text('Problem #' + parameter);
    view.find('.check-answer-button').click(checkAnswerClick);    
    return learnjs.applyBindings(view, problemData);
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

learnjs.flashElement = function(element, content) {
    element.fadeOut('fast', function() {
        element.html(content);
        element.fadeIn();
    });
}
