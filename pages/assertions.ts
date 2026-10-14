import { expect, Page, Locator } from '@playwright/test';

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

  constructor(private page: Page, protected actions: TActions) {
    this.h1Title = this.page.locator('h1.entry-title');
  }

  async toHaveHeader(expectedText: string): Promise<void> {
    await expect(this.h1Title).toHaveText(expectedText);
  }

  async toBeOnStep(stepNumber: number): Promise<void> {
    const activeStep = this.page.locator('.gform_page.active');
    await expect(activeStep).toContainText(`Step ${stepNumber}`);
  }
}

class FormFieldAssertions<TActions> {
  constructor(private page: Page, protected actions: TActions) {}

  // Asserts the current value of input, textarea, and select elements
  async toHaveValue(locatorKey: keyof TActions, expectedValue: string): Promise<void> {
    const locator = this.actions[locatorKey] as unknown as Locator;
    await expect(locator).toHaveValue(expectedValue);
  }

  // Asserts the visible inner text of display elements like labels, spans, and divs
  async toHaveText(locatorKey: keyof TActions, expectedValue: string): Promise<void> {
    const locator = this.actions[locatorKey] as unknown as Locator;
    await expect(locator).toHaveText(expectedValue);
  }
}

class FormErrorAssertions<TActions> {
  constructor(private page: Page, protected actions: TActions) {}

  async toShowValidationFailure(locatorKey: keyof TActions): Promise<void> {
    const locator = this.actions[locatorKey] as unknown as Locator;
    await expect(locator).toHaveAttribute('aria-invalid', 'true');
  }
}
