<template>
    <div class="uk-flex uk-flex-middle">
        <div class="uk-flex-1 ws-dropdown-gameplans">
            <button class="uk-button uk-button-default uk-width-1-1@m uk-text-truncate" type="button">
                {{ activeGameplanName | trans }}
            </button>
            <div ref="dropdown" class="dfm-dropdown-scroll">
                <ul class="uk-nav uk-dropdown-nav">
                    <li v-for="({preset, active,}) in hashedPresets" :key="preset" :class="{'uk-active': active,}">
                        <a href="#" @click.prevent="setPresetParams(preset)">
                            {{ preset | trans }}
                        </a>
                    </li>
                    <li class="uk-nav-divider"></li>
                    <li v-for="(gameplan, index) in hashedPersonalGameplans" :key="index" :class="{'uk-active': gameplan.active,}">
                        <a href="#" @click.prevent="setPersonalPresetParams(index)">
                        <span class="uk-flex uk-flex-middle">
                            <span class="uk-flex-1" :class="{'uk-text-muted': !gameplan.hasParams}">
                                {{ gameplan.name }}
                            </span>
                            <span>
                                <a :title="$trans('Sla huidige parameters op')"
                                   class="uk-margin-small-left"
                                   uk-tooltip="delay: 200"
                                   @click.stop.prevent="savePresetParams(index, gameplan)">
                                    <span uk-icon="icon:check;ratio:1"></span>
                                </a>
                                <a :title="$trans('Bewerk naam')"
                                   class="uk-margin-small-left"
                                   uk-tooltip="delay: 200"
                                   @click.stop.prevent="editPresetName(index, gameplan)">
                                    <span uk-icon="icon:pencil;ratio:0.7"></span>
                                </a>
                                <a :title="$trans('Verwijder gameplan')"
                                   class="uk-margin-small-left"
                                   uk-tooltip="delay: 200"
                                   @click.stop.prevent="removePreset(index)">
                                    <span uk-icon="icon:ban;ratio:0.5"></span>
                                </a>
                            </span>
                        </span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div style="width: 90px" class="uk-text-right">
            <button :title="$trans('Voeg eigen gameplan toe')"
                    :disabled="activeGameplan"
                    class="uk-button uk-button-default"
                    uk-tooltip="delay: 200"
                    @click="addPreset">
                <span uk-icon="plus-circle"></span>
            </button>
        </div>
    </div>
</template>

<script>
import {mapActions, mapState, mapGetters,} from 'vuex';
import {arrayWithRemovedItem, arrayWithReplacedItem} from '@/lib/util';
import UIkit from 'uikit';
import md5 from 'md5';
import {$,} from 'uikit/src/js/util';
import omit from 'lodash/omit';
import size from 'lodash/size';
import {SET_PARAMS, SET_USERFIELD,} from '@/store/mutation-types';
import * as types from '@/store/mutation-types';

export default {

    name: 'GameplanPresets',

    data: () => ({
        dropDownOptions: {
            pos: 'bottom-justify',
            boundary: '.ws-dropdown-gameplans',
            boundaryAlign: true,
            animation: 'uk-animation-slide-top-small',
            duration: 200,
        },
    }),

    computed: {
        presets() {
            return Object.keys(this.gameplans);
        },
        activeGameplan() {
            return [...this.hashedPresets, ...this.hashedPersonalGameplans,].find(({active,}) => active);
        },
        activeGameplanName() {
            if (this.activeGameplan) {
                return this.activeGameplan.preset || this.activeGameplan.name;
            }
            return this.$trans('Selecteer gameplan');
        },
        hashedPresets() {
            return this.presets.map(preset => {
                const hash = this.getGameplanHash(this.gameplans[preset]);
                return {
                    preset,
                    active: hash === this.paramsHash,
                };
            });
        },
        hashedPersonalGameplans() {
            return this.personalGameplans.map(gameplan => {
                const hash = this.getGameplanHash(gameplan);
                const hasParams = size(gameplan.params) > 0;
                return {
                    ...gameplan,
                    hash,
                    hasParams,
                    active: hasParams && hash === this.paramsHash,
                };
            });
        },
        personalGameplans: {
            get() {
                return this.userField('gameplans');
            },
            set(value) {
                this.$store.commit(SET_USERFIELD, {field_name: 'gameplans', value,});
            },
        },
        paramsHash() {
            return this.getGameplanHash({
                watchList: [this.params.Watchlists, this.ownWatchlistId,],
                params: this.gamePlanParams(this.params),
            });
        },
        ...mapState({
            params: state => state.params.params,
            gameplans: state => state.gameplans,
            ownWatchlistId: state => state.watchlists.ownWatchlistId,
        }),
        ...mapGetters(['userField',]),
    },

    mounted() {
        this.dropdown = UIkit.dropdown(this.$refs.dropdown, this.dropDownOptions);
    },

    methods: {
        setPresetParams(preset) {
            this.applyGameplanToParams(this.gameplans[preset]);
            this.dropdown.hide(false);
        },
        setPersonalPresetParams(index) {
            if (this.hasParams(index)) {
                this.applyGameplanToParams(this.personalGameplans[index]);
                this.dropdown.hide(false);
            }
        },
        applyGameplanToParams(gameplan) {
            const [watchList = 'Safe', ownWatchlistId = 0,] = gameplan.watchList || [];
            this.$store.commit(SET_PARAMS, {...this.params, ...gameplan.params,});
            this.$store.commit(types.SET_PARAM, {name: 'Watchlists', value: watchList,});
            this.$store.commit(types.SET_OWN_WATCHLIST_ID, ownWatchlistId);
        },
        hasParams(index) {
            return size(this.personalGameplans[index].params) > 0;
        },
        gamePlanParams(params) {
            return omit(params, ['Watchlists',]);
        },
        getGameplanHash(gameplan) {
            const [watchList = 'Safe', ownWatchlistId = 0,] = gameplan.watchList || [];
            return md5(JSON.stringify(gameplan.params) + `:${watchList}:${ownWatchlistId}`);
        },
        async addPreset() {
            const name = await this.promptName(`Gameplan ${this.personalGameplans.length + 1}`);
            if (name) {
                this.personalGameplans = [
                    ...this.personalGameplans,
                    {
                        name,
                        watchList: [this.params.Watchlists, this.ownWatchlistId,],
                        params: this.gamePlanParams(this.params),
                    },
                ];
                await this.saveGameplans();
            }
        },
        async removePreset(index) {
            this.personalGameplans = arrayWithRemovedItem(this.personalGameplans, index);
            await this.saveGameplans(this.$trans('Gameplan verwijderd'));
        },
        async promptName(defaultName) {
            const prompt = UIkit.modal.prompt(this.$trans('Naam gameplan:'), defaultName);

            const input = $('input', prompt.dialog.$el);
            input.setAttribute('maxlength', '20');

            return await prompt;
        },
        async editPresetName(index, gameplan) {
            try {

                const name = await this.promptName(gameplan.name);

                if (name) {
                    this.personalGameplans = arrayWithReplacedItem(this.personalGameplans, index, {
                        ...gameplan,
                        name: name.substr(0, 20),
                    });

                    await this.saveGameplans(this.$trans('Naam gewijzigd'));
                }
            } catch (e) {
                this.$notify(this.$trans('Fout bij aanpassen naam'), 'danger', 'warning');
            }
        },
        async savePresetParams(index, gameplan) {
            this.personalGameplans = arrayWithReplacedItem(this.personalGameplans, index, {
                ...gameplan,
                watchList: [this.params.Watchlists, this.ownWatchlistId,],
                params: this.gamePlanParams(this.params),
            });
            await this.saveGameplans();
        },
        async saveGameplans(successMessage = '') {
            try {
                const value = JSON.stringify(this.personalGameplans);
                const success = await this.updateUserField({field_name: 'gameplans', value,});
                if (success) {
                    this.$notify(successMessage || this.$trans('Gameplan opgeslagen'), 'success', 'check');
                } else {
                    this.$notify(this.$trans('Fout bij opslaan gameplans'), 'danger', 'warning');
                }
            } catch ({error, status,}) {
                console.error(status, error);
                this.$notify(this.$trans('Fout bij opslaan gameplans'), 'danger', 'warning');
            }
        },
        ...mapActions(['updateUserField',]),
    },
};
</script>
