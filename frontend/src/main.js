import Vue from "vue"

// BootstrapVue
import BootstrapVue from "bootstrap-vue"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Vue Meta
import VueMeta from "vue-meta"

import App from "./App.vue"
import router from "./router"
import store from "./store"

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(VueMeta)

library.add(fas)
Vue.component("font-awesome-icon", FontAwesomeIcon)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app")
