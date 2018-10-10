import Vue from 'vue'
import Router from 'vue-router'
import taskManage from './views/taskManage.vue'
import statistics from './views/statistics.vue'
import taskManageChildFolder from './views/taskManageChildFolder.vue'
import Predict from './views/predict.vue'
import DataAnalysis from './views/dataAnalysis.vue'
import Protein3D from './views/protein3D.vue'
import Login from './login.vue'
import App from './App.vue'
import TaskManageMain from './components/taskManageMain'
import StatusMonitor from './views/statusMonitor'

Vue.use(Router)

export default new Router({
    mode: 'history',
    linkActiveClass: 'router-link-exact-active',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            name: 'login',
            component: Login,
        },
        {
            path: '/app',
            component: App,
            name: 'app',
            children: [{
                    path: '/',
                    redirect: '/taskManage'
                },
                {
                    path: '/taskManage',
                    name: 'taskManage',
                    component: taskManage,
                    children: [{
                            path: '',
                            name: 'taskManageMain',
                            component: TaskManageMain,
                        },
                        {
                            path: 'statusMonitor',
                            name: 'statusMonitor',
                            component: StatusMonitor
                        },
                        {
                            path: 'taskManageChildFolder/:fileName',
                            name: 'taskManageChildFolder',
                            component: taskManageChildFolder
                        },
                        {
                            path: 'predict',
                            name: 'predict',
                            component: Predict
                        },
                        {
                            path: 'statistics',
                            name: 'statistics',
                            component: statistics
                        },
                        {
                            path: 'protein3D',
                            name: 'protein3D',
                            component: Protein3D
                        }
                    ]
                },
                {
                    path: '/statusMonitor',
                    name: 'statusMonitor',
                    // route level code-splitting
                    // this generates a separate chunk (about.[hash].js) for this route
                    // which is lazy-loaded when the route is visited.
                    component: () =>
                        import ( /* webpackChunkName: "about" */ './views/statusMonitor.vue')
                },
                {
                    path: '/statistics',
                    name: 'statistics',
                    component: statistics
                },
                {
                    path: '/predict',
                    name: 'predict',
                    component: Predict
                },
                {
                    path: '/dataAnalysis',
                    name: 'dataAnalysis',
                    component: DataAnalysis
                }
            ]
        }
    ]
});