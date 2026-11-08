import { test } from '@playwright/test';

import { ChangePCP } from '../pages/changePCP';
import testData from '../testdata/testdata.json';
import { sharedAssertions } from '../pages/assertions';
import { assertionTexts } from '../utils/assertionTexts';
import { SignatureHandler } from '../utils/signatureHandler';
import { SharedFormActions } from '../utils/sharedFormActions';

test.describe.configure({ mode: 'serial' });

test.describe('Change PCP Regression testsuite', () => {
  const envTarget = 'qa';
  const providerNotFoundtxt = assertionTexts.global.validationErrors.providerNotFound;
  const memberNotFoundtxt = assertionTexts.global.validationErrors.memberNotFound;

  let pcpChange: ChangePCP;
  let signatureHandler: SignatureHandler;
  let formAssert: sharedAssertions<ChangePCP['sharedFormActions']>;
  
  test.beforeEach(async ({ page }, info) => {
    pcpChange = new ChangePCP(page);
    signatureHandler = new SignatureHandler(page);
    formAssert = new sharedAssertions(page, pcpChange.sharedFormActions);
    await pcpChange.navigateToChangePCP(envTarget);
    
    console.log(`\nRunning test: ${info.title}`);
  });

  test.afterEach(async ({ page }, info) => {
    console.log(`Finished test: ${info.title}\n`);
    
  });

  test.skip('Successfully Submit a Change PCP form.', async ({ page }) => {
    await formAssert.ui.toHaveHeader(assertionTexts.pages.pcpChange.header);

    await pcpChange.fillProviderSection(testData.Data.ProviderDataActiveNPI);
    await pcpChange.fillContactSection(testData.Data.MemberDataInvalidMemberId);

    //This test is not completed. Still have to add test data to complete the form.
    await signatureHandler.signForm();

    await pcpChange.clickSubmitBtn();
  });

  test('Provider Not Found validation message appears.', async ({ page }) => {
    await formAssert.ui.toHaveHeader(assertionTexts.pages.pcpChange.header);

    await pcpChange.fillProviderSection(testData.Data.ProviderDataInvalidNPI);

    await formAssert.fields.waitForVisible('providerNotFound');
    await formAssert.fields.toHaveValue('providerNotFound', providerNotFoundtxt);
    console.log('Validation Message Confirmed:', providerNotFoundtxt);
  });

  test('Member Not Found validation message appears.', async ({ page }) => {
    await formAssert.ui.toHaveHeader(assertionTexts.pages.pcpChange.header);

    await pcpChange.fillProviderSection(testData.Data.ProviderDataInvalidNPI);
    await pcpChange.fillContactSection(testData.Data.MemberDataInvalidMemberId);

    await formAssert.fields.waitForVisible('memberNotFound');
    await formAssert.fields.toHaveValue('memberNotFound', memberNotFoundtxt);

    console.log('Validation Message Confirmed:', memberNotFoundtxt);
  });
});
