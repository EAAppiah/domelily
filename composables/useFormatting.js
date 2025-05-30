export const useFormatting = () => {
  const formatCurrency = (amount) => {
    return `₵${(amount || 0).toFixed(2)}`
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown'
    return new Date(timestamp).toLocaleDateString()
  }

  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'Unknown'
    return new Date(timestamp).toLocaleString()
  }

  const isRecentTransaction = (timestamp, minutes = 5) => {
    if (!timestamp) return false
    const now = Date.now()
    const transactionTime = typeof timestamp === 'number' ? timestamp : timestamp.toMillis?.() || 0
    return (now - transactionTime) < minutes * 60 * 1000
  }

  return {
    formatCurrency,
    formatDate,
    formatDateTime,
    isRecentTransaction
  }
}