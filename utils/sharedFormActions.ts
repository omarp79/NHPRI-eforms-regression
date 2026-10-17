import { Locator } from '@playwright/test';

const todaysDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });

export interface ProviderData {
  npi?: string;
  supplierId?: string;
  providerName?: string;
  addressLocation?: string;
  groupEntityNPI?: string;
  mailingCorrespondenceAddressUpdate?: string | boolean;
  email?: string;
}

export interface MemberData {
  memberId?: string;
  commercialMemberId?: string;
  email?: string;
  dob?: string;
  memberName?: string;
  planName?: string;
  dateOfService?: string;
  memberDOB?: string;
  changePCPforAntotherMember?: string | boolean;
}

export interface SharedFormData {
  provider?: ProviderData;
  member?: MemberData;
}

export class SharedFormActions {
  private readonly container: Locator;
  public readonly npiInput: Locator;
  public readonly supplierIdInput: Locator;
  public readonly memberIdInput: Locator;
  public readonly commercialMemberIdInput: Locator;
  public readonly emailInput: Locator;

  public readonly validationMemberIdInput: Locator;
  public readonly validationDobInput: Locator;
  public readonly providerNameInput: Locator;
  public readonly addressDropdown: Locator;
  public readonly detailMemberNameInput: Locator;
  public readonly detailPlanNameInput: Locator;
  public readonly detailDateOfServiceInput: Locator;
  public readonly providerNotFound: Locator;
  public readonly memberNotFound: Locator;
  public readonly memberDOB: Locator;
  public readonly changePCPforAntotherMember: Locator;
  public readonly groupEntityNPIInput: Locator;
  public readonly mailingCorrespondenceAddressUpdate: Locator;

  constructor(container: Locator) {
    this.container = container;

    // Direct, target-scoped elements linked to your page layout
    this.npiInput = this.container.page().locator('input[name="input_16"]');
    this.supplierIdInput = this.container.page().locator('input[name="input_17"]');
    this.memberIdInput = this.container.page().locator('input[name="input_24"]');
    this.commercialMemberIdInput = this.container.page().locator('input[name="input_19"]');
    this.emailInput = this.container.page().locator('input[type="email"], input[name*="email"]');
    this.providerNotFound = this.container.page().locator('input[name="input_20"]');
    this.memberNotFound = this.container.page().locator('input[name="input_56"]');
    this.memberDOB = this.container.page().locator('input[name="input_67"]');    
    this.validationMemberIdInput = this.container.page().locator('input[name="input_14"], input[name*="member_id"]');
    this.validationDobInput = this.container.page().locator('input[name="input_15"], input[name*="dob"]');
    this.providerNameInput = this.container.page().locator('input[name="input_17"], input[name*="provider_name"]');
    this.addressDropdown = this.container.page().locator('select[name="input_18"], select[name*="address"], select[name="input_19"]');
    this.detailMemberNameInput = this.container.page().locator('input[name="input_22"], input[name*="member_name"], input[name="input_27"]');
    this.detailPlanNameInput = this.container.page().locator('input[name="input_23"], input[name*="plan_name"], input[name="input_30"]');
    this.detailDateOfServiceInput = this.container.page().locator('input[name="input_24"], input[name*="date_of_service"], input[name*="dos"], input[name="input_61"]');
    this.changePCPforAntotherMember = this.container.page().locator('input[name="input_70"]');
    this.groupEntityNPIInput = this.container.page().locator('input[name="input_5"], input[name*="group_entity_npi"]');
    this.mailingCorrespondenceAddressUpdate = this.container.page().locator('input[name="input_1.1"], checkbox[name*="Mailing"]');
  }

  /**
   * Universal Field Driver: Returns boolean success.
   * Grace timeout shortened to 500ms to maintain lightning-fast test execution when skipping fields.
   */
  private async fillDynamicField(locator: Locator, fieldName: string, value?: string): Promise<boolean> {
    if (!value) return false;
    try {
      await locator.waitFor({ state: 'visible', timeout: 500 });
      await locator.scrollIntoViewIfNeeded();
      await locator.fill(value);
      return true;
    } catch (error) {
      console.log(` [INFO:] Field "${fieldName}" is absent on this specific form layout view, skipping.`);
      return false;
    }
  }

  private async clickDynamicField(locator: Locator, fieldName: string, value?: string | boolean): Promise<boolean> {
    if (!value) return false;
    try {
      await locator.waitFor({ state: 'visible', timeout: 500 });
      await locator.scrollIntoViewIfNeeded();
      await locator.check({ force: true });
      return true;
    } catch (error) {
      console.log(` [INFO:] Radio button/checkbox "${fieldName}" is absent on this form view, skipping.`);
      return false;
    }
  }

  private async selectDynamicDropdown(locator: Locator, fieldName: string, value?: string): Promise<boolean> {
    if (!value) return false;
    try {
      await locator.waitFor({ state: 'visible', timeout: 500 });
      await locator.selectOption({ label: value });
      return true;
    } catch (error) {
      console.log(` [INFO:] Dropdown "${fieldName}" is absent or missing target option, skipping.`);
      return false;
    }
  }

  async fillForm(data?: SharedFormData): Promise<void> {
    if (!data) return;
    try {
      await this.container.waitFor({ state: 'attached', timeout: 4000 });
    } catch {
      console.warn('[WARNING]: Base structural container did not render inside the timeline.');
    }
   
    if (data.provider) await this.fillProviderInfo(data.provider);
    if (data.member) await this.fillContactInfo(data.member);
  }

  async fillProviderInfo(data: ProviderData = {}): Promise<void> {
    // 1. Loop through baseline, predictable provider data strings
    const fields = [
      { value: data.supplierId, locator: this.supplierIdInput, label: 'Supplier ID' },
      { value: data.providerName, locator: this.providerNameInput, label: 'Provider Name' },
      { value: data.groupEntityNPI, locator: this.groupEntityNPIInput, label: 'Group Entity NPI' },
      { value: data.email, locator: this.emailInput, label: 'Email' }
    ];

    for (const field of fields) {
      if (field.value !== undefined && field.value !== null) {
        await this.fillDynamicField(field.locator, field.label, field.value);
      }
    }

if (data.npi) {
  await this.npiInput.clear();
  await this.npiInput.pressSequentially(data.npi, { delay: 100 });
    await this.container.page().keyboard.press('Tab');
}
      if (data.addressLocation) {
        try {
          await this.addressDropdown.waitFor({ state: 'visible', timeout: 2000 });
          await this.selectDynamicDropdown(this.addressDropdown, 'Address Location', data.addressLocation);
        } catch {
          console.log(' [INFO:] Address Location dropdown did not appear after NPI lookup.');
        }
      }

      if (data.mailingCorrespondenceAddressUpdate) {
        await this.clickDynamicField(this.mailingCorrespondenceAddressUpdate, 'Mailing Address Update', data.mailingCorrespondenceAddressUpdate);
      }
  }

  async fillContactInfo(data: MemberData = {}): Promise<void> {
    // 1. Loop through all standard text blocks first
    const standardFields = [
      { value: data.email, locator: this.emailInput, label: 'Email' },
      { value: data.commercialMemberId, locator: this.commercialMemberIdInput, label: 'Commercial Member ID' },
      { value: data.dob, locator: this.validationDobInput, label: 'Validation DOB' },
      { value: data.memberName, locator: this.detailMemberNameInput, label: 'Detail Member Name' },
      { value: data.planName, locator: this.detailPlanNameInput, label: 'Plan Name' },
      { value: data.dateOfService, locator: this.detailDateOfServiceInput, label: 'Date of Service' }
    ];

    for (const field of standardFields) {
      if (field.value) {
        await this.fillDynamicField(field.locator, field.label, field.value);
      }
    }

 if (data.memberId) {
  await this.memberIdInput.clear();
  await this.memberIdInput.pressSequentially(data.memberId, { delay: 100 });
    await this.container.page().keyboard.press('Tab');
}

    if (data.memberDOB) {
      const filled = await this.fillDynamicField(this.memberDOB, 'Date of Birth Field', data.memberDOB);
      if (filled) {
        try { await this.memberDOB.click(); } catch { }
        await this.container.page().keyboard.press('Tab');
      }
    }

    if (data.changePCPforAntotherMember) {
      await this.clickDynamicField(this.changePCPforAntotherMember, 'Change PCP for Another Member', data.changePCPforAntotherMember);
    }
  }
}
