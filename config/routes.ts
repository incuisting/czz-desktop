import type { IRoute } from 'umi';

const routes: IRoute[] = [
  {
    path: '/',
    component: '@/layouts/BaseLayout',
    routes: [
      {
        path: '/home',
        component: '@/pages/home',
      },
      {
        path: '/database',
        component: '@/pages/database',
      },
      {
        path: '/auth',
        component: '@/pages/auth',
      },
    ],
  },
];
export default routes;
