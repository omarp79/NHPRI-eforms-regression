import { expect, test } from '@playwright/test';
import { ChangePCP } from '../pages/changePCP';
import { sharedAssertions } from '../pages/assertions';
import { SelfHealingLocator } from '../utils/selfHealingLocator';
import { SharedFormActions } from '../utils/sharedFormActions';

test.describe('Self-healing locator', () => {
  test('recovers a stale selector using one accessible match', async ({ page }) => {
    await page.setContent('<form><label for="member-id">Member ID</label><input id="member-id"></form>');

    const scope = page.locator('form');
    const selfHealing = new SelfHealingLocator(scope);
    const target = await selfHealing.find(
      scope.locator('#old-member-id'),
      'Member ID',
      'textbox'
    );

    expect(target).toBeDefined();
    if (!target) {
      throw new Error('Expected the stale selector to recover to the labeled field.');
    }
    await target.fill('12345');
    await expect(scope.getByLabel('Member ID')).toHaveValue('12345');
  });

  test('recovers NPI through ChangePCP when its selector is stale', async ({ page }) => {
    await page.setContent(
      '<form id="other-form"></form>' +
        '<form id="gform_122">' +
        '<label for="npi">NPI Number<span>(Required)</span></label><input id="npi" name="input_16">' +
        '</form>'
    );

    const pcpChange = new ChangePCP(page);
    await pcpChange.fillProviderSection({ npi: '1234567890' });
    await expect(page.locator('#npi')).toHaveValue('1234567890');
  });

  test('recovers other fields when labels include required text', async ({ page }) => {
    await page.setContent(
      '<form><label for="supplier">Supplier ID<span>(Required)</span></label>' +
        '<input id="supplier" name="renamed_supplier_field"></form>'
    );

    const formActions = new SharedFormActions(page.locator('form'));
    await formActions.fillProviderInfo({ supplierId: 'SUP-123' });

    await expect(page.locator('#supplier')).toHaveValue('SUP-123');
  });

  test('prefers the unique semantic target over a stale selector that matches the wrong field', async ({
    page
  }) => {
    await page.setContent(
      '<form><label for="provider-name">Provider Name</label><input id="provider-name">' +
        '<label for="supplier-id">Supplier ID</label><input id="supplier-id"></form>'
    );

    const scope = page.locator('form');
    const selfHealing = new SelfHealingLocator(scope);
    const target = await selfHealing.find(
      scope.locator('#supplier-id'),
      'Provider Name',
      'textbox'
    );

    expect(target).toBeDefined();
    if (!target) {
      throw new Error('Expected the semantic locator to resolve Provider Name.');
    }
    await target.fill('Correct field');
    await expect(scope.getByLabel('Provider Name')).toHaveValue('Correct field');
    await expect(scope.getByLabel('Supplier ID')).toBeEmpty();
  });

  test('fails with diagnostics when semantic recovery is ambiguous', async ({ page }) => {
    await page.setContent(
      '<form><label for="member-a">Member ID</label><input id="member-a">' +
        '<label for="member-b">Member ID</label><input id="member-b"></form>'
    );

    const scope = page.locator('form');
    const selfHealing = new SelfHealingLocator(scope);

    await expect(
      selfHealing.require(scope.locator('#old-member-id'), 'Member ID', 'textbox')
    ).rejects.toThrow('found 2');
  });

  test('recovers a stale validation assertion locator by label', async ({ page }) => {
    await page.setContent(
      '<label for="provider-not-found">Error Message</label>' +
        '<input id="provider-not-found" value="Provider not found">'
    );
    const assertions = new sharedAssertions(page, {
      providerNotFound: page.locator('#old-provider-not-found')
    });

    await assertions.fields.toHaveValue('providerNotFound', 'Provider not found');
  });

  test('recovers a stale page heading selector by heading role', async ({ page }) => {
    await page.setContent('<h1>Change PCP</h1>');
    const assertions = new sharedAssertions(page, {});

    await assertions.ui.toHaveHeader('Change PCP');
  });

  test('fills the two provider email fields by their distinct form names', async ({ page }) => {
    await page.setContent(
      '<form><label for="office-email">Office Contact Email Address</label>' +
        '<input id="office-email" name="input_52" type="email">' +
        '<label for="email">Email</label><input id="email" name="input_60" type="email"></form>'
    );
    const formActions = new SharedFormActions(page.locator('form'));

    await formActions.fillProviderInfo({
      officeContactEmailAddress: 'office@example.test',
      email: 'general@example.test'
    });

    await expect(page.locator('input[name="input_52"]')).toHaveValue('office@example.test');
    await expect(page.locator('input[name="input_60"]')).toHaveValue('general@example.test');
  });
});
