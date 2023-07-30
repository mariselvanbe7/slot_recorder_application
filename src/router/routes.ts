import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { Cookies } from 'quasar';

// Define a route guard function
const requireAuth = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const isAuthenticated = !!Cookies.get('userName');

  if (isAuthenticated) {
    next();
  } else {
    next({ name: 'login' });
  }
};

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/LoginPage/LoginCom.vue'),
    children: [
      {
        path: '/',
        component: () => import('@/LoginPage/LoginForm.vue')
      },
      {
        path: '/register',
        component: () => import('@/LoginPage/RegisterForm.vue')
      }
    ]
  },
  {
    path: '/entry',
    component: () => import('@/Layouts/dashboardLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('@/components/EntryComp.vue'),
      },
      {
        path:'/lists',
        component: () => import('@/components/EntryListComp.vue')
      },
      {
        path:'/exits',
        component: () => import('@/components/CheckoutVechiclesComp.vue')
      },
      {
        path:'/checkedIn',
        component: () => import('@/components/CheckInVechiclesComp.vue')
      }
    ],
    beforeEnter: requireAuth,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
