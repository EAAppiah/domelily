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
              Total Revenue: <span class="font-semibold text-green-600">{{ formatCurrency(totalRevenue) }}</span>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <span class="text-xs text-gray-500">Auto-refresh</span>
              <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <div class="max-h-96 overflow-y-auto">
          <!-- Loading State -->
          <div v-if="transactionsLoading" class="space-y-4 p-4">
            <div v-for="n in 5" :key="n" class="border-b border-gray-100 p-4 animate-pulse">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <div class="h-4 bg-gray-300 rounded w-32"></div>
                    <div class="h-6 bg-gray-300 rounded w-16"></div>
                    <div class="h-5 bg-gray-300 rounded w-10"></div>
                  </div>
                  
                  <div class="mb-3">
                    <div class="h-4 bg-gray-200 rounded w-40"></div>
                  </div>
                  
                  <div class="space-y-1">
                    <div class="h-3 bg-gray-200 rounded w-full"></div>
                    <div class="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
                
                <div class="text-right">
                  <div class="h-6 bg-gray-300 rounded w-20 mb-1"></div>
                  <div class="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="!transactions || transactions.length === 0" class="text-center py-12 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
            <p class="text-lg font-medium">No transactions yet</p>
            <p class="text-sm">Your completed sales will appear here</p>
          </div>
          
          <!-- Transaction List -->
          <div v-else>
            <div v-for="transaction in transactions" :key="transaction.id" class="border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <span class="text-sm font-medium text-gray-900">
                      {{ formatDateTime(transaction.timestamp) }}
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
                      <span class="font-medium">{{ formatCurrency(item.price * item.quantity) }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="text-right">
                  <div class="text-xl font-bold text-green-600">
                    {{ formatCurrency(transaction.total) }}
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const { transactions } = useFirebaseData()
const { formatCurrency, formatDateTime, isRecentTransaction } = useFormatting()

const transactionsLoading = ref(false)

const totalRevenue = computed(() => {
  if (!transactions.value) return 0
  return transactions.value.reduce((sum, transaction) => sum + (transaction.total || 0), 0)
})

const getPaymentMethodColor = (method) => {
  const colors = {
    cash: 'bg-green-100 text-green-800',
    card: 'bg-blue-100 text-blue-800',
    credits: 'bg-purple-100 text-purple-800',
    mixed: 'bg-orange-100 text-orange-800'
  }
  return colors[method] || 'bg-gray-100 text-gray-800'
}

// Simulate loading for demonstration
onMounted(() => {
  transactionsLoading.value = true
  setTimeout(() => {
    transactionsLoading.value = false
  }, 1200)
})
</script>