<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { applicationsApi } from '@/lib/mockApi'
import type { ApplicationStatus } from '@shared/schema'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { Search, User, Mail, Phone, Download } from 'lucide-vue-next'

const authStore = useAuthStore()
const toastStore = useToastStore()
const queryClient = useQueryClient()

const searchQuery = ref('')
const statusFilter = ref<string>('all')

const { data: applications, isLoading } = useQuery({
  queryKey: ['applications'],
  queryFn: () => applicationsApi.getAll()
})

const filteredApplications = computed(() => {
  if (!applications.value) return []
  let result = applications.value
  
  if (statusFilter.value !== 'all') {
    result = result.filter(a => a.status === statusFilter.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(a => 
      a.candidate?.fullName?.toLowerCase().includes(query) ||
      a.candidate?.email?.toLowerCase().includes(query) ||
      a.job?.title?.toLowerCase().includes(query)
    )
  }
  
  return result
})

const updateStatusMutation = useMutation({
  mutationFn: ({ appId, status }: { appId: string; status: ApplicationStatus }) => 
    applicationsApi.updateStatus(appId, status, authStore.user!.fullName, 'admin'),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['applications'] })
    toastStore.toast({
      title: 'Success',
      description: 'Application status updated'
    })
  }
})

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Accepted': return 'bg-green-100 text-green-700'
    case 'Rejected': return 'bg-red-100 text-red-700'
    case 'Passed Selection': return 'bg-blue-100 text-blue-700'
    case 'Processing': return 'bg-yellow-100 text-yellow-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const statuses: ApplicationStatus[] = ['Applied', 'Processing', 'Passed Selection', 'Accepted', 'Rejected']
</script>

<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Candidates</h1>
        <p class="text-muted-foreground">Manage job applications</p>
      </div>
    </div>

    <div class="flex gap-4 mb-6 flex-wrap">
      <div class="relative flex-1 min-w-[200px] max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          v-model="searchQuery"
          placeholder="Search candidates or jobs..."
          class="pl-10"
        />
      </div>
      <select 
        v-model="statusFilter"
        class="h-10 rounded-md border border-input bg-background px-3 text-sm"
      >
        <option value="all">All Statuses</option>
        <option v-for="status in statuses" :key="status" :value="status">
          {{ status }}
        </option>
      </select>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="filteredApplications.length" class="space-y-4">
      <Card v-for="app in filteredApplications" :key="app.id">
        <CardContent class="p-6">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User class="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 class="font-semibold">{{ app.candidate?.fullName || 'Unknown' }}</h3>
                <p class="text-primary text-sm">{{ app.job?.title }}</p>
                <div class="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                  <span class="flex items-center gap-1">
                    <Mail class="h-3 w-3" />
                    {{ app.candidate?.email }}
                  </span>
                  <span v-if="app.candidate?.phone" class="flex items-center gap-1">
                    <Phone class="h-3 w-3" />
                    {{ app.candidate?.phone }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3 flex-wrap">
              <span :class="['px-3 py-1 rounded-full text-sm font-medium', getStatusColor(app.status)]">
                {{ app.status }}
              </span>
              <select 
                :value="app.status"
                @change="updateStatusMutation.mutate({ appId: app.id, status: ($event.target as HTMLSelectElement).value as ApplicationStatus })"
                class="h-9 rounded-md border border-input bg-background px-2 text-sm"
              >
                <option v-for="status in statuses" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card v-else>
      <CardContent class="p-8 text-center">
        <User class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-muted-foreground">No applications found</p>
      </CardContent>
    </Card>
  </div>
</template>
