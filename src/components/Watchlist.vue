<template>
    <div>
        <div v-if="loading" key="loader" class="uk-text-center"><div uk-spinner></div></div>
        <template v-else-if="watchlist">
            <div class="uk-margin uk-text-right">
                <button type="button" class="uk-button uk-button-default" @click="cancel">
                    {{ 'Annuleren' | trans }}
                </button>
                <button :disabled="saving" type="button" class="uk-button uk-button-primary uk-margin-small-left"
                        @click="save">
                    {{ 'Opslaan' | trans }}
                </button>
            </div>
            <div>
                <label for="name" class="uk-form-label">{{ 'Naam' | trans }}</label>
                <div class="uk-form-controls">
                    <input id="name" v-model="watchlist.name" type="text" class="uk-input"/>
                </div>
            </div>
            <div>
                <label class="uk-form-label">{{ 'Symbolen' | trans }} ({{ itemCount }})</label>
                <div class="uk-form-controls uk-form-controls-text">
                    <div>
                        <input ref="newInput" v-model="new_item" type="text"
                               class="uk-input uk-form-width-small"
                               @keyup.enter="addItem"/>
                        <button type="button" class="uk-button uk-button-default uk-button-small uk-margin-small-left"
                                @click="addItem">
                            {{ 'Toevoegen' | trans }}
                        </button>
                    </div>
                    <div class="uk-flex uk-flex-wrap uk-margin-small-top">
                        <small v-for="(item, index) in watchlist.items"
                               :key="item"
                               class="uk-margin-small-right uk-margin-small-bottom">
                            {{ item }}
                            <a class="uk-text-danger"
                               uk-close="ratio: 0.5"
                               @click="removeItem(index)"></a>
                        </small>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
import {apiRequest, arrayWithRemovedItem,} from '@/lib/util';

export default {

    name: 'Watchlist',

    props: {
        id: Number,
    },

    data: () => ({
        loading: false,
        new_item: '',
        saving: false,
        watchlist: null,
    }),

    computed: {
        itemCount() {
            return this.watchlist ? this.watchlist.items.length : 0;
        },
    },

    watch: {
        'id': {
            handler(id) {
                if (id === 0) {
                    this.newWatchlist();
                } else if(id !== null) {
                    this.loadWatchlist(id);
                }
            },
            immediate: true,
        },
    },

    methods: {
        newWatchlist() {
            this.watchlist = {
                name: '',
                items: [],
            };
        },
        addItem() {
            if (!this.new_item || this.watchlist.items.includes(this.new_item)) {
                return;
            }
            const items = this.watchlist.items.slice();
            items.push(this.new_item);
            items.sort();
            this.watchlist.items = items;
            this.new_item = '';
            this.$refs.newInput.focus();
        },
        removeItem(index) {
            this.watchlist.items = arrayWithRemovedItem(this.watchlist.items, index);
        },
        cancel() {
            this.$emit('cancel');
            this.watchlist = null;
        },
        async loadWatchlist(id) {
            try {
                this.loading = true;
                const {watchlist,} = await apiRequest('getWatchlist', {id,});
                watchlist.items = JSON.parse(watchlist.items);
                this.watchlist = watchlist;
            } catch (err) {
                console.error(err);
                this.$notify(this.$trans('Fout bij laden watchlist', 'danger', 'warning'));
            } finally {
                this.loading = false;
            }
        },
        async save() {
            try {
                this.saving = true;
                const {watchlist,} = await apiRequest('saveWatchlist', {
                    ...this.watchlist,
                    items: JSON.stringify(this.watchlist.items),
                })
                watchlist.items = JSON.parse(watchlist.items);
                this.watchlist = watchlist;
                this.$emit('saved');
                this.$notify(this.$trans('Watchlist opgeslagen'), 'success', 'check');
            } catch (err) {
                console.error(err);
                this.$notify(this.$trans('Fout bij opslaan watchlist', 'danger', 'warning'));
            } finally {
                this.saving = false;
            }
        },
    },

};
</script>
