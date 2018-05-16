describe('LearnJS', function () {
    it('can show the problem view', function () {
        learnjs.showView('#problem-1');
        expect($('.view-container .problems-view').length).toEqual(1);
    });

    it('shows the landing page on an empty route/hash', function () {
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

    it('subscribes to the hashchange event', function(){
        learnjs.appOnReady();
        spyOn(learnjs, 'showView');
        $(window).trigger('hashchange');
        expect(learnjs.showView).toHaveBeenCalledWith(window.location.hash)
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
    });

    describe('The databinding applicator', function() {
        it('sets the data to the bound elements', function() {
            var view = $('.templates .problems-view').clone();
            var result = learnjs.applyBindings(view, learnjs.problems[0]);
            expect(result.find('[data-name="description"]').text())
                .toEqual("Make this evaluate truthy");
            expect(result.find('[data-name="code"]').text())
                .toEqual("function problem() { return ___; }");
        });
    });
});
