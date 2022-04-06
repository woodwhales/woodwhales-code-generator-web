import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import CodeGenerator from '@/components/CodeGenerator'
import Connection from '@/components/Connection'
import TableDetail from '@/components/TableDetail'
import axios from '@/axios';

Vue.use(Router);
Vue.prototype.$axios = axios;

export default new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      name: 'Index',
      redirect:'codeGenerator',
      component: Index
    },
    {
      path: '/index',
      name: 'Index',
      redirect:'codeGenerator',
      component: Index
    },
    {
      path: '/connection',
      name: 'Connection',
      component: Connection
    },
    {
      path: '/codeGenerator',
      name: 'CodeGenerator',
      component: CodeGenerator
    },
    {
      path: '/tableDetail',
      name: 'TableDetail',
      component: TableDetail
    }
  ]
})
