<script setup lang="ts">
import { ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { educationApi } from '@/lib/mockApi'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { Plus, Trash2, GraduationCap } from 'lucide-vue-next'

const authStore = useAuthStore()
const toastStore = useToastStore()
const queryClient = useQueryClient()

const showForm = ref(false)
const form = ref({
  level: '',
  schoolName: '',
  major: '',
  startDate: '',
  endDate: '',
  gpa: ''
})

const { data: educationList, isLoading } = useQuery({
  queryKey: ['education', authStore.user?.id],
  queryFn: () => educationApi.getByUserId(authStore.user!.id),
  enabled: !!authStore.user?.id
})

const createMutation = useMutation({
  mutationFn: (data: typeof form.value) => 
    educationApi.create({ ...data, userId: authStore.user!.id }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['education'] })
    toastStore.toast({ title: 'Success', description: 'Education added' })
    showForm.value = false
    resetForm()
  }
})

const deleteMutation = useMutation({
  mutationFn: (id: string) => educationApi.delete(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['education'] })
    toastStore.toast({ title: 'Success', description: 'Education removed' })
  }
})

const resetForm = () => {
  form.value = { level: '', schoolName: '', major: '', startDate: '', endDate: '', gpa: '' }
}

const handleSubmit = () => {
  createMutation.mutate(form.value)
}
</script>

<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Education</h1>
        <p class="text-muted-foreground">Manage your educational background</p>
      </div>
      <Button @click="showForm = !showForm">
        <Plus class="h-4 w-4 mr-2" />
        Add Education
      </Button>
    </div>

    <Card v-if="showForm" class="mb-6 max-w-2xl">
      <CardHeader>
        <CardTitle>Add New Education</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <Label for="level">Education Level</Label>
              <select 
                id="level" 
                v-model="form.level"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Select level</option>
                <option value="High School">High School</option>
                <option value="Diploma">Diploma</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Master">Master</option>
                <option value="Doctorate">Doctorate</option>
              </select>
            </div>
            <div class="space-y-2">
              <Label for="schoolName">Institution Name</Label>
              <Input id="schoolName" v-model="form.schoolName" placeholder="University/School name" required />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="major">Major/Field of Study</Label>
            <Input id="major" v-model="form.major" placeholder="e.g., Computer Science" required />
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <div class="space-y-2">
              <Label for="startDate">Start Date</Label>
              <Input id="startDate" type="date" v-model="form.startDate" required />
            </div>
            <div class="space-y-2">
              <Label for="endDate">End Date</Label>
              <Input id="endDate" type="date" v-model="form.endDate" />
            </div>
            <div class="space-y-2">
              <Label for="gpa">GPA</Label>
              <Input id="gpa" v-model="form.gpa" placeholder="e.g., 3.5" />
            </div>
          </div>

          <div class="flex gap-2">
            <Button type="submit" :disabled="createMutation.isPending.value">
              {{ createMutation.isPending.value ? 'Adding...' : 'Add Education' }}
            </Button>
            <Button type="button" variant="outline" @click="showForm = false; resetForm()">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="educationList?.length" class="space-y-4">
      <Card v-for="edu in educationList" :key="edu.id">
        <CardContent class="p-4">
          <div class="flex items-start justify-between">
            <div class="flex gap-4">
              <div class="p-2 bg-primary/10 rounded-lg">
                <GraduationCap class="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 class="font-semibold">{{ edu.schoolName }}</h3>
                <p class="text-sm text-muted-foreground">{{ edu.level }} in {{ edu.major }}</p>
                <p class="text-sm text-muted-foreground">
                  {{ edu.startDate }} - {{ edu.endDate || 'Present' }}
                  <span v-if="edu.gpa"> | GPA: {{ edu.gpa }}</span>
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              @click="deleteMutation.mutate(edu.id)"
            >
              <Trash2 class="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card v-else>
      <CardContent class="p-8 text-center">
        <GraduationCap class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-muted-foreground">No education records yet. Add your first one!</p>
      </CardContent>
    </Card>
  </div>
</template>
