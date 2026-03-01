import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('../views/layouts/MainLayout.vue'),
        children: [
            {
                path: '',
                name: 'Dashboard',
                component: () => import('../views/pages/Home.vue')
            },
            {
                path: 'about',
                name: 'UserList',
                component: () => import('../views/pages/About.vue')
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/pages/Login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/pages/Register.vue')
    },
    {
        path: '/editor',
        name: 'Editor',
        component: () => import('../views/pages/Editor.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router