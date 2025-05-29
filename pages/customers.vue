<template>
  <div class="pb-20 lg:pb-0">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Customer Management</h2>
      <p class="text-gray-600">Add and manage your customers</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Add New Customer -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add New Customer</h3>
        
        <form @submit.prevent="addNewCustomer" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              v-model="newCustomer.name"
              type="text"
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Customer name"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              v-model="newCustomer.email"
              type="email"
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="customer@example.com"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              v-model="newCustomer.phone"
              type="tel"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="(555) 123-4567"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Initial Credits</label>
            <input
              v-model="newCustomer.credits"
              type="number"
              step="0.01"
              min="0"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="0.00"
            >
          </div>
          
          <button
            type="submit"
            :disabled="!newCustomer.name || !newCustomer.email || isAddingCustomer"
            class="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            <span v-if="!isAddingCustomer">Add Customer</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
          </button>
        </form>
      </div>

      <!-- Customer List -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Customer Database</h3>
          <div class="flex items-center space-x-2 text-sm text-gray-500">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{{ customers?.length || 0 }} customers</span>
          </div>
        </div>
        
        <div class="space-y-3 max-h-96 overflow-y-auto">
          <div v-if="!customers || customers.length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
            <p>No customers yet</p>
            <p class="text-sm">Add your first customer</p>
          </div>
          
          <div
            v-for="customer in customers"
            :key="customer.id"
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900">{{ customer.name }}</h4>
                <p class="text-sm text-gray-600">{{ customer.email }}</p>
                <p v-if="customer.phone" class="text-sm text-gray-600">{{ customer.phone }}</p>
                <p class="text-xs text-gray-400 mt-1">
                  Joined {{ formatDate(customer.createdAt) }}
                </p>
              </div>
              <div class="text-right">
                <div class="text-lg font-semibold text-green-600">
                  ${{ (customer.credits || 0).toFixed(2) }}
                </div>
                <div class="text-xs text-gray-500">Credits</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { customers, addCustomer } = useFirebaseData()

const isAddingCustomer = ref(false)
const newCustomer = ref({
  name: '',
  email: '',
  phone: '',
  credits: 0
})

const addNewCustomer = async () => {
  if (!newCustomer.value.name || !newCustomer.value.email || isAddingCustomer.value) return

  isAddingCustomer.value = true

  try {
    await addCustomer({
      name: newCustomer.value.name,
      email: newCustomer.value.email,
      phone: newCustomer.value.phone,
      credits: parseFloat(newCustomer.value.credits) || 0
    })
    
    newCustomer.value = {
      name: '',
      email: '',
      phone: '',
      credits: 0
    }

    // Success notification
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
    notification.textContent = 'Customer added successfully!'
    document.body.appendChild(notification)
    setTimeout(() => notification.remove(), 3000)
    
  } catch (error) {
    console.error('Error adding customer:', error)
    alert('Error adding customer. Please try again.')
  } finally {
    isAddingCustomer.value = false
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown'
  return new Date(timestamp).toLocaleDateString()
}
</script>
