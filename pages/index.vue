<template>
  <div class="pb-20 lg:pb-0">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">New Sale</h2>
      <p class="text-gray-600">Create a new transaction</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Service Selection -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Services</h3>
          <div class="flex items-center space-x-2 text-sm text-gray-500">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{{ services?.length || 0 }} available</span>
          </div>
        </div>
        
        <!-- Add New Service -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg border">
          <h4 class="text-sm font-medium text-gray-700 mb-3">Add New Service</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <input
              v-model="newService.name"
              type="text"
              placeholder="Service name"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
            <input
              v-model="newService.price"
              type="number"
              step="0.01"
              placeholder="Price"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
          </div>
          <button
            @click="addNewService"
            :disabled="!newService.name || !newService.price"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Add Service
          </button>
        </div>

        <!-- Available Services -->
        <div class="space-y-2 max-h-80 overflow-y-auto">
          <div v-if="!services || services.length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
            <p>No services available</p>
            <p class="text-sm">Add your first service above</p>
          </div>
          
          <div
            v-for="service in services"
            :key="service.id"
            @click="addToCart(service)"
            class="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all group"
          >
            <span class="font-medium group-hover:text-blue-700">{{ service.name }}</span>
            <span class="text-green-600 font-semibold">${{ service.price }}</span>
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
              {{ customer.name }} (Credits: ${{ customer.credits?.toFixed(2) || '0.00' }})
            </option>
          </select>
        </div>

        <!-- Cart Items -->
        <div class="mb-4 max-h-60 overflow-y-auto">
          <div v-if="cart.length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zM8 6V5a2 2 0 114 0v1H8zm2 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
            <p>Cart is empty</p>
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
                  <button @click="updateQuantity(index, -1)" class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-l-md transition-colors">-</button>
                  <span class="w-10 text-center text-sm font-medium">{{ item.quantity }}</span>
                  <button @click="updateQuantity(index, 1)" class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-r-md transition-colors">+</button>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <span class="font-semibold">${{ (item.price * item.quantity).toFixed(2) }}</span>
                <button @click="removeFromCart(index)" class="text-red-500 hover:text-red-700 transition-colors">
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
            <span class="text-green-600">${{ total.toFixed(2) }}</span>
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
            <option value="mixed">Mixed Payment</option>
          </select>
        </div>

        <!-- Credits Management -->
        <div v-if="selectedCustomer" class="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm font-medium text-blue-800">Customer Credits:</span>
            <span class="font-bold text-blue-900">${{ selectedCustomer.credits?.toFixed(2) || '0.00' }}</span>
          </div>
          <div class="flex space-x-2">
            <input
              v-model="creditsToAdd"
              type="number"
              step="0.01"
              placeholder="Add credits"
              class="flex-1 p-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
            <button
              @click="addCredits"
              :disabled="!creditsToAdd || creditsToAdd <= 0"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Add
            </button>
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
      </div>
    </div>
  </div>
</template>

<script setup>
const { services, customers, addService, addTransaction, updateCustomerCredits } = useFirebaseData()

const cart = ref([])
const selectedCustomer = ref('')
const paymentMethod = ref('cash')
const creditsToAdd = ref('')
const isProcessing = ref(false)

const newService = ref({
  name: '',
  price: ''
})

const total = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const addNewService = async () => {
  if (newService.value.name && newService.value.price) {
    try {
      await addService({
        name: newService.value.name,
        price: parseFloat(newService.value.price)
      })
      newService.value = { name: '', price: '' }
    } catch (error) {
      console.error('Error adding service:', error)
    }
  }
}

const addToCart = (service) => {
  const existingItem = cart.value.find(item => item.id === service.id)
  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.value.push({ ...service, quantity: 1 })
  }
}

const updateQuantity = (index, change) => {
  cart.value[index].quantity += change
  if (cart.value[index].quantity <= 0) {
    removeFromCart(index)
  }
}

const removeFromCart = (index) => {
  cart.value.splice(index, 1)
}

const addCredits = async () => {
  if (selectedCustomer.value && creditsToAdd.value && creditsToAdd.value > 0) {
    try {
      const newCreditAmount = (selectedCustomer.value.credits || 0) + parseFloat(creditsToAdd.value)
      await updateCustomerCredits(selectedCustomer.value.id, newCreditAmount)
      creditsToAdd.value = ''
    } catch (error) {
      console.error('Error adding credits:', error)
    }
  }
}

const processPayment = async () => {
  if (cart.value.length === 0 || isProcessing.value) return

  isProcessing.value = true

  try {
    // Validate credits payment
    if (paymentMethod.value === 'credits' && selectedCustomer.value) {
      const customerCredits = selectedCustomer.value.credits || 0
      if (customerCredits < total.value) {
        alert('Insufficient credits!')
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
        email: selectedCustomer.value.email
      } : null
    }

    await addTransaction(transaction)
    
    // Reset form
    cart.value = []
    selectedCustomer.value = ''
    paymentMethod.value = 'cash'
    
    // Success notification
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
    notification.textContent = 'Payment processed successfully!'
    document.body.appendChild(notification)
    setTimeout(() => notification.remove(), 3000)
    
  } catch (error) {
    console.error('Error processing payment:', error)
    alert('Error processing payment. Please try again.')
  } finally {
    isProcessing.value = false
  }
}
</script>