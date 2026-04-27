import { test } from '@playwright/test'
import { LoginPage } from '../pages/login-page'
import { PASSWORD, USERNAME } from '../../config/env-data'

const correctorderId = 17337
//const orderId = 17391

test('Not found page test', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  const orderPage = await loginPage.signIn(USERNAME, PASSWORD)
  const notFoundPage = await orderPage.checkOrderNotFound()
  await notFoundPage.checkVisible(true)
})

test('Found page test', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  const orderPage = await loginPage.signIn(USERNAME, PASSWORD)
  const detailsPage = await orderPage.checkOrderFound(correctorderId)
  await detailsPage.checkVisible(true)
})

//npx playwright test -g "Not found page test"
