
import {pickBy, findKey,} from 'lodash';

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
    validFieldValueAndNameFromIndex: state => (index, val) => {
        const name = findKey(state.fields, field => field.index === index);
        let value = null;
        if (!name) {
            return {name, value,};
        }
        value = val;
        if (state.fields[name].type !== 'BooleanOption' && !state.fields[name].options[value]) {
            value = state.fields[name].default;
        }
        return {name, value,};
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
