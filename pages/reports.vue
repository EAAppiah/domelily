<template>
  <div class="pb-20 lg:pb-0">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Sales Reports</h2>
      <p class="text-gray-600">Analyze your business performance with real-time data</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Summary Cards -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100">
            <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Revenue</p>
            <p class="text-2xl font-semibold text-gray-900">₵{{ totalRevenue.toFixed(2) }}</p>
            <p class="text-xs text-green-600 flex items-center mt-1">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-1 inline-block"></span>
              Live
            </p>
          </div>
        </div>
      </div>

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

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-orange-100">
            <svg class="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Avg. Transaction</p>
            <p class="text-2xl font-semibold text-gray-900">₵{{ averageTransaction.toFixed(2) }}</p>
            <p class="text-xs text-orange-600">Per sale</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Top Services -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Top Services</h3>
          <div class="text-xs text-gray-500">By revenue</div>
        </div>
        
        <div class="space-y-3">
          <div v-if="topServices.length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
            <p>No sales data yet</p>
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
              <div class="font-semibold text-green-600">₵{{ service.revenue.toFixed(2) }}</div>
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
        
        <div class="space-y-3">
          <div v-if="paymentMethods.length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
            <p>No payment data yet</p>
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
              <div class="font-semibold">₵{{ method.total.toFixed(2) }}</div>
              <div class="text-xs text-gray-500">{{ ((method.total / totalRevenue) * 100).toFixed(1) }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Today's Performance -->
    <div class="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Today's Performance</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ todayStats.transactions }}</div>
          <div class="text-sm text-gray-600">Transactions Today</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">₵{{ todayStats.revenue.toFixed(2) }}</div>
          <div class="text-sm text-gray-600">Revenue Today</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600">₵{{ todayStats.average.toFixed(2) }}</div>
          <div class="text-sm text-gray-600">Avg. per Transaction</div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <button
        @click="printReport"
        class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold inline-flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
        </svg>
        <span>Print Report</span>
      </button>
      
      <button
        @click="exportReport"
        :disabled="!transactions || transactions.length === 0"
        class="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold inline-flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
        <span>Export Report (CSV)</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const { transactions, customers, services } = useFirebaseData()

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

const printReport = () => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank')
  
  // Get current date for the report
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  // Build the print content
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sales Report - ${reportDate}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 5px 0; color: #666; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { border: 1px solid #ddd; padding: 15px; text-align: center; }
        .summary-card h3 { margin: 0 0 10px 0; font-size: 14px; color: #666; }
        .summary-card .value { font-size: 24px; font-weight: bold; color: #333; }
        .summary-card .label { font-size: 12px; color: #666; margin-top: 5px; }
        .section { margin-bottom: 30px; }
        .section h2 { border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px; }
        .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .service-item, .payment-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .service-item:last-child, .payment-item:last-child { border-bottom: none; }
        .rank { background: #007bff; color: white; border-radius: 50%; width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; margin-right: 10px; }
        @media print {
          body { margin: 0; }
          .header { break-after: avoid; }
          .section { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Sales Report</h1>
        <p>Generated on ${reportDate}</p>
        <p>Business Performance Summary</p>
      </div>
      
      <div class="summary">
        <div class="summary-card">
          <h3>Total Revenue</h3>
          <div class="value">₵${totalRevenue.value.toFixed(2)}</div>
          <div class="label">All Time</div>
        </div>
        <div class="summary-card">
          <h3>Total Transactions</h3>
          <div class="value">${transactions.value?.length || 0}</div>
          <div class="label">All Time</div>
        </div>
        <div class="summary-card">
          <h3>Total Customers</h3>
          <div class="value">${customers.value?.length || 0}</div>
          <div class="label">Registered</div>
        </div>
        <div class="summary-card">
          <h3>Avg. Transaction</h3>
          <div class="value">₵${averageTransaction.value.toFixed(2)}</div>
          <div class="label">Per Sale</div>
        </div>
      </div>
      
      <div class="section">
        <h2>Today's Performance</h2>
        <div class="summary">
          <div class="summary-card">
            <h3>Transactions Today</h3>
            <div class="value">${todayStats.value.transactions}</div>
          </div>
          <div class="summary-card">
            <h3>Revenue Today</h3>
            <div class="value">₵${todayStats.value.revenue.toFixed(2)}</div>
          </div>
          <div class="summary-card">
            <h3>Avg. per Transaction</h3>
            <div class="value">₵${todayStats.value.average.toFixed(2)}</div>
          </div>
        </div>
      </div>
      
      <div class="two-column">
        <div class="section">
          <h2>Top Services (By Revenue)</h2>
          ${topServices.value.length === 0 ? 
            '<p style="text-align: center; color: #666;">No sales data yet</p>' :
            topServices.value.map((service, index) => `
              <div class="service-item">
                <div>
                  <span class="rank">${index + 1}</span>
                  <strong>${service.name}</strong>
                  <div style="font-size: 12px; color: #666;">${service.quantity} sold</div>
                </div>
                <div style="text-align: right;">
                  <strong>₵${service.revenue.toFixed(2)}</strong>
                  <div style="font-size: 12px; color: #666;">${((service.revenue / totalRevenue.value) * 100).toFixed(1)}%</div>
                </div>
              </div>
            `).join('')
          }
        </div>
        
        <div class="section">
          <h2>Payment Methods</h2>
          ${paymentMethods.value.length === 0 ? 
            '<p style="text-align: center; color: #666;">No payment data yet</p>' :
            paymentMethods.value.map(method => `
              <div class="payment-item">
                <div>
                  <strong style="text-transform: capitalize;">${method.method}</strong>
                  <div style="font-size: 12px; color: #666;">${method.count} transactions</div>
                </div>
                <div style="text-align: right;">
                  <strong>₵${method.total.toFixed(2)}</strong>
                  <div style="font-size: 12px; color: #666;">${((method.total / totalRevenue.value) * 100).toFixed(1)}%</div>
                </div>
              </div>
            `).join('')
          }
        </div>
      </div>
    </body>
    </html>
  `
  
  printWindow.document.write(printContent)
  printWindow.document.close()
  
  // Wait for content to load, then print
  printWindow.onload = () => {
    printWindow.print()
    printWindow.close()
  }
  
  // Success notification
  const notification = document.createElement('div')
  notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
  notification.textContent = 'Print dialog opened!'
  document.body.appendChild(notification)
  setTimeout(() => notification.remove(), 3000)
}

const exportReport = () => {
  if (!transactions.value || transactions.value.length === 0) return
  
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
  
  // Success notification
  const notification = document.createElement('div')
  notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
  notification.textContent = 'Report exported successfully!'
  document.body.appendChild(notification)
  setTimeout(() => notification.remove(), 3000)
}
</script>