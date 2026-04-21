import React from 'react'
import './Popup.css'

export default function ProductPopup({ product, onClose, onAdd }) {
  if (!product) return null
  
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <img src={product.img} alt={product.name} />
        <h2>{product.name}</h2>
        <p>{product.desc}</p>
        <div className="popup-footer">
          <span className="price">{product.price} ₽</span>
          <button onClick={() => { onAdd(product); onClose() }}>В корзину</button>
        </div>
      </div>
    </div>
  )
}