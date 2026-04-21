import React, { useState, useEffect } from 'react'
import productsData from './products.json'
import ProductPopup from './components/ProductPopup'
import CartPopup from './components/CartPopup'
import './App.css'

function App() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart])
  const addToCart = (product) => setCart(prev => [...prev, product])

  return (
    <main className="container">
      <header className="header">
        <h1>🥐 Пекарня «Тёплый край»</h1>
        <button className="cart-btn" onClick={() => setIsCartOpen(true)}>Корзина ({cart.length})</button>
      </header>
      
      <section className="grid">
        {productsData.map(p => (
          <article key={p.id} className="card" onClick={() => setSelectedProduct(p)}>
            <img src={p.img} alt={p.name} />
            <h3>{p.name}</h3>
            <p>{p.desc}</p>
            <div className="price-row">
              <span>{p.price} ₽</span>
              <button onClick={(e) => { e.stopPropagation(); addToCart(p); }}>В корзину</button>
            </div>
          </article>
        ))}
      </section>

            {/* Поп-ап товара показываем ТОЛЬКО если выбран товар */}
            {selectedProduct && (
        <ProductPopup 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAdd={addToCart} 
        />
      )}

      {/* Корзину показываем ТОЛЬКО если открыта */}
      {isCartOpen && (
        <CartPopup 
          cart={cart} 
          onClose={() => setIsCartOpen(false)} 
          onUpdateCart={setCart} 
        />
      )}

      <footer className="footer">© 2026 Пекарня «Тёплый край». Все права защищены.</footer>
    </main>
  )
}
export default App