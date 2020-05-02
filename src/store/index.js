import Vue from 'vue';
import Vuex from 'vuex';

import * as types from '@/store/mutation-types';
import * as actions from '@/store/actions';
import * as getters from '@/store/getters';

import fields from '@/store/modules/fields';
import params from '@/store/modules/params';
import preview from '@/store/modules/preview';

Vue.use(Vuex);

const {trial_link, license_link, csi_link, showTitle, showIntro,} = window.$dfm_data;
const {noLicense, csiActive,} = window.$userFields;

export default new Vuex.Store({
    actions,
    getters,
    modules: {
        fields,
        params,
        preview,
    },
    state: {
        last_poll_time: 0,
        error: '',
        showTitle,
        showIntro,
        userFields: {noLicense, csiActive,},
        links: {trial_link, license_link, csi_link,},
        options: {
            width: 1200,
            layout: 'default',
            locale: 'nl-NL',
        },
    },
    mutations: {
        [types.RESET_UI](state) {
            state.spinning = false;
            state.last_poll_time = 0;
            state.error = '';
        },
        [types.SET_LAST_POLL_TIME](state, pendingTime) {
            state.last_poll_time = pendingTime;
        },
        [types.SET_ERROR](state, error) {
            state.error = error;
        },
        [types.RESET_ERROR](state) {
            state.error = '';
        },
        [types.SET_OPTIONS](state, options) {
            state.options = options;
        },
    },
});

