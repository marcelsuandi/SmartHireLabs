<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToastStore } from '@/stores/toast'
import { jobsApi, departmentsApi, positionsApi } from '@/lib/mockApi'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'

const router = useRouter()
const toastStore = useToastStore()
const queryClient = useQueryClient()

const form = ref({
  title: '',
  departmentId: '',
  positionId: '',
  location: '',
  employmentType: 'Full-time',
  salaryMin: '',
  salaryMax: '',
  description: '',
  requirements: '',
  status: 'Active' as 'Active' | 'Closed'
})

const { data: departments } = useQuery({
  queryKey: ['departments'],
  queryFn: () => departmentsApi.getAll()
})

const { data: positions } = useQuery({
  queryKey: ['positions'],
  queryFn: () => positionsApi.getAll()
})

const createMutation = useMutation({
  mutationFn: () => jobsApi.create({
    ...form.value,
    salaryMin: form.value.salaryMin ? parseInt(form.value.salaryMin) : undefined,
    salaryMax: form.value.salaryMax ? parseInt(form.value.salaryMax) : undefined,
    postedAt: new Date().toISOString()
  }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['jobs'] })
    toastStore.toast({ title: 'Success', description: 'Job created successfully' })
    router.push('/admin/settings/jobs')
  },
  onError: () => {
    toastStore.toast({ title: 'Error', description: 'Failed to create job', variant: 'destructive' })
  }
})
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Create New Job</h1>
      <p class="text-muted-foreground">Add a new job listing</p>
    </div>

    <Card class="max-w-2xl">
      <CardHeader>
        <CardTitle>Job Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="createMutation.mutate()" class="space-y-4">
          <div class="space-y-2">
            <Label for="title">Job Title</Label>
            <Input id="title" v-model="form.title" placeholder="e.g., Senior Software Engineer" required />
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <Label for="department">Department</Label>
              <select 
                id="department"
                v-model="form.departmentId"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Select department</option>
                <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                  {{ dept.name }}
                </option>
              </select>
            </div>
            <div class="space-y-2">
              <Label for="position">Position</Label>
              <select 
                id="position"
                v-model="form.positionId"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select position</option>
                <option 
                  v-for="pos in positions?.filter(p => p.departmentId === form.departmentId)" 
                  :key="pos.id" 
                  :value="pos.id"
                >
                  {{ pos.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <Label for="location">Location</Label>
              <Input id="location" v-model="form.location" placeholder="e.g., Jakarta, Indonesia" />
            </div>
            <div class="space-y-2">
              <Label for="employmentType">Employment Type</Label>
              <select 
                id="employmentType"
                v-model="form.employmentType"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <Label for="salaryMin">Minimum Salary</Label>
              <Input id="salaryMin" type="number" v-model="form.salaryMin" placeholder="e.g., 50000" />
            </div>
            <div class="space-y-2">
              <Label for="salaryMax">Maximum Salary</Label>
              <Input id="salaryMax" type="number" v-model="form.salaryMax" placeholder="e.g., 80000" />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="description">Description</Label>
            <textarea 
              id="description"
              v-model="form.description"
              placeholder="Describe the job role and responsibilities"
              rows="4"
              class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            ></textarea>
          </div>

          <div class="space-y-2">
            <Label for="requirements">Requirements</Label>
            <textarea 
              id="requirements"
              v-model="form.requirements"
              placeholder="List the required skills and qualifications"
              rows="4"
              class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            ></textarea>
          </div>

          <div class="space-y-2">
            <Label for="status">Status</Label>
            <select 
              id="status"
              v-model="form.status"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div class="flex gap-2 pt-4">
            <Button type="submit" :disabled="createMutation.isPending.value">
              {{ createMutation.isPending.value ? 'Creating...' : 'Create Job' }}
            </Button>
            <Button type="button" variant="outline" @click="router.back()">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
