import { test, expect } from '@playwright/test'
import { Home } from '../pages/home'
import { TodaysDeals } from '../pages/todaysDeals'

test.use({ viewport: { width: 1600, height: 900 } })

test('Amazon Test 1: Prime eligible books under $25', async ({ page }) => {
  const home = new Home(page)
  const todaysDeals = new TodaysDeals(page)
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const prime = ['Prime eligible']
  const departments = ['Books']
  const price = 'Under $25'

  await test.step('Navigate to the Amazon home page', async () => {
    await home.goto()
  })
  await test.step("Navigate to the Today's Deals page", async () => {
    await todaysDeals.goto()
  })
  await test.step('Filter the products', async () => {
    await todaysDeals.filterProducts(prime, departments, price)
  })
  await test.step('Assert the product grid is not empty', async () => {
    await todaysDeals.assertProductGridNotEmpty()
  })
  await test.step('Get and print the product grid details', async () => {
    await todaysDeals.getAndPrintProductInfo(prime)
  })
})

test('Amazon Test 2: Prime Early Access deals Electronics $25 to $50', async ({ page }) => {
  const home = new Home(page)
  const todaysDeals = new TodaysDeals(page)
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const prime = ['Prime Early Access deals']
  const departments = ['Electronics']
  const price = '$25 to $50'

  await test.step('Navigate to the Amazon home page', async () => {
    await home.goto()
  })
  await test.step("Navigate to the Today's Deals page", async () => {
    await todaysDeals.goto()
  })
  await test.step('Filter the products', async () => {
    await todaysDeals.filterProducts(prime, departments, price)
  })
  await test.step('Assert the product grid is not empty', async () => {
    await todaysDeals.assertProductGridNotEmpty()
  })
  await test.step('Get and print the product grid details', async () => {
    await todaysDeals.getAndPrintProductInfo(prime)
  })
})

test('Amazon Test 3: Prime Exclusive deals Fashion $50 to $100', async ({ page }) => {
  const home = new Home(page)
  const todaysDeals = new TodaysDeals(page)
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const prime = ['Prime Exclusive deals']
  const departments = ['Fashion']
  const price = '$50 to $100'

  await test.step('Navigate to the Amazon home page', async () => {
    await home.goto()
  })
  await test.step("Navigate to the Today's Deals page", async () => {
    await todaysDeals.goto()
  })
  await test.step('Filter the products', async () => {
    await todaysDeals.filterProducts(prime, departments, price)
  })
  await test.step('Assert the product grid is not empty', async () => {
    await todaysDeals.assertProductGridNotEmpty()
  })
  await test.step('Get and print the product grid details', async () => {
    await todaysDeals.getAndPrintProductInfo(prime)
  })
  delay(3000) //Delay 3 seconds
})
