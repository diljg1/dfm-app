/* global UIkit */

import * as types from '@/store/mutation-types';

import {JOOMLA_AJAX_URL,} from '@/../config';

const {ajax,} = UIkit.util;
const token = window.$token;

const headers = {
    'Content-Type': 'application/json',
    'X-CSRF-Token': token,
};

function getApiErrorInfo(err) {
    let error;
    let status = 500;
    if (err.xhr && err.xhr.response) {
        error = err.xhr.response.message || err.xhr.response;
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
    commit(types.SET_PREVIEW_STATUS, 'pending');
    commit(types.SET_PREVIEW_TIMESTAMP);
    commit(types.SET_OPTIONS, {...state.options, ...options,});
    return new Promise((resolve, reject) => {
        ajax(`${JOOMLA_AJAX_URL}&method=request`, {
            method: 'post',
            responseType: 'json',
            headers,
            data: JSON.stringify({params: state.params.params, options: state.options,}),
        })
            .then(({response, status,}) => {
                if (typeof response === 'string') {
                    response = JSON.parse(response); //IE does not parse the response
                }
                const {success, message, data,} = response;
                if (!success) {
                    reject({error: message, status,});
                }
                const {preview_id, result, error,} = data;
                if (result) {
                    commit(types.ADD_PREVIEW, {
                        preview_id,
                        params: {...{}, ...state.params.params,},
                    });
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
 * @param state
 * @param preview_id
 * @returns {Promise}
 */
export const pollPreview = ({commit,}, preview_id) => {
    return new Promise((resolve, reject) => {
        ajax(`${JOOMLA_AJAX_URL}&method=preview&preview_id=${preview_id}`, {
            method: 'post',
            responseType: 'json',
            headers,
        })
            .then(({response,}) => {
                if (typeof response === 'string') {
                    response = JSON.parse(response); //IE does not parse the response
                }
                const {success, message, data,} = response;
                if (!success) {
                    reject({error: message, status,});
                }
                const {preview_status, error, files,} = data;
                if (error) {
                    reject(error);
                    return;
                }
                if (preview_status === 'received') {
                    commit(types.SET_PREVIEW_FILES, {preview_id, files,});
                }
                commit(types.SET_PREVIEW_STATUS, preview_status);
                commit(types.SET_LAST_POLL_TIME, Date.now());
                resolve(preview_status);
            })
            .catch(err => reject(getApiErrorInfo(err)));

    });
};
