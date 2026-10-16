import { test } from '@playwright/test';

import * as fs from 'fs';

import * as path from 'path';

 

test('Scan webpage and save name attributes as POM locators', async ({ page }) => {

  // 1. Navigate to the target form page

  await page.goto('https://nhpri.org');

 

  // 2. Select all interactive form fields on the main page

  const formFields = page.locator('input, select, textarea');

  const count = await formFields.count();

 

  console.log(`\n🔍 Found ${count} total interactive form fields. Constructing POM locators...\n`);

 

  // Create an array to collect formatted locator strings

  const locatorLines: string[] = [];

 

  // 3. Loop through each field and extract attributes

  for (let i = 0; i < count; i++) {

    const field = formFields.nth(i);

   

    const attributes = await field.evaluate((el) => {

      return {

        tagName: el.tagName.toLowerCase(),

        name: el.getAttribute('name')

      };

    });

 

    // 4. Only process and save if a valid name attribute exists

    if (attributes.name && attributes.name !== '🚫 No Name') {

      // Formats the variable name nicely (e.g., field_input_16)

      const variableName = `field_${attributes.name.replace(/[^a-zA-Z0-9]/g, '_')}`;

      

      // ✅ Constructs using 'this.page.locator'

      const locatorString = `const ${variableName} = this.page.locator('${attributes.tagName}[name="${attributes.name}"]');`;

     

      locatorLines.push(locatorString);

    }

  }

 

  // 5. Save the compiled locator strings to a plain text file

  const outputPath = path.join(__dirname, 'locators.txt');

  fs.writeFileSync(outputPath, locatorLines.join('\n'), 'utf-8');

 

  console.log(`✅ Locators saved successfully to: ${outputPath}`);

});