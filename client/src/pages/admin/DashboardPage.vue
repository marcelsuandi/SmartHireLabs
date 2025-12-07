<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { applicationsApi, jobsApi, usersApi } from '@/lib/mockApi'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { Users, Briefcase, FileText, TrendingUp } from 'lucide-vue-next'

const { data: stats } = useQuery({
  queryKey: ['application-stats'],
  queryFn: () => applicationsApi.getStats()
})

const { data: jobs } = useQuery({
  queryKey: ['jobs'],
  queryFn: () => jobsApi.getAll()
})

const { data: users } = useQuery({
  queryKey: ['users'],
  queryFn: () => usersApi.getAll()
})

const { data: applications } = useQuery({
  queryKey: ['applications'],
  queryFn: () => applicationsApi.getAll()
})
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Admin Dashboard</h1>
      <p class="text-muted-foreground">Overview of the recruitment system</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Total Candidates</CardTitle>
          <Users class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ users?.filter(u => u.role === 'candidate').length || 0 }}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Active Jobs</CardTitle>
          <Briefcase class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ jobs?.filter(j => j.status === 'Active').length || 0 }}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Total Applications</CardTitle>
          <FileText class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats?.total || 0 }}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Pending Review</CardTitle>
          <TrendingUp class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats?.pending || 0 }}</div>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Application Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm">Applied</span>
              <span class="font-medium">{{ stats?.byStatus?.Applied || 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">Processing</span>
              <span class="font-medium">{{ stats?.byStatus?.Processing || 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">Passed Selection</span>
              <span class="font-medium">{{ stats?.byStatus?.['Passed Selection'] || 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-green-600">Accepted</span>
              <span class="font-medium text-green-600">{{ stats?.byStatus?.Accepted || 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-red-600">Rejected</span>
              <span class="font-medium text-red-600">{{ stats?.byStatus?.Rejected || 0 }}</span>
            </div>
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
              v-for="app in applications.slice(0, 5)" 
              :key="app.id"
              class="flex items-center justify-between p-2 rounded-md bg-muted/50"
            >
              <div>
                <p class="font-medium text-sm">{{ app.candidate?.fullName }}</p>
                <p class="text-xs text-muted-foreground">{{ app.job?.title }}</p>
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
          <p v-else class="text-sm text-muted-foreground">No applications yet</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
