import { useState } from 'react'

export default function CartPopup({ cart, products, onClose, onAdd, onRemove }) {
  const [isCheckout, setIsCheckout] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' })

  // Собираем товары из корзины
  const cartItems = Object.keys(cart).map(productId => {
    const product = products.find(p => p.id === productId)
    return { ...product, quantity: cart[productId] }
  }).filter(item => item.id)

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleCheckout = () => {
    alert(`Спасибо, ${formData.name}! Заказ на ${totalPrice}₽ отправлен.`)
    // Здесь позже подключим отправку в Телеграм или базу
    setIsCheckout(false)
    onClose()
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="cart-popup" onClick={e => e.stopPropagation()}>

        <div className="popup-header">
          <h2>{isCheckout ? 'Оформление заказа' : 'Корзина'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {cartItems.length === 0 && !isCheckout ? (
          <p className="empty-cart">Корзина пуста 🧺</p>
        ) : !isCheckout ? (
          /* === РЕЖИМ ПРОСМОТРА КОРЗИНЫ === */
          <>
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <strong>{item.name}</strong>
                    <p className="price-line">{item.price} ₽ × {item.quantity}</p>
                  </div>
                  <div className="cart-controls">
                    <button onClick={() => onRemove(item.id)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onAdd(item.id)}>+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Итого:</span>
                <strong>{totalPrice} ₽</strong>
              </div>
              <button className="checkout-btn" onClick={() => setIsCheckout(true)}>
                Оформить заказ
              </button>
            </div>
          </>
        ) : (
          /* === РЕЖИМ ФОРМЫ ЗАКАЗА === */
          <div className="checkout-form">
            <label>Ваше имя</label>
            <input
              placeholder="Иван"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />

            <label>Телефон</label>
            <input
              placeholder="+7 999 000-00-00"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />

            <label>Адрес доставки / Комментарий</label>
            <textarea
              placeholder="Улица, дом, квартира или пожелания к заказу"
              rows="3"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />

            <div className="form-buttons">
              <button className="back-btn" onClick={() => setIsCheckout(false)}>← Назад</button>
              <button className="submit-btn" onClick={handleCheckout}>Отправить заказ</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}