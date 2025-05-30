<template>
  <div class="pb-20 lg:pb-0">
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Customer Management</h2>
          <p class="text-gray-600">Add and manage your customers</p>
        </div>
        <div class="flex-shrink-0">
        </div>
      </div>
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
              :disabled="addCustomerLoading.isLoading.value"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Customer name"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Initial Credits</label>
            <input
              v-model="newCustomer.credits"
              type="number"
              step="0.01"
              min="0"
              :disabled="addCustomerLoading.isLoading.value"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0.00"
            >
          </div>
          
          <button
            type="submit"
            :disabled="!newCustomer.name || addCustomerLoading.isLoading.value"
            class="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            <span v-if="!addCustomerLoading.isLoading.value">Add Customer</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding Customer...
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
        
        <!-- Loading State for Customer List -->
        <div v-if="customersLoading" class="space-y-3 max-h-96">
          <div v-for="n in 3" :key="n" class="p-4 border border-gray-200 rounded-lg animate-pulse">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div class="text-right">
                <div class="h-6 bg-gray-300 rounded w-16 mb-1"></div>
                <div class="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="space-y-3 max-h-96 overflow-y-auto">
          <div v-if="!customers || customers.length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
            <p class="text-lg font-medium">No customers yet</p>
            <p class="text-sm">Add your first customer to get started</p>
          </div>
          
          <div
            v-for="customer in customers"
            :key="customer.id"
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900">{{ customer.name }}</h4>
                <p class="text-xs text-gray-400 mt-1">
                  Joined {{ formatDate(customer.createdAt) }}
                </p>
              </div>
              <div class="text-right">
                <div class="text-lg font-semibold text-green-600">
                  {{ formatCurrency(customer.credits) }}
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
const { showSuccess, showError } = useNotifications()
const { createLoadingState } = useLoadingState()
const { formatCurrency, formatDate } = useFormatting()

// Loading states
const addCustomerLoading = createLoadingState()
const customersLoading = ref(false)

const newCustomer = ref({
  name: '',
  credits: 0
})

const addNewCustomer = async () => {
  if (!newCustomer.value.name) {
    showError('Please enter a customer name')
    return
  }

  try {
    await addCustomerLoading.withLoading(async () => {
      await addCustomer({
        name: newCustomer.value.name,
        credits: parseFloat(newCustomer.value.credits) || 0
      })
      
      // Reset form
      newCustomer.value = {
        name: '',
        credits: 0
      }

      showSuccess('Customer added successfully!')
    })
  } catch (error) {
    console.error('Error adding customer:', error)
    showError('Failed to add customer. Please try again.')
  }
}

onMounted(() => {
  customersLoading.value = true
  setTimeout(() => {
    customersLoading.value = false
  }, 1000)
})
</script>