import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

import $store from './store';

import Preview from './components/Preview.vue';
import Pending from './components/Pending.vue';
import ParamsForm from './components/ParamsForm.vue';

Vue.component('Preview', Preview);
Vue.component('Pending', Pending);
Vue.component('ParamsForm', ParamsForm);

new Vue({
    store: $store,
    render: h => h(App),
}).$mount('#app');
