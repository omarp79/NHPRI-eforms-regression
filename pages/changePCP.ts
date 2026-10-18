import { Locator, Page } from '@playwright/test';
import { Environment } from '../utils/env';
import * as SharedForm from '../utils/sharedFormActions';
export class ChangePCP {
  private readonly page: Page;
  public readonly sharedFormActions: SharedForm.SharedFormActions;
  public readonly formRoot: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formRoot = this.page.locator('form#pcp-change-form, .form-container-class');
    this.sharedFormActions = new SharedForm.SharedFormActions(this.formRoot);
  }

  private getURL(envTarget: string): string {
    const cleanEnv = envTarget.toLowerCase().trim();
    const baseURL = Environment.setEnv(cleanEnv);
    return `${baseURL}providers/pcp-change`;
  }

  async navigateToChangePCP(envTarget: string): Promise<void> {
    const targetURL = this.getURL(envTarget);
    console.log(`Testing: ${targetURL}`);
    await this.page.goto(targetURL);
    await this.page.waitForLoadState('load');
  }

  async fillProviderSection(data?: SharedForm.ProviderData): Promise<void> {
    await this.sharedFormActions.fillProviderInfo(data);
  }

  async fillContactSection(data: SharedForm.MemberData = {}): Promise<void> {
    await this.sharedFormActions.fillContactInfo(data);
  }
  async clickSubmitBtn(){
    await this.sharedFormActions.clickActionButton(this.sharedFormActions.submitReviewbtn, 'REVIEW AND SUBMIT');
  }

  
}