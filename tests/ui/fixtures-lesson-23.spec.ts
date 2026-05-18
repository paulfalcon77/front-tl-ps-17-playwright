import { test } from '../fixtures/delivery.fixture'

test.describe('Mocked order flows', () => {
  test('Order creation with fixture', async ({ Orders, Login }) => {
    await Login.checkInnerComponents()
    await Orders.createOrder()
    await Orders.checkSuccessfullyCreatedPopup()
  })

  test('Should  create and view order details', async ({ Orders, orderId }) => {
    await Orders.createOrder()
    await Orders.checkSuccessfullyCreatedPopup()

    const orderDetailsPage = await Orders.checkOrderFound(Number(orderId))
    await orderDetailsPage.checkVisible(true)
  })

  test('Should show order not found page for missing ID', async ({ page, Orders }) => {
    await page.route('**/orders/0*', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Order not found' }),
      })
    })
    const notFoundPage = await Orders.checkOrderNotFound()
    await notFoundPage.checkVisible(true)
  })
})

// npx playwright test -g 'Should successfully create and view order details' --project=chromium --debug
// npx playwright test -g 'Should show order not found page for missing ID' --project=chromium --debug
// npx playwright test -g 'Order creation with fixture' --project=chromium --debug
