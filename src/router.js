import Vue from 'vue'
import Router from 'vue-router'

import Dashboard from './components/Dashboard'
import ProcessDetail from './components/ProcessDetail'
import AccessCell from './components/AccessCell'
import PreviousComments from './components/PreviousComments'

Vue.use(Router)

export default new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'AccessCell',
            component: AccessCell
        },
        {
            path: '/previousComments',
            name: 'PreviousComments',
            component: PreviousComments
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: Dashboard
        },
        {
            path: '/processDetail/:id',
            name: 'ProcessDetail',
            component: ProcessDetail
        },

    ]
})