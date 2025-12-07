<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppSidebar from '@/components/AppSidebar.vue'
import Toaster from '@/components/ui/Toaster.vue'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const showSidebar = computed(() => {
  const publicRoutes = ['/', '/login', '/signup']
  return authStore.user && !publicRoutes.includes(route.path)
})

watch(() => authStore.user, (user) => {
  if (user && (route.path === '/login' || route.path === '/signup')) {
    const defaultPath = user.role === 'candidate' ? '/candidate' : 
                        user.role === 'admin' ? '/admin' : '/manager'
    router.push(defaultPath)
  }
}, { immediate: true })
</script>

<template>
  <div class="min-h-screen bg-background">
    <div v-if="authStore.isLoading" class="min-h-screen flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>
    
    <template v-else>
      <div v-if="showSidebar" class="flex h-screen w-full">
        <AppSidebar />
        <div class="flex flex-col flex-1 overflow-hidden">
          <main class="flex-1 overflow-auto bg-muted/30">
            <router-view />
          </main>
        </div>
      </div>
      
      <router-view v-else />
    </template>
    
    <Toaster />
  </div>
</template>
