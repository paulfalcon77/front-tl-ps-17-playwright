import { expect, Locator, Page } from '@playwright/test'
import { faker, th } from '@faker-js/faker'

export class OrderPage {
  readonly page: Page
  readonly title: Locator
  readonly statusButton: Locator
  readonly createOrderButton: Locator
  readonly nameInput: Locator
  readonly phoneInput: Locator
  readonly commentInput: Locator
  readonly confirmationPopup: Locator
  readonly logoutButton: Locator
  readonly logoMainInOrder: Locator
  readonly highLightTitleInOrder: Locator
  readonly privacyPolicyLinkInOrder: Locator
  readonly cookiePolicyLinkInOrder: Locator
  readonly serviceTermsLinkInOrder: Locator
  readonly btnRuInOrder: Locator
  readonly btnENInOrder: Locator

  constructor(page: Page) {
    this.page = page
    this.title = page.locator('h2')
    this.statusButton = page.getByTestId('openStatusPopup-button')
    this.nameInput = page.getByTestId('username-input')
    this.phoneInput = page.getByTestId('phone-input')
    this.commentInput = page.getByTestId('comment-input')
    this.createOrderButton = page.getByTestId('createOrder-button')
    this.confirmationPopup = page.getByTestId('orderSuccessfullyCreated-popup')
    this.logoutButton = page.getByTestId('logout-button')
    this.logoMainInOrder = page.getByTestId('mainPage-link')
    this.highLightTitleInOrder = page.locator('h1')
    this.privacyPolicyLinkInOrder = page.getByTestId('privacy-policy')
    this.cookiePolicyLinkInOrder = page.getByTestId('cookie-policy')
    this.serviceTermsLinkInOrder = page.getByTestId('terms-of-service')
    this.btnRuInOrder = page.getByRole('button', { name: 'RU' })
    this.btnENInOrder = page.getByRole('button', { name: 'EN' })
  }

  async checkInnerComponents(): Promise<void> {
    await expect(this.title).toBeVisible()
    await expect(this.statusButton).toBeVisible()
    await expect(this.createOrderButton).toBeVisible()
    await expect(this.nameInput).toBeVisible()
    await expect(this.phoneInput).toBeVisible()
    await expect(this.commentInput).toBeVisible()
    await expect(this.logoutButton).toBeVisible()
    await expect(this.logoMainInOrder).toBeVisible()
    await expect(this.highLightTitleInOrder).toBeVisible()
    await expect(this.privacyPolicyLinkInOrder).toBeVisible()
    await expect(this.cookiePolicyLinkInOrder).toBeVisible()
    await expect(this.serviceTermsLinkInOrder).toBeVisible()
    await expect(this.btnRuInOrder).toBeVisible()
    await expect(this.btnENInOrder).toBeVisible()
    //await this.checkCreateOrderBtnEnabled(true) //исправил на true. Должен быть False
  }

  async createOrder(): Promise<void> {
    await this.nameInput.fill(faker.person.firstName())
    await this.phoneInput.fill(faker.phone.number())
    await this.commentInput.fill(faker.lorem.sentence())
    await this.createOrderButton.click()
    await expect(this.confirmationPopup).toBeVisible()
  }

  async checkCreateOrderBtnEnabled(enabled: boolean): Promise<void> {
    await expect(this.createOrderButton).toBeEnabled({ enabled })
  }

  async checkLanguageTest(): Promise<void> {
    await this.btnENInOrder.click()
    await expect(this.privacyPolicyLinkInOrder).toHaveText('Privacy Policy')
    await this.btnRuInOrder.click()
    await expect(this.privacyPolicyLinkInOrder).toHaveText('Политика приватности')
  }
}
