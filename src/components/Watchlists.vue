<template>
    <div>
        <div class="uk-flex uk-flex-middle">
            <div class="uk-flex-1 ws-dropdown-watchlists">
                <button class="uk-button uk-button-default uk-width-1-1@m uk-text-truncate" type="button">
                    {{ activeWatchlistName }}
                </button>
                <div ref="dropdown" class="dfm-dropdown-scroll">
                    <ul class="uk-nav uk-dropdown-nav">
                        <li v-for="watchlist in defaultWatchlists" :key="watchlist.id" :class="{'uk-active': active(watchlist),}">
                            <a href="#" @click.prevent="setPresetWatchlist(watchlist)">
                                {{ watchlist.name | trans }}
                            </a>
                        </li>
                        <li class="uk-nav-divider"></li>
                        <li v-if="loading" key="loader" class="uk-text-center"><div uk-spinner="ratio:0.8"></div></li>
                        <template v-else-if="watchlists.length">
                            <li v-for="watchlist in watchlists" :key="watchlist.id" :class="{'uk-active': active(watchlist),}">
                                <a href="#" @click.prevent="setWatchlist(watchlist)">
                                <span class="uk-flex uk-flex-middle">
                                    <span class="uk-flex-1 uk-text-truncate">
                                        <span class="">{{ watchlist.name }}</span>
                                    </span>
                                   <small class="uk-margin-small-left">({{ watchlist.item_count }})</small>
                                   <a :title="$trans('Bewerk watchlist')"
                                       class="uk-margin-small-left"
                                       uk-tooltip="delay: 200"
                                       @click.stop.prevent="editWatchlist(watchlist)">
                                        <span uk-icon="icon:pencil;ratio:0.7"></span>
                                    </a>
                                    <a :title="$trans('Verwijder watchlist')"
                                       class="uk-margin-small-left"
                                       uk-tooltip="delay: 200"
                                       @click.stop.prevent="removeWatchlist(watchlist)">
                                        <span uk-icon="icon:ban;ratio:0.5"></span>
                                    </a>
                                </span>
                                </a>
                            </li>
                        </template>
                        <li v-else-if="watchlistsLoaded" key="empty" class="uk-text-center uk-text-muted">
                            <a @click="addWatchlist">{{ 'Geen watchlists opgeslagen' | trans }}</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div style="width: 90px" class="uk-text-right">
                <button :title="$trans('Voeg eigen watchlist toe')"
                        class="uk-button uk-button-default"
                        uk-tooltip="delay: 200"
                        @click="addWatchlist">
                    <span uk-icon="plus-circle"></span>
                </button>
            </div>
        </div>
        <Modal ref="modal" :close-button="false" container>
            <Watchlist v-if="edit_id !== null" :id="edit_id"
                       @close="closeWatchlist"
                       @saved="load(true)" />
        </Modal>
    </div>
</template>

<script>
import {apiRequest,} from '@/lib/util';

import UIkit from 'uikit';
import Modal from '@/components/Ui/Modal';
import Watchlist from '@/components/Watchlist';
import {mapActions, mapState, mapGetters,} from 'vuex';
import * as types from '@/store/mutation-types';

const WATCHLIST_OWN_VALUE = 'Own';

export default {

    name: 'Watchlists',

    components: {
        Watchlist,
        Modal,
    },

    data: () => ({
        loading: false,
        edit_id: null,
        dropDownOptions: {
            pos: 'bottom-justify',
            boundary: '.ws-dropdown-watchlists',
            boundaryAlign: true,
            animation: 'uk-animation-slide-top-small',
            duration: 200,
        },
    }),

    computed: {
        field() {
            return this.fieldByName('Watchlists');
        },
        defaultWatchlists() {
            return this.field.options.filter(name => name !== WATCHLIST_OWN_VALUE).map(name =>({name, preset: true,}));
        },
        activeWatchlist() {
            return [...this.defaultWatchlists, ...this.watchlists,].find(({name, id, preset,}) => {
                return preset ? name === this.paramValue : id === this.ownWatchlistId;
            });
        },
        activeWatchlistName() {
            return this.activeWatchlist ? this.activeWatchlist.name : this.$trans('Selecteer watchlist');
        },
        ...mapGetters(['watchlistsLoaded',]),
        ...mapGetters(['fieldByName',]),
        ...mapState({
            paramValue: state => state.params.params.Watchlists,
            ownWatchlistId: state => state.watchlists.ownWatchlistId,
            watchlists: state => state.watchlists.watchlists,
        }),
    },

    created() {
        this.load();
    },

    mounted() {
        this.dropdown = UIkit.dropdown(this.$refs.dropdown, this.dropDownOptions);
    },

    methods: {
        setPresetWatchlist(watchlist) {
            this.$store.commit(types.SET_PARAM, {name: 'Watchlists', value: watchlist.name});
            this.$store.commit(types.SET_OWN_WATCHLIST_ID, 0);
            this.dropdown.hide(false);
        },
        setWatchlist(watchlist) {
            this.$store.commit(types.SET_PARAM, {name: 'Watchlists', value: WATCHLIST_OWN_VALUE});
            this.$store.commit(types.SET_OWN_WATCHLIST_ID, watchlist.id);
            this.dropdown.hide(false);
        },
        active(watchlist) {
            return watchlist.name === this.activeWatchlistName;
        },
        addWatchlist() {
            this.edit_id = 0;
            this.$refs.modal.show();
        },
        editWatchlist({id,}) {
            this.edit_id = id;
            this.$refs.modal.show();
        },
        closeWatchlist() {
            this.edit_id = null;
            this.$refs.modal.hide();
        },
        async removeWatchlist({id,}) {
            try {

                await UIkit.modal.confirm(this.$trans('Watchlist verwijderen?'), {stack: true,});

                await apiRequest('removeWatchlist', {id,});
                await this.load(true);
                this.$notify(this.$trans('Watchlist verwijderd'), 'success', 'check');

            } catch (err) {
                if (err === undefined) {
                    return; //confirm rejected
                }
                console.error(err);
                this.$notify(this.$trans('Fout bij verwijderen watchlist'), 'danger', 'warning');
            }
        },
        async load(force = false) {
            try {
                this.loading = true;
                await this.loadWatchlists(force);
            } catch (err) {
                console.error(err);
                this.$notify(this.$trans('Fout bij opvragen watchlists'), 'danger', 'warning');
            } finally {
                this.loading = false;
            }
        },
        ...mapActions(['loadWatchlists',]),
    },
}
</script>
