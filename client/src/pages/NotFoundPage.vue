<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/30">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 class="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p class="text-muted-foreground mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button @click="router.push('/')">
        Go Home
      </Button>
    </div>
  </div>
</template>
