<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { useAuthStore } from '@/stores/auth'
import { applicationsApi } from '@/lib/mockApi'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { FileText, Building2, Calendar, Clock } from 'lucide-vue-next'

const authStore = useAuthStore()

const { data: applications, isLoading } = useQuery({
  queryKey: ['applications', authStore.user?.id],
  queryFn: () => applicationsApi.getByUserId(authStore.user!.id),
  enabled: !!authStore.user?.id
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
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">My Applications</h1>
      <p class="text-muted-foreground">Track your job applications</p>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="applications?.length" class="space-y-4">
      <Card v-for="app in applications" :key="app.id">
        <CardContent class="p-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-start gap-4">
                <div class="p-3 bg-primary/10 rounded-lg shrink-0">
                  <Building2 class="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 class="font-semibold text-lg">{{ app.job?.title || 'Unknown Position' }}</h3>
                  <p class="text-primary">{{ app.job?.department?.name || 'Unknown Department' }}</p>
                  <div class="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                    <span class="flex items-center gap-1">
                      <Calendar class="h-4 w-4" />
                      Applied: {{ new Date(app.appliedAt).toLocaleDateString() }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col items-end gap-2">
              <span :class="['px-3 py-1 rounded-full text-sm font-medium', getStatusColor(app.status)]">
                {{ app.status }}
              </span>
            </div>
          </div>

          <div v-if="app.history?.length" class="mt-4 pt-4 border-t">
            <p class="text-sm font-medium mb-2 flex items-center gap-2">
              <Clock class="h-4 w-4" />
              Application History
            </p>
            <div class="space-y-2">
              <div 
                v-for="hist in app.history" 
                :key="hist.id"
                class="flex items-center justify-between text-sm"
              >
                <span :class="['px-2 py-0.5 rounded text-xs', getStatusColor(hist.status)]">
                  {{ hist.status }}
                </span>
                <span class="text-muted-foreground">
                  {{ new Date(hist.timestamp).toLocaleDateString() }} by {{ hist.actor }}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card v-else>
      <CardContent class="p-8 text-center">
        <FileText class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-muted-foreground mb-4">You haven't applied to any jobs yet.</p>
        <router-link 
          to="/candidate/search-jobs"
          class="text-primary hover:underline"
        >
          Start searching for jobs
        </router-link>
      </CardContent>
    </Card>
  </div>
</template>
