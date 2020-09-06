
import * as types from '@/store/mutation-types';
import {apiRequest,} from '@/lib/util';

// initial state
const state = {
    watchlists: [],
    ownWatchlistId: 0,
    watchlistsLoaded: false,
};

// getters
const getters = {
    watchlistsLoaded: state => state.watchlistsLoaded,
};

// actions
const actions = {
    loadWatchlists: async ({commit, getters,}, force = false) => {
        if (!getters.watchlistsLoaded || force) {
            const {watchlists} = await apiRequest('getWatchlists')
            commit(types.SET_WATCHLISTS, watchlists);
            commit(types.SET_WATCHLISTS_LOADED);
        }
    },
};

// mutations
const mutations = {
    [types.SET_WATCHLISTS_LOADED](state) {
        state.watchlistsLoaded = true;
    },
    [types.SET_OWN_WATCHLIST_ID](state, id) {
        state.ownWatchlistId = id;
    },
    [types.SET_WATCHLISTS](state, watchlists) {
        state.watchlists = watchlists;
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
