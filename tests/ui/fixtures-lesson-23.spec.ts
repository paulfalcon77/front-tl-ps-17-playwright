import { test } from '../fixtures/delivery.fixture'

test.describe('Mocked order flows', () => {
  // Первый тест: Убираем Login из аргументов.
  // Проверяем компоненты страницы создания заказа Orders, так как мы уже внутри приложения!
  test('Order creation with fixture', async ({ Orders }) => {
    await Orders.checkInnerComponents()
    await Orders.createOrder()
    await Orders.checkSuccessfullyCreatedPopup()
  })

  test('Should create and view order details', async ({ Orders, orderId }) => {
    await Orders.createOrder()
    await Orders.checkSuccessfullyCreatedPopup()
    await Orders.confirmationPopup.locator('button', { hasText: 'OK' }).click()
    const orderDetailsPage = await Orders.checkOrderFound(Number(orderId))
    await orderDetailsPage.checkVisible(true)
  })

  test('Should show order not found page for missing ID', async ({ Orders, OrderNotFound }) => {
    await Orders.checkOrderNotFound()
    await OrderNotFound.checkVisible(true)

    // await Orders.statusButton.click()
    // await Orders.searchInput.fill('999999999999')
    // await Orders.searchButton.click()
  })
})

// npx playwright test -g 'Should create and view order details' --project=chromium --debug
// npx playwright test -g 'Should show order not found page for missing ID' --project=chromium --debug
// npx playwright test -g 'Order creation with fixture' --project=chromium --debug
