// src/App.jsx
import { useState, useEffect } from 'react'
import { loadProducts } from './utils/loadProducts'
import ProductPopup from './components/ProductPopup'
import CartPopup from './components/CartPopup'
import './App.css'

export default function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState({}) // {productId: quantity}
  const [activeProduct, setActiveProduct] = useState(null)
  const [showCart, setShowCart] = useState(false)

  useEffect(() => {
    loadProducts().then(data => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  const addToCart = (productId) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }))
  }

  const removeFromCart = (productId) => {
    setCart(prev => {
      const newCart = { ...prev }
      if (newCart[productId] > 1) {
        newCart[productId]--
      } else {
        delete newCart[productId]
      }
      return newCart
    })
  }

  const isInCart = (productId) => cart[productId] > 0
  const getQuantity = (productId) => cart[productId] || 0
  const getTotalItems = () => Object.values(cart).reduce((sum, qty) => sum + qty, 0)

  if (loading) return <div className="container"><p>Загрузка...</p></div>

  return (
    <div className="container">
      <header className="header">
        <h1>🥐 Пекарня «Тёплый край»</h1>
        <button className="cart-btn" onClick={() => setShowCart(true)}>
          Корзина ({getTotalItems()})
        </button>
      </header>

      <main className="grid">
        {products.map(product => (
          <div key={product.id} className="card" onClick={() => setActiveProduct(product)}>
            <div className="card-image-wrapper">
              <img src={product.image} alt={product.name} />
            </div>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="price-row">
              <span>{product.price} ₽</span>
              {isInCart(product.id) ? (
                <div className="quantity-control" onClick={e => e.stopPropagation()}>
                  <button className="qty-btn minus" onClick={() => removeFromCart(product.id)}>-</button>
                  <span className="qty-value">{getQuantity(product.id)}</span>
                  <button className="qty-btn plus" onClick={() => addToCart(product.id)}>+</button>
                </div>
              ) : (
                <button onClick={(e) => { e.stopPropagation(); addToCart(product.id); }}>
                  В корзину
                </button>
              )}
            </div>
          </div>
        ))}
      </main>

      <footer className="footer">
        © 2026 Пекарня «Тёплый край»
      </footer>

      {activeProduct && (
        <ProductPopup
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onAddToCart={() => {
            addToCart(activeProduct.id)
            setActiveProduct(null)
          }}
          quantity={getQuantity(activeProduct.id)}
          onAdd={() => addToCart(activeProduct.id)}
          onRemove={() => removeFromCart(activeProduct.id)}
        />
      )}

      {showCart && (
        <CartPopup
          cart={cart}
          products={products}
          onClose={() => setShowCart(false)}
          onAdd={(id) => addToCart(id)}
          onRemove={(id) => removeFromCart(id)}
        />
      )}
    </div>
  )
}