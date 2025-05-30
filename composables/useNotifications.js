// composables/useNotifications.js
export const useNotifications = () => {
  const showNotification = (message, type = 'success', duration = 3000) => {
    const notification = document.createElement('div')
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse`
    notification.textContent = message
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.opacity = '0'
      notification.style.transform = 'translateX(100%)'
      notification.style.transition = 'all 0.3s ease'
      setTimeout(() => notification.remove(), 300)
    }, duration)
  }

  const showSuccess = (message) => showNotification(message, 'success')
  const showError = (message) => showNotification(message, 'error')
  const showInfo = (message) => showNotification(message, 'info')

  return {
    showNotification,
    showSuccess,
    showError,
    showInfo
  }
}