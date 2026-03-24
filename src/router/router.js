import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('../views/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/pages/HomePage.vue'),
      },
      {
        path: 'about',
        name: 'UserList',
        component: () => import('../views/pages/AboutFinis.vue'),
      },
      {
        path: 'space/:id',
        name: 'userSpace',
        component: () => import('../views/pages/PersonalPage.vue'),
        props: true,
      },
      {
        path: 'article/:id',
        name: 'article',
        component: () => import('../views/pages/ArticlePage.vue'),
        props: true,
      },
      {
        path: 'notfound',
        name: 'notFound',
        component: () => import('../views/pages/NotFound.vue'),
      },
      {
        path: 'setting',
        name: 'setting',
        component: () => import('../views/pages/ModifyPersonalData.vue'),
      },
      {
        path: 'rag',
        name: 'RAG',
        component: () => import('../views/pages/RagPage.vue')
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('../views/pages/SearchResult.vue'),
        props: route => ({
          keyword: route.query.query
        })
      }
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/pages/LoginPage.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/pages/Register.vue'),
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import('../views/pages/ArticleEditor.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
