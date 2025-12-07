<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { applicationsApi, jobsApi } from '@/lib/mockApi'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { FileText, Clock, CheckCircle, Users } from 'lucide-vue-next'

const { data: stats } = useQuery({
  queryKey: ['application-stats'],
  queryFn: () => applicationsApi.getStats()
})

const { data: applications } = useQuery({
  queryKey: ['applications'],
  queryFn: () => applicationsApi.getAll()
})
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Manager Dashboard</h1>
      <p class="text-muted-foreground">Manage and review candidate applications</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
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
          <Clock class="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats?.pending || 0 }}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Interview Stage</CardTitle>
          <Users class="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats?.interviews || 0 }}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Accepted</CardTitle>
          <CheckCircle class="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats?.byStatus?.Accepted || 0 }}</div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="applications?.length" class="space-y-3">
          <div 
            v-for="app in applications.slice(0, 10)" 
            :key="app.id"
            class="flex items-center justify-between p-3 rounded-md bg-muted/50"
          >
            <div>
              <p class="font-medium">{{ app.candidate?.fullName }}</p>
              <p class="text-sm text-muted-foreground">{{ app.job?.title }} - {{ app.job?.department?.name }}</p>
            </div>
            <span 
              :class="[
                'text-xs px-2 py-1 rounded-full',
                app.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                app.status === 'Passed Selection' ? 'bg-blue-100 text-blue-700' :
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
</template>
