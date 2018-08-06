import Vue from 'vue';
import Vuex from 'vuex';

import * as types from './mutation-types';
import * as actions from './actions';
import * as getters from './getters';

import PreviewRequest from '../lib/preview-request';

Vue.use(Vuex);

export default new Vuex.Store({
    actions,
    getters,
    state: {
        preview_id: '',
        previewrequests: {},
        params: {
            Investment: 48,
            PortfolioSize: 12,
            HoldingPeriod: 13,
            ValidationPeriod: 30,
            PennyStocks: 'No',
            GrowthPotential: 'Yes',
            HedgePercentage: 0,
            BalanceRR: 'MinimizeRisk/Reward',
            Watchlists: 'Safe',
            TransactionCosts: 0,
            LoanPercentage: 0,
            DividendTax: 15,
            DataProvider: 'CSI',
        },
        options: {
            width: 1200,
            layout: 'default',
        },
        files: [],
    },
    mutations: {
        [types.SET_PREVIEW_ID](state, preview_id) {
            state.preview_id = preview_id;
        },
        [types.ADD_PREVIEW](state, {preview_id, params, options,}) {
            if (state.previewrequests[preview_id] !== undefined) {
                throw new Error(`${preview_id} has already been set!`);
            }
            state.previewrequests = {...state.previewrequests, [preview_id]: new PreviewRequest(preview_id, params, options),};
        },
        [types.SET_PREVIEW_STATUS](state, {preview_id, status,}) {
            if (state.previewrequests[preview_id] === undefined) {
                throw new Error(`${preview_id} does not exist!`);
            }
            state.previewrequests[preview_id].status = status;
        },
        [types.SET_PREVIEW_FILES](state, {preview_id, files,}) {
            if (state.previewrequests[preview_id] === undefined) {
                throw new Error(`${preview_id} does not exist!`);
            }
            state.previewrequests[preview_id].files = files;
        },
        [types.SET_PARAMS](state, params) {
            state.params = params;
        },
        [types.SET_PARAM](state, {key, value,}) {
            if (state.params[key] === undefined) {
                throw new Error(`${key} does not exist in params!`);
            }
            state.params[key] = value;
        },
        [types.SET_OPTIONS](state, options) {
            state.options = options;
        },
        [types.SET_OPTION](state, {key, value,}) {
            if (state.options[key] === undefined) {
                throw new Error(`${key} does not exist in options!`);
            }
            state.options[key] = value;
        },
    },
});

