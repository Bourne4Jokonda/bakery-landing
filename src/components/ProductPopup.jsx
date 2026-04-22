// src/components/ProductPopup.jsx
import React from 'react'
import './Popup.css'

export default function ProductPopup({ product, onClose, onAddToCart, quantity, onAdd, onRemove }) {
  if (!product) return null

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup product-popup" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        
        {product.image && (
          <img src={product.image} alt={product.name} className="popup-image" />
        )}
        
        <h2>{product.name}</h2>
        <p className="popup-description">{product.description}</p>
        <div className="popup-price">{product.price} ₽</div>
        
        {quantity > 0 ? (
          <div className="quantity-control-popup">
            <button className="qty-btn" onClick={onRemove}>−</button>
            <span className="qty-value">{quantity}</span>
            <button className="qty-btn" onClick={onAdd}>+</button>
          </div>
        ) : (
          <button className="add-to-cart-btn" onClick={onAddToCart}>
            В корзину
          </button>
        )}
      </div>
    </div>
  )
}