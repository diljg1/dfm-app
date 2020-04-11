<template>

    <div class="uk-grid-divider uk-grid-small uk-child-width-1-3@s uk-form-stacked" uk-grid>
        <div>
            <h3 class="uk-flex uk-flex-middle">
                <small class="uk-text-muted uk-margin-small-right">{{ 'Stap 1' | trans }}</small>
                <strong class="uk-flex-1">{{ 'Data' | trans }}</strong>
            </h3>
            <hr class="uk-margin-small-bottom"/>
            <Toggler v-for="(field, name) in fieldsByGroup('group1')" :key="name"
                     :name="name"
                     :field="field" />

            <h3 class="uk-flex uk-flex-middle">
                <small class="uk-text-muted uk-margin-small-right">{{ 'Stap 2' | trans }}</small>
                <strong class="uk-flex-1">{{ 'Screenen' | trans }}</strong>
            </h3>
            <hr class="uk-margin-small-bottom"/>
            <Toggler v-for="(field, name) in fieldsByGroup('group2')" :key="name"
                     :name="name"
                     :field="field" />
        </div>
        <div>
            <h3 class="uk-flex uk-flex-middle">
                <small class="uk-text-muted uk-margin-small-right">{{ 'Stap 3' | trans }}</small>
                <strong class="uk-flex-1">{{ 'Ranken' | trans }}</strong>
            </h3>
            <hr class="uk-margin-small-bottom"/>
            <Toggler v-for="(field, name) in fieldsByGroup('group3')" :key="name"
                     :name="name"
                     :field="field" />

            <h3 class="uk-flex uk-flex-middle">
                <small class="uk-text-muted uk-margin-small-right">{{ 'Stap 4' | trans }}</small>
                <strong class="uk-flex-1">{{ 'Sizen' | trans }}</strong>
            </h3>
            <hr class="uk-margin-small-bottom"/>
            <Toggler v-for="(field, name) in fieldsByGroup('group4')" :key="name"
                     :name="name"
                     :field="field">
            </Toggler>
        </div>
        <div>
            <h3 class="uk-flex uk-flex-middle">
                <small class="uk-text-muted uk-margin-small-right">{{ 'Stap 5' | trans }}</small>
                <strong class="uk-flex-1">{{ 'Wegen' | trans }}</strong>
            </h3>
            <hr class="uk-margin-small-bottom"/>
            <Toggler v-for="(field, name) in fieldsByGroup('group5')" :key="name"
                     :name="name"
                     :field="field" />

            <h3 class="uk-flex uk-flex-middle">
                <small class="uk-text-muted uk-margin-small-right">{{ 'Stap 6' | trans }}</small>
                <strong class="uk-flex-1">{{ 'Kosten' | trans }}</strong>
            </h3>
            <hr class="uk-margin-small-bottom"/>
            <Toggler v-for="(field, name) in fieldsByGroup('group6')" :key="name"
                     :name="name"
                     :field="field" />
        </div>
    </div>

</template>
<script>
import {mapState, mapGetters,} from 'vuex';

export default {

    name: 'ParamsForm',

    computed: {
        ...mapGetters(['fieldsByGroup',]),
    },

    methods: {
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
