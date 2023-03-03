import { expect, Locator, Page } from '@playwright/test'

export class Home {
  readonly page: Page
  readonly amazonLogo: string
  readonly homePageCarousel: string

  constructor(page: Page) {
    this.page = page
    this.amazonLogo = '//div[@id="nav-logo"]'
    this.homePageCarousel = '//div[@class="a-carousel-row-inner"]'
  }

  /**
   * Navigate to the Amazon home page and wait for the Amazon logo to be visible.
   */
  async goto() {
    await this.page.goto('https://www.amazon.com/')
    await this.page.locator(this.amazonLogo).isVisible()
    await expect(this.page.locator(this.amazonLogo), 'Expect the Amazon logo to be present.').toBeVisible()
    await this.page.locator(this.homePageCarousel).isVisible()
    await expect(this.page.locator(this.homePageCarousel), 'Expect the home page carousel to be present.').toBeVisible()
  }
}
