<script setup lang="ts">
interface Props {
  type?: string
  placeholder?: string
  modelValue?: string | number
  disabled?: boolean
  id?: string
  name?: string
  required?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <input
    :type="type"
    :placeholder="placeholder"
    :value="modelValue"
    :disabled="disabled"
    :id="id"
    :name="name"
    :required="required"
    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
