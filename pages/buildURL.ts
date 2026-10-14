import { Locator, Page } from '@playwright/test';
import { EnvManager } from '../utils/env';

export class BuildURLHelper {
  async getDomainURL(envTarget: any): Promise<string> {
    const Domain = EnvManager.setEnv(envTarget);
    return `https://${Domain}`;
  }
}