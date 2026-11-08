import { Locator } from '@playwright/test';
import { SelfHealingLocator } from './selfHealingLocator';

const todaysDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });

export interface ProviderData {
  npi?: string;
  supplierId?: string;
  providerName?: string;
  addressLocation?: string;
  groupEntityNPI?: string;
  mailingCorrespondenceAddressUpdate?: string | boolean;
  officeContactEmailAddress?: string;
  email?: string;
  changePCPforAnotherMember?: string | boolean;
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
  changePCPforAnotherMemberYes?: string | boolean;
  changePCPforAnotherMemberNo?: string | boolean;
}
export interface submitReview {
submitBtn?: string
}

export interface SharedFormData {
  provider?: ProviderData;
  member?: MemberData;
  submitReviewbtn?: submitReview;
}

export class SharedFormActions {
  public readonly submitbtn: Locator;
  private readonly container: Locator;
  private readonly selfHealing: SelfHealingLocator;
  public readonly npiInput: Locator;
  public readonly supplierIdInput: Locator;
  public readonly memberIdInput: Locator;
  public readonly commercialMemberIdInput: Locator;
  public readonly officeContactEmailAddressInput: Locator;
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
  public readonly changePCPforAnotherMemberYes: Locator;
  public readonly changePCPforAnotherMemberNo: Locator;
  public readonly groupEntityNPIInput: Locator;
  public readonly mailingCorrespondenceAddressUpdate: Locator;
  public readonly submitReviewbtn: Locator;
  constructor(container: Locator) {
    this.container = container;
    this.selfHealing = new SelfHealingLocator(container);

    const staleForSelfHealingTest = (selector: string): Locator =>
      this.container.page().locator(
        `:is(${selector})[data-self-healing-test="_ChangedName_toTestSelfHealing"]`
      );

    this.submitbtn = this.container.page().locator('input[name="gform_target_page_number_122"]');
    this.npiInput = this.container.page().locator('input[name="input_16"]');
    this.supplierIdInput = this.container.page().locator('input[name="input_17"]');
    this.memberIdInput = this.container.page().locator('input[name="input_24"]');
    this.commercialMemberIdInput = this.container.page().locator('input[name="input_19"]');
    this.emailInput = this.container.page().locator('input[name="input_60X"]');
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
    this.changePCPforAnotherMemberYes = this.container.page().locator('input[name="input_70"][value="Yes"]');
    this.changePCPforAnotherMemberNo = this.container.page().locator('input[name="input_70"][value="No"]');
    this.groupEntityNPIInput = this.container.page().locator('input[name="input_5"], input[name*="group_entity"]');
    this.mailingCorrespondenceAddressUpdate = this.container.page().locator('input[name="input_1.1"], checkbox[name*="Mailing"]');
    this.submitReviewbtn = this.container.page().locator('input[value="Review and Submit"]');
    this.officeContactEmailAddressInput = this.container.page().locator('input[name="input_6"], input[name*="office_contact_email"]');

  }

  private async fillDynamicField(
    locator: Locator,
    fieldName: string,
    value?: string,
    role: 'textbox' | 'combobox' = 'textbox',
    exactMatchOnly = false
  ): Promise<boolean> {
    if (!value) return false;
    const target = await this.selfHealing.find(locator, fieldName, role, { exactMatchOnly });
    if (!target) {
      console.log(` [INFO:] Field "${fieldName}" is absent on this specific form layout view, skipping.`);
      return false;
    }
    await target.scrollIntoViewIfNeeded();
    await target.fill(value);
    return true;
  }

  private async clickDynamicField(
    locator: Locator,
    fieldName: string,
    value?: string | boolean,
    accessibleName: string = fieldName,
    role: 'checkbox' | 'radio' = 'checkbox'
  ): Promise<boolean> {
    if (!value) return false;
    const target = await this.selfHealing.find(locator, accessibleName, role, { description: fieldName });
    if (!target) {
      console.log(` [INFO:] Radio button/checkbox "${fieldName}" is absent on this form view, skipping.`);
      return false;
    }
    await target.scrollIntoViewIfNeeded();
    await target.check({ force: true });
    return true;
  }

  private async selectDynamicDropdown(locator: Locator, fieldName: string, value?: string): Promise<boolean> {
    if (!value) return false;
    const target = await this.selfHealing.find(locator, fieldName, 'combobox');
    if (!target) {
      console.log(` [INFO:] Dropdown "${fieldName}" is absent or missing target option, skipping.`);
      return false;
    }
    await target.selectOption({ label: value });
    return true;
  }

  async fillProviderInfo(data: ProviderData = {}): Promise<void> {
    const fields: Array<{
      value?: string;
      locator: Locator;
      label: string;
      exactMatchOnly?: boolean;
    }> = [
      //this array is used for simple text input fields.
      { value: data.supplierId, locator: this.supplierIdInput, label: 'Supplier ID' },
      { value: data.providerName, locator: this.providerNameInput, label: 'Provider Name' },
      { value: data.groupEntityNPI, locator: this.groupEntityNPIInput, label: 'Group/Entity NPI' },
      {value: data.officeContactEmailAddress, locator: this.officeContactEmailAddressInput, label: 'Office Contact Email Address'},
      {value: data.email, locator: this.emailInput, label: 'Email', exactMatchOnly: true}
    ];

    for (const field of fields) {
      await this.fillDynamicField(
        field.locator,
        field.label,
        field.value,
        'textbox',
        field.exactMatchOnly
      );
    }
    if (data.npi) {
      const npiInput = await this.selfHealing.require(
        this.npiInput,
        'NPI Number',
        'textbox',
        { description: 'NPI' }
      );
      await npiInput.clear();
      await npiInput.pressSequentially(data.npi, { delay: 100 });
      await this.container.page().keyboard.press('Tab');
    }
    if (data.addressLocation) {
      await this.selectDynamicDropdown(this.addressDropdown, 'Address Location', data.addressLocation);
    }

    if (data.mailingCorrespondenceAddressUpdate) {
      await this.clickDynamicField(
        this.mailingCorrespondenceAddressUpdate,
        'Mailing Address Update',
        data.mailingCorrespondenceAddressUpdate
      );
    }
    if (data.changePCPforAnotherMember) {
      await this.clickDynamicField(
        this.changePCPforAnotherMemberNo,
        'Change PCP for Another Member',
        data.changePCPforAnotherMember,
        'No',
        'radio'
      );
    }
  }

  async fillContactInfo(data: MemberData = {}): Promise<void> {
    // 1. Loop through all standard text blocks first
    const standardFields: Array<{
      value?: string;
      locator: Locator;
      label: string;
      exactMatchOnly?: boolean;
    }> = [
      { value: data.email, locator: this.emailInput, label: 'Email', exactMatchOnly: true },
      { value: data.commercialMemberId, locator: this.commercialMemberIdInput, label: 'Commercial Member ID' },
      { value: data.dob, locator: this.validationDobInput, label: 'Date of Birth' },
      { value: data.memberName, locator: this.detailMemberNameInput, label: 'Detail Member Name' },
      { value: data.planName, locator: this.detailPlanNameInput, label: 'Plan Name' },
      { value: data.dateOfService, locator: this.detailDateOfServiceInput, label: 'Date of Service' }
    ];

    for (const field of standardFields) {
      await this.fillDynamicField(
        field.locator,
        field.label,
        field.value,
        'textbox',
        field.exactMatchOnly
      );
    }

    if (data.memberId) {
      const memberIdInput = await this.selfHealing.require(
        this.memberIdInput,
        'Member ID',
        'textbox'
      );
      await memberIdInput.clear();
      await memberIdInput.pressSequentially(data.memberId, { delay: 100 });
      await this.container.page().keyboard.press('Tab');
    }

    if (data.memberDOB) {
      const memberDOB = await this.selfHealing.find(
        this.memberDOB,
        'Member DOB',
        'textbox',
        { description: 'Date of Birth' }
      );
      if (memberDOB) {
        await memberDOB.fill(data.memberDOB);
        await memberDOB.click();
        await this.container.page().keyboard.press('Tab');
      } else {
        console.log(' [INFO:] Field "Date of Birth" is absent on this specific form layout view, skipping.');
      }
    }

    if (data.changePCPforAnotherMemberYes) {
      await this.clickDynamicField(
        this.changePCPforAnotherMemberYes,
        'Change PCP for Another Member',
        data.changePCPforAnotherMemberYes,
        'Yes',
        'radio'
      );
    }
  }
  public async clickActionButton(locator: Locator, submitReviewbtn: string): Promise<boolean> {
    const target = await this.selfHealing.find(
      locator,
      'Review and Submit',
      'button',
      { description: submitReviewbtn }
    );
    if (!target) {
      console.log(` [INFO:] Action button "${submitReviewbtn}" is not visible on this view, skipping.`);
      return false;
    }
    await target.scrollIntoViewIfNeeded();
    await target.click();
    console.log(` [SUCCESS:] Clicked the "${submitReviewbtn}" action button.`);
    return true;
  }
}
