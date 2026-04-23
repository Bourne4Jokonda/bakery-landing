import { useState, useEffect } from 'react'
import { db, auth } from '../firebase'
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { uploadToCloudinary } from '../utils/cloudinary'
import './AdminPanel.css'

export default function AdminPanel() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ name: '', description: '', price: '' })
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { loadProducts() }, [])

  const loadProducts = async () => {
    const snapshot = await getDocs(collection(db, 'products'))
    setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!image) return alert('Выберите фото')
    
    setLoading(true)
    try {
      const imageUrl = await uploadToCloudinary(image)
      
      await addDoc(collection(db, 'products'), {
        ...form,
        price: Number(form.price),
        image: imageUrl,
        createdAt: new Date()
      })
      
      setForm({ name: '', description: '', price: '' })
      setImage(null)
      loadProducts()
      alert('✅ Товар добавлен!')
    } catch (err) {
      alert('❌ Ошибка: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Удалить товар?')) {
      await deleteDoc(doc(db, 'products', id))
      loadProducts()
    }
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
      
      <form onSubmit={handleUpload} className="product-form">
        <input placeholder="Название" value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})} required />
        <textarea placeholder="Описание" value={form.description} 
          onChange={e => setForm({...form, description: e.target.value})} />
        <input type="number" placeholder="Цена (₽)" value={form.price} 
          onChange={e => setForm({...form, price: e.target.value})} required />
        <input type="file" accept="image/*" 
          onChange={e => setImage(e.target.files[0])} required />
        <button type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : 'Добавить товар'}
        </button>
      </form>

      <div className="products-list">
        {products.map(p => (
          <div key={p.id} className="product-item">
            <img src={p.image} alt={p.name} />
            <div>
              <strong>{p.name}</strong>
              <p>{p.price} ₽</p>
            </div>
            <button onClick={() => handleDelete(p.id)}>🗑️</button>
          </div>
        ))}
      </div>
    </div>
  )
}