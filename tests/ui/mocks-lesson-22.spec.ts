import { test } from '@playwright/test'
import { LoginPage } from '../pages/login-page'
import { PASSWORD, USERNAME } from '../../config/env-data'
import { ENDPOINTS } from '../../utils/endpoints'
import { TEST_DATA } from '../../utils/TestData'
import { fakeJwt } from '../../utils/jwt'
import { OrderPage } from '../pages/order-page'

//const orderId = 17391

//const temp_JWT =
//  'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwYXZlbHNva29sb3YiLCJleHAiOjE3Nzg1OTU4MDEsImlhdCI6MTc3ODU3NzgwMX0.c8PWEMBm2NmUOdFYZg-Ms2ZYosaWksV34K3WAiwVMmqljjSjho0qWLzRYL_h1dZYi0t_Gbc9nHOeGDXGEOm-ww'

const jwt = fakeJwt()

test.describe('Mocked order flows', () => {
  test('Mocked order creation', async ({ context }) => {
    await context.addInitScript((token) => {
      console.log(token)
      localStorage.setItem(
        'jwt',
        token, //'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwYXZlbHNva29sb3YiLCJleHAiOjE3Nzg3OTUwNTQsImlhdCI6MTc3ODc3NzA1NH0.Dec6kkxQT6iO1pJJgk95RxeKpkJRjmPHNypRihnuLjyVD9plTCkud4_GP8dscdZTx98sSLazzV5tGf1m3tf0Gw',
      )
    }, jwt)

    const page = await context.newPage()
    const orderPage = new OrderPage(page)

    await orderPage.open()
    await page.route(`**${ENDPOINTS.ORDERS}`, async (route) => {
      await route.fulfill({
        status: 200,
        json: TEST_DATA.CREATE_ORDER_RESPONSE,
        contentType: 'application/json',
      })
    })
    await orderPage.createOrder()
    await orderPage.checkSuccessfullyCreatedPopup()
  })

  test(' Mocked order search - found', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.open()
    await page.route(`**${ENDPOINTS.STUDENTS}`, async (route) => {
      await route.fulfill({ body: fakeJwt() })
    })
    const orderPage = await loginPage.signIn(USERNAME, PASSWORD)

    await page.route(`**${ENDPOINTS.ORDERS}/*`, async (route) => {
      await route.fulfill({
        status: 200,
        json: TEST_DATA.CREATE_ORDER_RESPONSE,
        contentType: 'application/json',
      })
    })
    const detailsPage = await orderPage.checkOrderFound(TEST_DATA.CREATE_ORDER_RESPONSE.id)
    await detailsPage.checkVisible(true)
  })

  test(' Mocked order search - not found', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.open()
    await page.route(`**${ENDPOINTS.STUDENTS}`, async (route) => {
      await route.fulfill({ body: fakeJwt() })
    })
    const orderPage = await loginPage.signIn(USERNAME, PASSWORD)

    await page.route(`**${ENDPOINTS.ORDERS}/*`, async (route) => {
      await route.fulfill({
        status: 200,
      })
    })
    const notFoundPage = await orderPage.checkOrderNotFound()
    await notFoundPage.checkVisible(true)
  })

  test(' Mocked server error', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.open()
    await page.route(`**${ENDPOINTS.STUDENTS}`, async (route) => {
      await route.fulfill({ body: fakeJwt() })
    })
    const orderPage = await loginPage.signIn(USERNAME, PASSWORD)

    await page.route(`**${ENDPOINTS.ORDERS}/*`, async (route) => {
      // if (route.request().method() === 'get') {} <-- routing
      // if (route.request().method() === 'post') {}
      await route.fulfill({
        status: 500,
      })
    })
    const notFoundPage = await orderPage.checkOrderNotFound()
    await notFoundPage.checkVisible(true)
  })
})

// await page.unrouteAll() - снимает регистрацию со всех ендпоинтов (роутов). Одной командой снимае все моки.

// npx playwright test -g 'Mocked order creation' --project=chromium --debug
// npx playwright test -g 'Mocked order search - found' --project=chromium --debug
// npx playwright test -g 'Mocked order search - not found' --project=chromium --debug
// npx playwright test -g 'Mocked server error' --project=chromium --debug
