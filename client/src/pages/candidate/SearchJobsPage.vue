<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { jobsApi, applicationsApi } from '@/lib/mockApi'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { Search, MapPin, Briefcase, DollarSign, Calendar } from 'lucide-vue-next'

const authStore = useAuthStore()
const toastStore = useToastStore()
const queryClient = useQueryClient()

const searchQuery = ref('')

const { data: jobs, isLoading } = useQuery({
  queryKey: ['jobs-active'],
  queryFn: () => jobsApi.getActive()
})

const { data: applications } = useQuery({
  queryKey: ['applications', authStore.user?.id],
  queryFn: () => applicationsApi.getByUserId(authStore.user!.id),
  enabled: !!authStore.user?.id
})

const appliedJobIds = computed(() => 
  new Set(applications.value?.map(a => a.jobId) || [])
)

const filteredJobs = computed(() => {
  if (!jobs.value) return []
  if (!searchQuery.value) return jobs.value
  const query = searchQuery.value.toLowerCase()
  return jobs.value.filter(job => 
    job.title.toLowerCase().includes(query) ||
    job.department?.name?.toLowerCase().includes(query) ||
    job.location?.toLowerCase().includes(query)
  )
})

const applyMutation = useMutation({
  mutationFn: (jobId: string) => applicationsApi.create(jobId, authStore.user!.id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['applications'] })
    toastStore.toast({
      title: 'Success',
      description: 'Application submitted successfully!'
    })
  },
  onError: (error: any) => {
    toastStore.toast({
      title: 'Error',
      description: error.message || 'Failed to apply',
      variant: 'destructive'
    })
  }
})

const formatSalary = (min?: number, max?: number) => {
  if (!min && !max) return 'Not specified'
  if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`
  if (min) return `From $${min.toLocaleString()}`
  return `Up to $${max?.toLocaleString()}`
}
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Search Jobs</h1>
      <p class="text-muted-foreground">Find your perfect opportunity</p>
    </div>

    <div class="mb-6">
      <div class="relative max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          v-model="searchQuery"
          placeholder="Search by title, department, or location..."
          class="pl-10"
        />
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="filteredJobs.length" class="grid gap-4">
      <Card v-for="job in filteredJobs" :key="job.id">
        <CardContent class="p-6">
          <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold mb-1">{{ job.title }}</h3>
              <p class="text-primary font-medium mb-3">{{ job.department?.name }}</p>
              
              <div class="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <span v-if="job.location" class="flex items-center gap-1">
                  <MapPin class="h-4 w-4" />
                  {{ job.location }}
                </span>
                <span class="flex items-center gap-1">
                  <Briefcase class="h-4 w-4" />
                  {{ job.employmentType || 'Full-time' }}
                </span>
                <span class="flex items-center gap-1">
                  <DollarSign class="h-4 w-4" />
                  {{ formatSalary(job.salaryMin, job.salaryMax) }}
                </span>
                <span v-if="job.postedAt" class="flex items-center gap-1">
                  <Calendar class="h-4 w-4" />
                  {{ new Date(job.postedAt).toLocaleDateString() }}
                </span>
              </div>

              <p v-if="job.description" class="text-sm text-muted-foreground line-clamp-2">
                {{ job.description }}
              </p>

              <div v-if="job.requirements" class="mt-3">
                <p class="text-sm font-medium mb-1">Requirements:</p>
                <p class="text-sm text-muted-foreground">{{ job.requirements }}</p>
              </div>
            </div>

            <div class="shrink-0">
              <Button 
                v-if="appliedJobIds.has(job.id)"
                variant="secondary"
                disabled
              >
                Applied
              </Button>
              <Button 
                v-else
                @click="applyMutation.mutate(job.id)"
                :disabled="applyMutation.isPending.value"
              >
                Apply Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card v-else>
      <CardContent class="p-8 text-center">
        <Search class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-muted-foreground">
          {{ searchQuery ? 'No jobs match your search' : 'No active jobs available at the moment' }}
        </p>
      </CardContent>
    </Card>
  </div>
</template>
