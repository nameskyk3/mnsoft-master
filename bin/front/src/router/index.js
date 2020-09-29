import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export const ROUTES = [
  {
    menuId: 1000,
    path: '/login',
    name: 'login',
    component: () => import('@/site/login/login-container'),
    displayName: '로그인',
    children: [
      { menuId: 1200,
        path: 'default-login',
        alias: '',
        name: 'default_kakao',
        displayName: '기본로그인',
        component: () => import('@/site/login/default-login')
      },
      {
        menuId: 1200,
        path: 'kakao-login',
        name: 'login_kakao',
        displayName: '카카오로그인',
        component: () => import('@/site/login/kakao-login')
      },
      {
        menuId: 1300,
        path: 'naver-login',
        name: 'login_naver',
        displayName: '네이버',
        component: () => import('@/site/login/naver-login')
      }
    ]
  },
  {
    menuId: 2000,
    path: '/component',
    name: 'component',
    displayName: '컴포넌트',
    component: () => import('@/site/component/component')
  },
  {
    menuId: 3000,
    path: '/test',
    name: 'test',
    displayName: 'test',
    component: () => import('@/site/test/test-manage')
  },
  {
    menuId: 4000,
    path: '/menu',
    name: 'menu',
    displayName: 'menu',
    component: () => import('@/site/menu/menu-list')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes: ROUTES
})

export default router
