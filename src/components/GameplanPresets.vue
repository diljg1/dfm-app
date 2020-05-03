<template>
    <div>
        <button v-for="({preset, active,}) in hashedPresets" :key="preset"
                type="button"
                class="uk-button uk-margin-small-bottom uk-width-1-1"
                :class="{'uk-button-primary': active, 'uk-button-default': !active,}"
                @click="setPresetParams(preset)">
            {{ preset | trans }}
        </button>
        <div>
            <div v-for="(gameplan, index) in hashedPersonalGameplans" :key="index"
                 class="uk-button uk-margin-small-bottom uk-width-1-1"
                 :class="{'uk-button-primary': gameplan.active, 'uk-button-default': !gameplan.active,}"
                 @click="setPersonalPresetParams(index)">
                <div class="uk-flex uk-flex-middle">
                    <div class="uk-flex-1" :class="{'uk-text-muted': !gameplan.hasParams}">
                        {{ gameplan.name }}
                        <a :title="$trans('Bewerk naam')"
                           class="uk-margin-small-left"
                           uk-tooltip="delay: 200"
                           @click.stop="editPresetName(index, gameplan)">
                            <span uk-icon="icon:pencil;ratio:0.7"></span>
                        </a>
                    </div>
                    <div>
                        <a :title="$trans('Sla huidige parameters op')"
                           class="uk-margin-small-left"
                           uk-tooltip="delay: 200"
                           @click.stop="savePresetParams(index, gameplan)">
                            <span uk-icon="icon:check;ratio:1"></span>
                        </a>
                        <a :title="$trans('Verwijder gameplan')"
                           class="uk-margin-small-left"
                           uk-tooltip="delay: 200"
                           @click.stop="removePreset(index)">
                            <span uk-icon="icon:ban;ratio:0.5"></span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="uk-text-right">
                <a :title="$trans('Voeg eigen gameplan toe')"
                   class="uk-icon-button"
                   uk-tooltip="delay: 200"
                   uk-icon="plus" @click="addPreset"></a>
            </div>
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

    export default {

        name: 'GameplanPresets',

        computed: {
            presets() {
                return Object.keys(this.gameplans);
            },
            hashedPresets() {
                return this.presets.map(preset => {
                    const hash = md5(JSON.stringify(this.gameplans[preset]));
                    return {
                        preset,
                        active: hash === this.paramsHash,
                    };
                });
            },
            hashedPersonalGameplans() {
                return this.personalGameplans.map(gameplan => {
                    const hash = md5(JSON.stringify(gameplan.params));
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
                return md5(JSON.stringify(this.gamePlanParams(this.params)));
            },
            ...mapState({
                params: state => state.params.params,
                gameplans: state => state.gameplans,
            }),
            ...mapGetters(['userField',]),
        },

        methods: {
            setPresetParams(preset) {
                this.$store.commit(SET_PARAMS, {...this.params, ...this.gameplans[preset]});
            },
            setPersonalPresetParams(index) {
                if (this.hasParams(index)) {
                    this.$store.commit(SET_PARAMS, {...this.params, ...this.personalGameplans[index].params});
                }
            },
            hasParams(index) {
                return size(this.personalGameplans[index].params) > 0;
            },
            gamePlanParams(params) {
                return omit(params, ['DataProvider', 'IncludeInactive', 'Benchmark', 'Watchlists',]);
            },
            addPreset() {
                this.personalGameplans = [
                    ...this.personalGameplans,
                    {
                        name: `Gameplan ${this.personalGameplans.length + 1}`,
                        params: {},
                    },
                ];
            },
            async removePreset(index) {
                this.personalGameplans = arrayWithRemovedItem(this.personalGameplans, index);
                await this.saveGameplans(this.$trans('Gameplan verwijderd'));
            },
            async editPresetName(index, gameplan) {
                try {

                    const prompt = UIkit.modal.prompt(this.$trans('Nieuwe naam gameplan:'), gameplan.name);

                    const input = $('input', prompt.dialog.$el);
                    input.setAttribute('maxlength', '20');

                    const name = await prompt;

                    if (name) {
                        this.personalGameplans = arrayWithReplacedItem(this.personalGameplans, index, {
                            ...gameplan,
                            name: name.substr(0, 20),
                        });

                        await this.saveGameplans(this.$trans('Naam gewijzigd'));
                    }
                } catch (e) {
                    this.$notify(this.$trans('Fout bij aanpassen naam', 'danger', 'warning'));
                }
            },
            async savePresetParams(index, gameplan) {
                this.personalGameplans = arrayWithReplacedItem(this.personalGameplans, index, {
                    ...gameplan,
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
                        this.$notify(this.$trans('Fout bij opslaan gameplans', 'danger', 'warning'));
                    }
                } catch ({error, status,}) {
                    console.error(status, error);
                    this.$notify(this.$trans('Fout bij opslaan gameplans', 'danger', 'warning'));
                }
            },
            ...mapActions(['updateUserField',]),
        },
    };
</script>
