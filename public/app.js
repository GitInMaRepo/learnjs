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

learnjs.landingView = function() {
    return learnjs.cloneTemplate('landing-view')
}

learnjs.problemView = function(parameter) {
    var number = parseInt(parameter);
    var problem = learnjs.problems[number-1];
    var view = learnjs.cloneTemplate('problems-view');
    var resultArea = view.find('.result');

    function checkAnswer() {
        var answer = view.find('.answer').val();
        var sourceCode = problem
                            .code
                            .replace('___', answer) + '; problem();';
        return eval(sourceCode);
    }

    function buildCorrectAnswer() {
        var content = learnjs.cloneTemplate('correct-result');
        var link = content.find('a');
        if(number >= learnjs.problems.length) {
            link.attr('href', '');
            link.text('You are finished');            
        }
        else {
            link.attr('href', '#problem-'+ (number+1));
        }
        return content;
    }
    
    function checkAnswerClick() {
        if(checkAnswer()) {
            var content = buildCorrectAnswer(number);
            learnjs.flashElement(resultArea, content);
        }
        else {
            learnjs.flashElement(resultArea, 'Incorrect!');
        }
        return learnjs.DO_NOT_RELOAD_THE_PAGE;
    }

    view.find('.title').text('Problem #' + number);
    view.find('.check-answer-button').click(checkAnswerClick);    
    return learnjs.applyBindings(view, problem);
}

learnjs.showView = function(hash) {
    var routes = {
        '#problem' : learnjs.problemView,
        '' : learnjs.landingView
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

learnjs.cloneTemplate = function(name) {
    return $('.templates .'+name).clone();
}

