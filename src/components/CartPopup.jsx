import './App.css' // Убедись, что стили подключены

export default function CartPopup({ cart, products, onClose, onAdd, onRemove }) {
  // 1. Собираем полные данные товаров, которые есть в корзине
  const cartItems = Object.keys(cart).map(productId => {
    const product = products.find(p => p.id === productId)
    return { ...product, quantity: cart[productId] }
  }).filter(item => item.id) // Убираем "мусор", если товар удален из базы

  // 2. Считаем итоговую сумму
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="cart-popup" onClick={e => e.stopPropagation()}>
        
        <div className="popup-header">
          <h2>Корзина</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {cartItems.length === 0 ? (
          <p className="empty-cart">Корзина пуста 🧺</p>
        ) : (
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
              <button className="checkout-btn">Оформить заказ</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}