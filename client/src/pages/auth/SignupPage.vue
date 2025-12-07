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

const fullName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  if (!fullName.value || !email.value || !phone.value || !password.value) {
    toastStore.toast({
      title: 'Error',
      description: 'Please fill in all fields',
      variant: 'destructive'
    })
    return
  }

  if (password.value !== confirmPassword.value) {
    toastStore.toast({
      title: 'Error',
      description: 'Passwords do not match',
      variant: 'destructive'
    })
    return
  }

  isLoading.value = true
  try {
    await authStore.register({
      fullName: fullName.value,
      email: email.value,
      phone: phone.value,
      password: password.value
    })
    toastStore.toast({
      title: 'Success',
      description: 'Account created successfully!'
    })
    router.push('/candidate')
  } catch (error: any) {
    toastStore.toast({
      title: 'Error',
      description: error.message || 'Failed to register',
      variant: 'destructive'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8">
    <Card class="w-full max-w-md">
      <CardHeader class="text-center">
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Join SmartHire and find your dream job</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <Label for="fullName">Full Name</Label>
            <Input
              id="fullName"
              v-model="fullName"
              placeholder="Enter your full name"
              required
            />
          </div>
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
            <Label for="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              v-model="phone"
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              type="password"
              v-model="password"
              placeholder="Create a password"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              v-model="confirmPassword"
              placeholder="Confirm your password"
              required
            />
          </div>
          <Button type="submit" class="w-full" :disabled="isLoading">
            {{ isLoading ? 'Creating account...' : 'Create Account' }}
          </Button>
        </form>
        
        <div class="mt-6 text-center text-sm">
          <span class="text-muted-foreground">Already have an account? </span>
          <router-link to="/login" class="text-primary hover:underline">
            Sign in
          </router-link>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
