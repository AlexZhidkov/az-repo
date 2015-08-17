describe('E2E: Content', function () {

    it('test1', function () {
        browser().navigateTo('/#/');
        expect(
            Element("button#startNewMatch").htmlFor()).toEqual("Reset score. New game.");
    });
});