import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../components/pages/Index.vue'),
    },
    {
      path: '/users',
      component: () => import('../components/ui/UserGrid.vue'),
    },
    {
      path: '/employees',
      component: () => import('../components/ui/EmployeeGrid.vue'),
    },
    {
      path: '/notifications',
      component: () => import('../components/ui/NotificationGrid.vue'),
    },
    {
      path: '/alerts',
      component: () => import('../components/ui/AlertGrid.vue'),
    },
    {
      path: '/cctvs',
      component: () => import('../components/ui/CctvGrid.vue'),
    },
    {
      path: '/strangeObjects',
      component: () => import('../components/ui/StrangeObjectGrid.vue'),
    },
    {
      path: '/workers',
      component: () => import('../components/ui/WorkerGrid.vue'),
    },
    {
      path: '/workTrucks',
      component: () => import('../components/ui/WorkTruckGrid.vue'),
    },
    {
      path: '/runwayCracks',
      component: () => import('../components/ui/RunwayCrackGrid.vue'),
    },
    {
      path: '/runwayCrackReports',
      component: () => import('../components/ui/RunwayCrackReportGrid.vue'),
    },
    {
      path: '/equipmentReports',
      component: () => import('../components/ui/EquipmentReportGrid.vue'),
    },
    {
      path: '/equipment',
      component: () => import('../components/ui/EquipmentGrid.vue'),
    },
  ],
})

export default router;
