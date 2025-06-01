<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
              <span class="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 class="text-xl font-semibold text-gray-900">Domemily Enterprise</h1>
              <p class="text-xs text-gray-500">Professional Sales Management</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-xs text-gray-600">Live</span>
            </div>
            <!-- User Profile (Desktop) -->
            <div class="hidden lg:flex items-center space-x-2">
              <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span class="text-xs font-medium text-gray-600">DM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Desktop Navigation Sidebar -->
    <nav class="hidden lg:block fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-200 shadow-sm z-40 pt-16">
      <!-- Sidebar Header -->
      <div class="p-6 border-b border-gray-100">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 class="font-semibold text-gray-900">Sales Dashboard</h2>
            <p class="text-sm text-gray-500">Manage your business</p>
          </div>
        </div>
      </div>

      <!-- Navigation Menu - Scrollable Content -->
      <div class="p-4 space-y-2 overflow-y-auto h-full pb-20">
        <!-- Quick Stats -->
        <div class="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Today's Overview</h3>
          <div class="grid grid-cols-2 gap-3">
            <div class="text-center">
              <div class="text-lg font-bold text-blue-600">$2,450</div>
              <div class="text-xs text-gray-500">Sales</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-green-600">12</div>
              <div class="text-xs text-gray-500">Orders</div>
            </div>
          </div>
        </div>

        <!-- Main Navigation -->
        <div class="space-y-1">
          <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
            Main Menu
          </div>
          
          <NuxtLink to="/" class="group flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:bg-gray-50" :class="$route.path === '/' ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' : 'text-gray-700 hover:text-gray-900'">
            <div class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors" :class="$route.path === '/' ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-200'">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-medium">New Sale</div>
              <div class="text-xs text-gray-500">Create transaction</div>
            </div>
          </NuxtLink>

          <NuxtLink to="/history" class="group flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:bg-gray-50" :class="$route.path === '/history' ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' : 'text-gray-700 hover:text-gray-900'">
            <div class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors" :class="$route.path === '/history' ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-200'">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-medium">Transaction History</div>
              <div class="text-xs text-gray-500">View past sales</div>
            </div>
          </NuxtLink>

          <NuxtLink to="/customers" class="group flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:bg-gray-50" :class="$route.path === '/customers' ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' : 'text-gray-700 hover:text-gray-900'">
            <div class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors" :class="$route.path === '/customers' ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-200'">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-medium">Customers</div>
              <div class="text-xs text-gray-500">Manage contacts</div>
            </div>
          </NuxtLink>

          <NuxtLink to="/reports" class="group flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:bg-gray-50" :class="$route.path === '/reports' ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' : 'text-gray-700 hover:text-gray-900'">
            <div class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors" :class="$route.path === '/reports' ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-200'">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2a2 2 0 002-2V5a1 1 0 100-2H3zm11.5 4.5a.5.5 0 01.5-.5h4a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-4a.5.5 0 01-.5-.5v-2z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-medium">Reports</div>
            <div class="text-xs text-gray-500">Analytics & insights</div>
          </div>
        </NuxtLink>
      </div>
    </div>
   
  </nav>

  <!-- Main Content -->
  <main class="lg:ml-72 pt-16 px-4 sm:px-6 lg:px-8 py-6">
    <slot />
  </main>

  <!-- Bottom Navigation (Mobile) -->
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50 shadow-lg">
    <div class="grid grid-cols-4 gap-1 px-2 py-1">
      <NuxtLink to="/" class="flex flex-col items-center py-3 px-2 rounded-lg transition-colors" :class="$route.path === '/' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'">
        <div class="w-8 h-8 flex items-center justify-center rounded-lg mb-1" :class="$route.path === '/' ? 'bg-blue-100' : ''">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <span class="text-xs font-medium">Sale</span>
      </NuxtLink>
      <NuxtLink to="/history" class="flex flex-col items-center py-3 px-2 rounded-lg transition-colors" :class="$route.path === '/history' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'">
        <div class="w-8 h-8 flex items-center justify-center rounded-lg mb-1" :class="$route.path === '/history' ? 'bg-blue-100' : ''">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <span class="text-xs font-medium">History</span>
      </NuxtLink>
      <NuxtLink to="/customers" class="flex flex-col items-center py-3 px-2 rounded-lg transition-colors" :class="$route.path === '/customers' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'">
        <div class="w-8 h-8 flex items-center justify-center rounded-lg mb-1" :class="$route.path === '/customers' ? 'bg-blue-100' : ''">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
        </div>
        <span class="text-xs font-medium">Customers</span>
      </NuxtLink>
      <NuxtLink to="/reports" class="flex flex-col items-center py-3 px-2 rounded-lg transition-colors" :class="$route.path === '/reports' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'">
        <div class="w-8 h-8 flex items-center justify-center rounded-lg mb-1" :class="$route.path === '/reports' ? 'bg-blue-100' : ''">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2a2 2 0 002-2V5a1 1 0 100-2H3zm11.5 4.5a.5.5 0 01.5-.5h4a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-4a.5.5 0 01-.5-.5v-2z" clip-rule="evenodd" />
          </svg>
        </div>
        <span class="text-xs font-medium">Reports</span>
      </NuxtLink>
    </div>
  </nav>
</div>
</template>