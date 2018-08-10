import Vue from 'vue';
import Vuex from 'vuex';

import * as types from './mutation-types';
import * as actions from './actions';
import * as getters from './getters';

import {MAX_PREVIEWS,} from '../../config';

import fields from './modules/fields';
import paramsModule from './modules/params';

import PreviewRequest from '../lib/preview-request';

Vue.use(Vuex);

export default new Vuex.Store({
    actions,
    getters,
    modules: {
        fields,
        params: paramsModule(),
    },
    state: {
        spinning: false,
        error: '',
        preview_id: '',
        previewrequests: {},
        options: {
            width: 1200,
            layout: 'default',
        },
        files: [],
    },
    mutations: {
        [types.RESET_PREVIEW](state) {
            state.spinning = false;
            state.error = '';
            state.preview_id = '';
        },
        [types.SET_SPINNING](state, spinning) {
            state.spinning = spinning;
        },
        [types.SET_ERROR](state, error) {
            state.error = error;
        },
        [types.RESET_ERROR](state) {
            state.error = '';
        },
        [types.SET_PREVIEW_ID](state, preview_id) {
            state.preview_id = preview_id;
        },
        [types.ADD_PREVIEW](state, {preview_id, params, options,}) {
            if (state.previewrequests[preview_id] !== undefined) {
                throw new Error(`${preview_id} has already been set!`);
            }
            const preview_ids = Object.keys(state.previewrequests);
            if (preview_ids.length === MAX_PREVIEWS) {
                Vue.delete(state.previewrequests, preview_ids[0]);
            }
            state.previewrequests = {...state.previewrequests, [preview_id]: new PreviewRequest(preview_id, params, options),};
        },
        [types.SET_PREVIEW_STATUS](state, {preview_id, preview_status,}) {
            if (state.previewrequests[preview_id] === undefined) {
                throw new Error(`${preview_id} does not exist!`);
            }
            state.previewrequests[preview_id].status = preview_status;
        },
        [types.SET_PREVIEW_FILES](state, {preview_id, files,}) {
            if (state.previewrequests[preview_id] === undefined) {
                throw new Error(`${preview_id} does not exist!`);
            }
            state.previewrequests[preview_id].files = files;
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

