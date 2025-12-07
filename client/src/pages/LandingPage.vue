<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/ui/Button.vue'
import { Briefcase, Users, CheckCircle, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const features = [
  {
    icon: Briefcase,
    title: 'Find Your Dream Job',
    description: 'Browse through hundreds of opportunities from top companies'
  },
  {
    icon: Users,
    title: 'Connect with Employers',
    description: 'Get matched with the right employers looking for your skills'
  },
  {
    icon: CheckCircle,
    title: 'Track Applications',
    description: 'Keep track of all your job applications in one place'
  }
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-background to-muted">
    <header class="container mx-auto px-4 py-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-primary">SmartHire</h1>
      <div class="flex gap-4">
        <Button variant="ghost" @click="router.push('/login')">Login</Button>
        <Button @click="router.push('/signup')">Get Started</Button>
      </div>
    </header>

    <main class="container mx-auto px-4 py-20">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-4xl md:text-5xl font-bold mb-6">
          Your Next Career Move Starts Here
        </h2>
        <p class="text-xl text-muted-foreground mb-8">
          SmartHire connects talented professionals with leading companies. 
          Find your perfect match and advance your career today.
        </p>
        <div class="flex gap-4 justify-center">
          <Button size="lg" @click="router.push('/signup')">
            Start Your Journey
            <ArrowRight class="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" @click="router.push('/login')">
            Sign In
          </Button>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="bg-card rounded-lg p-6 shadow-sm border"
        >
          <component :is="feature.icon" class="h-10 w-10 text-primary mb-4" />
          <h3 class="text-lg font-semibold mb-2">{{ feature.title }}</h3>
          <p class="text-muted-foreground">{{ feature.description }}</p>
        </div>
      </div>

      <div class="mt-20 text-center">
        <p class="text-muted-foreground mb-4">Try the demo accounts:</p>
        <div class="flex gap-4 justify-center flex-wrap">
          <Button 
            variant="secondary" 
            @click="authStore.demoLogin('candidate'); router.push('/candidate')"
          >
            Demo Candidate
          </Button>
          <Button 
            variant="secondary" 
            @click="authStore.demoLogin('manager'); router.push('/manager')"
          >
            Demo Manager
          </Button>
          <Button 
            variant="secondary" 
            @click="authStore.demoLogin('admin'); router.push('/admin')"
          >
            Demo Admin
          </Button>
        </div>
      </div>
    </main>
  </div>
</template>
