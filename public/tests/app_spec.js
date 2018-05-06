describe('LearnJS', function () {
    it('can show the problem view', function () {
        learnjs.showView('#problem-1');
        expect($('.view-container .problem-view').length).toEqual(1);
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
            expect(view.text()).toEqual('Problem 1 coming soon');
        });
    });
});
