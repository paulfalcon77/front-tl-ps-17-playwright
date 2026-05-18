import { expect, Locator, Page } from '@playwright/test'
import { OrderPage } from './order-page'
import { SERVICE_URL } from '../../config/env-data'
import { BasePage } from './base-page'
import { Button } from '../atoms/Button'

export class LoginPage extends BasePage {
  readonly signInButton: Button
  readonly usernameField: Locator
  readonly passwordField: Locator
  readonly logoMain: Locator

  constructor(page: Page) {
    super(page, SERVICE_URL)
    this.signInButton = new Button(page.getByTestId('signIn-button'))
    this.usernameField = page.getByTestId('username-input')
    this.passwordField = page.getByTestId('password-input')
    this.logoMain = page.getByTestId('mainPage-link')
  }

  async signIn(username: string, password: string) {
    await this.usernameField.fill(username)
    await this.passwordField.fill(password)
    await this.signInButton.click()
    return new OrderPage(this.page)
  }
  async checkInnerComponents() {
    await expect(this.usernameField).toBeVisible()
    await expect(this.passwordField).toBeVisible()
    await this.signInButton.checkVisible(true)
    await expect(this.logoMain).toBeVisible()
  }
}
