import { AppPage } from './app.po';

describe('ng-deck-gl App', () => {

    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it('should display Navbar Brand', () => {
        page.navigateTo();
        expect(page.getNavbarBrand()).toContain('Angular App Seed');
    });

});
