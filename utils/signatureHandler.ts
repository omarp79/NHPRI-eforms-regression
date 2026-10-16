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

    await canvasLocator.scrollIntoViewIfNeeded();
    await canvasLocator.waitFor({ state: 'visible', timeout: 5000 });

    const box = await canvasLocator.boundingBox();
    if (!box) {
      throw new Error('❌ Could not calculate bounding box dimensions for signature canvas.');
    }

    //drawing movement
    const startX = box.x + (box.width * 0.2);
    const startY = box.y + (box.height * 0.5);

    // 4. Perform a  mouse drawing sequence
    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();

    // Draw a reliable wavy pattern using multi-step paths to register HTML5 drawing vectors
    await this.page.mouse.move(startX + (box.width * 0.15), startY - (box.height * 0.1), { steps: 5 });
    await this.page.mouse.move(startX + (box.width * 0.30), startY + (box.height * 0.1), { steps: 5 });
    await this.page.mouse.move(startX + (box.width * 0.45), startY, { steps: 5 });

    await this.page.mouse.up();

    try {
      await canvasLocator.dispatchEvent('change', { bubbles: true });
      await canvasLocator.blur();
    } catch {
      console.log(' [INFO]: Canvas state update triggered implicitly.');
    }
  }
}
