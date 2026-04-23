import { useState, useEffect } from 'react'
import { db, auth } from '../firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { uploadToCloudinary } from '../utils/cloudinary'
import './AdminPanel.css'

export default function AdminPanel() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ name: '', description: '', price: '' })
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { 
    loadProducts() 
  }, [])

  const loadProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'products'))
      const productsList = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }))
      setProducts(productsList)
    } catch (err) {
      console.error('Ошибка загрузки:', err)
      alert('❌ Не удалось загрузить товары')
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!image && !editingId) return alert('Выберите фото')
    
    setLoading(true)
    try {
      let imageUrl = editingId ? products.find(p => p.id === editingId)?.image : null
      
      // Если загрузили новое фото
      if (image) {
        imageUrl = await uploadToCloudinary(image)
      }
      
      const productData = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        image: imageUrl,
        updatedAt: new Date()
      }

      if (editingId) {
        // Обновляем существующий
        await updateDoc(doc(db, 'products', editingId), productData)
        alert('✅ Товар обновлён!')
      } else {
        // Добавляем новый
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: new Date()
        })
        alert('✅ Товар добавлен!')
      }
      
      // Сброс формы
      setForm({ name: '', description: '', price: '' })
      setImage(null)
      setEditingId(null)
      loadProducts()
    } catch (err) {
      alert('❌ Ошибка: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString()
    })
    setEditingId(product.id)
    setImage(null)
    // Прокрутка к форме
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (confirm('Удалить товар?')) {
      try {
        await deleteDoc(doc(db, 'products', id))
        loadProducts()
        alert('✅ Товар удалён')
      } catch (err) {
        alert('❌ Ошибка при удалении')
      }
    }
  }

  const handleCancel = () => {
    setForm({ name: '', description: '', price: '' })
    setImage(null)
    setEditingId(null)
  }

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/')
  }

  return (
    <div className="admin-panel">
      <header>
        <h2>🥐 Админ-панель</h2>
        <button onClick={handleLogout}>Выйти</button>
      </header>
      
      {/* Форма добавления/редактирования */}
      <form onSubmit={handleUpload} className="product-form">
        <h3>{editingId ? '✏️ Редактировать товар' : '➕ Добавить товар'}</h3>
        <input 
          placeholder="Название" 
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})} 
          required 
        />
        <textarea 
          placeholder="Описание" 
          value={form.description} 
          onChange={e => setForm({...form, description: e.target.value})} 
        />
        <input 
          type="number" 
          placeholder="Цена (₽)" 
          value={form.price} 
          onChange={e => setForm({...form, price: e.target.value})} 
          required 
        />
        <input 
          type="file" 
          accept="image/*" 
          onChange={e => setImage(e.target.files[0])} 
        />
        {editingId && <small>💡 Оставьте фото пустым, чтобы не менять</small>}
        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? 'Загрузка...' : (editingId ? '💾 Сохранить' : '➕ Добавить')}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} className="cancel-btn">
              ✖ Отмена
            </button>
          )}
        </div>
      </form>

      {/* Список товаров */}
      <div className="products-list">
        <h3>📦 Товаров: {products.length}</h3>
        {products.length === 0 ? (
          <p className="no-products">Пока нет товаров. Добавьте первый!</p>
        ) : (
          products.map(p => (
            <div key={p.id} className="product-item">
              <img src={p.image} alt={p.name} onError={(e) => e.target.src='https://via.placeholder.com/100'} />
              <div className="product-info">
                <strong>{p.name}</strong>
                <p className="price">{p.price} ₽</p>
                {p.description && <p className="desc">{p.description}</p>}
              </div>
              <div className="product-actions">
                <button onClick={() => handleEdit(p)} className="edit-btn">✏️</button>
                <button onClick={() => handleDelete(p.id)} className="delete-btn">🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}