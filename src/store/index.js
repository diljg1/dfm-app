import Vue from 'vue';
import Vuex from 'vuex';

import * as types from './mutation-types';
import * as actions from './actions';
import * as getters from './getters';

import fields from './modules/fields';
import params from './modules/params';
import preview from './modules/preview';

Vue.use(Vuex);

const {trial_link, license_link, csi_link, showTitle,} = window.$dfm_data;

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

