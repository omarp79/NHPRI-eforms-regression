import { expect, test, type Locator } from '@playwright/test';
import { ChangePCP } from '../pages/changePCP';
import testData from '../testdata/testdata.json';
import { sharedAssertions } from '../pages/assertions';
import { assertionTexts } from '../utils/assertionTexts';

test.describe('Change PCP Regression testsuite', () => {
  const envTarget = 'qa';
  const providerNotFoundtxt = assertionTexts.global.validationErrors.providerNotFound;
  const memberNotFoundtxt = assertionTexts.global.validationErrors.memberNotFound;

  let pcpChange: ChangePCP;
  let formAssert: sharedAssertions<ChangePCP['sharedFormActions']>;
  let providerNotFoundLbl: Locator;
  let memberNotFoundLbl: Locator;

  test.beforeEach(async ({ page }) => {
    pcpChange = new ChangePCP(page);
    formAssert = new sharedAssertions(page, pcpChange.sharedFormActions);
    providerNotFoundLbl = pcpChange.sharedFormActions.providerNotFound;
    memberNotFoundLbl = pcpChange.sharedFormActions.memberNotFound;
  });
  test.afterEach(async ({ page }) => {
    console.log(`Finished test: ${test.info().title}`);
  });

  test.skip('Submit a Change PCP form.', async ({ page }) => {
    console.log(`Running test: ${test.info().title}`);

    await pcpChange.navigateToChangePCP(envTarget);
    await formAssert.ui.toHaveHeader(assertionTexts.pages.pcpChange.header);
    
    await pcpChange.fillProviderSection(testData.Data.ProviderData);
  
    await expect(providerNotFoundLbl).not.toHaveValue(providerNotFoundtxt);
  });

  test('Provider Not Found validation message appears.', async ({ page }) => {
    console.log(`Running test: ${test.info().title}`);

    await pcpChange.navigateToChangePCP(envTarget);
    await formAssert.ui.toHaveHeader(assertionTexts.pages.pcpChange.header);

    await pcpChange.fillProviderSection(testData.Data.ProviderData);

    await providerNotFoundLbl.waitFor({ state: 'visible', timeout: 5000 });
    await formAssert.fields.toHaveValue('providerNotFound', providerNotFoundtxt);

    console.log('✅ Validation Message Confirmed:', providerNotFoundtxt);
  });

  test.skip('Member Not Found validation message appears.', async ({ page }) => {
    console.log(`Running test: ${test.info().title}`);

    await pcpChange.navigateToChangePCP(envTarget);
    await formAssert.ui.toHaveHeader(assertionTexts.pages.pcpChange.header);

    await pcpChange.fillContactSection(testData.Data.MemberData);

    await memberNotFoundLbl.waitFor({ state: 'visible', timeout: 5000 });
    await formAssert.fields.toHaveValue('memberNotFound', memberNotFoundtxt);

    console.log('✅ Validation Message Confirmed:', memberNotFoundtxt);
  });
});
