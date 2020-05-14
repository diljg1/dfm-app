import Vue from 'vue';
import App from '@/App.vue';

Vue.config.productionTip = false;

import $store from '@/store';

import ErrorMessage from '@/components/ErrorMessage.vue';
import MessageScroll from '@/components/MessageScroll.vue';
import ParamsDisplay from '@/components/ParamsDisplay.vue';
import ParamsForm from '@/components/ParamsForm.vue';
import CsiEmail from '@/components/CsiEmail.vue';
import LicenseKey from '@/components/LicenseKey.vue';
import GameplanPresets from '@/components/GameplanPresets.vue';
import Pending from '@/components/Pending.vue';
import Preview from '@/components/Preview.vue';
import Toggler from '@/components/Ui/Toggler.vue';

import TranslateFilter from '@/lib/translate';
import NotifyPlugin from '@/lib/notify';
import EventPlugin from '@/lib/event';
import {DEFAULT_LOCALE,} from '@/../config';

const {$locale = DEFAULT_LOCALE, } = window;

Vue.component('ErrorMessage', ErrorMessage);
Vue.component('MessageScroll', MessageScroll);
Vue.component('ParamsDisplay', ParamsDisplay);
Vue.component('ParamsForm', ParamsForm);
Vue.component('LicenseKey', LicenseKey);
Vue.component('CsiEmail', CsiEmail);
Vue.component('GameplanPresets', GameplanPresets);
Vue.component('Pending', Pending);
Vue.component('Preview', Preview);
Vue.component('Toggler', Toggler);
Vue.use(TranslateFilter, {$locale,});
Vue.use(NotifyPlugin);
Vue.use(EventPlugin);

new Vue({
    store: $store,
    render: h => h(App),
}).$mount('#app');
