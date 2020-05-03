<template>
    <div>
        <button v-for="preset in presets" :key="preset"
                type="button"
                class="uk-button uk-button-default uk-margin-small-bottom uk-width-1-1"
                @click="setPreset(preset)">
            {{ preset | trans }}
        </button>
        <div>
            <div v-for="(gameplan, index) in personalGameplans" :key="index"
                 class="uk-button uk-button-default uk-margin-small-bottom uk-width-1-1"

                 @click="setPersonalPreset(index)">
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
                           @click.stop="savePreset(index, gameplan)">
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
    import {mapState} from 'vuex';
    import {arrayWithRemovedItem, arrayWithReplacedItem} from '@/lib/util';
    import UIkit from 'uikit';
    import {$,} from 'uikit/src/js/util';
    import omit from 'lodash/omit';
    import size from 'lodash/size';
    import {SET_PARAMS,} from '@/store/mutation-types';

    export default {

        name: 'GameplanPresets',

        data: () => ({
            personalGameplans: [],
        }),

        computed: {
            presets() {
                return Object.keys(this.gameplans);
            },
            ...mapState({
                params: state => state.params.params,
                gameplans: state => state.gameplans,
            }),
        },

        methods: {
            addPreset() {
                this.personalGameplans.push({
                    name: `Gameplan ${this.personalGameplans.length + 1}`,
                    params: {},
                });
            },
            removePreset(index) {
                this.personalGameplans = arrayWithRemovedItem(this.personalGameplans, index);
            },
            setPreset(preset) {
                this.$store.commit(SET_PARAMS, {...this.params, ...this.gameplans[preset]});
            },
            hasParams(index) {
                return size(this.personalGameplans[index].params) > 0;
            },
            setPersonalPreset(index) {
                this.$store.commit(SET_PARAMS, {...this.params, ...this.personalGameplans[index].params});
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

                        this.$notify(this.$trans('Naam aangepast'), 'success', 'check');
                    }
                } catch (e) {
                    this.$notify(this.$trans('Fout bij aanpassen naam', 'danger', 'warning'));
                }
            },
            savePreset(index, gameplan) {
                this.personalGameplans = arrayWithReplacedItem(this.personalGameplans, index, {
                    ...gameplan,
                    params: omit(this.params, ['DataProvider', 'IncludeInactive', 'Benchmark', 'Watchlists',]),
                });
                this.$notify(this.$trans('Gameplan opgeslagen'), 'success', 'check');
            },
        },
    };
</script>
