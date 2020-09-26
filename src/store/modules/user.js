import {apiRequest,} from '@/lib/util';

import * as types from '@/store/mutation-types';

function setUserData(state, user_data) {
    const {noLicense, isTrial, trialEnd, csiActive, fields,} = user_data;
    state.noLicense = noLicense;
    state.isTrial = isTrial;
    state.trialEnd = trialEnd;
    state.csiActive = csiActive;
    state.fields = {...(state.fields || {}), ...fields,};
    return state;
}

// initial state
const state = setUserData({}, window.$user_data);

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
                    const {success: saveSuccess, user_data,} = data;
                    commit(types.SET_USERDATA, user_data)
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
    [types.SET_USERDATA](state, user_data) {
        setUserData(state, user_data);
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
