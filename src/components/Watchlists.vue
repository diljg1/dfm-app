<template>
    <div>
        <div class="uk-text-right">
            <button type="button" class="uk-button uk-button-link uk-button-small" @click="showModal">
                {{ 'Watchlists beheren' | trans }}
            </button>
        </div>
        <Modal ref="modal" container>
            <div class="uk-modal-header">
                <h3>{{ 'Persoonlijke watchlists' | trans }}</h3>
            </div>
            <div class="uk-modal-body uk-form-horizontal">
                <div class="uk-grid-divider" uk-grid>
                    <div class="uk-width-1-3@l">
                        <div class="uk-text-right uk-margin-bottom">
                            <button type="button" class="uk-button uk-button-default uk-button-small"
                                    @click="addWatchlist">
                                {{ 'Nieuwe watchlist' | trans }}
                            </button>
                        </div>
                        <div v-if="loading" key="loader" class="uk-text-center"><div uk-spinner></div></div>
                        <ul v-else-if="watchlists.length" key="list" class="uk-list uk-list-divider">
                            <li v-for="watchlist in watchlists" :key="watchlist.id">
                                <div class="uk-flex uk-flex-middle">
                                    <div class="uk-flex-1">
                                        <a v-if="edit_id !== watchlist.id" key="edit"
                                           @click="editWatchlist(watchlist)">{{ watchlist.name }}</a>
                                        <span v-else key="active">{{ watchlist.name }}</span>
                                        <small class="uk-margin-small-left">({{ watchlist.item_count }})</small>
                                    </div>
                                    <a v-if="edit_id !== watchlist.id" :title="$trans('Bewerk watchlist')"
                                       class="uk-margin-small-left"
                                       uk-tooltip="delay: 200"
                                       @click.stop="editWatchlist(watchlist)">
                                        <span uk-icon="icon:pencil;ratio:0.7"></span>
                                    </a>
                                    <a :title="$trans('Verwijder watchlist')"
                                       class="uk-margin-small-left"
                                       uk-tooltip="delay: 200"
                                       @click.stop="removeWatchlist(watchlist)">
                                        <span uk-icon="icon:ban;ratio:0.5"></span>
                                    </a>
                                </div>
                            </li>
                        </ul>
                        <div v-else-if="initialLoad" key="empty" class="uk-text-center uk-text-muted">
                            {{ 'Geen watchlists opgeslagen' | trans }}
                        </div>
                    </div>
                    <div class="uk-width-2-3@l">
                        <Watchlist v-if="edit_id !== null" :id="edit_id"
                                   @cancel="edit_id = null"
                                   @saved="load" />
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
import {apiRequest,} from '@/lib/util';

import UIkit from 'uikit';
import Modal from '@/components/Ui/Modal';
import Watchlist from '@/components/Watchlist';

export default {

    name: 'Watchlists',

    components: {
        Watchlist,
        Modal,
    },

    data: () => ({
        loading: false,
        initialLoad: false,
        watchlists: [],
        edit_id: null,
    }),

    computed: {
    },

    created() {
        this.$bus.$on('modal:watchlists', this.showModal);
    },

    beforeDestroy() {
        this.$bus.$off('modal:watchlists', this.showModal);
    },

    methods: {
        showModal() {
            this.$refs.modal.show();
            this.load();
        },
        addWatchlist() {
            this.edit_id = 0;
        },
        editWatchlist({id,}) {
            this.edit_id = id;
        },
        async removeWatchlist({id,}) {
            try {

                await UIkit.modal.confirm(this.$trans('Watchlist verwijderen?'), {stack: true,});

                await apiRequest('removeWatchlist', {id,});
                await this.load();
                this.$notify(this.$trans('Watchlist verwijderd'), 'success', 'check');

            } catch (err) {
                if (err === undefined) {
                    return; //confirm rejected
                }
                console.error(err);
                this.$notify(this.$trans('Fout bij verwijderen watchlist', 'danger', 'warning'));
            }
        },
        async load() {
            try {
                this.loading = true;
                const {watchlists,} = await apiRequest( 'getWatchlists')
                this.watchlists = watchlists;
            } catch (err) {
                console.error(err);
                this.$notify(this.$trans('Fout bij opvragen watchlists', 'danger', 'warning'));
            } finally {
                this.initialLoad = true;
                this.loading = false;
            }
        },
    },
}
</script>
