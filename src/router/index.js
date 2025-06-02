import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'Home', component: () => import('@/components/Home.vue') },
  { path: '/news', name: 'News', component: () => import('@/components/News.vue') },
  { path: '/about', name: 'About', component: () => import('@/components/About.vue') },

  // Защищённые маршруты
  {
    path: '/panel',
    name: 'Panel',
    component: () => import('@/components/Panel.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/submit',
    name: 'Submit',
    component: () => import('@/components/Submit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/my-requests',
    name: 'MyRequests',
    component: () => import('@/components/MyRequests.vue'),
    meta: { requiresAuth: true }
  },

  { path: '/account', name: 'Account', component: () => import('@/components/Account.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

  if (to.meta.requiresAuth) {
    if (!currentUser) {
      // Гость — редирект на страницу входа
      return next('/account');
    }

    if (to.meta.requiresAdmin && currentUser.role !== 'admin') {
      // Если роут для админа, а пользователь не админ — редирект на главную
      return next('/');
    }

    // Запрет админу заходить на страницы пользователя
    if ((to.path === '/submit' || to.path === '/my-requests') && currentUser.role === 'admin') {
      return next('/');
    }

    // Всё ок — пропускаем
    return next();
  }

  // Роут не требует авторизации — пропускаем
  next();
});

export default router;
