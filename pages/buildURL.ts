import { Locator, Page } from '@playwright/test';
import { Environment } from '../utils/env';

export class BuildURLHelper {
  async getDomainURL(envTarget: any): Promise<string> {
    const Domain = Environment.setEnv(envTarget);
    return `${Domain}`;
  }
}