<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    toastStore.toast({
      title: 'Error',
      description: 'Please fill in all fields',
      variant: 'destructive'
    })
    return
  }

  isLoading.value = true
  try {
    await authStore.login(email.value, password.value)
    toastStore.toast({
      title: 'Success',
      description: 'Welcome back!'
    })
    const defaultPath = authStore.user?.role === 'candidate' ? '/candidate' : 
                        authStore.user?.role === 'admin' ? '/admin' : '/manager'
    router.push(defaultPath)
  } catch (error: any) {
    toastStore.toast({
      title: 'Error',
      description: error.message || 'Failed to login',
      variant: 'destructive'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/30 px-4">
    <Card class="w-full max-w-md">
      <CardHeader class="text-center">
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Sign in to your SmartHire account</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              v-model="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              type="password"
              v-model="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <Button type="submit" class="w-full" :disabled="isLoading">
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </Button>
        </form>
        
        <div class="mt-6 text-center text-sm">
          <span class="text-muted-foreground">Don't have an account? </span>
          <router-link to="/signup" class="text-primary hover:underline">
            Sign up
          </router-link>
        </div>
        
        <div class="mt-4 pt-4 border-t">
          <p class="text-sm text-muted-foreground text-center mb-3">Demo accounts:</p>
          <div class="flex gap-2 justify-center flex-wrap">
            <Button 
              variant="outline" 
              size="sm"
              @click="authStore.demoLogin('candidate'); router.push('/candidate')"
            >
              Candidate
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              @click="authStore.demoLogin('manager'); router.push('/manager')"
            >
              Manager
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              @click="authStore.demoLogin('admin'); router.push('/admin')"
            >
              Admin
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
