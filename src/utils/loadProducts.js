// src/utils/loadProducts.js

export async function loadProducts() {
  const SHEET_ID = '1Oz7FMWLaEdqtK_Tu_JvQyCwsXK69w-cpRWUAmib007Y';
  const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    
    // Google возвращает JSON с обёрткой, очищаем её
    const jsonText = text.substring(47).slice(0, -2);
    const data = JSON.parse(jsonText);
    
    // Преобразуем в массив товаров
    const products = data.table.rows.map((row, index) => {
      const cells = row.c || [];
      return {
        id: index + 1,
        name: cells[1]?.v || '',           // Column B: name
        description: cells[2]?.v || '',    // Column C: description  
        price: cells[3]?.v || 0,           // Column D: price
        image: cells[4]?.v || ''           // Column E: image URL
      };
    }).filter(p => p.name); // убираем пустые строки

    console.log('Загружено товаров:', products.length);
    return products;
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    return [];
  }
}