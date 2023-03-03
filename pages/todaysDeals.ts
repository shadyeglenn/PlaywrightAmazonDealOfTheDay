import { expect, Locator, Page } from '@playwright/test'

export class TodaysDeals {
  readonly page: Page
  readonly todaysDealsLink: string
  readonly todaysDealsHeader: string
  readonly gettingStartedHeader: string
  readonly primeFilters: string
  readonly departmentsFilters: string
  readonly priceFilters: string
  readonly productGrid: string
  readonly products: string

  constructor(page: Page) {
    this.page = page
    this.todaysDealsLink = `//a[contains(text(),"Today's Deals")]`
    this.todaysDealsHeader = `//h1[contains(text(),"Today's Deals")]`
    this.primeFilters = '//span[@data-testid="grid-filter-PRIME"]'
    this.departmentsFilters = '//span[@data-testid="grid-filter-DEPARTMENTS"]'
    this.priceFilters = '//span[@data-testid="grid-filter-PRICE"]'
    this.productGrid = '//div[@data-testid="grid-deals-container"]'
    this.products = `${this.productGrid}//div[contains(@class,"DealGridItem-module__dealItemDisplayGrid")]`
  }

  /**
   * Navigate to the Amazon home page and wait for the Amazon logo to be visible.
   */
  async goto() {
    await this.page.locator(this.todaysDealsLink).click() //Use a .first().click() if there are more than one link or a different locator if there may be possible locator confusion.
    await expect(
      this.page.locator(this.todaysDealsHeader),
      "Todays's Deals header wasn't visible when it was expected to be."
    ).toBeVisible()
  }

  /**
   * Filter Today's Deals by one or more of the Prime programs.
   *
   * @param primeFilters the "Prime programs" to filter on
   */
  async filterPrime(primeFilters: string | string[]) {
    if (typeof primeFilters === 'string') {
      primeFilters = [primeFilters]
    }
    for (const primeFilter of primeFilters) {
      const element = this.page.locator(`${this.primeFilters}//span[text()="${primeFilter}"]//ancestor::label`)
      await expect.soft(element, `Expecting the Prime program ${primeFilter} to be visible.`).toBeVisible()
      await element.check()
      await expect.soft(element, `Expecting the Prime program ${primeFilter} to be checked.`).toBeChecked()
    }
  }

  /**
   * Filter Today's Deals by one or more of the Departments.
   *
   * @param departments the department(s) to filter on
   */
  async filterDepartments(departments: string | string[]) {
    if (typeof departments === 'string') {
      departments = [departments]
    }
    for (const department of departments) {
      const regDept = new RegExp(`^${department}$`) //Use RegEx to specify that we only want exact text matches.
      const element = this.page.locator(this.departmentsFilters).locator('span', {
        hasText: regDept,
      })

      //If the specific Department isn't available, don't wait to click it
      if (await element.isVisible()) {
        await element.check()
        await expect.soft(element, `Expecting the Department ${department} to be checked.`).toBeChecked()
      }
    }
  }

  /**
   * Filter Today's Deals by one of the Price categories.
   *
   * @param price the price to filter on
   */
  async filterPrice(price: string) {
    const element = this.page.locator(this.priceFilters).locator('a', { hasText: price })
    const selectedElement = element.locator('//ancestor::span[@class="a-text-bold"]')

    //If the Price section isn't available, don't wait to click it
    if ((await element.isVisible()) && (await element.isEnabled())) {
      await element.click()
      await expect.soft(selectedElement, `Expecting the Price ${price} to be selected.`).toBeVisible()
    }
  }

  /**
   * Filter the products on the Today's Deals page according to the passed in Prime program(s), Department(s), and Price.
   *
   * @param primeFilters the "Prime programs" to filter on
   * @param departments the department(s) to filter on
   * @param price the price to filter on
   */
  async filterProducts(primeFilters: string | string[], departments: string | string[], price: string) {
    await this.filterPrime(primeFilters)
    await this.filterDepartments(departments)
    await this.filterPrice(price)
  }

  /**
   * Assert that the filtered products results for Today's Deals grid isn't empty.
   */
  async assertProductGridNotEmpty() {
    const productGridCount = await this.page.locator(this.products).evaluateAll((items) => items.length, 0)
    expect(productGridCount > 0, 'No products displayed, more than zero products were expected.').toBeTruthy()
  }

  /**
   * Returns and prints the product information for the current page given the applied filters.
   *
   * @param primeFilters the "Prime programs" that are filtered on, used for determining how to handle the product parsing
   * @returns a multidimensional string array containing the first page of product information
   */
  async getAndPrintProductInfo(primeFilters: string | string[]): Promise<string[][]> {
    const products = await this.page.locator(this.products)
    const count = await products.count()

    let productInfo: string[][] = []
    let hasPrimeTime = false

    if (typeof primeFilters === 'string') {
      primeFilters = [primeFilters]
    }

    if (primeFilters.includes('Prime Early Access deals') || primeFilters.includes('Prime Exclusive deals')) {
      hasPrimeTime = true
    }

    for (let i = 0; i < count; i++) {
      let productRow: string[] = []
      const productText = await products.nth(i).locator('//div[contains(@class,"DealContent-module")]').textContent()
      if (productText) {
        productRow.push(productText)
      }

      let productPrice = await products
        .nth(i)
        .locator(
          '//div[contains(@class,"BadgeAutomated-module__badgeOneLineContainer") and not(@aria-hidden="true")]//div'
        )
        .textContent()
      if (productPrice) {
        if (typeof productPrice === 'object') {
          productPrice = productPrice[0]
        }
        productRow.push(productPrice)
      }

      let productTime: any
      if (hasPrimeTime) {
        productTime = await products
          .nth(i)
          .locator(
            '//div[contains(@class,"BadgeAutomated-module__badgeOneLineContainer") and not(@aria-hidden="true")]//time'
          )
          .textContent()
        if (productTime) {
          productRow.push(productTime)
        }
      }

      if (productRow) {
        console.log(`${productTime ? productTime + ' : ' : ''}${productPrice} : ${productText}`)
        productInfo.push(productRow)
      }
    }
    return productInfo
  }
}
