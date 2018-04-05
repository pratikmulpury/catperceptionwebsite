

import Vue from 'vue'
import VueFire from 'vuefire'
import App from './App.vue'


// turn off the console note about switching to production mode
Vue.config.productionTip = false

// explicit installation required in module environments
Vue.use(VueFire)

new Vue({
  el: '#app',
  render: h => h(App)
})
