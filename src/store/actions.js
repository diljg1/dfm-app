/* global UIkit */

import * as types from './mutation-types';

import {INTERNAL_API_HOST,} from '../../config';

const {ajax,} = UIkit.util;

/**
 * Request preview from the webserver. The preview_id for polling is returned
 * @param commit
 * @param state
 * @param options
 * @returns {Promise}
 */
export const requestPreview = ({commit, state,}, options) => {
    return new Promise((resolve, reject) => {
        ajax(`${INTERNAL_API_HOST}/request`, {
            method: 'post',
            responseType: 'json',
            body: {...state.params, ...state.options, ...options,},
        })
            .then(({response: {preview_id, result, error,},}) => {
                if (result) {
                    commit(types.SET_PREVIEW_ID, preview_id);
                    resolve(preview_id);
                } else {
                    reject(error);
                }
            })
            .catch(err => reject(err.message || err));

    });
};

/**
 * Poll the server for files. Returns files if they have arrived, status pending if not
 * @param commit
 * @param state
 * @returns {Promise}
 */
export const pollPreview = ({commit, state,}) => {
    return new Promise((resolve, reject) => {
        ajax(`${INTERNAL_API_HOST}/preview/${state.preview_id}`, {
            method: 'get',
            responseType: 'json',
        })
            .then(({response: {status, error, files,},}) => {
                commit(types.SET_STATUS, status);
                if (error) {
                    reject(error);
                    return;
                }
                if (status === 'received') {
                    commit(types.SET_PREVIEW_FILES, files);
                    commit(types.SET_FILES_RECEIVED, true);
                }
                resolve(status);
            })
            .catch(err => reject(err.message || err));

    });
};


