import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, UserRole } from '@shared/schema'
import { demoUsers } from '@/lib/mockData'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(true)

  const init = () => {
    const savedUser = localStorage.getItem('smarthire_user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
    isLoading.value = false
  }

  const login = async (email: string, password: string): Promise<void> => {
    const foundUser = demoUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )

    if (!foundUser) {
      throw new Error('Invalid email or password')
    }

    const userWithoutPassword = { ...foundUser, password: '' }
    user.value = userWithoutPassword
    localStorage.setItem('smarthire_user', JSON.stringify(userWithoutPassword))
  }

  const register = async (data: { fullName: string; email: string; password: string; phone: string }): Promise<void> => {
    const exists = demoUsers.find(u => u.email.toLowerCase() === data.email.toLowerCase())
    
    if (exists) {
      throw new Error('Email already registered')
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      phone: data.phone,
      role: 'candidate'
    }

    demoUsers.push(newUser)
    const userWithoutPassword = { ...newUser, password: '' }
    user.value = userWithoutPassword
    localStorage.setItem('smarthire_user', JSON.stringify(userWithoutPassword))
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('smarthire_user')
  }

  const demoLogin = (role: UserRole) => {
    const demoUser = demoUsers.find(u => u.role === role)
    if (demoUser) {
      const userWithoutPassword = { ...demoUser, password: '' }
      user.value = userWithoutPassword
      localStorage.setItem('smarthire_user', JSON.stringify(userWithoutPassword))
    }
  }

  init()

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    demoLogin
  }
})
