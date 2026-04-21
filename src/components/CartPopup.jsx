import React, { useState } from 'react'
import './Popup.css'
import submitOrder from '../utils/submitOrder'

export default function CartPopup({ cart, onClose, onUpdateCart }) {
  const [form, setForm] = useState({ name: '', phone: '', comment: '' })
  const [loading, setLoading] = useState(false)
  const total = cart.reduce((sum, item) => sum + item.price, 0)

  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index)
    onUpdateCart(newCart)
  }

  const handleOrder = async () => {
    if (!form.name || !form.phone) return alert('Заполните имя и телефон')
    
    setLoading(true)
    try {
      await submitOrder({ ...form, items: cart, total })
      onUpdateCart([])
      onClose()
      alert('✅ Заказ принят!')
    } catch (error) {
      alert('❌ Ошибка. Смотри консоль.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup cart-popup" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>Корзина ({cart.length})</h2>
        
        {cart.length === 0 ? (
          <p>Пусто</p>
        ) : (
          <>
            {cart.map((item, i) => (
              <div key={i} className="cart-item">
                <span>{item.name} — {item.price} ₽</span>
                <button onClick={() => removeItem(i)}>✕</button>
              </div>
            ))}
            <div className="cart-total">Итого: {total} ₽</div>
            
            <input 
              id="customer-name"
              name="from_name" 
              placeholder="Ваше имя" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
            />
            <input 
              id="customer-phone"
              name="phone" 
              placeholder="Телефон" 
              value={form.phone} 
              onChange={e => setForm({...form, phone: e.target.value})} 
            />
            <textarea 
              id="customer-comment"
              name="comment" 
              placeholder="Комментарий" 
              value={form.comment} 
              onChange={e => setForm({...form, comment: e.target.value})} 
            />
            <button onClick={handleOrder} disabled={loading}>
              {loading ? 'Отправка...' : 'Оформить заказ'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}