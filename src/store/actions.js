/* global UIkit */

import * as types from './mutation-types';

import {INTERNAL_API_HOST,} from '../../config';

const {ajax,} = UIkit.util;

const headers = {
    'Content-Type': 'application/json',
};

function getApiErrorInfo(err) {
    let error;
    let status = 500;
    if (err.xhr && err.xhr.response) {
        error = err.xhr.response.error || err.xhr.response;
    } else {
        error = err.message || err;
    }
    return {error, status,};
}
/**
 * Request preview from the webserver. The preview_id for polling is returned
 * @param commit
 * @param state
 * @param options
 * @returns {Promise}
 */
export const requestPreview = ({commit, state,}, options) => {
    commit(types.SET_OPTIONS, {...state.options, ...options,});
    return new Promise((resolve, reject) => {
        ajax(`${INTERNAL_API_HOST}/request`, {
            method: 'post',
            responseType: 'json',
            headers,
            data: JSON.stringify({params: state.params.params, options: state.options,}),
        })
            .then(({response: {preview_id, result, error,},}) => {
                if (result) {
                    commit(types.ADD_PREVIEW, {
                        preview_id,
                        params: {...{}, ...state.params.params,},
                        options: {...{}, ...state.options,},
                    });
                    commit(types.SET_PREVIEW_ID, preview_id);
                    resolve(preview_id);
                } else {
                    reject({error, status: 400,});
                }
            })
            .catch(err => reject(getApiErrorInfo(err)));

    });
};

/**
 * Poll the server for files. Returns files if they have arrived, status pending if not
 * @param commit
 * @param preview_id
 * @returns {Promise}
 */
export const pollPreview = ({commit,}, preview_id) => {
    return new Promise((resolve, reject) => {
        ajax(`${INTERNAL_API_HOST}/preview/${preview_id}`, {
            method: 'get',
            responseType: 'json',
        })
            .then(({response: {preview_status, error, files,},}) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (preview_status === 'received') {
                    commit(types.SET_PREVIEW_FILES, {preview_id, files,});
                }
                commit(types.SET_PREVIEW_STATUS, {preview_id, preview_status,});
                resolve(preview_status);
            })
            .catch(err => reject(getApiErrorInfo(err)));

    });
};
/**
 * Reset te preview data to restore a pending preview
 * @param commit
 * @param preview
 */
export const restorePendingPreview = ({commit,}, preview) => {
    commit(types.ADD_PREVIEW, preview);
    commit(types.SET_OPTIONS, preview.options);
    commit(types.SET_PREVIEW_ID, preview.preview_id);
    commit(types.SET_SPINNING, true);
};


