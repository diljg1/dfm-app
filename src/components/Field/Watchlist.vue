<template>
    <div>
        <div class="uk-child-width-1-2@l uk-flex-bottom" uk-grid>
            <div>
                <label class="uk-form-label" :for="name">
                    {{ field.label | trans }}<br>
                    <small v-if="fieldTip">{{ fieldTip }}</small><br>
                </label>
                <div class="uk-form-controls uk-flex uk-flex-between uk-flex-middle">
                    <select :name="name" :id="name"
                            class="uk-select uk-form-width-medium"
                            v-model="inputValue" :disabled="disabled">
                        <option v-for="option in field.options" :key="option"
                                :value="option" v-bind="optionAttribrutes(option)">{{ option | trans }}
                        </option>
                    </select>
                    <Dropdown v-if="fieldInfo" class="uk-margin-small-left">
                        <small>{{ fieldInfo }}</small>
                    </Dropdown>
                </div>
            </div>
            <div>
                <div v-if="loading" key="loader" class="uk-text-center"><div uk-spinner="ratio:0.8"></div></div>
                <select v-else-if="watchlists.length" v-model="watchlistId"
                        :disabled="inputValue !== 'Own'"
                        key="select" class="uk-select">
                    <option v-for="watchlist in watchlists" :key="watchlist.id" :value="watchlist.id">
                        {{ watchlist.name }}
                    </option>
                </select>
                <small v-else-if="watchlistsLoaded" key="empty" class="uk-text-center uk-text-muted">
                    {{ 'Geen watchlists opgeslagen' | trans }}
                </small>

                <div class="uk-text-right">
                    <button type="button" class="uk-button uk-button-link uk-button-small"
                            @click="$bus.$emit('modal:watchlists')">
                        {{ 'Watchlists beheren' | trans }}
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
    import * as types from '@/store/mutation-types';
    import {mapActions, mapGetters, mapState,} from 'vuex';

    import Select from '@/components/Field/Select';
    import params from '@/store/modules/params';

    const CSI_VALUE = 'CSI';

    export default {

        name: 'Watchlist',

        extends: Select,

        data: () => ({
            loading: false,
        }),

        computed: {
            watchlistId: {
                get() {
                    return this.ownWatchlistId;
                },
                set(id) {
                    this.$store.commit(types.SET_OWN_WATCHLIST_ID, id);
                },
            },
            ...mapGetters(['watchlistsLoaded',]),
            ...mapState({
                ownWatchlistId: state => state.watchlists.ownWatchlistId,
                watchlists: state => state.watchlists.watchlists,
            }),
        },

        watch: {
            'value': {
                handler(value) {
                    if (value === CSI_VALUE && !this.csiActive) {
                        this.$emit('input', this.field.options
                            .find(option => ![params.DISABLED_FIELD_VALUE, CSI_VALUE].includes(option)))
                    }
                },
                immediate: true,
            }
        },

        async created() {
            await this.load();
            if (this.watchlists.length && this.watchlistId === 0) {
                this.watchlistId = this.watchlists[0].id;
            }
        },

        methods: {
            async load() {
                try {
                    this.loading = true;
                    await this.loadWatchlists();
                } catch (err) {
                    console.error(err);
                    this.$notify(this.$trans('Fout bij opvragen watchlists', 'danger', 'warning'));
                } finally {
                    this.loading = false;
                }
            },
            ...mapActions(['loadWatchlists',]),
        },
    }

</script>
