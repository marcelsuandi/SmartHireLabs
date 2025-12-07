<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToastStore } from '@/stores/toast'
import { departmentsApi, positionsApi, jobsApi } from '@/lib/mockApi'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { Plus, Trash2, Building2, Briefcase, FileText } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const toastStore = useToastStore()
const queryClient = useQueryClient()

const activeTab = computed(() => route.params.tab as string || 'departments')
const tabs = [
  { id: 'departments', label: 'Departments', icon: Building2 },
  { id: 'positions', label: 'Positions', icon: Briefcase },
  { id: 'jobs', label: 'Jobs', icon: FileText }
]

const newDeptName = ref('')
const newPosName = ref('')
const selectedDeptId = ref('')

const { data: departments } = useQuery({
  queryKey: ['departments'],
  queryFn: () => departmentsApi.getAll()
})

const { data: positions } = useQuery({
  queryKey: ['positions'],
  queryFn: () => positionsApi.getAll()
})

const { data: jobs } = useQuery({
  queryKey: ['jobs'],
  queryFn: () => jobsApi.getAll()
})

const createDeptMutation = useMutation({
  mutationFn: (name: string) => departmentsApi.create({ name }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['departments'] })
    newDeptName.value = ''
    toastStore.toast({ title: 'Success', description: 'Department created' })
  }
})

const deleteDeptMutation = useMutation({
  mutationFn: (id: string) => departmentsApi.delete(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['departments'] })
    toastStore.toast({ title: 'Success', description: 'Department deleted' })
  }
})

const createPosMutation = useMutation({
  mutationFn: (data: { name: string; departmentId: string }) => positionsApi.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['positions'] })
    newPosName.value = ''
    toastStore.toast({ title: 'Success', description: 'Position created' })
  }
})

const deletePosMutation = useMutation({
  mutationFn: (id: string) => positionsApi.delete(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['positions'] })
    toastStore.toast({ title: 'Success', description: 'Position deleted' })
  }
})

const deleteJobMutation = useMutation({
  mutationFn: (id: string) => jobsApi.delete(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['jobs'] })
    toastStore.toast({ title: 'Success', description: 'Job deleted' })
  }
})
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Settings</h1>
      <p class="text-muted-foreground">Manage system configuration</p>
    </div>

    <div class="flex gap-2 mb-6 border-b">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="router.push(`/admin/settings/${tab.id}`)"
        :class="[
          'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
          activeTab === tab.id 
            ? 'border-primary text-primary' 
            : 'border-transparent text-muted-foreground hover:text-foreground'
        ]"
      >
        <component :is="tab.icon" class="h-4 w-4" />
        {{ tab.label }}
      </button>
    </div>

    <div v-if="activeTab === 'departments'">
      <Card class="max-w-2xl">
        <CardHeader>
          <CardTitle>Departments</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="createDeptMutation.mutate(newDeptName)" class="flex gap-2 mb-4">
            <Input v-model="newDeptName" placeholder="New department name" required />
            <Button type="submit" :disabled="!newDeptName.trim()">
              <Plus class="h-4 w-4 mr-1" />
              Add
            </Button>
          </form>
          <div class="space-y-2">
            <div 
              v-for="dept in departments" 
              :key="dept.id"
              class="flex items-center justify-between p-3 rounded-md bg-muted/50"
            >
              <span>{{ dept.name }}</span>
              <Button variant="ghost" size="icon" @click="deleteDeptMutation.mutate(dept.id)">
                <Trash2 class="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div v-else-if="activeTab === 'positions'">
      <Card class="max-w-2xl">
        <CardHeader>
          <CardTitle>Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="createPosMutation.mutate({ name: newPosName, departmentId: selectedDeptId })" class="flex gap-2 mb-4">
            <select 
              v-model="selectedDeptId"
              class="h-10 rounded-md border border-input bg-background px-3 text-sm"
              required
            >
              <option value="">Select department</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
            <Input v-model="newPosName" placeholder="Position name" required class="flex-1" />
            <Button type="submit" :disabled="!newPosName.trim() || !selectedDeptId">
              <Plus class="h-4 w-4 mr-1" />
              Add
            </Button>
          </form>
          <div class="space-y-2">
            <div 
              v-for="pos in positions" 
              :key="pos.id"
              class="flex items-center justify-between p-3 rounded-md bg-muted/50"
            >
              <div>
                <span>{{ pos.name }}</span>
                <span class="text-sm text-muted-foreground ml-2">
                  ({{ departments?.find(d => d.id === pos.departmentId)?.name }})
                </span>
              </div>
              <Button variant="ghost" size="icon" @click="deletePosMutation.mutate(pos.id)">
                <Trash2 class="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div v-else-if="activeTab === 'jobs'">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Job Listings</h2>
        <Button @click="router.push('/admin/settings/jobs/new')">
          <Plus class="h-4 w-4 mr-1" />
          New Job
        </Button>
      </div>
      <div class="space-y-4">
        <Card v-for="job in jobs" :key="job.id">
          <CardContent class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-semibold">{{ job.title }}</h3>
                <p class="text-sm text-muted-foreground">
                  {{ job.department?.name }} | {{ job.status }}
                </p>
              </div>
              <Button variant="ghost" size="icon" @click="deleteJobMutation.mutate(job.id)">
                <Trash2 class="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
