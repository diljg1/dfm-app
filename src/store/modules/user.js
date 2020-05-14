const {ajax,} = UIkit.util;
import {getApiErrorInfo,} from '@/lib/util';

import * as types from '@/store/mutation-types';
import {JOOMLA_AJAX_URL,} from '@/../config';

const token = window.$token;

const headers = {
    'Content-Type': 'application/json',
    'X-CSRF-Token': token,
};

const {noLicense, isTrial, trialEnd, csiActive, fields,} = window.$user_data;

// initial state
const state = {
    noLicense,
    isTrial,
    trialEnd,
    csiActive,
    fields: {license_key: '', csi_email: '', gameplans: [], watchlists: [], ...fields,},
};

// getters
const getters = {
    userField: state => field_name => state.fields[field_name],
};

// actions
const actions = {
    updateUserField: ({commit,}, {field_name, value,}) => {
        return new Promise((resolve, reject) => {
            ajax(`${JOOMLA_AJAX_URL}&method=updateUserField`, {
                method: 'post',
                responseType: 'json',
                headers,
                data: JSON.stringify({field_name, value,}),
            })
                .then(({response,}) => {
                    if (typeof response === 'string') {
                        response = JSON.parse(response); //IE does not parse the response
                    }
                    const {success, message, data,} = response;
                    if (!success) {
                        reject({error: message, status,});
                    }
                    const {success: saveSuccess,} = data;
                    resolve(saveSuccess);
                })
                .catch(err => reject(getApiErrorInfo(err)));

        });
    }
};

// mutations
const mutations = {
    [types.SET_USERFIELD](state, {field_name, value,}) {
        if (state.fields[field_name] !== undefined) {
            state.fields[field_name] = value;
        } else {
            throw new Error(`Field ${field_name} is not in userfields`);
        }
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
