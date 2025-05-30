<template>
  <div class="pb-20 lg:pb-0">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">New Sale</h2>
      </div>
      <div class="flex items-center space-x-3">
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-gray-700">Business Name:</label>
          <input
            v-model="businessName"
            type="text"
            placeholder="Enter business name"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Service Selection -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Services</h3>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2 text-sm text-gray-500">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{{ services?.length || 0 }} available</span>
            </div>
            <button
              @click="showAddServiceModal = true"
              class="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              <span>Add Service</span>
            </button>
          </div>
        </div>
        
        <!-- Searchable Service Dropdown -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Select Service</label>
          <div class="relative">
            <input
              v-model="serviceSearch"
              @focus="showServiceDropdown = true"
              @blur="handleServiceBlur"
              type="text"
              placeholder="Search services..."
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
            <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
            
            <!-- Dropdown List -->
            <div
              v-if="showServiceDropdown && filteredServices.length > 0"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              <div
                v-for="service in filteredServices"
                :key="service.id"
                @mousedown="selectService(service)"
                class="flex justify-between items-center p-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
              >
                <span class="font-medium">{{ service.name }}</span>
                <span class="text-green-600 font-semibold">{{ formatCurrency(service.price) }}</span>
              </div>
            </div>
            
            <!-- No Results -->
            <div
              v-if="showServiceDropdown && serviceSearch && filteredServices.length === 0"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500"
            >
              <p>No services found matching "{{ serviceSearch }}"</p>
              <button
                @click="showAddServiceModal = true; showServiceDropdown = false"
                class="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Add new service
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State for Services -->
        <div v-if="servicesLoading" class="space-y-2 max-h-80">
          <div v-for="n in 4" :key="n" class="flex justify-between items-center p-4 border border-gray-200 rounded-lg animate-pulse">
            <div class="h-4 bg-gray-300 rounded w-1/2"></div>
            <div class="h-4 bg-gray-300 rounded w-16"></div>
          </div>
        </div>

        <!-- Available Services (Grid View) -->
        <div v-else class="space-y-2 max-h-80 overflow-y-auto">
          <div v-if="!services || services.length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
            <p class="text-lg font-medium">No services available</p>
            <p class="text-sm">Add your first service using the button above</p>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div
              v-for="service in services"
              :key="service.id"
              @click="addToCart(service)"
              class="flex flex-col p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all group"
            >
              <span class="font-medium group-hover:text-blue-700 text-sm">{{ service.name }}</span>
              <span class="text-green-600 font-semibold text-sm">{{ formatCurrency(service.price) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Cart & Checkout -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Current Sale</h3>
          <div class="text-sm text-gray-500">
            {{ cart.length }} item{{ cart.length !== 1 ? 's' : '' }}
          </div>
        </div>
        
        <!-- Customer Selection -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Customer</label>
          <select
            v-model="selectedCustomer"
            :disabled="processPaymentLoading.isLoading.value"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Walk-in Customer</option>
            <option v-for="customer in customers" :key="customer.id" :value="customer">
              {{ customer.name }} (Credits: {{ formatCurrency(customer.credits) }})
            </option>
          </select>
        </div>

        <!-- Cart Items -->
        <div class="mb-4 max-h-60 overflow-y-auto">
          <div v-if="cart.length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zM8 6V5a2 2 0 114 0v1H8zm2 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
            <p class="text-lg font-medium">Cart is empty</p>
            <p class="text-sm">Add services from the left panel</p>
          </div>
          
          <div class="space-y-2">
            <div
              v-for="(item, index) in cart"
              :key="index"
              class="flex justify-between items-center p-3 bg-gray-50 rounded-lg border"
            >
              <div class="flex items-center space-x-3">
                <span class="font-medium">{{ item.name }}</span>
                <div class="flex items-center space-x-1 bg-white rounded-md border">
                  <button 
                    @click="updateQuantity(index, -1)" 
                    :disabled="processPaymentLoading.isLoading.value"
                    class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-l-md transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >-</button>
                  <span class="w-10 text-center text-sm font-medium">{{ item.quantity }}</span>
                  <button 
                    @click="updateQuantity(index, 1)" 
                    :disabled="processPaymentLoading.isLoading.value"
                    class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-r-md transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >+</button>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <span class="font-semibold">{{ formatCurrency(item.price * item.quantity) }}</span>
                <button 
                  @click="removeFromCart(index)" 
                  :disabled="processPaymentLoading.isLoading.value"
                  class="text-red-500 hover:text-red-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Total -->
        <div class="border-t pt-4 mb-4">
          <div class="flex justify-between text-xl font-bold">
            <span>Total:</span>
            <span class="text-green-600">{{ formatCurrency(total) }}</span>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
          <select
            v-model="paymentMethod"
            :disabled="processPaymentLoading.isLoading.value"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="credits" :disabled="!selectedCustomer">Customer Credits</option>
            <option value="mixed">Mixed Payment</option>
          </select>
        </div>

        <!-- Credits Management -->
        <div v-if="selectedCustomer" class="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm font-medium text-blue-800">Customer Credits:</span>
            <span class="font-bold text-blue-900">{{ formatCurrency(selectedCustomer.credits) }}</span>
          </div>
          <div class="flex space-x-2">
            <input
              v-model="creditsToAdd"
              type="number"
              step="0.01"
              placeholder="Add credits"
              :disabled="addCreditsLoading.isLoading.value"
              class="flex-1 p-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
            <button
              @click="addCredits"
              :disabled="!creditsToAdd || creditsToAdd <= 0 || addCreditsLoading.isLoading.value"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <span v-if="!addCreditsLoading.isLoading.value">Add</span>
              <svg v-else class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Checkout Button -->
        <button
          @click="processPayment"
          :disabled="cart.length === 0 || processPaymentLoading.isLoading.value"
          class="w-full bg-green-600 text-white px-4 py-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-bold text-lg"
        >
          <span v-if="!processPaymentLoading.isLoading.value">Process Payment</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Payment...
          </span>
        </button>

        <!-- Print Receipt Button (appears after successful payment) -->
        <div v-if="lastTransaction" class="mt-3">
          <button
            @click="printReceipt"
            class="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
            </svg>
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Add Service Modal -->
    <div
      v-if="showAddServiceModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="closeModal"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Add New Service</h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="addNewService">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
              <input
                v-model="newService.name"
                type="text"
                placeholder="Enter service name"
                :disabled="addServiceLoading.isLoading.value"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Price (₵)</label>
              <input
                v-model="newService.price"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter price"
                :disabled="addServiceLoading.isLoading.value"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
            </div>
          </div>
          
          <div class="flex space-x-3 mt-6">
            <button
              type="button"
              @click="closeModal"
              :disabled="addServiceLoading.isLoading.value"
              class="flex-1 bg-gray-200 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="!newService.name || !newService.price || addServiceLoading.isLoading.value"
              class="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <span v-if="!addServiceLoading.isLoading.value">Add Service</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Hidden Print Receipt -->
    <div id="print-receipt" style="display: none;">
      <div style="max-width: 320px; margin: 0 auto; padding: 16px; font-family: monospace; font-size: 12px; line-height: 1.4;">
        <div style="text-align: center; margin-bottom: 16px;">
          <h2 style="font-weight: bold; font-size: 16px; margin: 0 0 4px 0;">{{ businessName || 'Your Business' }}</h2>
          <p style="font-size: 10px; color: #666; margin: 0;">Receipt</p>
          <p style="font-size: 10px; color: #666; margin: 0;">{{ formatDate(lastTransaction?.timestamp) }}</p>
        </div>
        
        <div style="border-top: 1px dashed #333; border-bottom: 1px dashed #333; padding: 8px 0; margin-bottom: 8px;">
          <div v-for="item in lastTransaction?.items" :key="item.id" style="display: flex; justify-content: space-between; padding: 2px 0;">
            <div>
              <span>{{ item.name }}</span>
              <span v-if="item.quantity > 1" style="font-size: 10px; color: #666;"> x{{ item.quantity }}</span>
            </div>
            <span>{{ formatCurrency(item.price * item.quantity) }}</span>
          </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; font-weight: bold; border-bottom: 1px dashed #333; padding-bottom: 8px; margin-bottom: 8px;">
          <span>Total:</span>
          <span>{{ formatCurrency(lastTransaction?.total) }}</span>
        </div>
        
        <div style="font-size: 10px; color: #666; margin-bottom: 8px;">
          <p style="margin: 2px 0;">Payment: {{ lastTransaction?.paymentMethod }}</p>
          <p v-if="lastTransaction?.customer" style="margin: 2px 0;">Customer: {{ lastTransaction.customer.name }}</p>
        </div>
        
        <div style="text-align: center; font-size: 10px; color: #666; margin-top: 16px;">
          <p style="margin: 0;">Thank you for your business!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const { services, customers, addService, addTransaction, updateCustomerCredits } = useFirebaseData()
const { showSuccess, showError, showInfo } = useNotifications()
const { createLoadingState } = useLoadingState()
const { formatCurrency } = useFormatting()

// Loading states
const addServiceLoading = createLoadingState()
const processPaymentLoading = createLoadingState()
const addCreditsLoading = createLoadingState()
const servicesLoading = ref(false)

// Modal and dropdown states
const showAddServiceModal = ref(false)
const showServiceDropdown = ref(false)
const serviceSearch = ref('')

const cart = ref([])
const selectedCustomer = ref('')
const paymentMethod = ref('cash')
const creditsToAdd = ref('')
const lastTransaction = ref(null)
const businessName = ref('SalesPro')

const newService = ref({
  name: '',
  price: ''
})

// Computed properties
const total = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const filteredServices = computed(() => {
  if (!services.value || !serviceSearch.value) {
    return services.value || []
  }
  
  const searchTerm = serviceSearch.value.toLowerCase()
  return services.value.filter(service => 
    service.name.toLowerCase().includes(searchTerm)
  )
})

// Helper function to format date
const formatDate = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleString()
}

// Print function
const printReceipt = () => {
  const printContent = document.getElementById('print-receipt')
  const originalContent = document.body.innerHTML
  
  document.body.innerHTML = printContent.innerHTML
  window.print()
  document.body.innerHTML = originalContent
  
  // Re-initialize Vue after restoring content
  setTimeout(() => {
    location.reload()
  }, 100)
}

// Modal functions
const closeModal = () => {
  showAddServiceModal.value = false
  newService.value = { name: '', price: '' }
}

// Service selection functions
const selectService = (service) => {
  addToCart(service)
  serviceSearch.value = ''
  showServiceDropdown.value = false
}

const handleServiceBlur = () => {
  // Delay hiding dropdown to allow click events to register
  setTimeout(() => {
    showServiceDropdown.value = false
  }, 150)
}

// Existing functions
const addNewService = async () => {
  if (!newService.value.name || !newService.value.price) {
    showError('Please enter service name and price')
    return
  }

  try {
    await addServiceLoading.withLoading(async () => {
      await addService({
        name: newService.value.name,
        price: parseFloat(newService.value.price)
      })
      closeModal()
      showSuccess('Service added successfully!')
    })
  } catch (error) {
    console.error('Error adding service:', error)
    showError('Failed to add service. Please try again.')
  }
}

const addToCart = (service) => {
  const existingItem = cart.value.find(item => item.id === service.id)
  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.value.push({ ...service, quantity: 1 })
  }
  showSuccess(`${service.name} added to cart`)
}

const updateQuantity = (index, change) => {
  cart.value[index].quantity += change
  if (cart.value[index].quantity <= 0) {
    removeFromCart(index)
  }
}

const removeFromCart = (index) => {
  const item = cart.value[index]
  cart.value.splice(index, 1)
  showInfo(`${item.name} removed from cart`)
}

const addCredits = async () => {
  if (!selectedCustomer.value || !creditsToAdd.value || creditsToAdd.value <= 0) {
    showError('Please enter a valid credit amount')
    return
  }

  try {
    await addCreditsLoading.withLoading(async () => {
      const newCreditAmount = (selectedCustomer.value.credits || 0) + parseFloat(creditsToAdd.value)
      await updateCustomerCredits(selectedCustomer.value.id, newCreditAmount)
      creditsToAdd.value = ''
      showSuccess('Credits added successfully!')
    })
  } catch (error) {
    console.error('Error adding credits:', error)
    showError('Failed to add credits. Please try again.')
  }
}

const processPayment = async () => {
  if (cart.value.length === 0) {
    showError('Cart is empty')
    return
  }

  try {
    await processPaymentLoading.withLoading(async () => {
      // Validate credits payment
      if (paymentMethod.value === 'credits' && selectedCustomer.value) {
        const customerCredits = selectedCustomer.value.credits || 0
        if (customerCredits < total.value) {
          showError('Insufficient credits!')
          return
        }
        // Deduct credits
        await updateCustomerCredits(selectedCustomer.value.id, customerCredits - total.value)
      }

      const transaction = {
        items: cart.value,
        total: total.value,
        paymentMethod: paymentMethod.value,
        customer: selectedCustomer.value ? {
          id: selectedCustomer.value.id,
          name: selectedCustomer.value.name,
        } : null,
        timestamp: Date.now()
      }

      await addTransaction(transaction)
      
      // Store last transaction for printing
      lastTransaction.value = transaction
      
      // Reset form
      cart.value = []
      selectedCustomer.value = ''
      paymentMethod.value = 'cash'
      
      showSuccess('Payment processed successfully!')
    })
  } catch (error) {
    console.error('Error processing payment:', error)
    showError('Failed to process payment. Please try again.')
  }
}

// Simulate loading for demonstration
onMounted(() => {
  servicesLoading.value = true
  setTimeout(() => {
    servicesLoading.value = false
  }, 800)
})
</script>