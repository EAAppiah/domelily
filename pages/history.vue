<template>
  <div class="pb-20 lg:pb-0">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Transaction History</h2>
      <p class="text-gray-600">View all completed transactions in real-time</p>
    </div>

    <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-sm text-gray-600">Live Updates</span>
            </div>
            <div class="text-sm text-gray-600">
              Total Transactions: <span class="font-semibold">{{ transactions?.length || 0 }}</span>
            </div>
            <div class="text-sm text-gray-600">
              Total Revenue: <span class="font-semibold text-green-600">${{ totalRevenue.toFixed(2) }}</span>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xs text-gray-500">Auto-refresh</span>
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <div class="max-h-96 overflow-y-auto">
          <div v-if="!transactions || transactions.length === 0" class="text-center py-12 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
            <p class="text-lg font-medium">No transactions yet</p>
            <p class="text-sm">Your completed sales will appear here</p>
          </div>
          
          <div v-for="transaction in transactions" :key="transaction.id" class="border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <span class="text-sm font-medium text-gray-900">
                    {{ formatDate(transaction.timestamp) }}
                  </span>
                  <span class="text-xs px-3 py-1 rounded-full font-medium" :class="getPaymentMethodColor(transaction.paymentMethod)">
                    {{ transaction.paymentMethod }}
                  </span>
                  <span v-if="isRecentTransaction(transaction.timestamp)" class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                    New
                  </span>
                </div>
                
                <div class="text-sm text-gray-600 mb-3">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                    <span v-if="transaction.customer">
                      {{ transaction.customer.name }}
                    </span>
                    <span v-else class="italic">Walk-in Customer</span>
                  </div>
                </div>
                
                <div class="space-y-1">
                  <div v-for="item in transaction.items" :key="item.id" class="text-sm text-gray-700 flex justify-between">
                    <span>{{ item.quantity }}x {{ item.name }}</span>
                    <span class="font-medium">${{ (item.price * item.quantity).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
              
              <div class="text-right">
                <div class="text-xl font-bold text-green-600">
                  ${{ transaction.total?.toFixed(2) || '0.00' }}
                </div>
                <div class="text-xs text-gray-500">
                  ID: {{ transaction.id?.slice(-6) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { transactions } = useFirebaseData()

const totalRevenue = computed(() => {
  if (!transactions.value) return 0
  return transactions.value.reduce((sum, transaction) => sum + (transaction.total || 0), 0)
})

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown'
  return new Date(timestamp).toLocaleString()
}

const isRecentTransaction = (timestamp) => {
  if (!timestamp) return false
  const now = Date.now()
  const transactionTime = typeof timestamp === 'number' ? timestamp : timestamp.toMillis?.() || 0
  return (now - transactionTime) < 5 * 60 * 1000 // 5 minutes
}

const getPaymentMethodColor = (method) => {
  const colors = {
    cash: 'bg-green-100 text-green-800',
    card: 'bg-blue-100 text-blue-800',
    credits: 'bg-purple-100 text-purple-800',
    mixed: 'bg-orange-100 text-orange-800'
  }
  return colors[method] || 'bg-gray-100 text-gray-800'
}
</script>