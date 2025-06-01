<template>
  <div class="pt-4 pb-20 lg:pb-0">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">New Sale</h2>
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
        
        <!-- Service Search -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Search Services</label>
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
            
            <!-- Dropdown -->
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
          </div>
        </div>

        <!-- Services Grid -->
        <div class="space-y-2 max-h-80 overflow-y-auto">
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
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="">Walk-in Customer</option>
            <option v-for="customer in customers" :key="customer.id" :value="customer">
              {{ customer.name }} (Credits: {{ formatCurrency(customer.credits || 0) }})
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
                    class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-l-md transition-colors"
                  >-</button>
                  <span class="w-10 text-center text-sm font-medium">{{ item.quantity }}</span>
                  <button 
                    @click="updateQuantity(index, 1)" 
                    class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-r-md transition-colors"
                  >+</button>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <span class="font-semibold">{{ formatCurrency(item.price * item.quantity) }}</span>
                <button 
                  @click="removeFromCart(index)" 
                  class="text-red-500 hover:text-red-700 transition-colors"
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
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="credits" :disabled="!selectedCustomer">Customer Credits</option>
          </select>
        </div>

        <!-- Credits Display -->
        <div v-if="selectedCustomer" class="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-blue-800">Available Credits:</span>
            <span class="font-bold text-blue-900">{{ formatCurrency(selectedCustomer.credits || 0) }}</span>
          </div>
        </div>

        <!-- Checkout Button -->
        <button
          @click="processPayment"
          :disabled="cart.length === 0 || isProcessing"
          class="w-full bg-green-600 text-white px-4 py-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-bold text-lg"
        >
          <span v-if="!isProcessing">Process Payment</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        </button>

        <!-- Receipt Actions -->
        <div v-if="lastTransaction" class="mt-3 space-y-2">
          <button
            @click="showReceiptModal = true"
            class="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
            </svg>
            <span>Preview & Print Receipt</span>
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
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6" @click.stop>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Add New Service</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
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
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              >
            </div>
          </div>
          
          <div class="flex space-x-3 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 bg-gray-200 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="!newService.name || !newService.price"
              class="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Add Service
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Enhanced Receipt Preview Modal -->
    <div
      v-if="showReceiptModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="showReceiptModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-sm w-full max-h-[90vh] overflow-hidden" @click.stop>
        <div class="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Receipt Preview</h3>
          <button @click="showReceiptModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <!-- Receipt Preview Content -->
        <div class="overflow-y-auto max-h-[60vh]">
          <div class="p-6 bg-gray-50 m-4 rounded-lg border-2 border-dashed border-gray-300" id="receipt-content">
            <div class="bg-white p-6 rounded shadow-sm text-center font-mono" style="font-family: 'Courier New', monospace;">
              <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-900 mb-1">DOMEMILY ENTERPRISE</h2>
                <p class="text-sm text-gray-600">Receipt</p>
                <p class="text-sm text-gray-600">{{ formatDate(lastTransaction?.timestamp) }}</p>
              </div>
              
              <div class="border-t border-b border-dashed border-gray-400 py-4 mb-4 text-left">
                <div v-for="item in lastTransaction?.items" :key="item.id" class="flex justify-between items-center py-1 text-sm">
                  <div>
                    <span class="font-medium">{{ item.name }}</span>
                    <span v-if="item.quantity > 1" class="text-gray-600 ml-1">x{{ item.quantity }}</span>
                  </div>
                  <span class="font-semibold">{{ formatCurrency(item.price * item.quantity) }}</span>
                </div>
              </div>
              
              <div class="flex justify-between items-center text-lg font-bold border-b border-dashed border-gray-400 pb-4 mb-4">
                <span>TOTAL:</span>
                <span class="text-green-600">{{ formatCurrency(lastTransaction?.total) }}</span>
              </div>
              
              <div class="text-sm text-gray-600 mb-6 text-left">
                <p class="mb-1">Payment: {{ lastTransaction?.paymentMethod?.toUpperCase() }}</p>
                <p v-if="lastTransaction?.customer" class="mb-1">Customer: {{ lastTransaction.customer.name }}</p>
              </div>
              
              <div class="text-center text-sm text-gray-600">
                <p>Thank you for your business!</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="sticky bottom-0 bg-white border-t p-4 space-y-3">
          <!-- Print Button -->
          <button
            @click="printReceipt"
            class="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
            </svg>
            <span>Print Receipt</span>
          </button>
          
          <!-- Share/Save Button -->
          <button
            @click="shareReceipt"
            class="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
            </svg>
            <span>Share/Copy Receipt</span>
          </button>
          
          <!-- Email Option (if applicable) -->
          <button
            v-if="lastTransaction?.customer?.email"
            @click="emailReceipt"
            class="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
            <span>Email to Customer</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { services, customers, addService, addTransaction, updateCustomerCredits } = useFirebaseData()
const { showSuccess, showError } = useNotifications()
const { formatCurrency } = useFormatting()

// State
const showAddServiceModal = ref(false)
const showServiceDropdown = ref(false)
const showReceiptModal = ref(false)
const serviceSearch = ref('')
const isProcessing = ref(false)

const cart = ref([])
const selectedCustomer = ref('')
const paymentMethod = ref('cash')
const lastTransaction = ref(null)

const newService = ref({
  name: '',
  price: ''
})

// Computed
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

// Helper functions
const formatDate = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleString()
}

// Modal functions
const closeModal = () => {
  showAddServiceModal.value = false
  newService.value = { name: '', price: '' }
}

// Service functions
const selectService = (service) => {
  addToCart(service)
  serviceSearch.value = ''
  showServiceDropdown.value = false
}

const handleServiceBlur = () => {
  setTimeout(() => {
    showServiceDropdown.value = false
  }, 150)
}

const addNewService = async () => {
  if (!newService.value.name || !newService.value.price) {
    showError('Please enter service name and price')
    return
  }

  try {
    await addService({
      name: newService.value.name,
      price: parseFloat(newService.value.price)
    })
    closeModal()
    showSuccess('Service added successfully!')
  } catch (error) {
    showError('Failed to add service. Please try again.')
  }
}

// Cart functions
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
  showSuccess(`${item.name} removed from cart`)
}

// Payment processing
const processPayment = async () => {
  if (cart.value.length === 0) {
    showError('Cart is empty')
    return
  }

  isProcessing.value = true

  try {
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
    
  } catch (error) {
    showError('Failed to process payment. Please try again.')
  } finally {
    isProcessing.value = false
  }
}

// Receipt functions - enhanced with preview
const printReceipt = () => {
  // Close the modal first
  showReceiptModal.value = false
  
  // Small delay to allow modal to close, then proceed directly to print
  setTimeout(() => {
    createPrintWindow()
  }, 300)
}

const emailReceipt = async () => {
  if (!lastTransaction.value?.customer?.email) {
    showError('No customer email available')
    return
  }
  
  const receiptText = generateReceiptText()
  const subject = encodeURIComponent('Receipt from Domemily Enterprise')
  const body = encodeURIComponent(receiptText)
  
  // Try to open email client
  const emailUrl = `mailto:${lastTransaction.value.customer.email}?subject=${subject}&body=${body}`
  
  try {
    window.open(emailUrl, '_blank')
    showSuccess('Email client opened')
  } catch (error) {
    showError('Could not open email client')
  }
}

const createPrintWindow = () => {
  const receiptHTML = generateReceiptHTML()
  
  try {
    // Try to create print window
    const printWindow = window.open('', '_blank', 'width=400,height=700')
    
    if (!printWindow) {
      // If popup is blocked, show fallback message
      showError('Please enable popups to print receipts, or use the Share option instead.')
      return
    }
    
    // Enhanced HTML content with better visibility
    const htmlContent = '<!DOCTYPE html>' +
      '<html>' +
      '<head>' +
      '<title>Receipt - Domemily Enterprise</title>' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
      '<meta charset="UTF-8">' +
      '<style>' +
      // Screen styles for better preview
      'body { ' +
      '  font-family: "Courier New", "Lucida Console", Monaco, monospace; ' +
      '  font-size: 16px; ' +
      '  font-weight: bold; ' +
      '  line-height: 1.4; ' +
      '  margin: 20px auto; ' +
      '  padding: 20px; ' +
      '  text-align: center; ' +
      '  max-width: 350px; ' +
      '  background: white; ' +
      '  color: #000; ' +
      '  border: 2px solid #000; ' +
      '}' +
      // Header styles
      '.receipt-header { ' +
      '  font-size: 20px; ' +
      '  font-weight: bold; ' +
      '  letter-spacing: 1px; ' +
      '  margin-bottom: 15px; ' +
      '  text-transform: uppercase; ' +
      '}' +
      '.receipt-subheader { ' +
      '  font-size: 14px; ' +
      '  margin: 5px 0; ' +
      '}' +
      // Item styles
      '.receipt-item { ' +
      '  display: flex; ' +
      '  justify-content: space-between; ' +
      '  margin: 8px 0; ' +
      '  font-size: 15px; ' +
      '  font-weight: bold; ' +
      '  align-items: flex-start; ' +
      '}' +
      '.item-name { ' +
      '  flex: 1; ' +
      '  text-align: left; ' +
      '  padding-right: 10px; ' +
      '  word-wrap: break-word; ' +
      '}' +
      '.item-price { ' +
      '  font-weight: bold; ' +
      '  white-space: nowrap; ' +
      '}' +
      // Separator styles
      '.dashed { ' +
      '  border-top: 2px dashed #000; ' +
      '  margin: 15px 0; ' +
      '  padding-top: 15px; ' +
      '}' +
      '.solid-line { ' +
      '  border-top: 3px solid #000; ' +
      '  margin: 15px 0; ' +
      '  padding-top: 15px; ' +
      '}' +
      // Total styles
      '.total-section { ' +
      '  font-size: 18px; ' +
      '  font-weight: bold; ' +
      '  letter-spacing: 1px; ' +
      '  margin: 20px 0; ' +
      '}' +
      '.total-amount { ' +
      '  font-size: 22px; ' +
      '  font-weight: bold; ' +
      '}' +
      // Footer styles
      '.receipt-footer { ' +
      '  font-size: 13px; ' +
      '  margin: 15px 0 5px 0; ' +
      '  text-align: left; ' +
      '}' +
      '.thank-you { ' +
      '  font-size: 16px; ' +
      '  font-weight: bold; ' +
      '  margin-top: 20px; ' +
      '  text-transform: uppercase; ' +
      '  letter-spacing: 1px; ' +
      '}' +
      // Print-specific styles for thermal/receipt printers
      '@media print { ' +
      '  body { ' +
      '    margin: 0 !important; ' +
      '    padding: 10px !important; ' +
      '    font-size: 14px !important; ' +
      '    font-weight: bold !important; ' +
      '    line-height: 1.3 !important; ' +
      '    border: none !important; ' +
      '    background: white !important; ' +
      '    color: #000 !important; ' +
      '    -webkit-print-color-adjust: exact !important; ' +
      '    print-color-adjust: exact !important; ' +
      '  }' +
      '  .receipt-header { ' +
      '    font-size: 18px !important; ' +
      '    font-weight: bold !important; ' +
      '    margin-bottom: 10px !important; ' +
      '  }' +
      '  .receipt-item { ' +
      '    font-size: 13px !important; ' +
      '    font-weight: bold !important; ' +
      '    margin: 6px 0 !important; ' +
      '  }' +
      '  .total-section { ' +
      '    font-size: 16px !important; ' +
      '    font-weight: bold !important; ' +
      '  }' +
      '  .total-amount { ' +
      '    font-size: 18px !important; ' +
      '    font-weight: bold !important; ' +
      '  }' +
      '  .dashed { ' +
      '    border-top: 2px dashed #000 !important; ' +
      '    margin: 10px 0 !important; ' +
      '    padding-top: 10px !important; ' +
      '  }' +
      '  .solid-line { ' +
      '    border-top: 3px solid #000 !important; ' +
      '    margin: 10px 0 !important; ' +
      '    padding-top: 10px !important; ' +
      '  }' +
      '  .receipt-footer { ' +
      '    font-size: 11px !important; ' +
      '    margin: 10px 0 !important; ' +
      '  }' +
      '  .thank-you { ' +
      '    font-size: 14px !important; ' +
      '    font-weight: bold !important; ' +
      '    margin-top: 15px !important; ' +
      '  }' +
      // Page settings for thermal printers
      '  @page { ' +
      '    margin: 5mm !important; ' +
      '    size: 80mm auto !important; ' +
      '  }' +
      '}' +
      // Dark text emphasis for thermal printers
      '* { ' +
      '  color: #000 !important; ' +
      '  background: transparent !important; ' +
      '}' +
      '</style>' +
      '</head>' +
      '<body>' +
      receiptHTML +
      '<script>' +
      'window.onload = function() {' +
      // Show preview for a moment before printing
      '  setTimeout(function() {' +
      '    if (confirm("Ready to print? Click OK to continue or Cancel to review.")) { ' +
      '      window.print();' +
      '      setTimeout(function() {' +
      '        window.close();' +
      '      }, 1500);' +
      '    }' +
      '  }, 800);' +
      '};' +
      // Prevent accidental closing during print
      'window.addEventListener("beforeunload", function(e) {' +
      '  e.preventDefault();' +
      '  return "Are you sure you want to close? Your receipt may not have printed.";' +
      '});' +
      '</' + 'script>' +
      '</body>' +
      '</html>'
    
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    showSuccess('Receipt opened for printing...')
    
  } catch (error) {
    console.error('Print failed:', error)
    showError('Printing failed. Please try using the Share option instead.')
  }
}

const shareReceipt = async () => {
  const receiptText = generateReceiptText()
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Receipt - Domemily Enterprise',
        text: receiptText,
      })
      showSuccess('Receipt shared successfully!')
    } catch (error) {
      if (error.name !== 'AbortError') {
        copyToClipboard(receiptText)
      }
    }
  } else {
    copyToClipboard(receiptText)
  }
}

const copyToClipboard = async (text) => {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text)
      showSuccess('Receipt copied to clipboard!')
    } catch (error) {
      fallbackCopy(text)
    }
  } else {
    fallbackCopy(text)
  }
}

const fallbackCopy = (text) => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  
  try {
    document.execCommand('copy')
    showSuccess('Receipt copied to clipboard!')
  } catch (err) {
    showError('Could not copy receipt')
  }
  
  document.body.removeChild(textArea)
}

const generateReceiptHTML = () => {
  if (!lastTransaction.value) return ''
  
  // Generate items with better formatting
  const items = lastTransaction.value.items.map(item => {
    const quantityText = item.quantity > 1 ? ` x${item.quantity}` : ''
    return `<div class="receipt-item">
      <div class="item-name">${item.name}${quantityText}</div>
      <div class="item-price">${formatCurrency(item.price * item.quantity)}</div>
    </div>`
  }).join('')
  
  // Customer information
  const customerInfo = lastTransaction.value.customer ? 
    `<div style="margin: 5px 0; font-weight: bold;">Customer: ${lastTransaction.value.customer.name}</div>` : 
    `<div style="margin: 5px 0; font-weight: bold;">Walk-in Customer</div>`
  
  // Date formatting
  const receiptDate = new Date(lastTransaction.value.timestamp)
  const dateStr = receiptDate.toLocaleDateString() + ' ' + receiptDate.toLocaleTimeString()
  
  return `
    <div class="receipt-header">DOMEMILY ENTERPRISE</div>
    <div class="receipt-subheader">*** RECEIPT ***</div>
    <div class="receipt-subheader">${dateStr}</div>
    
    <div class="dashed">
      ${items}
    </div>
    
    <div class="solid-line total-section">
      <div class="receipt-item">
        <div class="item-name">TOTAL:</div>
        <div class="item-price total-amount">${formatCurrency(lastTransaction.value.total)}</div>
      </div>
    </div>
    
    <div class="receipt-footer">
      <div style="margin: 8px 0; font-weight: bold;">Payment: ${lastTransaction.value.paymentMethod.toUpperCase()}</div>
      ${customerInfo}
    </div>
    
    <div class="solid-line">
      <div class="thank-you">THANK YOU!</div>
      <div style="font-size: 12px; margin-top: 10px; font-weight: bold;">
        Please keep this receipt<br>
        for your records
      </div>
    </div>
  `
}

const generateReceiptText = () => {
  if (!lastTransaction.value) return ''
  
  const separator = '================================'
  const dashed = '- - - - - - - - - - - - - - - - -'
  
  // Format items
  const items = lastTransaction.value.items.map(item => {
    const quantityText = item.quantity > 1 ? ` x${item.quantity}` : ''
    const itemLine = `${item.name}${quantityText}`
    const price = formatCurrency(item.price * item.quantity)
    
    // Create aligned format
    const maxWidth = 30
    const spaces = Math.max(1, maxWidth - itemLine.length - price.length)
    return itemLine + ' '.repeat(spaces) + price
  }).join('\n')
  
  // Customer info
  const customerInfo = lastTransaction.value.customer ? 
    `Customer: ${lastTransaction.value.customer.name}` : 'Walk-in Customer'
  
  // Date
  const receiptDate = new Date(lastTransaction.value.timestamp)
  const dateStr = receiptDate.toLocaleDateString() + ' ' + receiptDate.toLocaleTimeString()
  
  // Build receipt
  const receiptLines = [
    separator,
    '    DOMEMILY ENTERPRISE',
    '         *** RECEIPT ***',
    dateStr,
    separator,
    '',
    items,
    '',
    dashed,
    '',
    `TOTAL: ${formatCurrency(lastTransaction.value.total)}`,
    '',
    separator,
    '',
    `Payment: ${lastTransaction.value.paymentMethod.toUpperCase()}`,
    customerInfo,
    '',
    separator,
    '',
    '        THANK YOU!',
    '  Please keep this receipt',
    '     for your records',
    '',
    separator
  ]
  
  return receiptLines.join('\n')
}
</script>