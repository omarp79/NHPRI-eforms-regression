import { expect, test, type Locator } from '@playwright/test';
import { ChangePCP } from '../pages/changePCP';
import testData from '../testdata/testdata.json';
import { sharedAssertions } from '../pages/assertions';
import { assertionTexts } from '../utils/assertionTexts';
import { SignatureHandler } from '../utils/signatureHandler';
import { SharedFormActions } from '../utils/sharedFormActions';

test.describe('Change PCP Regression testsuite', () => {
  const envTarget = 'qa';
  const providerNotFoundtxt = assertionTexts.global.validationErrors.providerNotFound;
  const memberNotFoundtxt = assertionTexts.global.validationErrors.memberNotFound;

  let pcpChange: ChangePCP;
  let signatureHandler: SignatureHandler;
  let formAssert: sharedAssertions<ChangePCP['sharedFormActions']>;
  let providerNotFoundLbl: Locator;
  let memberNotFoundLbl: Locator;

  test.beforeEach(async ({ page }) => {
    pcpChange = new ChangePCP(page);
    signatureHandler = new SignatureHandler(page)
    formAssert = new sharedAssertions(page, pcpChange.sharedFormActions);
    providerNotFoundLbl = pcpChange.sharedFormActions.providerNotFound;
    memberNotFoundLbl = pcpChange.sharedFormActions.memberNotFound;

    // Opens the browser and navigates to the application for the specified environment
    await pcpChange.navigateToChangePCP(envTarget);
  });

  test.afterEach(async ({ page }) => {
    console.log(`Finished test: ${test.info().title}`);
  });

  test('Successfully Submit a Change PCP form.', async ({ page }) => {
    console.log(`Running test: ${test.info().title}`);

    await formAssert.ui.toHaveHeader(assertionTexts.pages.pcpChange.header);
    await pcpChange.fillProviderSection(testData.Data.ProviderDataActiveNPI);
    await pcpChange.fillContactSection(testData.Data.MemberDataInvalidMemberId);
    await signatureHandler.signForm()

    await pcpChange.clickSubmitBtn()
    await page.pause()

    //Need assertions here
    // await expect(providerNotFoundLbl).not.toHaveValue(providerNotFoundtxt);
  });

  test.skip('Provider Not Found validation message appears.', async ({ page }) => {
    console.log(`Running test: ${test.info().title}`);

    await formAssert.ui.toHaveHeader(assertionTexts.pages.pcpChange.header);
    await pcpChange.fillProviderSection(testData.Data.ProviderDataInvalidNPI);

    await providerNotFoundLbl.waitFor({ state: 'visible', timeout: 5000 });
    await formAssert.fields.toHaveValue('providerNotFound', providerNotFoundtxt);

    console.log('✅ Validation Message Confirmed:', providerNotFoundtxt);
  });

  test.skip('Member Not Found validation message appears.', async ({ page }) => {
    console.log(`Running test: ${test.info().title}`);

    await formAssert.ui.toHaveHeader(assertionTexts.pages.pcpChange.header);
    await pcpChange.fillContactSection(testData.Data.MemberDataInvalidMemberId);

    await memberNotFoundLbl.waitFor({ state: 'visible', timeout: 5000 });
    await formAssert.fields.toHaveValue('memberNotFound', memberNotFoundtxt);

    console.log('✅ Validation Message Confirmed:', memberNotFoundtxt);
  });
});
