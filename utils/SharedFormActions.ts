import { Locator } from '@playwright/test';

 const todaysDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })
export interface ProviderData {
  npi?: string;
  supplierId?: string;
  providerName?: string;
  addressLocation?: string;
  groupEntityNPI?: string;
  mailingCorrespondenceAddressUpdate?: string;
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
  changePCPforAntotherMember?: string;
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
    this.addressDropdown = this.container.page().locator('select[name="input_18"], select[name*="address"]');
    this.detailMemberNameInput = this.container.page().locator('input[name="input_22"], input[name*="member_name"]');
    this.detailPlanNameInput = this.container.page().locator('input[name="input_23"], input[name*="plan_name"]');
    this.detailDateOfServiceInput = this.container.page().locator('input[name="input_24"], input[name*="date_of_service"], input[name*="dos"]');
    this.changePCPforAntotherMember = this.container.page().locator('input[name="input_70"][value="No"]');
    this.groupEntityNPIInput = this.container.page().locator('input[name="input_5"], input[name*="group_entity_npi"]');
// OR
this.mailingCorrespondenceAddressUpdate = this.container.page().getByRole('checkbox', { name: 'Mailing/Correspondence Address Update' });
 
 
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
    const { npi, supplierId, providerName, addressLocation, groupEntityNPI, mailingCorrespondenceAddressUpdate } = data;

    if (npi) {
      // FIX: Channeled through dynamic handler to protect against missing NPI layouts on Form B
      const filled = await this.fillDynamicField(this.npiInput, 'NPI', npi);
      if (filled) await this.container.page().keyboard.press('Tab');
    }
     if (supplierId) {
      await this.fillDynamicField(this.supplierIdInput, 'Supplier ID', supplierId);
    }
    if (groupEntityNPI) {
      await this.fillDynamicField(this.groupEntityNPIInput, 'Group Entity NPI', groupEntityNPI);
    }

    if (providerName) {
      await this.fillDynamicField(this.providerNameInput, 'Provider Name', providerName);
    }

    if (addressLocation) {
      await this.selectDynamicDropdown(this.addressDropdown, 'Address Location', addressLocation);
    }
if (mailingCorrespondenceAddressUpdate) {
  await this.mailingCorrespondenceAddressUpdate
    .locator(this.mailingCorrespondenceAddressUpdate).click()
    console.log("does it work")

}
  }
  async fillContactInfo(data: MemberData = {}): Promise<void> { 
    const { email, memberId, commercialMemberId, dob, memberName, planName, dateOfService, memberDOB } = data;

    if (email) {
      await this.fillDynamicField(this.emailInput, 'Email', email);
    }
    
    if (memberId) {
      // Fallback architecture checks main target before testing validation fallback variations
      let filled = await this.fillDynamicField(this.memberIdInput, 'Main Member ID', memberId);
      if (!filled) {
        filled = await this.fillDynamicField(this.validationMemberIdInput, 'Validation Variant Member ID', memberId);
      }
      if (filled) await this.container.page().keyboard.press('Tab');
    }
    
    if (memberDOB) {
      const filled = await this.fillDynamicField(this.memberDOB, 'Date of Birth Field', memberDOB);
      if (filled) {
        try { await this.memberDOB.click(); } catch {}
        await this.container.page().keyboard.press('Tab');
      }
    }
    
    if (commercialMemberId) {
      await this.fillDynamicField(this.commercialMemberIdInput, 'Commercial Member ID', commercialMemberId);
    }
    
    if (dob) {
      await this.fillDynamicField(this.validationDobInput, 'Validation DOB', dob);
    }
    
    if (memberName) {
      await this.fillDynamicField(this.detailMemberNameInput, 'Detail Member Name', memberName);
    }
    
    if (planName) {
      await this.fillDynamicField(this.detailPlanNameInput, 'Plan Name', planName);
    }
    
    if (dateOfService) {
      await this.fillDynamicField(this.detailDateOfServiceInput, 'Date of Service', dateOfService);
    }
    
    if (data.changePCPforAntotherMember) {
      await this.clickDynamicField(this.changePCPforAntotherMember, 'Change PCP for Another Member', data.changePCPforAntotherMember);
    }

  }
}