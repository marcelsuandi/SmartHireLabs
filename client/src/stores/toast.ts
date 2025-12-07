import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  const toast = (options: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}`
    toasts.value.push({ ...options, id })
    
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts,
    toast,
    removeToast
  }
})
