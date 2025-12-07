<script setup lang="ts">
import { ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { skillsApi, trainingsApi, languagesApi } from '@/lib/mockApi'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { Plus, X, Wrench, Award, Globe } from 'lucide-vue-next'

const authStore = useAuthStore()
const toastStore = useToastStore()
const queryClient = useQueryClient()

const newSkill = ref('')
const newTraining = ref({ name: '', institution: '', year: '' })
const newLanguage = ref({ name: '', proficiency: 'Intermediate' })

const { data: skills } = useQuery({
  queryKey: ['skills', authStore.user?.id],
  queryFn: () => skillsApi.getByUserId(authStore.user!.id),
  enabled: !!authStore.user?.id
})

const { data: trainings } = useQuery({
  queryKey: ['trainings', authStore.user?.id],
  queryFn: () => trainingsApi.getByUserId(authStore.user!.id),
  enabled: !!authStore.user?.id
})

const { data: languages } = useQuery({
  queryKey: ['languages', authStore.user?.id],
  queryFn: () => languagesApi.getByUserId(authStore.user!.id),
  enabled: !!authStore.user?.id
})

const addSkillMutation = useMutation({
  mutationFn: (name: string) => skillsApi.create({ name, userId: authStore.user!.id }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['skills'] })
    newSkill.value = ''
  }
})

const deleteSkillMutation = useMutation({
  mutationFn: (id: string) => skillsApi.delete(id),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['skills'] })
})

const addTrainingMutation = useMutation({
  mutationFn: (data: typeof newTraining.value) => trainingsApi.create({ ...data, userId: authStore.user!.id }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['trainings'] })
    newTraining.value = { name: '', institution: '', year: '' }
    toastStore.toast({ title: 'Success', description: 'Training added' })
  }
})

const deleteTrainingMutation = useMutation({
  mutationFn: (id: string) => trainingsApi.delete(id),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trainings'] })
})

const addLanguageMutation = useMutation({
  mutationFn: (data: typeof newLanguage.value) => languagesApi.create({ ...data, userId: authStore.user!.id }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['languages'] })
    newLanguage.value = { name: '', proficiency: 'Intermediate' }
    toastStore.toast({ title: 'Success', description: 'Language added' })
  }
})

const deleteLanguageMutation = useMutation({
  mutationFn: (id: string) => languagesApi.delete(id),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['languages'] })
})

const handleAddSkill = () => {
  if (newSkill.value.trim()) {
    addSkillMutation.mutate(newSkill.value.trim())
  }
}
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Skills & Training</h1>
      <p class="text-muted-foreground">Manage your skills, certifications, and languages</p>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Wrench class="h-5 w-5" />
            Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex gap-2 mb-4">
            <Input 
              v-model="newSkill" 
              placeholder="Add a skill (e.g., JavaScript)"
              @keyup.enter="handleAddSkill"
            />
            <Button @click="handleAddSkill" :disabled="!newSkill.trim()">
              <Plus class="h-4 w-4" />
            </Button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="skill in skills" 
              :key="skill.id"
              class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
            >
              {{ skill.name }}
              <button @click="deleteSkillMutation.mutate(skill.id)" class="hover:text-destructive">
                <X class="h-3 w-3" />
              </button>
            </span>
            <span v-if="!skills?.length" class="text-sm text-muted-foreground">
              No skills added yet
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Globe class="h-5 w-5" />
            Languages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex gap-2 mb-4">
            <Input 
              v-model="newLanguage.name" 
              placeholder="Language"
              class="flex-1"
            />
            <select 
              v-model="newLanguage.proficiency"
              class="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Native</option>
            </select>
            <Button @click="addLanguageMutation.mutate(newLanguage)" :disabled="!newLanguage.name.trim()">
              <Plus class="h-4 w-4" />
            </Button>
          </div>
          <div class="space-y-2">
            <div 
              v-for="lang in languages" 
              :key="lang.id"
              class="flex items-center justify-between p-2 rounded-md bg-muted/50"
            >
              <div>
                <span class="font-medium">{{ lang.name }}</span>
                <span class="text-sm text-muted-foreground ml-2">{{ lang.proficiency }}</span>
              </div>
              <button @click="deleteLanguageMutation.mutate(lang.id)" class="text-muted-foreground hover:text-destructive">
                <X class="h-4 w-4" />
              </button>
            </div>
            <p v-if="!languages?.length" class="text-sm text-muted-foreground">
              No languages added yet
            </p>
          </div>
        </CardContent>
      </Card>

      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Award class="h-5 w-5" />
            Training & Certifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="addTrainingMutation.mutate(newTraining)" class="flex gap-2 mb-4 flex-wrap">
            <Input 
              v-model="newTraining.name" 
              placeholder="Certificate/Training name"
              class="flex-1 min-w-[200px]"
              required
            />
            <Input 
              v-model="newTraining.institution" 
              placeholder="Institution"
              class="flex-1 min-w-[150px]"
            />
            <Input 
              v-model="newTraining.year" 
              placeholder="Year"
              class="w-24"
            />
            <Button type="submit" :disabled="!newTraining.name.trim()">
              <Plus class="h-4 w-4 mr-1" />
              Add
            </Button>
          </form>
          
          <div class="space-y-2">
            <div 
              v-for="training in trainings" 
              :key="training.id"
              class="flex items-center justify-between p-3 rounded-md bg-muted/50"
            >
              <div>
                <p class="font-medium">{{ training.name }}</p>
                <p class="text-sm text-muted-foreground">
                  {{ training.institution }}
                  <span v-if="training.year"> ({{ training.year }})</span>
                </p>
              </div>
              <button @click="deleteTrainingMutation.mutate(training.id)" class="text-muted-foreground hover:text-destructive">
                <X class="h-4 w-4" />
              </button>
            </div>
            <p v-if="!trainings?.length" class="text-sm text-muted-foreground">
              No trainings or certifications added yet
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
