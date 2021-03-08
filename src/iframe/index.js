import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from './dashboard.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import './assets/popup.css'

// import Buefy from 'buefy'
// import 'buefy/dist/buefy.css'
// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// Vue.extend(), or just a component options object.
// We'll talk about nested routes later.
const routes = [
  { path: '/dashboard', component: Dashboard }
]
// const NotFound = { template: '<p>Page not found</p>' }

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueRouter)

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes
})

// 4. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
new Vue({
  router
}).$mount('#root')
