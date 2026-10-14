import { expect, Locator, test } from '@playwright/test';
import testData from '../data/testdata.json';
import { sharedAssertions } from '../pages/assertions';
import { assertionTexts } from './fixtures/assertionTexts';
import { SignatureHandler } from '../utils/signatureHandler';
import { providerAddressUpdates } from '../pages/providerAddressUpdates';

test.describe('Provider Address Updates Regression TestSuite', () => {
  const todaysDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })
  let envTarget = "qa";
  const currentDate = () => new Date().toISOString().split('T')[0];
  const memberNotFoundtxt = assertionTexts.global.validationErrors.memberNotFound;
  let memberNotFoundLbl: Locator;

    test.beforeEach(async ({ page }) => {
        const providerAddressUpdatesPage = new providerAddressUpdates(page);
      memberNotFoundLbl = providerAddressUpdatesPage.sharedFormActions.memberNotFound;
    });

    test('Sucessfuly submit an address Updatess form', async ({ page }) => {
        console.log(`Running test: ${test.info().title}`);

        const providerAddressUpdatesPage = new providerAddressUpdates(page);
        const formAssert = new sharedAssertions(page, providerAddressUpdatesPage.sharedFormActions);
        const signatureHandler = new SignatureHandler(page);

        await providerAddressUpdatesPage.navigateToProviderAddressUpdates(envTarget);
    
        await providerAddressUpdatesPage.fillProviderSection(testData.Data.ProviderData);

          const todaysDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })

        console.log( ' date ' + todaysDate);

       // await memberNotFoundLbl.waitFor({ state: 'visible', timeout: 5000 });
   // await formAssert.fields.toHaveValue('memberNotFound', memberNotFoundtxt);
        await page.pause();

    });
});
