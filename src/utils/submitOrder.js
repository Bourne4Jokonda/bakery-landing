import emailjs from '@emailjs/browser'

export default async function submitOrder(orderData) {
  try {
    // orderData = { name, phone, comment, items, total }
    const orderText = orderData.items.map(item => 
      `${item.name} — ${item.price} ₽`
    ).join('\n')

    const templateParams = {
      to_email: 'bourne4jokonda@gmail.com',
      from_name: orderData.name || 'Клиент',
      phone: orderData.phone || '',
      comment: orderData.comment || '',
      order_details: orderText,
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