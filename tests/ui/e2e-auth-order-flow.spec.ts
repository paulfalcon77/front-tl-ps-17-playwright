import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login-page'
import { faker } from '@faker-js/faker/locale/ar'
import { PASSWORD, USERNAME } from '../../config/env-data'
import { OrderPage } from '../pages/order-page'

test('Login test + order page components check', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const orderPage = new OrderPage(page)

  await loginPage.open()

  await loginPage.usernameField.fill(USERNAME)
  await loginPage.passwordField.fill(PASSWORD)
  await loginPage.signInButton.click()
  await expect(orderPage.statusButton).toBeVisible()
})
