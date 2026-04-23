import { expect, Locator, Page } from '@playwright/test'
import { OrderPage } from './order-page'
import { SERVICE_URL } from '../../config/env-data'

export class LoginPage {
  readonly page: Page
  readonly url: string = SERVICE_URL
  readonly signInButton: Locator
  readonly usernameField: Locator
  readonly passwordField: Locator
  readonly logoMain: Locator
  readonly highLightTitle: Locator
  readonly privacyPolicyLink: Locator
  readonly cookiePolicyLink: Locator
  readonly serviceTermsLink: Locator
  readonly btnRu: Locator
  readonly btnEN: Locator
  readonly authError: Locator

  constructor(page: Page) {
    this.page = page
    this.signInButton = page.getByTestId('signIn-button')
    this.usernameField = page.getByTestId('username-input')
    this.passwordField = page.getByTestId('password-input')
    this.logoMain = page.getByTestId('mainPage-link')
    this.highLightTitle = page.locator('h1')
    this.privacyPolicyLink = page.getByTestId('privacy-policy')
    this.cookiePolicyLink = page.getByTestId('cookie-policy')
    this.serviceTermsLink = page.getByTestId('terms-of-service')
    this.btnRu = page.getByRole('button', { name: 'RU' })
    this.btnEN = page.getByRole('button', { name: 'EN' })
    this.authError = page.getByTestId('username-input-error')
  }

  async open() {
    await this.page.goto(this.url)
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
    await expect(this.signInButton).toBeVisible()
    await expect(this.logoMain).toBeVisible()
    await expect(this.highLightTitle).toBeVisible()
    await expect(this.privacyPolicyLink).toBeVisible()
    await expect(this.cookiePolicyLink).toBeVisible()
    await expect(this.serviceTermsLink).toBeVisible()
    await expect(this.btnRu).toBeVisible()
    await expect(this.btnEN).toBeVisible()
  }

  // Метод сделан. Не работает
  async checkErrorForAuthentication(): Promise<void> {
    await this.usernameField.fill('')
    await this.passwordField.fill('')
    await this.signInButton.click()
    await expect(this.authError).toBeVisible()
  }
  // continue with the rest of the implementation below
}
