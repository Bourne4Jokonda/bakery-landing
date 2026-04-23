// src/utils/loadProducts.js
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'

export async function loadProducts() {
  try {
    const snapshot = await getDocs(collection(db, 'products'))
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    console.log('Загружено товаров:', products.length)
    return products
  } catch (error) {
    console.error('Ошибка загрузки:', error)
    return []
  }
}