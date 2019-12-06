import Vue from 'vue';
import VueRouter from 'vue-router';

import Index from '../vue/index.vue';
import Login from '../vue/login.vue';
import Callback from '../vue/callback.vue';

import API from './api';

Vue.use(VueRouter);

const router= new VueRouter({
	// mode: 'history',
	routes: [
		{
			path: '/',
			component: Index,
			meta: {
				requiredAuth: true
			}
		},
		{
			path: '/login',
			component: Login
		},
		{
			path: '/callback/:query',
			component: Callback
		}
	]
});

router.beforeEach((to, from, next)=>{
	if(to.matched.some((record)=>{
		return record.meta.requiredAuth;
	})){
		API.validateToken()
		.then(()=>{
			next();
		})
		.catch((err)=>{
			next({
				path: 'login'
			});
		});
		return;
	}
	next();
});

new Vue({
	el: '#app',
	router: router
});
