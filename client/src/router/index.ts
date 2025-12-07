import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/pages/LandingPage.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/auth/LoginPage.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/pages/auth/SignupPage.vue')
    },
    {
      path: '/candidate',
      name: 'candidate-dashboard',
      component: () => import('@/pages/candidate/DashboardPage.vue'),
      meta: { requiresAuth: true, roles: ['candidate'] }
    },
    {
      path: '/candidate/personal-data',
      name: 'candidate-personal-data',
      component: () => import('@/pages/candidate/PersonalDataPage.vue'),
      meta: { requiresAuth: true, roles: ['candidate'] }
    },
    {
      path: '/candidate/education',
      name: 'candidate-education',
      component: () => import('@/pages/candidate/EducationPage.vue'),
      meta: { requiresAuth: true, roles: ['candidate'] }
    },
    {
      path: '/candidate/experience',
      name: 'candidate-experience',
      component: () => import('@/pages/candidate/ExperiencePage.vue'),
      meta: { requiresAuth: true, roles: ['candidate'] }
    },
    {
      path: '/candidate/skills',
      name: 'candidate-skills',
      component: () => import('@/pages/candidate/SkillsPage.vue'),
      meta: { requiresAuth: true, roles: ['candidate'] }
    },
    {
      path: '/candidate/search-jobs',
      name: 'candidate-search-jobs',
      component: () => import('@/pages/candidate/SearchJobsPage.vue'),
      meta: { requiresAuth: true, roles: ['candidate'] }
    },
    {
      path: '/candidate/my-applications',
      name: 'candidate-my-applications',
      component: () => import('@/pages/candidate/MyApplicationsPage.vue'),
      meta: { requiresAuth: true, roles: ['candidate'] }
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('@/pages/admin/DashboardPage.vue'),
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: '/admin/candidates',
      name: 'admin-candidates',
      component: () => import('@/pages/admin/CandidatesPage.vue'),
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: '/admin/settings/:tab?',
      name: 'admin-settings',
      component: () => import('@/pages/admin/SettingsPage.vue'),
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: '/admin/settings/jobs/new',
      name: 'admin-job-form',
      component: () => import('@/pages/admin/JobFormPage.vue'),
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: '/manager',
      name: 'manager-dashboard',
      component: () => import('@/pages/manager/DashboardPage.vue'),
      meta: { requiresAuth: true, roles: ['manager'] }
    },
    {
      path: '/manager/candidates',
      name: 'manager-candidates',
      component: () => import('@/pages/manager/CandidatesPage.vue'),
      meta: { requiresAuth: true, roles: ['manager'] }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth) {
    if (!authStore.user) {
      next('/login')
      return
    }
    
    const allowedRoles = to.meta.roles as string[] | undefined
    if (allowedRoles && !allowedRoles.includes(authStore.user.role)) {
      const defaultPath = authStore.user.role === 'candidate' ? '/candidate' : 
                          authStore.user.role === 'admin' ? '/admin' : '/manager'
      next(defaultPath)
      return
    }
  }
  
  next()
})

export default router
