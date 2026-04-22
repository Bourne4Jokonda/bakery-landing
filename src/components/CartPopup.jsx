import React, { useState } from 'react'
import submitOrder from '../utils/submitOrder'
import './Popup.css'

export default function CartPopup({ cart, products, onClose, onAdd, onRemove }) {
  const [form, setForm] = useState({ name: '', phone: '', comment: '' })
  const [loading, setLoading] = useState(false)

  const cartItems = Object.entries(cart).map(([id, quantity]) => {
    const product = products.find(p => p.id === parseInt(id))
    return product ? { ...product, quantity } : null
  }).filter(Boolean)

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleOrder = async () => {
    if (!form.name || !form.phone) {
      alert('Заполните имя и телефон')
      return
    }

    setLoading(true)
    try {
      await submitOrder({ ...form, items: cartItems, total })
      alert('✅ Заказ отправлен! Мы скоро свяжемся с вами.')
      onClose()
    } catch (error) {
      alert('❌ Ошибка отправки. Попробуйте позже.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup cart-popup" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>Корзина ({cartItems.length})</h2>
        
        {cartItems.length === 0 ? (
          <p>Корзина пуста</p>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                  )}
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">{item.price} ₽</div>
                  </div>
                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button className="qty-btn minus" onClick={() => onRemove(item.id)}>−</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn plus" onClick={() => onAdd(item.id)}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-total">Итого: {total} ₽</div>

            <div className="order-form">
              <input 
                type="text"
                placeholder="Ваше имя"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                required
              />
              <input 
                type="tel"
                placeholder="Телефон"
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
                required
              />
              <textarea 
                placeholder="Комментарий к заказу"
                value={form.comment}
                onChange={e => setForm({...form, comment: e.target.value})}
                rows="3"
              />
            </div>

            <button className="checkout-btn" onClick={handleOrder} disabled={loading}>
              {loading ? 'Отправка...' : 'Оформить заказ'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}