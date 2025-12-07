<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  LayoutDashboard, 
  User, 
  GraduationCap, 
  Briefcase, 
  Wrench, 
  Search, 
  FileText,
  Users,
  Settings,
  LogOut,
  Menu
} from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const candidateLinks = [
  { path: '/candidate', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/candidate/personal-data', label: 'Personal Data', icon: User },
  { path: '/candidate/education', label: 'Education', icon: GraduationCap },
  { path: '/candidate/experience', label: 'Experience', icon: Briefcase },
  { path: '/candidate/skills', label: 'Skills & Training', icon: Wrench },
  { path: '/candidate/search-jobs', label: 'Search Jobs', icon: Search },
  { path: '/candidate/my-applications', label: 'My Applications', icon: FileText },
]

const adminLinks = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/candidates', label: 'Candidates', icon: Users },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
]

const managerLinks = [
  { path: '/manager', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/manager/candidates', label: 'Candidates', icon: Users },
]

const links = computed(() => {
  if (!authStore.user) return []
  switch (authStore.user.role) {
    case 'candidate': return candidateLinks
    case 'admin': return adminLinks
    case 'manager': return managerLinks
    default: return []
  }
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<template>
  <aside class="w-64 border-r bg-background h-screen flex flex-col">
    <div class="p-4 border-b">
      <h1 class="text-xl font-bold text-primary">SmartHire</h1>
    </div>
    
    <nav class="flex-1 p-4 space-y-1">
      <router-link
        v-for="link in links"
        :key="link.path"
        :to="link.path"
        :class="[
          'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
          isActive(link.path) 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        ]"
      >
        <component :is="link.icon" class="h-4 w-4" />
        {{ link.label }}
      </router-link>
    </nav>
    
    <div class="p-4 border-t">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User class="h-4 w-4 text-primary" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">{{ authStore.user?.fullName }}</p>
          <p class="text-xs text-muted-foreground capitalize">{{ authStore.user?.role }}</p>
        </div>
      </div>
      <button
        @click="handleLogout"
        class="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors"
      >
        <LogOut class="h-4 w-4" />
        Logout
      </button>
    </div>
  </aside>
</template>
