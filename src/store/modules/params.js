
import * as types from '../mutation-types';

// initial state
const state = {
    params: {},
};

// getters
const getters = {
};

// actions
const actions = {
    resetParams: ({commit, getters,}) => {
        commit(types.SET_PARAMS, {...{}, ...getters.defaultParameters,});
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

export default function () {

    return {
        state,
        getters,
        actions,
        mutations,
    }
}