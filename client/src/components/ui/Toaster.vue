<script setup lang="ts">
import { useToastStore } from '@/stores/toast'
import { X } from 'lucide-vue-next'

const toastStore = useToastStore()
</script>

<template>
  <div class="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
    <TransitionGroup
      name="toast"
      tag="div"
      class="flex flex-col gap-2"
    >
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        :class="[
          'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
          toast.variant === 'destructive' 
            ? 'border-destructive bg-destructive text-destructive-foreground' 
            : 'border bg-background text-foreground'
        ]"
      >
        <div class="grid gap-1">
          <div v-if="toast.title" class="text-sm font-semibold">{{ toast.title }}</div>
          <div v-if="toast.description" class="text-sm opacity-90">{{ toast.description }}</div>
        </div>
        <button
          @click="toastStore.removeToast(toast.id)"
          class="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
