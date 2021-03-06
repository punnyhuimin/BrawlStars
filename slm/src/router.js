import Vue from 'vue';
import Router from 'vue-router';
import firebase from 'firebase'

import Home from './components/Home.vue'
import NotFound from './components/NotFound.vue'
import Dashboard from './components/Dashboard.vue'
import Login from './components/Login.vue'
import SignUp from './components/SignUp.vue'    
import About from './components/About.vue'
import MyAccount from './components/MyAccount.vue'
import SessionTrial from './components/SessionTrial.vue'
import JoinCode from './components/JoinCode.vue'
import CreateSession from './components/CreateSession.vue'
import AskQuestion from './components/AskQuestion.vue'
import ModuleSessList from './components/ModuleSessList.vue'
// import QNA from './components/QNSANS.vue'
import QNA from './components/QnForum.vue'

Vue.use(Router);

let router = new Router({
    routes: [
        { path: '/', component: Home },
        { path: '/dashboard', component: Dashboard, name: 'dashboard', meta: { requiresAuth: true } },
        { path: '/login', component: Login, meta: { requiresGuest: true } },
        { path: '/signup', component: SignUp, meta: { requiresGuest: true } },
        { path: '/about', component: About },
        { path: '/myaccount', component: MyAccount, meta: { requiresAuth: true } },
        { path: '/sessiontrial/', component: SessionTrial, props:true, name:'sessionpage', meta: { requiresAuth: true }},
        { path: '/joincode', component: JoinCode, name:'joincode', meta: { requiresAuth: true } },
        { path: '/createsession', component: CreateSession, meta: { requiresAuth: true } },
        { path: '/askquestion', component: AskQuestion, meta: { requiresAuth: true } },
        { path: '/modsess', name: 'module',props: true,component: ModuleSessList, meta: { requiresAuth: true } },
        { path: '*', component: NotFound, name: 'not found' },
        { path: '/q&a', name: 'q&a', props: true, component: QNA, meta: { requiresAuth: true}}
    ],
    mode: 'history'
});

//nav guards
router.beforeEach((to, from, next) => {
    //check for required auth guard
    if(to.matched.some(record => record.meta.requiresAuth)) {
        //check if not logged in to firebase
        if(!firebase.auth().currentUser){
            //send him to login page
            next({
                path:'/login',
                query: {redirect: to.fullPath}
            });
        } else {
            //logged in, just proceed to route
            next();
        }
    }
    //if logged in, check if the route is supposed to be inaccessible to logged in users 
    else if(to.matched.some(record => record.meta.requiresGuest)) {
        if(firebase.auth().currentUser){
            //send him to dashboard
            next({
                path:'/dashboard',
                query: {redirect: to.fullPath}
            });
        } else {
            //logged in, just proceed to route
            next();
        }
    }
    else{
        next();
    }
});

export default router;