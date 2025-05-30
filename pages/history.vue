<template>
  <div class="pb-20 lg:pb-0">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Transaction History</h2>
        <p class="text-gray-600">View all completed transactions in real-time</p>
      </div>
      <div>
        <button
          @click="printReport"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
          </svg>
          <span>Print Report</span>
        </button>
      </div>
    </div>

    <!-- Date Filter Section -->
    <div class="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
      <div class="flex flex-col gap-4">
        <h3 class="text-lg font-semibold text-gray-900">Filter Transactions</h3>
        
        <!-- Date Range Inputs -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              v-model="dateFilter.from"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              v-model="dateFilter.to"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
          </div>
        </div>
        
        <!-- Quick Filter Buttons -->
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="grid grid-cols-2 sm:flex gap-2 flex-1">
            <button
              @click="setQuickFilter('today')"
              :class="quickFilter === 'today' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              class="px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              Today
            </button>
            <button
              @click="setQuickFilter('week')"
              :class="quickFilter === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              class="px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              This Week
            </button>
            <button
              @click="setQuickFilter('month')"
              :class="quickFilter === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              class="px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              This Month
            </button>
            <button
              @click="setQuickFilter('all')"
              :class="quickFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              class="px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              All Time
            </button>
          </div>
          
          <!-- Clear Filter -->
          <button
            @click="clearFilter"
            class="text-gray-500 hover:text-gray-700 text-sm font-medium py-2 sm:py-0"
          >
            Clear Filter
          </button>
        </div>
      </div>
      
      <!-- Filter Summary -->
      <div v-if="isFiltered" class="mt-4 p-3 bg-blue-50 rounded-lg">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span class="text-sm text-blue-800">
            <span class="font-medium">Filtered:</span>
            {{ filteredTransactions.length }} transactions
            <span v-if="dateFilter.from || dateFilter.to" class="block sm:inline">
              {{ getFilterDateRange() }}
            </span>
          </span>
          <span class="text-sm font-semibold text-blue-900">
            Revenue: {{ formatCurrency(filteredTotalRevenue) }}
          </span>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div class="p-4 sm:p-6 border-b border-gray-200">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-sm text-gray-600">{{ isFiltered ? 'Filtered Results' : 'Live Updates' }}</span>
            </div>
            <div class="text-sm text-gray-600">
              Total Transactions: <span class="font-semibold">{{ filteredTransactions?.length || 0 }}</span>
            </div>
            <div class="text-sm text-gray-600">
              Total Revenue: <span class="font-semibold text-green-600">{{ formatCurrency(filteredTotalRevenue) }}</span>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <span class="text-xs text-gray-500">{{ isFiltered ? 'Filtered' : 'Auto-refresh' }}</span>
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
          <div v-else-if="filteredTransactions.length === 0" class="text-center py-12 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
            <p class="text-lg font-medium">{{ isFiltered ? 'No transactions found' : 'No transactions yet' }}</p>
            <p class="text-sm">{{ isFiltered ? 'Try adjusting your date filter' : 'Your completed sales will appear here' }}</p>
          </div>
          
          <!-- Transaction List -->
          <div v-else>
            <div v-for="transaction in filteredTransactions" :key="transaction.id" class="border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors">
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

    <!-- Hidden Print Report -->
    <div id="print-report" style="display: none;">
      <div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 15px;">
          <h1 style="font-size: 24px; font-weight: bold; margin: 0 0 5px 0;">Domemily Enterprise</h1>
          <h2 style="font-size: 18px; margin: 0 0 10px 0;">{{ isFiltered ? 'Filtered Transaction Report' : 'Transaction Report' }}</h2>
          <p style="margin: 0; color: #666;">Generated on {{ formatDateTime(Date.now()) }}</p>
          <p v-if="isFiltered" style="margin: 5px 0 0 0; color: #666; font-size: 11px;">{{ getFilterDateRange() }}</p>
        </div>
        
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f5f5f5; border: 1px solid #ddd;">
          <h3 style="margin: 0 0 10px 0; font-size: 16px;">Summary</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Total Transactions:</span>
            <span style="font-weight: bold;">{{ filteredTransactions?.length || 0 }}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Total Revenue:</span>
            <span style="font-weight: bold; color: #16a34a;">{{ formatCurrency(filteredTotalRevenue) }}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Average Transaction:</span>
            <span style="font-weight: bold;">{{ formatCurrency(filteredAverageTransaction) }}</span>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 15px 0; font-size: 16px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Payment Methods</h3>
          <div v-for="(count, method) in filteredPaymentMethodSummary" :key="method" style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="text-transform: capitalize;">{{ method }}:</span>
            <span>{{ count }} transactions</span>
          </div>
        </div>
        
        <div>
          <h3 style="margin: 0 0 15px 0; font-size: 16px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Transaction Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f9f9f9; border-bottom: 2px solid #ddd;">
                <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Date/Time</th>
                <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Customer</th>
                <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Items</th>
                <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Payment</th>
                <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in filteredTransactions" :key="transaction.id" style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px; border: 1px solid #ddd; font-size: 10px;">{{ formatDateTime(transaction.timestamp) }}</td>
                <td style="padding: 8px; border: 1px solid #ddd; font-size: 10px;">
                  {{ transaction.customer?.name || 'Walk-in' }}
                </td>
                <td style="padding: 8px; border: 1px solid #ddd; font-size: 10px;">
                  <div v-for="item in transaction.items" :key="item.id">
                    {{ item.quantity }}x {{ item.name }}
                  </div>
                </td>
                <td style="padding: 8px; border: 1px solid #ddd; font-size: 10px; text-transform: capitalize;">
                  {{ transaction.paymentMethod }}
                </td>
                <td style="padding: 8px; border: 1px solid #ddd; font-size: 10px; text-align: right; font-weight: bold;">
                  {{ formatCurrency(transaction.total) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 10px; color: #666;">
          <p style="margin: 0;">Report generated by Domemily Enterprise - {{ formatDateTime(Date.now()) }}</p>
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

// Date filter state
const dateFilter = ref({
  from: '',
  to: ''
})
const quickFilter = ref('all')

// Helper function to get timestamp from transaction
const getTransactionTimestamp = (transaction) => {
  const timestamp = transaction.timestamp
  return typeof timestamp === 'number' 
    ? timestamp 
    : timestamp?.toMillis?.() || 0
}

// Computed properties for filtered data
const filteredTransactions = computed(() => {
  if (!transactions.value) return []
  
  if (!dateFilter.value.from && !dateFilter.value.to) {
    return transactions.value
  }
  
  const fromDate = dateFilter.value.from ? new Date(dateFilter.value.from).getTime() : 0
  const toDate = dateFilter.value.to ? new Date(dateFilter.value.to).getTime() + (24 * 60 * 60 * 1000 - 1) : Infinity
  
  return transactions.value.filter(transaction => {
    const transactionTime = getTransactionTimestamp(transaction)
    return transactionTime >= fromDate && transactionTime <= toDate
  })
})

const isFiltered = computed(() => {
  return dateFilter.value.from || dateFilter.value.to
})

const filteredTotalRevenue = computed(() => {
  return filteredTransactions.value.reduce((sum, transaction) => sum + (transaction.total || 0), 0)
})

const filteredAverageTransaction = computed(() => {
  if (filteredTransactions.value.length === 0) return 0
  return filteredTotalRevenue.value / filteredTransactions.value.length
})

const filteredPaymentMethodSummary = computed(() => {
  const summary = {}
  filteredTransactions.value.forEach(transaction => {
    const method = transaction.paymentMethod || 'unknown'
    summary[method] = (summary[method] || 0) + 1
  })
  return summary
})

// Legacy computed properties for backward compatibility
const totalRevenue = computed(() => filteredTotalRevenue.value)
const averageTransaction = computed(() => filteredAverageTransaction.value)
const paymentMethodSummary = computed(() => filteredPaymentMethodSummary.value)

// Date filter functions
const setQuickFilter = (period) => {
  quickFilter.value = period
  const today = new Date()
  
  switch (period) {
    case 'today':
      dateFilter.value.from = today.toISOString().split('T')[0]
      dateFilter.value.to = today.toISOString().split('T')[0]
      break
    case 'week':
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay())
      dateFilter.value.from = weekStart.toISOString().split('T')[0]
      dateFilter.value.to = today.toISOString().split('T')[0]
      break
    case 'month':
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      dateFilter.value.from = monthStart.toISOString().split('T')[0]
      dateFilter.value.to = today.toISOString().split('T')[0]
      break
    case 'all':
      dateFilter.value.from = ''
      dateFilter.value.to = ''
      break
  }
}

const clearFilter = () => {
  dateFilter.value.from = ''
  dateFilter.value.to = ''
  quickFilter.value = 'all'
}

const getFilterDateRange = () => {
  if (dateFilter.value.from && dateFilter.value.to) {
    return `from ${dateFilter.value.from} to ${dateFilter.value.to}`
  } else if (dateFilter.value.from) {
    return `from ${dateFilter.value.from}`
  } else if (dateFilter.value.to) {
    return `until ${dateFilter.value.to}`
  }
  return ''
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

// Print function
const printReport = () => {
  const printContent = document.getElementById('print-report')
  const originalContent = document.body.innerHTML
  
  document.body.innerHTML = printContent.innerHTML
  window.print()
  document.body.innerHTML = originalContent
  
  // Re-initialize Vue after restoring content
  setTimeout(() => {
    location.reload()
  }, 100)
}

// Simulate loading for demonstration
onMounted(() => {
  transactionsLoading.value = true
  setTimeout(() => {
    transactionsLoading.value = false
  }, 1200)
})
</script>