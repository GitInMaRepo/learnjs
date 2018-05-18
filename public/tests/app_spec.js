describe('LearnJS', function () {
    it('can show the problem view', function () {
        learnjs.showView('#problem-1');
        expect($('.view-container .problems-view').length).toEqual(1);
    });

    it('shows the landing page', function () {
        learnjs.showView('');
        expect($('.view-container .landing-view').length).toEqual(1);
    });

    it('routes parameters to the view', function () {
       spyOn(learnjs, 'problemView');
       learnjs.showView('#problem-42')
       expect(learnjs.problemView).toHaveBeenCalledWith('42');
    });

    it('invokes the router when loading', function () {
        spyOn(learnjs, 'showView');
        learnjs.appOnReady();
        expect(learnjs.showView).toHaveBeenCalledWith(window.location.hash);
    });

    it('subscribes to the hashchange event', function() {
        learnjs.appOnReady();
        spyOn(learnjs, 'showView');
        $(window).trigger('hashchange');
        expect(learnjs.showView).toHaveBeenCalledWith(window.location.hash)
    });

    it('correctly clones the view template', function() {
        var view = learnjs.cloneTemplate('problems-view');
        expect(view.hasClass('problems-view')).toEqual(true);
    });

    it('correctly clones the result template', function() {
        var view = learnjs.cloneTemplate('correct-result');
        expect(view.hasClass('correct-result')).toEqual(true);
    });

    it('has a navigation area', function() {
        learnjs.showView('#problem-1');
        expect($('.nav-container').length).toEqual(1);
    });

    describe('The problem view', function() {
        it('shows the problem number', function() {
            var view = learnjs.problemView('1');
            expect(view.find('.title').text()).toEqual('Problem #1');
        });

        it('has the fields to bind data to', function() {
            var view = learnjs.problemView('1');
            expect(view.find('[data-name="description"]').length).toEqual(1);
            expect(view.find('[data-name="code"]').length).toEqual(1);
        });

        it('binds data to itself', function(){
            spyOn(learnjs, 'applyBindings');
            learnjs.problemView('1');
            expect(learnjs.applyBindings).toHaveBeenCalled();
        });

        it('calls the fadein/fadeout for user feedback', function() {
            spyOn(learnjs, 'flashElement');
            var view = learnjs.problemView('1');
            view.find('.check-answer-button').click();
            expect(learnjs.flashElement).toHaveBeenCalled();
        });
    });

    describe('The databinding applicator', function() {
        it('sets the data to the description element', function() {
            var view = $('.templates .problems-view').clone();
            var result = learnjs.applyBindings(view, learnjs.problems[0]);
            expect(result.find('[data-name="description"]').text())
                .toEqual("Make this evaluate truthy");
        });

        it('sets the data to the code element', function() {
            var view = $('.templates .problems-view').clone();
            var result = learnjs.applyBindings(view, learnjs.problems[0]);
            expect(result.find('[data-name="code"]').text())
                .toEqual("function problem() { return ___; }");
        });
    });

    describe('The answer section', function(){
        it('accepts a correct answer', function() {
            var view = learnjs.problemView('1');
            view.find('.answer').val('true');
            view.find('.check-answer-button').click();
            expect(view.find('span').text()).toEqual('Correct! ');
        });

        it('shows the link to the next problem on a correct answer', function() {
            var view = learnjs.problemView('1');
            view.find('.answer').val('true');
            view.find('.check-answer-button').click();
            expect(view.find('a').text()).toEqual('Next problem');
            expect(view.find('a').attr('href')).toEqual('#problem-2');
        });

        it('denies an incorrect answer', function() {
            var view = learnjs.problemView('2');
            view.find('.answer').val('10');
            view.find('.check-answer-button').click();
            expect(view.find('.result').text()).toEqual('Incorrect!');
        });

        it('shows the link to the start page the last problem', function() {
            var view = learnjs.problemView('2');
            view.find('.answer').val('6');
            view.find('.check-answer-button').click();
            expect(view.find('a').text()).toEqual('You are finished');
            expect(view.find('a').attr('href')).toEqual('');
        });
    });

    describe('The navigation area', function(){
        it('has a home link', function(){
            learnjs.showView('#problem-1');
            expect($('.text-lg').attr('href')).toEqual('');
        });

        it('has a link to problem 1', function(){
            learnjs.showView('#problem-1');
            expect($('#start').text()).toEqual('Start');
        });

        it('has a skip button on problem 1', function(){
            learnjs.showView('#problem-1');
            expect($('.nav-container .skip-button').length).toEqual(1);
        });
    
        it('has no skip button on problem 2', function(){
            learnjs.showView('#problem-2');
            expect($('.nav-container .skip-button').length).toEqual(0);
        });
    });
});
