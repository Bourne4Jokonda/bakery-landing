import emailjs from '@emailjs/browser'

export default async function submitOrder(orderData) {
  try {
    const templateParams = {
      from_name: orderData.name || 'Клиент', // Для {{from_name}} в тексте
      name: orderData.name || 'Клиент',      // Для {{name}} в поле "От кого"
      phone: orderData.phone || '',
      comment: orderData.comment || '',
      order_items: orderData.items || 'Не указано', // <-- ИСПРАВЛЕНО НА order_items
      total: orderData.total
    }

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )

    return { success: true }
  } catch (error) {
    console.error('Ошибка отправки:', error)
    return { success: false, error: error.message }
  }
}