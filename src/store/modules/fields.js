
import {pickBy,} from 'lodash';

import {PARAMETER_FIELDS,} from '../../../config';

// initial state
const state = {
    fields: PARAMETER_FIELDS,
};

// getters
const getters = {
    defaultParameters() {
        const params = {};
        Object.entries(PARAMETER_FIELDS).forEach(([name, field,]) => {
            params[name] = field.default;
        });
        return params;
    },
    fieldsByGroup: state => group => {
        return pickBy(state.fields, {group,}) || {};
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