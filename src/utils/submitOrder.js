import emailjs from '@emailjs/browser'

export default async function submitOrder(data) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  // Формируем строку с товарами: "Пирог (450₽), Круассан (290₽)"
  const itemsString = data.items.map(item => `${item.name} — ${item.price} ₽`).join(', ')

  const templateParams = {
    from_name: data.name,
    phone: data.phone,
    comment: data.comment || 'Без комментария',
    order_items: itemsString, // <-- Новая переменная для шаблона
    total: data.total + ' ₽'
  }

  try {
    await emailjs.send(serviceId, templateId, templateParams, publicKey)
    console.log('✅ Заказ улетел!')
  } catch (error) {
    console.error('Ошибка EmailJS:', error)
    alert('Ошибка отправки!')
  }
}