import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { Environment } from '../utils/env';
test('Scan webpage and save name attributes as POM locators', async ({ page }) => {

  const baseURL = Environment.setEnv('QA');
  const targetURL = `${baseURL}providers/pcp-change`;

  await page.goto(targetURL);
  console.log(`Scanning webpage: ${targetURL}`);
  const formFields = page.locator('input, select, textarea');
  const count = await formFields.count();

  console.log(`\n🔍 Found ${count} total interactive form fields. Constructing POM locators...\n`);

  const locatorLines: string[] = [];

  for (let i = 0; i < count; i++) {
    const field = formFields.nth(i);
    const attributes = await field.evaluate((el) => {

      return {
        tagName: el.tagName.toLowerCase(),
        name: el.getAttribute('name')
      };
    });

    if (attributes.name && attributes.name !== '🚫 No Name') {
      const variableName = `field_${attributes.name.replace(/[^a-zA-Z0-9]/g, '_')}`;
      // ✅ Constructs using 'this.page.locator'
      const locatorString = `const ${variableName} = this.page.locator('${attributes.tagName}[name="${attributes.name}"]');`;

      locatorLines.push(locatorString);
    }
  }

  const outputPath = path.join(__dirname, 'locators.txt');
  fs.writeFileSync(outputPath, locatorLines.join('\n'), 'utf-8');
  console.log(`✅ Locators saved successfully to: ${outputPath}`);
});