
import * as types from '../mutation-types';

function paramsToFieldsArray(getters, prmstr) {
    const params = {};
    const prmarr = prmstr.split('&');
    for (let i = 0; i < prmarr.length; i++) {
        let [index, val,] = prmarr[i].split('=');
        let {name, value,} = getters.validFieldValueAndNameFromIndex(Number(index), Number(val));
        if (name) {
            params[name] = value;
        }
    }
    return params;
}

// initial state
const state = {
    params: {},
};

// getters
const getters = {
    getParamsFromRequest: (state, getters) => {
        const prmstr = window.location.search.substr(1);
        return prmstr != null && prmstr !== '' ? paramsToFieldsArray(getters, prmstr) : {};
    },
};

// actions
const actions = {
    resetParams: ({commit, getters,}, params) => {
        commit(types.SET_PARAMS, {...{}, ...getters.defaultParameters, ...params,});
    },
};

// mutations
const mutations = {
    [types.SET_PARAMS](state, params) {
        state.params = params;
    },
    [types.SET_PARAM](state, {name, value,}) {
        if (state.params[name] === undefined) {
            throw new Error(`${name} does not exist in params!`);
        }
        state.params[name] = value;
    },

};

export default {
    state,
    getters,
    actions,
    mutations,
};