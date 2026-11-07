import { expect, Page, Locator } from '@playwright/test';
import { SelfHealingLocator } from '../utils/selfHealingLocator';

const accessibleNames: Record<string, string> = {
  providerNotFound: 'Error Message',
  memberNotFound: 'Untitled',
  npiInput: 'NPI',
  supplierIdInput: 'Supplier ID',
  memberIdInput: 'Member ID',
  commercialMemberIdInput: 'Commercial Member ID',
  emailInput: 'Email',
  validationMemberIdInput: 'Member ID',
  validationDobInput: 'Date of Birth',
  providerNameInput: 'Provider Name',
  addressDropdown: 'Address Location',
  detailMemberNameInput: 'Member Name',
  detailPlanNameInput: 'Plan Name',
  detailDateOfServiceInput: 'Date of Service',
  memberDOB: 'Date of Birth',
  changePCPforAnotherMemberYes: 'Yes',
  changePCPforAnotherMemberNo: 'No',
  groupEntityNPIInput: 'Group Entity NPI',
  mailingCorrespondenceAddressUpdate: 'Mailing Address Update',
  submitReviewbtn: 'Review and Submit'
};

function descriptionFor(locatorKey: PropertyKey): string {
  return String(locatorKey).replace(/([a-z])([A-Z])/g, '$1 $2');
}

function accessibleNameFor(locatorKey: PropertyKey): string {
  const key = String(locatorKey);
  return accessibleNames[key] ?? descriptionFor(key);
}

export class sharedAssertions<TActions> {
  public readonly ui: FormUIAssertions<TActions>;
  public readonly fields: FormFieldAssertions<TActions>;
  public readonly errors: FormErrorAssertions<TActions>;

  constructor(page: Page, actions: TActions) {
    this.ui = new FormUIAssertions(page, actions);
    this.fields = new FormFieldAssertions(page, actions);
    this.errors = new FormErrorAssertions(page, actions);
  }
}

class FormUIAssertions<TActions> {
  private readonly h1Title: Locator;
  private readonly selfHealing: SelfHealingLocator;

  constructor(private page: Page, protected actions: TActions) {
    this.h1Title = this.page.locator('h1.entry-title');
    this.selfHealing = new SelfHealingLocator(this.page.locator('body'));
  }

  async toHaveHeader(expectedText: string): Promise<void> {
    const heading = await this.selfHealing.require(
      this.h1Title,
      expectedText,
      'heading',
      { description: 'Page heading' }
    );
    await expect(heading).toHaveText(expectedText);
  }

  async toBeOnStep(stepNumber: number): Promise<void> {
    const stepName = `Step ${stepNumber}`;
    const activeStep = await this.selfHealing.require(
      this.page.locator('.gform_page.active'),
      stepName,
      undefined,
      { description: `Active form step ${stepNumber}`, allowTextMatch: true }
    );
    await expect(activeStep).toContainText(`Step ${stepNumber}`);
  }
}

class FormFieldAssertions<TActions> {
  private readonly selfHealing: SelfHealingLocator;

  constructor(private page: Page, protected actions: TActions) {
    this.selfHealing = new SelfHealingLocator(this.page.locator('body'));
  }

  // Asserts the current value of input, textarea, and select elements
  async toHaveValue(locatorKey: keyof TActions, expectedValue: string): Promise<void> {
    const locator = await this.resolve(locatorKey, 'textbox');
    await expect(locator).toHaveValue(expectedValue);
  }

  // Asserts the visible inner text of display elements like labels, spans, and divs
  async toHaveText(locatorKey: keyof TActions, expectedValue: string): Promise<void> {
    const locator = await this.resolve(locatorKey, undefined, true);
    await expect(locator).toHaveText(expectedValue);
  }

  async waitForVisible(locatorKey: keyof TActions): Promise<void> {
    const locator = await this.resolve(locatorKey, 'textbox');
    await expect(locator).toBeVisible();
  }

  private async resolve(
    locatorKey: keyof TActions,
    role?: 'textbox' | 'combobox' | 'checkbox' | 'radio' | 'button',
    allowTextMatch = false
  ): Promise<Locator> {
    const locator = this.actions[locatorKey] as unknown as Locator;
    return this.selfHealing.require(
      locator,
      accessibleNameFor(locatorKey),
      role,
      { description: descriptionFor(locatorKey), allowTextMatch }
    );
  }
}

class FormErrorAssertions<TActions> {
  private readonly selfHealing: SelfHealingLocator;

  constructor(private page: Page, protected actions: TActions) {
    this.selfHealing = new SelfHealingLocator(this.page.locator('body'));
  }

  async toShowValidationFailure(locatorKey: keyof TActions): Promise<void> {
    const locator = await this.selfHealing.require(
      this.actions[locatorKey] as unknown as Locator,
      accessibleNameFor(locatorKey),
      'textbox',
      { description: descriptionFor(locatorKey) }
    );
    await expect(locator).toHaveAttribute('aria-invalid', 'true');
  }
}