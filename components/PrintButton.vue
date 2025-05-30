<!-- PrintButton.vue -->
<template>
  <button
    @click="handlePrint"
    :disabled="disabled"
    :class="[
      'inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors',
      disabled 
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
        : 'bg-blue-600 text-white hover:bg-blue-700'
    ]"
  >
    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
    </svg>
    <span>{{ buttonText }}</span>
  </button>
</template>

<script setup>
const props = defineProps({
  pageType: {
    type: String,
    required: true,
    validator: (value) => ['reports', 'transactions', 'customers', 'sales'].includes(value)
  },
  data: {
    type: Object,
    default: () => ({})
  },
  disabled: {
    type: Boolean,
    default: false
  },
  buttonText: {
    type: String,
    default: 'Print Report'
  }
})

const handlePrint = () => {
  const printWindow = window.open('', '_blank')
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  let printContent = ''

  switch (props.pageType) {
    case 'reports':
      printContent = generateReportsContent(reportDate)
      break
    case 'transactions':
      printContent = generateTransactionsContent(reportDate)
      break
    case 'customers':
      printContent = generateCustomersContent(reportDate)
      break
    case 'sales':
      printContent = generateSalesContent(reportDate)
      break
    default:
      printContent = generateGenericContent(reportDate)
  }

  printWindow.document.write(printContent)
  printWindow.document.close()

  printWindow.onload = () => {
    printWindow.print()
    printWindow.close()
  }

  showNotification('Print dialog opened!')
}

const generateReportsContent = (reportDate) => {
  const { totalRevenue, transactions, customers, averageTransaction, topServices, paymentMethods, todayStats } = props.data

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sales Report - ${reportDate}</title>
      ${getCommonStyles()}
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
          <div class="value">$${totalRevenue?.toFixed(2) || '0.00'}</div>
          <div class="label">All Time</div>
        </div>
        <div class="summary-card">
          <h3>Total Transactions</h3>
          <div class="value">${transactions?.length || 0}</div>
          <div class="label">All Time</div>
        </div>
        <div class="summary-card">
          <h3>Total Customers</h3>
          <div class="value">${customers?.length || 0}</div>
          <div class="label">Registered</div>
        </div>
        <div class="summary-card">
          <h3>Avg. Transaction</h3>
          <div class="value">$${averageTransaction?.toFixed(2) || '0.00'}</div>
          <div class="label">Per Sale</div>
        </div>
      </div>
      
      <div class="section">
        <h2>Today's Performance</h2>
        <div class="summary">
          <div class="summary-card">
            <h3>Transactions Today</h3>
            <div class="value">${todayStats?.transactions || 0}</div>
          </div>
          <div class="summary-card">
            <h3>Revenue Today</h3>
            <div class="value">$${todayStats?.revenue?.toFixed(2) || '0.00'}</div>
          </div>
          <div class="summary-card">
            <h3>Avg. per Transaction</h3>
            <div class="value">$${todayStats?.average?.toFixed(2) || '0.00'}</div>
          </div>
        </div>
      </div>
      
      <div class="two-column">
        <div class="section">
          <h2>Top Services (By Revenue)</h2>
          ${!topServices?.length ? 
            '<p style="text-align: center; color: #666;">No sales data yet</p>' :
            topServices.map((service, index) => `
              <div class="service-item">
                <div>
                  <span class="rank">${index + 1}</span>
                  <strong>${service.name}</strong>
                  <div style="font-size: 12px; color: #666;">${service.quantity} sold</div>
                </div>
                <div style="text-align: right;">
                  <strong>$${service.revenue.toFixed(2)}</strong>
                  <div style="font-size: 12px; color: #666;">${((service.revenue / totalRevenue) * 100).toFixed(1)}%</div>
                </div>
              </div>
            `).join('')
          }
        </div>
        
        <div class="section">
          <h2>Payment Methods</h2>
          ${!paymentMethods?.length ? 
            '<p style="text-align: center; color: #666;">No payment data yet</p>' :
            paymentMethods.map(method => `
              <div class="payment-item">
                <div>
                  <strong style="text-transform: capitalize;">${method.method}</strong>
                  <div style="font-size: 12px; color: #666;">${method.count} transactions</div>
                </div>
                <div style="text-align: right;">
                  <strong>$${method.total.toFixed(2)}</strong>
                  <div style="font-size: 12px; color: #666;">${((method.total / totalRevenue) * 100).toFixed(1)}%</div>
                </div>
              </div>
            `).join('')
          }
        </div>
      </div>
    </body>
    </html>
  `
}

const generateTransactionsContent = (reportDate) => {
  const { transactions, totalRevenue } = props.data

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Transaction History - ${reportDate}</title>
      ${getCommonStyles()}
    </head>
    <body>
      <div class="header">
        <h1>Transaction History</h1>
        <p>Generated on ${reportDate}</p>
        <p>Complete transaction records</p>
      </div>
      
      <div class="summary">
        <div class="summary-card">
          <h3>Total Transactions</h3>
          <div class="value">${transactions?.length || 0}</div>
        </div>
        <div class="summary-card">
          <h3>Total Revenue</h3>
          <div class="value">$${totalRevenue?.toFixed(2) || '0.00'}</div>
        </div>
      </div>
      
      <div class="section">
        <h2>Transaction Details</h2>
        ${!transactions?.length ? 
          '<p style="text-align: center; color: #666;">No transactions found</p>' :
          `<table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f5f5f5; border-bottom: 2px solid #ddd;">
                <th style="text-align: left; padding: 12px; border: 1px solid #ddd;">Date</th>
                <th style="text-align: left; padding: 12px; border: 1px solid #ddd;">Customer</th>
                <th style="text-align: left; padding: 12px; border: 1px solid #ddd;">Items</th>
                <th style="text-align: left; padding: 12px; border: 1px solid #ddd;">Payment</th>
                <th style="text-align: right; padding: 12px; border: 1px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map(transaction => `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px; border: 1px solid #ddd;">${new Date(transaction.timestamp).toLocaleString()}</td>
                  <td style="padding: 12px; border: 1px solid #ddd;">${transaction.customer?.name || 'Walk-in'}</td>
                  <td style="padding: 12px; border: 1px solid #ddd;">
                    ${transaction.items?.map(item => `${item.quantity}x ${item.name}`).join(', ') || 'N/A'}
                  </td>
                  <td style="padding: 12px; border: 1px solid #ddd; text-transform: capitalize;">${transaction.paymentMethod || 'Unknown'}</td>
                  <td style="padding: 12px; border: 1px solid #ddd; text-align: right; font-weight: bold;">$${transaction.total?.toFixed(2) || '0.00'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>`
        }
      </div>
    </body>
    </html>
  `
}

const generateCustomersContent = (reportDate) => {
  const { customers } = props.data

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Customer Database - ${reportDate}</title>
      ${getCommonStyles()}
    </head>
    <body>
      <div class="header">
        <h1>Customer Database</h1>
        <p>Generated on ${reportDate}</p>
        <p>Complete customer records</p>
      </div>
      
      <div class="summary">
        <div class="summary-card">
          <h3>Total Customers</h3>
          <div class="value">${customers?.length || 0}</div>
        </div>
        <div class="summary-card">
          <h3>Total Credits</h3>
          <div class="value">$${customers?.reduce((sum, c) => sum + (c.credits || 0), 0).toFixed(2) || '0.00'}</div>
        </div>
      </div>
      
      <div class="section">
        <h2>Customer Details</h2>
        ${!customers?.length ? 
          '<p style="text-align: center; color: #666;">No customers found</p>' :
          `<table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f5f5f5; border-bottom: 2px solid #ddd;">
                <th style="text-align: left; padding: 12px; border: 1px solid #ddd;">Name</th>
                <th style="text-align: right; padding: 12px; border: 1px solid #ddd;">Credits</th>
                <th style="text-align: left; padding: 12px; border: 1px solid #ddd;">Joined</th>
              </tr>
            </thead>
            <tbody>
              ${customers.map(customer => `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">${customer.name}</td>
                  <td style="padding: 12px; border: 1px solid #ddd; text-align: right; font-weight: bold; color: #059669;">$${(customer.credits || 0).toFixed(2)}</td>
                  <td style="padding: 12px; border: 1px solid #ddd;">${customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'Unknown'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>`
        }
      </div>
    </body>
    </html>
  `
}

const generateSalesContent = (reportDate) => {
  const { cart, selectedCustomer, total, services } = props.data

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Current Sale - ${reportDate}</title>
      ${getCommonStyles()}
    </head>
    <body>
      <div class="header">
        <h1>Current Sale Summary</h1>
        <p>Generated on ${reportDate}</p>
        <p>Point of Sale Information</p>
      </div>
      
      <div class="summary">
        <div class="summary-card">
          <h3>Cart Items</h3>
          <div class="value">${cart?.length || 0}</div>
        </div>
        <div class="summary-card">
          <h3>Current Total</h3>
          <div class="value">$${total?.toFixed(2) || '0.00'}</div>
        </div>
        <div class="summary-card">
          <h3>Available Services</h3>
          <div class="value">${services?.length || 0}</div>
        </div>
      </div>
      
      <div class="two-column">
        <div class="section">
          <h2>Current Cart</h2>
          ${!cart?.length ? 
            '<p style="text-align: center; color: #666;">Cart is empty</p>' :
            cart.map(item => `
              <div class="service-item">
                <div>
                  <strong>${item.name}</strong>
                  <div style="font-size: 12px; color: #666;">Quantity: ${item.quantity}</div>
                </div>
                <div style="text-align: right;">
                  <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
                  <div style="font-size: 12px; color: #666;">$${item.price} each</div>
                </div>
              </div>
            `).join('')
          }
        </div>
        
        <div class="section">
          <h2>Available Services</h2>
          ${!services?.length ? 
            '<p style="text-align: center; color: #666;">No services available</p>' :
            services.map(service => `
              <div class="payment-item">
                <div>
                  <strong>${service.name}</strong>
                </div>
                <div style="text-align: right;">
                  <strong>$${service.price}</strong>
                </div>
              </div>
            `).join('')
          }
        </div>
      </div>
      
      ${selectedCustomer ? `
        <div class="section">
          <h2>Customer Information</h2>
          <div class="summary">
            <div class="summary-card">
              <h3>Customer Name</h3>
              <div class="value" style="font-size: 18px;">${selectedCustomer.name}</div>
            </div>
            <div class="summary-card">
              <h3>Available Credits</h3>
              <div class="value">$${(selectedCustomer.credits || 0).toFixed(2)}</div>
            </div>
          </div>
        </div>
      ` : ''}
    </body>
    </html>
  `
}

const generateGenericContent = (reportDate) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Business Report - ${reportDate}</title>
      ${getCommonStyles()}
    </head>
    <body>
      <div class="header">
        <h1>Business Report</h1>
        <p>Generated on ${reportDate}</p>
        <p>General business information</p>
      </div>
      
      <div class="section">
        <h2>Report Information</h2>
        <p>This is a general business report. For specific data, please ensure the correct page type and data are provided to the print component.</p>
      </div>
    </body>
    </html>
  `
}

const getCommonStyles = () => {
  return `
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; color: #333; line-height: 1.6; }
      .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
      .header h1 { margin: 0; font-size: 28px; color: #1f2937; }
      .header p { margin: 5px 0; color: #666; }
      .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
      .summary-card { border: 1px solid #ddd; padding: 15px; text-align: center; border-radius: 8px; }
      .summary-card h3 { margin: 0 0 10px 0; font-size: 14px; color: #666; text-transform: uppercase; }
      .summary-card .value { font-size: 24px; font-weight: bold; color: #1f2937; }
      .summary-card .label { font-size: 12px; color: #666; margin-top: 5px; }
      .section { margin-bottom: 30px; }
      .section h2 { border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px; color: #1f2937; }
      .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
      .service-item, .payment-item { display: flex; justify-content: space-between; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid #eee; }
      .service-item:last-child, .payment-item:last-child { border-bottom: none; }
      .rank { background: #3b82f6; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; margin-right: 10px; font-weight: bold; }
      table { border-collapse: collapse; width: 100%; margin-top: 15px; }
      th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
      th { background-color: #f8f9fa; font-weight: bold; }
      tr:nth-child(even) { background-color: #f8f9fa; }
      @media print {
        body { margin: 0; font-size: 12px; }
        .header { break-after: avoid; }
        .section { break-inside: avoid; }
        .two-column { grid-template-columns: 1fr; gap: 20px; }
      }
    </style>
  `
}

const showNotification = (message) => {
  const notification = document.createElement('div')
  notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
  notification.textContent = message
  document.body.appendChild(notification)
  setTimeout(() => notification.remove(), 3000)
}
</script>