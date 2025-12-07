<script setup lang="ts">
import { ref, watch } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { profileApi } from '@/lib/mockApi'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'

const authStore = useAuthStore()
const toastStore = useToastStore()
const queryClient = useQueryClient()

const form = ref({
  ktpNumber: '',
  placeOfBirth: '',
  dateOfBirth: '',
  gender: '',
  maritalStatus: '',
  religion: '',
  nationality: '',
  address: ''
})

const { data: profile, isLoading } = useQuery({
  queryKey: ['profile', authStore.user?.id],
  queryFn: () => profileApi.getByUserId(authStore.user!.id),
  enabled: !!authStore.user?.id
})

watch(profile, (newProfile) => {
  if (newProfile) {
    form.value = {
      ktpNumber: newProfile.ktpNumber || '',
      placeOfBirth: newProfile.placeOfBirth || '',
      dateOfBirth: newProfile.dateOfBirth || '',
      gender: newProfile.gender || '',
      maritalStatus: newProfile.maritalStatus || '',
      religion: newProfile.religion || '',
      nationality: newProfile.nationality || '',
      address: newProfile.address || ''
    }
  }
}, { immediate: true })

const mutation = useMutation({
  mutationFn: (data: typeof form.value) => 
    profileApi.upsert(authStore.user!.id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['profile'] })
    toastStore.toast({
      title: 'Success',
      description: 'Personal data updated successfully'
    })
  },
  onError: () => {
    toastStore.toast({
      title: 'Error',
      description: 'Failed to update personal data',
      variant: 'destructive'
    })
  }
})

const handleSubmit = () => {
  mutation.mutate(form.value)
}
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Personal Data</h1>
      <p class="text-muted-foreground">Update your personal information</p>
    </div>

    <Card class="max-w-2xl">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="isLoading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
        
        <form v-else @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <Label for="ktpNumber">KTP Number</Label>
              <Input id="ktpNumber" v-model="form.ktpNumber" placeholder="Enter KTP number" />
            </div>
            <div class="space-y-2">
              <Label for="nationality">Nationality</Label>
              <Input id="nationality" v-model="form.nationality" placeholder="Enter nationality" />
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <Label for="placeOfBirth">Place of Birth</Label>
              <Input id="placeOfBirth" v-model="form.placeOfBirth" placeholder="Enter place of birth" />
            </div>
            <div class="space-y-2">
              <Label for="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" type="date" v-model="form.dateOfBirth" />
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <Label for="gender">Gender</Label>
              <select 
                id="gender" 
                v-model="form.gender"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div class="space-y-2">
              <Label for="maritalStatus">Marital Status</Label>
              <select 
                id="maritalStatus" 
                v-model="form.maritalStatus"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
          </div>

          <div class="space-y-2">
            <Label for="religion">Religion</Label>
            <Input id="religion" v-model="form.religion" placeholder="Enter religion" />
          </div>

          <div class="space-y-2">
            <Label for="address">Address</Label>
            <textarea 
              id="address"
              v-model="form.address"
              placeholder="Enter your full address"
              rows="3"
              class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            ></textarea>
          </div>

          <Button type="submit" :disabled="mutation.isPending.value">
            {{ mutation.isPending.value ? 'Saving...' : 'Save Changes' }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
