
import {PARAMETER_FIELDS,} from '../../../config';

// initial state
const state = {
    fields: PARAMETER_FIELDS,
};

// getters
const getters = {
    defaultParameters() {
        const params = {};
        Object.values(PARAMETER_FIELDS).forEach(fields => {
            Object.keys(fields).forEach(name => {
                params[name] = fields[name].default;
            });
        });
        return params;
    },
    fieldsByGroup: state => group_name => {
        return state.fields[group_name] || {};
    },
};

// actions
const actions = {};

// mutations
const mutations = {};

export default {
    state,
    getters,
    actions,
    mutations,
}