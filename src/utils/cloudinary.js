export const CLOUDINARY_CONFIG = {
  cloudName: 'dmhfqxswo',
  apiKey: '721679935591647',
  uploadPreset: 'bakery-uploads' // создадим ниже
}

export const uploadToCloudinary = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset)
  formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
    { method: 'POST', body: formData }
  )
  
  const data = await response.json()
  if (!response.ok) throw new Error(data.error?.message || 'Ошибка загрузки')
  
  return data.secure_url // прямая ссылка на изображение
}