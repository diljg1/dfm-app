import {apiRequest,} from '@/lib/util';

import * as types from '@/store/mutation-types';

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
            apiRequest('updateUserField', {field_name, value,})
                .then(data => {
                    const {success: saveSuccess,} = data;
                    resolve(saveSuccess);
                })
                .catch(err => reject(err));
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
