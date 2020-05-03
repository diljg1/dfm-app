<template>
    <div>
        <button v-for="preset in presets" :key="preset"
                type="button"
                class="uk-button uk-button-default uk-margin-small-bottom uk-width-1-1"
                @click="setPresetParams(preset)">
            {{ preset | trans }}
        </button>
        <div>
            <div v-for="(gameplan, index) in personalGameplans" :key="index"
                 class="uk-button uk-button-default uk-margin-small-bottom uk-width-1-1"

                 @click="setPersonalPresetParams(index)">
                <div class="uk-flex uk-flex-middle">
                    <div class="uk-flex-1" :class="{'uk-text-muted': !hasParams(index)}">
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
            personalGameplans: {
                get() {
                    return this.userField('gameplans');
                },
                set(value) {
                    this.$store.commit(SET_USERFIELD, {field_name: 'gameplans', value,});
                },
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
                await this.saveGameplans();
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

                        await this.saveGameplans();
                    }
                } catch (e) {
                    this.$notify(this.$trans('Fout bij aanpassen naam', 'danger', 'warning'));
                }
            },
            async savePresetParams(index, gameplan) {
                this.personalGameplans = arrayWithReplacedItem(this.personalGameplans, index, {
                    ...gameplan,
                    params: omit(this.params, ['DataProvider', 'IncludeInactive', 'Benchmark', 'Watchlists',]),
                });
                await this.saveGameplans();
            },
            async saveGameplans() {
                try {
                    const value = JSON.stringify(this.personalGameplans);
                    const success = await this.updateUserField({field_name: 'gameplans', value,});
                    if (success) {
                        this.$notify(this.$trans('Gameplan opgeslagen'), 'success', 'check');
                    } else {
                        this.$notify(this.$trans('Fout bij opslaan gameplan', 'danger', 'warning'));
                    }
                } catch ({error, status,}) {
                    console.error(status, error);
                    this.$notify(this.$trans('Fout bij opslaan gameplan', 'danger', 'warning'));
                }
            },
            ...mapActions(['updateUserField',]),
        },
    };
</script>
