/* global UIkit */

import * as types from '@/store/mutation-types';
import {apiRequest,} from '@/lib/util';

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
        apiRequest('request', {params: state.params.params, options: state.options,})
            .then(data => {
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
            .catch(err => reject(err));

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
        apiRequest(`preview&preview_id=${preview_id}`)
            .then(data => {
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
            .catch(err => reject(err));

    });
};
