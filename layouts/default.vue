<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
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
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-xs text-gray-600">Live</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50">
      <div class="grid grid-cols-4 gap-1">
        <NuxtLink to="/" class="flex flex-col items-center py-2 px-1" :class="$route.path === '/' ? 'text-blue-600' : 'text-gray-600'">
          <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          <span class="text-xs">Sale</span>
        </NuxtLink>
        <NuxtLink to="/history" class="flex flex-col items-center py-2 px-1" :class="$route.path === '/history' ? 'text-blue-600' : 'text-gray-600'">
          <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
          <span class="text-xs">History</span>
        </NuxtLink>
        <NuxtLink to="/customers" class="flex flex-col items-center py-2 px-1" :class="$route.path === '/customers' ? 'text-blue-600' : 'text-gray-600'">
          <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
          <span class="text-xs">Customers</span>
        </NuxtLink>
        <NuxtLink to="/reports" class="flex flex-col items-center py-2 px-1" :class="$route.path === '/reports' ? 'text-blue-600' : 'text-gray-600'">
          <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2a2 2 0 002-2V5a1 1 0 100-2H3zm11.5 4.5a.5.5 0 01.5-.5h4a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-4a.5.5 0 01-.5-.5v-2z" clip-rule="evenodd" />
          </svg>
          <span class="text-xs">Reports</span>
        </NuxtLink>
      </div>
    </nav>

    <!-- Desktop Navigation -->
    <nav class="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto z-40">
      <div class="p-4 space-y-2">
        <NuxtLink to="/" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors" :class="$route.path === '/' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-700'">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          <span>New Sale</span>
        </NuxtLink>
        <NuxtLink to="/history" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors" :class="$route.path === '/history' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-700'">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
          <span>Transaction History</span>
        </NuxtLink>
        <NuxtLink to="/customers" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors" :class="$route.path === '/customers' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-700'">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
          <span>Customers</span>
        </NuxtLink>
        <NuxtLink to="/reports" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors" :class="$route.path === '/reports' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-700'">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2a2 2 0 002-2V5a1 1 0 100-2H3zm11.5 4.5a.5.5 0 01.5-.5h4a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-4a.5.5 0 01-.5-.5v-2z" clip-rule="evenodd" />
          </svg>
          <span>Reports</span>
        </NuxtLink>
      </div>
    </nav>

    <!-- Desktop Content Offset -->
    <div class="hidden lg:block pl-64"></div>
  </div>
</template>
