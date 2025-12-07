<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useAuthStore } from '@/stores/auth'
import { applicationsApi, getCandidateDetails } from '@/lib/mockApi'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { FileText, CheckCircle, Clock, XCircle } from 'lucide-vue-next'

const authStore = useAuthStore()

const { data: applications } = useQuery({
  queryKey: ['applications', authStore.user?.id],
  queryFn: () => applicationsApi.getByUserId(authStore.user!.id),
  enabled: !!authStore.user?.id
})

const { data: candidateDetails } = useQuery({
  queryKey: ['candidate-details', authStore.user?.id],
  queryFn: () => getCandidateDetails(authStore.user!.id),
  enabled: !!authStore.user?.id
})

const stats = computed(() => {
  if (!applications.value) return { total: 0, pending: 0, accepted: 0, rejected: 0 }
  return {
    total: applications.value.length,
    pending: applications.value.filter(a => ['Applied', 'Processing', 'Passed Selection'].includes(a.status)).length,
    accepted: applications.value.filter(a => a.status === 'Accepted').length,
    rejected: applications.value.filter(a => a.status === 'Rejected').length
  }
})

const profileCompletion = computed(() => {
  if (!candidateDetails.value) return 0
  let score = 0
  if (candidateDetails.value.fullName) score += 20
  if (candidateDetails.value.profile) score += 20
  if (candidateDetails.value.education?.length) score += 20
  if (candidateDetails.value.experience?.length) score += 20
  if (candidateDetails.value.skills?.length) score += 20
  return score
})
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Welcome back, {{ authStore.user?.fullName }}!</h1>
      <p class="text-muted-foreground">Here's an overview of your job search progress.</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Total Applications</CardTitle>
          <FileText class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.total }}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Pending</CardTitle>
          <Clock class="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.pending }}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Accepted</CardTitle>
          <CheckCircle class="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.accepted }}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Rejected</CardTitle>
          <XCircle class="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.rejected }}</div>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Profile Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span>Progress</span>
              <span>{{ profileCompletion }}%</span>
            </div>
            <div class="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                class="h-full bg-primary transition-all" 
                :style="{ width: `${profileCompletion}%` }"
              ></div>
            </div>
            <p class="text-sm text-muted-foreground mt-2">
              Complete your profile to increase your chances of getting hired!
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="applications?.length" class="space-y-3">
            <div 
              v-for="app in applications.slice(0, 3)" 
              :key="app.id"
              class="flex items-center justify-between p-2 rounded-md bg-muted/50"
            >
              <div>
                <p class="font-medium text-sm">{{ app.job?.title || 'Unknown Position' }}</p>
                <p class="text-xs text-muted-foreground">{{ app.job?.department?.name }}</p>
              </div>
              <span 
                :class="[
                  'text-xs px-2 py-1 rounded-full',
                  app.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                  app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                ]"
              >
                {{ app.status }}
              </span>
            </div>
          </div>
          <p v-else class="text-sm text-muted-foreground">
            No applications yet. Start searching for jobs!
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
