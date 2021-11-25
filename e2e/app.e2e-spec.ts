import { AnalyticsTemplatePage } from './app.po';

describe('Analytics App', function() {
  let page: AnalyticsTemplatePage;

  beforeEach(() => {
    page = new AnalyticsTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
