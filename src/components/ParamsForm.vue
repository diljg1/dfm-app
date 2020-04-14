<template>

    <div class="uk-grid-divider uk-grid-small" uk-grid>
        <div class="uk-width-1-3@s">
            <ParamsDisplay class="uk-margin"></ParamsDisplay>
        </div>
        <div class="uk-width-2-3@s">
            <ul uk-accordion="active: 0;" class="uk-accordion uk-accordion-condensed">
                <li v-for="fieldGroup in groups"
                    :key="fieldGroup.step">
                    <a class="uk-accordion-title" href="#">
                        <small class="uk-text-muted uk-margin-small-right">{{ fieldGroup.step }}</small>
                        <strong class="uk-flex-1">{{ fieldGroup.label }}</strong>
                    </a>
                    <div class="uk-accordion-content">
                        <Toggler v-for="(field, name) in fieldGroup.fields" :key="name"
                                 :name="name"
                                 :field="field" />
                    </div>
                </li>
            </ul>
        </div>
    </div>

</template>
<script>
    import {mapGetters,} from 'vuex';

    export default {

        name: 'ParamsForm',

        computed: {
            groups() {
                return [
                    {
                        step: this.$trans('Stap 1'),
                        label: this.$trans('Data'),
                        fields: this.fieldsByGroup('group1'),
                    },
                    {
                        step: this.$trans('Stap 2'),
                        label: this.$trans('Screenen'),
                        fields: this.fieldsByGroup('group2'),
                    },
                    {
                        step: this.$trans('Stap 3'),
                        label: this.$trans('Ranken'),
                        fields: this.fieldsByGroup('group3'),
                    },
                    {
                        step: this.$trans('Stap 4'),
                        label: this.$trans('Sizen'),
                        fields: this.fieldsByGroup('group4'),
                    },
                    {
                        step: this.$trans('Stap 5'),
                        label: this.$trans('Wegen'),
                        fields: this.fieldsByGroup('group5'),
                    },
                    {
                        step: this.$trans('Stap 6'),
                        label: this.$trans('Kosten'),
                        fields: this.fieldsByGroup('group6'),
                    },
                ];
            },
            ...mapGetters(['fieldsByGroup',]),
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
</style>
