import { test, type Locator } from '@playwright/test';

import { ProviderAddressUpdates } from '../pages/providerAddressUpdates';
import testData from '../testdata/testdata.json';
import { sharedAssertions } from '../pages/assertions';
import { assertionTexts } from '../utils/assertionTexts';
import { SignatureHandler } from '../utils/signatureHandler';

test.describe.configure({ mode: 'serial' });

test.describe('Provider Address Updates Regression testsuite', () => {
  const envTarget = 'qa';
  const providerNotFoundText = assertionTexts.global.validationErrors.providerNotFound;
  const memberNotFoundText = assertionTexts.global.validationErrors.memberNotFound;

  let addressUpdates: ProviderAddressUpdates;
  let signatureHandler: SignatureHandler;
  let formAssert: sharedAssertions<ProviderAddressUpdates['sharedFormActions']>;
  let providerNotFoundLabel: Locator;
  let memberNotFoundLabel: Locator;

  test.beforeEach(async ({ page }, info) => {
    addressUpdates = new ProviderAddressUpdates(page);
    signatureHandler = new SignatureHandler(page);
    formAssert = new sharedAssertions(page, addressUpdates.sharedFormActions);
    providerNotFoundLabel = addressUpdates.sharedFormActions.providerNotFound;
    memberNotFoundLabel = addressUpdates.sharedFormActions.memberNotFound;

    await addressUpdates.navigateToProviderAddressUpdates(envTarget);

    console.log(`\n▶️  Running test: ${info.title}`);
  });

  test.afterEach(async ({}, info) => {
    console.log(`🏁 Finished test: ${info.title}\n`);
  });

  test('Successfully Submit a Provider Address Updates form.', async ({ page }) => {
  await formAssert.ui.toHaveHeader(assertionTexts.pages.addressUpdates.header);

              const todaysDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })
                      console.log( ' date ' + todaysDate);


    await addressUpdates.fillProviderSection(testData.Data.AddressUpdatesData);

   // await signatureHandler.signForm();
   // await addressUpdates.clickSubmitBtn();
  });
  

});
