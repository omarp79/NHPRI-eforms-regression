import { Locator } from '@playwright/test';

type SemanticRole =
  | 'textbox'
  | 'combobox'
  | 'checkbox'
  | 'radio'
  | 'button'
  | 'heading'
  | 'alert';

interface FindOptions {
  description?: string;
  allowTextMatch?: boolean;
}

export class SelfHealingLocator {
  constructor(private readonly scope: Locator) {}

  async find(
    primary: Locator,
    accessibleName: string,
    role?: SemanticRole,
    options: FindOptions = {}
  ): Promise<Locator | undefined> {
    const description = options.description ?? accessibleName;
    const primaryCount = await primary.count();
    const primaryIsVisible = primaryCount === 1 && await primary.isVisible();

    const getVisibleSemantic = (exact: boolean): Locator => {
      let semantic = this.scope
        .getByLabel(accessibleName, { exact })
        .or(this.scope.getByPlaceholder(accessibleName, { exact }));
      if (role) {
        semantic = semantic.or(this.scope.getByRole(role, { name: accessibleName, exact }));
      }
      if (options.allowTextMatch) {
        semantic = semantic.or(this.scope.getByText(accessibleName, { exact }));
      }
      return semantic.filter({ visible: true });
    };

    let visibleSemantic = getVisibleSemantic(true);
    let semanticCount = await visibleSemantic.count();
    if (semanticCount === 0) {
      visibleSemantic = getVisibleSemantic(false);
      semanticCount = await visibleSemantic.count();
    }

    if (semanticCount === 1) {
      if (!primaryIsVisible) {
        console.warn(
          `[SELF-HEAL] Recovered "${description}" by accessible name "${accessibleName}" (primary matches: ${primaryCount}).`
        );
      }
      return visibleSemantic;
    }

    if (primaryIsVisible) {
      return primary;
    }

    if (semanticCount > 1 || primaryCount > 1) {
      throw new Error(
        `[SELF-HEAL] Cannot safely resolve "${description}". ` +
          `Expected one visible semantic match for "${accessibleName}", found ${semanticCount}; ` +
          `primary matches: ${primaryCount}; URL: ${this.scope.page().url()}.`
      );
    }

    return undefined;
  }

  async require(
    primary: Locator,
    accessibleName: string,
    role?: SemanticRole,
    options: FindOptions = {}
  ): Promise<Locator> {
    const description = options.description ?? accessibleName;
    const locator = await this.find(primary, accessibleName, role, options);
    if (!locator) {
      throw new Error(
        `[SELF-HEAL] Could not find "${description}" or a unique visible semantic match for ` +
          `"${accessibleName}". URL: ${this.scope.page().url()}.`
      );
    }
    return locator;
  }
}
