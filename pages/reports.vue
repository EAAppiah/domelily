<template>
  <div class="pb-20 lg:pb-0">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Sales Reports</h2>
      <p class="text-gray-600">Analyze your business performance with real-time data</p>
    </div>

    <!-- Summary Cards with Loading States -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-if="reportsLoading" v-for="n in 4" :key="n" class="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-gray-200 w-12 h-12"></div>
          <div class="ml-4 flex-1">
            <div class="h-4 bg-gray-300 rounded w-24 mb-2"></div>
            <div class="h-6 bg-gray-300 rounded w-16 mb-1"></div>
            <div class="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
      </div>

      <template v-else>
        <!-- Total Revenue -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100">
              <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Revenue</p>
              <p class="text-2xl font-semibold text-gray-900">{{ formatCurrency(totalRevenue) }}</p>
              <p class="text-xs text-green-600 flex items-center mt-1">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-1 inline-block"></span>
                Live
              </p>
            </div>
          </div>
        </div>

        <!-- Total Transactions -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100">
              <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Transactions</p>
              <p class="text-2xl font-semibold text-gray-900">{{ transactions?.length || 0 }}</p>
              <p class="text-xs text-blue-600">All time</p>
            </div>
          </div>
        </div>

        <!-- Total Customers -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100">
              <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Customers</p>
              <p class="text-2xl font-semibold text-gray-900">{{ customers?.length || 0 }}</p>
              <p class="text-xs text-purple-600">Registered</p>
            </div>
          </div>
        </div>

        <!-- Average Transaction -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-orange-100">
              <svg class="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Avg. Transaction</p>
              <p class="text-2xl font-semibold text-gray-900">{{ formatCurrency(averageTransaction) }}</p>
              <p class="text-xs text-orange-600">Per sale</p>
            </div>
          </div>
        </div>
      </template>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Top Services -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Top Services</h3>
          <div class="text-xs text-gray-500">By revenue</div>
        </div>
        
        <!-- Loading State for Top Services -->
        <div v-if="analyticsLoading" class="space-y-3">
          <div v-for="n in 5" :key="n" class="flex justify-between items-center p-3 bg-gray-50 rounded-lg animate-pulse">
            <div class="flex items-center space-x-3">
              <div class="w-6 h-6 bg-gray-300 rounded-full"></div>
              <div>
                <div class="h-4 bg-gray-300 rounded w-20 mb-1"></div>
                <div class="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div class="text-right">
              <div class="h-4 bg-gray-300 rounded w-16 mb-1"></div>
              <div class="h-3 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        </div>
        
        <div v-else class="space-y-3">
          <div v-if="topServices.length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
            <p class="text-lg font-medium">No sales data yet</p>
          </div>
          
          <div v-for="(service, index) in topServices" :key="service.name" class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {{ index + 1 }}
              </div>
              <div>
                <span class="font-medium">{{ service.name }}</span>
                <div class="text-sm text-gray-500">{{ service.quantity }} sold</div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-semibold text-green-600">{{ formatCurrency(service.revenue) }}</div>
              <div class="text-xs text-gray-500">{{ ((service.revenue / totalRevenue) * 100).toFixed(1) }}%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Payment Methods</h3>
          <div class="text-xs text-gray-500">Distribution</div>
        </div>
        
        <!-- Loading State for Payment Methods -->
        <div v-if="analyticsLoading" class="space-y-3">
          <div v-for="n in 4" :key="n" class="flex justify-between items-center p-3 bg-gray-50 rounded-lg animate-pulse">
            <div class="flex items-center space-x-3">
              <div class="w-4 h-4 bg-gray-300 rounded-full"></div>
              <div>
                <div class="h-4 bg-gray-300 rounded w-16 mb-1"></div>
                <div class="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <div class="text-right">
              <div class="h-4 bg-gray-300 rounded w-16 mb-1"></div>
              <div class="h-3 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        </div>
        
        <div v-else class="space-y-3">
          <div v-if="paymentMethods.length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
            <p class="text-lg font-medium">No payment data yet</p>
          </div>
          
          <div v-for="method in paymentMethods" :key="method.method" class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
              <span class="w-4 h-4 rounded-full" :class="getPaymentMethodBg(method.method)"></span>
              <div>
                <span class="font-medium capitalize">{{ method.method }}</span>
                <div class="text-sm text-gray-500">{{ method.count }} transactions</div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-semibold">{{ formatCurrency(method.total) }}</div>
              <div class="text-xs text-gray-500">{{ ((method.total / totalRevenue) * 100).toFixed(1) }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Today's Performance -->
    <div class="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Today's Performance</h3>
      
      <!-- Loading State for Today's Performance -->
      <div v-if="todayStatsLoading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="n in 3" :key="n" class="text-center animate-pulse">
          <div class="h-8 bg-gray-300 rounded w-16 mx-auto mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ todayStats.transactions }}</div>
          <div class="text-sm text-gray-600">Transactions Today</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ formatCurrency(todayStats.revenue) }}</div>
          <div class="text-sm text-gray-600">Revenue Today</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600">{{ formatCurrency(todayStats.average) }}</div>
          <div class="text-sm text-gray-600">Avg. per Transaction</div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <button
        @click="exportReport"
        :disabled="!transactions || transactions.length === 0 || exportLoading.isLoading.value"
        class="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold inline-flex items-center space-x-2"
      >
        <span v-if="!exportLoading.isLoading.value">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </span>
        <span v-else>
          <svg class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
        <span>{{ exportLoading.isLoading.value ? 'Exporting...' : 'Export Report (CSV)' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const { transactions, customers, services } = useFirebaseData()
const { showSuccess, showError } = useNotifications()
const { createLoadingState } = useLoadingState()
const { formatCurrency } = useFormatting()

// Loading states
const exportLoading = createLoadingState()
const reportsLoading = ref(false)
const analyticsLoading = ref(false)
const todayStatsLoading = ref(false)

const totalRevenue = computed(() => {
  if (!transactions.value) return 0
  return transactions.value.reduce((sum, transaction) => sum + (transaction.total || 0), 0)
})

const averageTransaction = computed(() => {
  if (!transactions.value || transactions.value.length === 0) return 0
  return totalRevenue.value / transactions.value.length
})

const topServices = computed(() => {
  if (!transactions.value) return []
  
  const serviceStats = {}
  
  transactions.value.forEach(transaction => {
    if (transaction.items) {
      transaction.items.forEach(item => {
        if (!serviceStats[item.name]) {
          serviceStats[item.name] = {
            name: item.name,
            quantity: 0,
            revenue: 0
          }
        }
        serviceStats[item.name].quantity += item.quantity || 0
        serviceStats[item.name].revenue += (item.price || 0) * (item.quantity || 0)
      })
    }
  })
  
  return Object.values(serviceStats)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
})

const paymentMethods = computed(() => {
  if (!transactions.value) return []
  
  const methodStats = {}
  
  transactions.value.forEach(transaction => {
    const method = transaction.paymentMethod || 'unknown'
    if (!methodStats[method]) {
      methodStats[method] = {
        method: method,
        total: 0,
        count: 0
      }
    }
    methodStats[method].total += transaction.total || 0
    methodStats[method].count++
  })
  
  return Object.values(methodStats).sort((a, b) => b.total - a.total)
})

const todayStats = computed(() => {
  if (!transactions.value) return { transactions: 0, revenue: 0, average: 0 }
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTimestamp = today.getTime()
  
  const todayTransactions = transactions.value.filter(transaction => {
    const transactionDate = transaction.timestamp
    const transactionTimestamp = typeof transactionDate === 'number' 
      ? transactionDate 
      : transactionDate?.toMillis?.() || 0
    return transactionTimestamp >= todayTimestamp
  })
  
  const todayRevenue = todayTransactions.reduce((sum, transaction) => sum + (transaction.total || 0), 0)
  
  return {
    transactions: todayTransactions.length,
    revenue: todayRevenue,
    average: todayTransactions.length > 0 ? todayRevenue / todayTransactions.length : 0
  }
})

const getPaymentMethodBg = (method) => {
  const colors = {
    cash: 'bg-green-500',
    card: 'bg-blue-500',
    credits: 'bg-purple-500',
    mixed: 'bg-orange-500'
  }
  return colors[method] || 'bg-gray-500'
}

const exportReport = async () => {
  if (!transactions.value || transactions.value.length === 0) {
    showError('No transactions to export')
    return
  }
  
  try {
    await exportLoading.withLoading(async () => {
      // Simulate processing time for demonstration
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const csvContent = [
        ['Date', 'Customer', 'Items', 'Payment Method', 'Total'],
        ...transactions.value.map(t => [
          new Date(typeof t.timestamp === 'number' ? t.timestamp : t.timestamp?.toMillis?.() || 0).toLocaleDateString(),
          t.customer ? t.customer.name : 'Walk-in',
          t.items?.map(item => `${item.quantity}x ${item.name}`).join('; ') || '',
          t.paymentMethod || 'unknown',
          (t.total || 0).toFixed(2)
        ])
      ].map(row => row.join(',')).join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      
      showSuccess('Report exported successfully!')
    })
  } catch (error) {
    console.error('Error exporting report:', error)
    showError('Failed to export report. Please try again.')
  }
}

// Simulate loading states for demonstration
onMounted(() => {
  // Stagger loading states for better UX
  reportsLoading.value = true
  analyticsLoading.value = true
  todayStatsLoading.value = true
  
  setTimeout(() => {
    reportsLoading.value = false
  }, 800)
  
  setTimeout(() => {
    analyticsLoading.value = false
  }, 1200)
  
  setTimeout(() => {
    todayStatsLoading.value = false
  }, 1500)
})
</script>