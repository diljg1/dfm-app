<template>
    <ul ref="accordion" uk-accordion="active: 0;" class="dfm-accordion uk-accordion uk-accordion-condensed">
        <li v-for="fieldGroup in groups"
            :key="fieldGroup.step">
            <a class="uk-accordion-title" href="#">
                        <span class="uk-flex uk-flex-middle">
                            <small class="uk-text-muted uk-text-nowrap uk-margin-small-right">{{ fieldGroup.step }}</small>
                            <span class="uk-flex uk-flex-middle">
                                <strong class="uk-width-small uk-text-large">{{ fieldGroup.label }}</strong>
                                <small class="uk-flex-1 uk-visible@l"><i>{{ fieldGroup.description }}</i></small>
                            </span>
                        </span>
                <small class="uk-flex-1 uk-hidden@l uk-width-1-1@l"><i>{{ fieldGroup.description }}</i></small>
            </a>
            <div class="uk-accordion-content">
                <div class="uk-grid-divider uk-grid-small uk-grid-match" uk-grid>
                    <Toggler v-for="(field, name) in fieldGroup.fields" :key="name"
                             :name="name"
                             :field="field" />
                </div>
            </div>
        </li>
    </ul>
</template>
<script>
    import UIkit from 'uikit';
    import {mapGetters, mapState,} from 'vuex';
    import params from '@/store/modules/params';
    import {SET_PARAM,} from '@/store/mutation-types';

    export default {

        name: 'ParamsForm',

        props: {
            activeAccordion: Number,
        },

        computed: {
            groups() {
                return [
                    {
                        step: this.$trans('Stap 1'),
                        label: this.$trans('Data'),
                        description: this.$trans('Gegevens ophalen van aandelen'),
                        fields: this.fieldsByGroup('group1'),
                    },
                    {
                        step: this.$trans('Stap 2'),
                        label: this.$trans('Screenen'),
                        description: this.$trans('Screenen van effecten op basis van die data zodat aan bepaalde voorwaarden van de investeerder wordt voldaan'),
                        fields: this.fieldsByGroup('group2'),
                    },
                    {
                        step: this.$trans('Stap 3'),
                        label: this.$trans('Ranken'),
                        description: this.$trans('Ranken van de gescreende effecten'),
                        fields: this.fieldsByGroup('group3'),
                    },
                    {
                        step: this.$trans('Stap 4'),
                        label: this.$trans('Sizen'),
                        description: this.$trans('Bepalen van hoeveel van de hoogste rang u wil hebben'),
                        fields: this.fieldsByGroup('group4'),
                    },
                    {
                        step: this.$trans('Stap 5'),
                        label: this.$trans('Wegen'),
                        description: this.$trans('Hoeveel aandelen u van ieder effect wil hebben, iedere handelsperiode'),
                        fields: this.fieldsByGroup('group5'),
                    },
                    {
                        step: this.$trans('Stap 6'),
                        label: this.$trans('Kosten'),
                        description: this.$trans('Kosten van iedere handelstransactie en dividendbelasting die betaald moet worden'),
                        fields: this.fieldsByGroup('group6'),
                    },
                ];
            },
            ...mapState({params: state => state.params.params}),
            ...mapGetters(['fieldsByGroup',]),
        },

        watch: {
            'params.Timing'(value) {
                if (value === '1' && this.params.InvestementObjective !== params.DISABLED_FIELD_VALUE) {
                    this.$store.commit(
                        SET_PARAM,
                        {name: 'TimingInvestementObjective', value: this.params.InvestementObjective,}
                    );
                }
            },
            'params.InvestementObjective'(value) {
                if (value !== params.DISABLED_FIELD_VALUE && this.params.Timing === '1') {
                    this.$store.commit(SET_PARAM, {name: 'TimingInvestementObjective', value,});
                }
            },
        },

        methods: {
            showAccordion(index) {
                if (this.$refs.accordion) {
                    UIkit.accordion(this.$refs.accordion).toggle(index, true);
                }
            }
        },
    }

</script>
<style lang="less">
    @import '~uikit/src/less/components/variables';
    .dfm-fieldcard {
        /*for dropdown align*/
        position: relative;
        padding: @global-small-margin;
        transition: background-color 200ms linear;
    }
    .dfm-field:not(.dfm-disabled) > .dfm-fieldcard:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
    .dfm-field hr {
        margin: @global-small-margin 0;
    }
    .dfm-params-display {
        font-size: 0.9rem;
        line-height: 1.2rem;
    }
    .dfm-mouse-pointer {
        cursor: pointer;
    }
</style>
