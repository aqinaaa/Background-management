import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control,

// 公共组件
import CategorySelect from '@/components/CategorySelect'
import HintButton from '@/components/HintButton'

// 将api挂载到vue的原型对象上面，方便组件内随意使用
// import * as API from '@/api/index'
import API from '@/api/index'

Vue.prototype.$API = API

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
    const { mockXHR } = require('../mock')
    mockXHR()
}


// 若是没有开启Devtools工具，在开发环境中开启，在生产环境中关闭
if (process.env.NODE_ENV == 'development') {
    Vue.config.devtools = true;
} else {
    Vue.config.devtools = false;
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
    // 如果想要中文版 element-ui，按如下方式声明
    // Vue.use(ElementUI)

Vue.config.productionTip = false
    // 注册全局组件
Vue.component(CategorySelect.name, CategorySelect)
Vue.component(HintButton.name, HintButton)
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})