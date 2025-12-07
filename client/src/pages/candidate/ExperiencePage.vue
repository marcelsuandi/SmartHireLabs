<script setup lang="ts">
import { ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { experienceApi } from '@/lib/mockApi'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { Plus, Trash2, Briefcase } from 'lucide-vue-next'

const authStore = useAuthStore()
const toastStore = useToastStore()
const queryClient = useQueryClient()

const showForm = ref(false)
const form = ref({
  companyName: '',
  position: '',
  startDate: '',
  endDate: '',
  description: ''
})

const { data: experienceList, isLoading } = useQuery({
  queryKey: ['experience', authStore.user?.id],
  queryFn: () => experienceApi.getByUserId(authStore.user!.id),
  enabled: !!authStore.user?.id
})

const createMutation = useMutation({
  mutationFn: (data: typeof form.value) => 
    experienceApi.create({ ...data, userId: authStore.user!.id }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['experience'] })
    toastStore.toast({ title: 'Success', description: 'Experience added' })
    showForm.value = false
    resetForm()
  }
})

const deleteMutation = useMutation({
  mutationFn: (id: string) => experienceApi.delete(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['experience'] })
    toastStore.toast({ title: 'Success', description: 'Experience removed' })
  }
})

const resetForm = () => {
  form.value = { companyName: '', position: '', startDate: '', endDate: '', description: '' }
}

const handleSubmit = () => {
  createMutation.mutate(form.value)
}
</script>

<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Work Experience</h1>
        <p class="text-muted-foreground">Manage your work history</p>
      </div>
      <Button @click="showForm = !showForm">
        <Plus class="h-4 w-4 mr-2" />
        Add Experience
      </Button>
    </div>

    <Card v-if="showForm" class="mb-6 max-w-2xl">
      <CardHeader>
        <CardTitle>Add New Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <Label for="companyName">Company Name</Label>
              <Input id="companyName" v-model="form.companyName" placeholder="Company name" required />
            </div>
            <div class="space-y-2">
              <Label for="position">Position</Label>
              <Input id="position" v-model="form.position" placeholder="Your job title" required />
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <Label for="startDate">Start Date</Label>
              <Input id="startDate" type="date" v-model="form.startDate" required />
            </div>
            <div class="space-y-2">
              <Label for="endDate">End Date</Label>
              <Input id="endDate" type="date" v-model="form.endDate" placeholder="Leave empty if current" />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="description">Description</Label>
            <textarea 
              id="description"
              v-model="form.description"
              placeholder="Describe your responsibilities and achievements"
              rows="4"
              class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            ></textarea>
          </div>

          <div class="flex gap-2">
            <Button type="submit" :disabled="createMutation.isPending.value">
              {{ createMutation.isPending.value ? 'Adding...' : 'Add Experience' }}
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

    <div v-else-if="experienceList?.length" class="space-y-4">
      <Card v-for="exp in experienceList" :key="exp.id">
        <CardContent class="p-4">
          <div class="flex items-start justify-between">
            <div class="flex gap-4">
              <div class="p-2 bg-primary/10 rounded-lg">
                <Briefcase class="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 class="font-semibold">{{ exp.position }}</h3>
                <p class="text-sm font-medium text-primary">{{ exp.companyName }}</p>
                <p class="text-sm text-muted-foreground">
                  {{ exp.startDate }} - {{ exp.endDate || 'Present' }}
                </p>
                <p v-if="exp.description" class="text-sm mt-2">{{ exp.description }}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              @click="deleteMutation.mutate(exp.id)"
            >
              <Trash2 class="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card v-else>
      <CardContent class="p-8 text-center">
        <Briefcase class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-muted-foreground">No work experience yet. Add your first one!</p>
      </CardContent>
    </Card>
  </div>
</template>
