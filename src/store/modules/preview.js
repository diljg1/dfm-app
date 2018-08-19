
import * as types from '../mutation-types';
import {STORAGEKEY_PENDING_PREVIEW, MAX_WAIT_TIME,} from '../../../config';

const state = {
    preview_id: '',
    timestamp: 0,
    status: '',
    params: {},
    files: {},
};

// getters
const getters = {
    currentPreviewStatus: state => state.status,
    currentPreviewFilesReceived: state => state.status === 'received',
    currentPreviewFiles: state => state.files,
    currentPreviewExpired: (state, getters) => {
        return getters.pendingTime > MAX_WAIT_TIME;
    },
    pendingTime: (state, getters, rootState) => {
        return Math.max(0, Math.round((rootState.last_poll_time - state.timestamp) / 1000));
    },
};

// actions
const actions = {
    restorePendingPreview: ({commit,}, preview) => {
        commit(types.ADD_PREVIEW, preview);
        commit(types.SET_PREVIEW_ID, preview.preview_id);
    },
};

// mutations
const mutations = {
    [types.RESET_PREVIEW](state) {
        state.preview_id = '';
        state.timestamp = 0;
        state.status = '';
        state.params = {};
    },
    [types.SET_PREVIEW_ID](state, preview_id) {
        state.preview_id = preview_id;
    },
    [types.RESTORE_PREVIEW](state, {preview_id, timestamp, status, params,}) {
        state.preview_id = preview_id;
        state.timestamp = timestamp;
        state.status = status;
        state.params = params;
    },
    [types.ADD_PREVIEW](state, {preview_id, params,}) {
        state.preview_id = preview_id;
        state.params = params;
        localStorage.setItem(STORAGEKEY_PENDING_PREVIEW, JSON.stringify({
            preview_id,
            timestamp: state.timestamp,
            status: state.status,
            params,
        }));
    },
    [types.SET_PREVIEW_STATUS](state, preview_status) {
        state.status = preview_status;
    },
    [types.SET_PREVIEW_TIMESTAMP](state) {
        state.timestamp = Date.now();
    },
    [types.SET_PREVIEW_FILES](state, {preview_id, files,}) {
        if (state.preview_id !== preview_id) {
            return; //ignore any late-comming files
        }
        localStorage.removeItem(STORAGEKEY_PENDING_PREVIEW);
        state.files = files;
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
}