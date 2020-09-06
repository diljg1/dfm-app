import Vue from 'vue';
import Vuex from 'vuex';

import * as types from '@/store/mutation-types';
import * as actions from '@/store/actions';
import * as getters from '@/store/getters';

import fields from '@/store/modules/fields';
import params from '@/store/modules/params';
import preview from '@/store/modules/preview';
import user from '@/store/modules/user';
import watchlists from '@/store/modules/watchlists';

Vue.use(Vuex);

const {trial_link, license_link, csi_link, showTitle, showIntro,} = window.$dfm_data;

import {GAMEPLAN_PRESETS,} from '@/../config';

export default new Vuex.Store({
    actions,
    getters,
    modules: {
        fields,
        params,
        preview,
        user,
        watchlists,
    },
    state: {
        last_poll_time: 0,
        error: '',
        showTitle,
        showIntro,
        links: {trial_link, license_link, csi_link,},
        options: {
            width: 1200,
            layout: 'default',
            locale: 'nl-NL',
            ownWatchlistId: 0,
        },
        gameplans: GAMEPLAN_PRESETS,
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
        [types.SET_OPTION](state, {name, value,}) {
            if (state.options[name] === undefined) {
                throw new Error(`${name} does not exist in options!`);
            }
            state.options[name] = value;
        },
    },
});

