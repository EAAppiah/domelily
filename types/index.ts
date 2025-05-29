declare global {
  interface Window {
    // Add any window extensions here if needed
  }
}

// VueFire module augmentation
declare module 'vuefire' {
  interface VueFireDatabase {
    // Custom database interface extensions
  }
}

export {}
