'use strict';

function googleSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    AWS.config.update({
        region: 'us-east-1',
        credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: learnjs.poolId,
            Logins: {
                'accounts.google.com': id_token
            }
        })
    })
    function refresh() {
        return gapi.auth2.getAuthInstance().signIn({
            prompt: 'login'
        }).then(function(userUpdate) {
            var creds = AWS.config.credentials;
            var newToken = userUpdate.getAuthResponse().id_token;
            creds.params.Logins['accounts.google.com'] = newToken;
            return learnjs.awsRefresh();
        });
    }
    learnjs.awsRefresh().then(function(id) {
        learnjs.identity.resolve({
            id: id,
            email: googleUser.getBasicProfile().getEmail(),
            refresh: refresh
        });
    });
}

var learnjs = {
    poolId: 'us-east-1:00fa4db0-1be4-4652-a6f5-31844e5a4866'
};

learnjs.identity = new $.Deferred();

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

    if(number < learnjs.problems.length) {
        var button = learnjs.cloneTemplate('skip-button');
        button.find('a').attr('href', '#problem-' + (number+1));
        $('.nav-list').append(button);
        view.bind('removingView', function() {
            button.remove();
        });
    }
    return learnjs.applyBindings(view, problem);
}

learnjs.profileView = function() {
    var view = learnjs.cloneTemplate('profile-view');
    learnjs.identity.done(function(identity) {
        view.find('.email').text(identity.email);
    });
    return view;
}

learnjs.showView = function(hash) {
    var routes = {
        '#problem' : learnjs.problemView,
        '#profileview' : learnjs.profileView,
        '' : learnjs.landingView
    };

    var routeAndParams = hash.split('-');

    var funcToCall = routes[routeAndParams[0]];
    if(funcToCall) {
        learnjs.triggerEvent('removingView', [])
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

learnjs.triggerEvent = function(name, args) {
    $('.view-container>*').trigger(name, args);
}

learnjs.awsRefresh = function() {
    var deferred = new $.Deferred();
    AWS.config.credentials.refresh(function(err) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(AWS.config.credentials.identityId);
        }
    });
    return deferred.promise();
}

