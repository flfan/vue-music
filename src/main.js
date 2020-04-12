import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import fastclick from 'fastclick'
import '@styles/index.styl'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  loading: require('@assets/image/loading.svg'),
  error: require('@assets/image/error.jpg')
})

Vue.config.productionTip = false
fastclick.attach(document.body)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
