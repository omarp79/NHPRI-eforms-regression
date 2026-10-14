import { Page } from '@playwright/test';

export class SignatureHandler {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async signForm(): Promise<void> {
    // 1. Locate the target canvas using common signature element selectors
    const canvasLocator = this.page.locator([
      'canvas.signature-pad',
      'canvas[id*="signature"]',
      '.gfield_signature_container canvas',
      'canvas'
    ].join(', ')).first();

    // 2. Clear out any scrolling delays and wait for layout stabilization
    await canvasLocator.scrollIntoViewIfNeeded();
    
    // Crucial step: wait for scrolling/rendering loops to complete so coordinates match
    await this.page.waitForLoadState('networkidle'); 
    await canvasLocator.waitFor({ state: 'visible', timeout: 5000 });

    // 3. Obtain the exact localized bounding box coordinates
    const box = await canvasLocator.boundingBox();
    if (!box) {
      throw new Error('Could not calculate bounding box dimensions for signature canvas.');
    }

    // Calculate a safe starting point within the left quadrant of the canvas
    const startX = box.x + (box.width * 0.2);
    const startY = box.y + (box.height * 0.5);

    // 4. Perform a trusted native mouse drawing sequence
    // Moving directly to the position ensures browser window coordinates lock in
    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();

    // Draw a reliable wavy pattern using native steps to trigger internal library tracking
    await this.page.mouse.move(startX + (box.width * 0.2), startY - 15, { steps: 5 });
    await this.page.mouse.move(startX + (box.width * 0.4), startY + 15, { steps: 5 });
    await this.page.mouse.move(startX + (box.width * 0.6), startY, { steps: 5 });

    await this.page.mouse.up();

    await this.page.waitForTimeout(500);
  }
}
