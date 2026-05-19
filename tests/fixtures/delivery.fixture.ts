import { Page, test as base } from '@playwright/test'
import { BE_URL, PASSWORD, SERVICE_URL, USERNAME } from '../../config/env-data'
import { ENDPOINTS } from '../../utils/endpoints'
import { LoginPage } from '../pages/login-page'
import { OrderPage } from '../pages/order-page'
import { OrderDetailsPage } from '../pages/order-details-page'
import { NotFoundPage } from '../pages/order-not-found-page'

type Fixtures = {
  auth: { jwt: string }
  orderId: string
  mainPage: Page
  Login: LoginPage
  Orders: OrderPage
  OrderDetails: OrderDetailsPage
  OrderNotFound: NotFoundPage
}

export const test = base.extend<Fixtures>({
  auth: async ({ request }, use) => {
    console.log('Init: getting jwt')
    const response = await request.post(`${BE_URL}${ENDPOINTS.STUDENTS}`, {
      data: {
        username: `${USERNAME}`,
        password: `${PASSWORD}`,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const jwt = await response.text()

    await use({ jwt })
  },

  orderId: async ({ auth, request }, use) => {
    const response = await request.post(`${BE_URL}${ENDPOINTS.ORDERS}`, {
      data: {
        status: 'OPEN',
        customerName: 'test',
        customerPhone: 'test',
        comment: 'test',
      },
      headers: {
        Authorization: `Bearer ${auth.jwt}`,
      },
    })

    const responseData = await response.json()
    const orderId = responseData.id
    console.log('order created with id: ', orderId)
    await use(orderId)
  },

  mainPage: async ({ context, auth }, use) => {
    await context.addInitScript((token) => {
      localStorage.setItem('jwt', token)
    }, auth.jwt)

    const mainPage = await context.newPage()

    await mainPage.route(`${BE_URL}${ENDPOINTS.ORDERS}/*`, async (route) => {
      if (route.request().url().endsWith('/404')) {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Order not found' }),
        })
      } else if (route.request().method() !== 'GET') {
        await route.continue()
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'DELIVERED',
            courierId: null,
            customerName: 'mocked customer',
            customerPhone: '99887766',
            comment: '',
            id: 9999,
          }),
        })
      }
    })

    await mainPage.goto(SERVICE_URL)
    await use(mainPage)
  },

  Login: async ({ mainPage }, use) => {
    const Login = new LoginPage(mainPage)
    await Login.open()
    await Login.signIn(USERNAME, PASSWORD)
    await use(Login)
  },

  Orders: async ({ mainPage }, use) => {
    const Orders = new OrderPage(mainPage)
    await use(Orders)
  },

  OrderDetails: async ({ mainPage }, use) => {
    const orderDetails = new OrderDetailsPage(mainPage)
    await use(orderDetails)
  },

  OrderNotFound: async ({ mainPage }, use) => {
    const orderNotFound = new NotFoundPage(mainPage) // Используем правильный класс
    await use(orderNotFound)
  },
})

export { expect } from '@playwright/test'
