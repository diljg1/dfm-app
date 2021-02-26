<template>
    <div>
        <div class="uk-modal-header uk-flex uk-flex-middle">
            <h3 v-if="!watchlist || !watchlist.id" class="uk-margin-remove uk-flex-1">{{ 'Nieuwe watchlist' | trans }}</h3>
            <h3 v-else class="uk-margin-remove uk-flex-1">{{ 'Bewerk watchlist' | trans }}</h3>
            <button type="button" class="uk-button uk-button-default" @click="close">
                {{ 'Sluiten' | trans }}
            </button>
            <button :disabled="saving" type="button" class="uk-button uk-button-primary uk-margin-small-left"
                    @click="save">
                {{ 'Opslaan' | trans }}
            </button>
        </div>
        <div class="uk-modal-body uk-form-horizontal">
            <div v-if="loading" key="loader" class="uk-text-center"><div uk-spinner></div></div>
            <template v-else-if="watchlist">
                <div>
                    <label for="name" class="uk-form-label">{{ 'Naam' | trans }}</label>
                    <div class="uk-form-controls">
                        <input id="name" v-model="watchlist.name"
                               :class="{'uk-form-danger': nameError,}"
                               type="text"
                               maxlength="128"
                               class="uk-input"
                               @input="nameError = null" />
                        <p v-if="nameError" class="uk-text-danger uk-margin-small">
                            {{ nameError }}
                        </p>
                    </div>
                </div>
                <div>
                    <label class="uk-form-label">{{ 'Symbolen' | trans }} ({{ itemCount }})</label>
                    <div id="symbol-controls" class="uk-position-relative uk-form-controls uk-form-controls-text">
                        <div class="uk-grid-small uk-child-width-1-2@l" uk-grid>
                            <div class="uk-flex uk-flex-middle">
                                <SymbolSearch ref="newInput" v-model="new_item"
                                              boundary="#symbol-controls"
                                              @pick="addItem" />
                                <button :disabled="!new_item" type="button"
                                        class="uk-button uk-button-default uk-button-small uk-margin-small-left"
                                        @click="addItem">
                                    {{ 'Toevoegen' | trans }}
                                </button>
                            </div>
                            <CsvImport v-model="watchlist.items"
                                       class="uk-flex uk-flex-middle uk-flex-right" />
                        </div>
                    </div>
                    <hr class="uk-margin-small"/>
                    <div class="uk-grid-small" uk-grid>
                        <div class="uk-width-1-4@m">
                            <ul class="uk-tab-left" uk-tab>
                                <li v-for="({number, first, last,}) in pages" :class="{'uk-active': page === number,}">
                                    <a href="#" @click="page = number">{{ first }} - {{ last }}</a>
                                </li>
                            </ul>
                        </div>
                        <div class="uk-width-3-4@m">
                            <div v-if="visibleValues" class="uk-flex uk-flex-wrap value-list">
                                <small v-for="(item, index) in visibleValues.items"
                                       :key="item"
                                       class="uk-margin-small-right uk-width-1-6 uk-margin-small-bottom uk-flex uk-flex-middle">
                                    <span class="uk-text-truncate uk-flex-1">{{ item }}</span>
                                    <a class="uk-text-danger"
                                       uk-close="ratio: 0.8"
                                       @click="removeItem(index + visibleValues.startIndex)"></a>
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
import {apiRequest, arrayWithRemovedItem,} from '@/lib/util';
import CsvImport from '@/components/CsvImport';
import SymbolSearch from '@/components/Ui/SymbolSearch';

export default {

    name: 'Watchlist',

    components: {
        CsvImport,
        SymbolSearch,
    },

    props: {
        id: Number,
    },

    data: () => ({
        loading: false,
        nameError: null,
        new_item: '',
        saving: false,
        watchlist: null,
        page: 1,
    }),

    computed: {
        itemCount() {
            return this.watchlist ? this.watchlist.items.length : 0;
        },
        pages() {
            const pageSize = 50;
            const items = (this.watchlist ? this.watchlist.items : []);
            const nrPages = Math.ceil(items.length / pageSize);
            const pages = [];
            let startIndex = 0;
            for (let i = 0; i < nrPages; i++) {
                pages.push({
                    startIndex,
                    number: i + 1,
                    items: items.slice(startIndex, startIndex + pageSize),
                    first: items[startIndex],
                    last: items[Math.min(startIndex + pageSize - 1, (items.length - 1))],
                });
                startIndex += pageSize;
            }
            return pages;
        },
        visibleValues() {
            return this.pages[this.page - 1];
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
        close() {
            this.$emit('close');
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
                this.$notify(this.$trans('Fout bij laden watchlist'), 'danger', 'warning');
            } finally {
                this.loading = false;
            }
        },
        async save() {
            if (!this.watchlist.name) {
                this.nameError = this.$trans('Voer een naam in voor de watchlist');
                return;
            }
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
                this.$notify(this.$trans('Fout bij opslaan watchlist'), 'danger', 'warning');
            } finally {
                this.saving = false;
            }
        },
    },

};
</script>
<style lang="less" scoped>
    .value-list {
        small {
            padding: 0 5px;
            &:hover {
                background: #478580;
            }
        }
    }
</style>
