<template>

    <div class="uk-grid-divider uk-grid-small uk-child-width-1-3@s uk-form-stacked" uk-grid>
        <div>
            <h3>{{ 'Stap 1' | trans }}</h3>
            <hr class="uk-margin-small-bottom"/>
            <Toggler v-for="(field, name) in fieldsByGroup('group1')" :key="name"
                     :name="name"
                     :field="field" />

            <h3>{{ 'Stap 2' | trans }}</h3>
            <hr class="uk-margin-small-bottom"/>
            <Toggler v-for="(field, name) in fieldsByGroup('group2')" :key="name"
                     :name="name"
                     :field="field" />
        </div>
        <div>
            <h3>{{ 'Stap 3' | trans }}</h3>
            <hr class="uk-margin-small-bottom"/>
            <Toggler v-for="(field, name) in fieldsByGroup('group3')" :key="name"
                     :name="name"
                     :field="field" />

            <h3>{{ 'Stap 4' | trans }}</h3>
            <hr class="uk-margin-small-bottom"/>
            <Toggler v-for="(field, name) in fieldsByGroup('group4')" :key="name"
                     :name="name"
                     :field="field">
            </Toggler>
        </div>
        <div>
            <h3>{{ 'Stap 5' | trans }}</h3>
            <hr class="uk-margin-small-bottom"/>
            <Toggler v-for="(field, name) in fieldsByGroup('group5')" :key="name"
                     :name="name"
                     :field="field" />

            <h3>{{ 'Stap 6' | trans }}</h3>
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
        & > div {
            padding: @global-small-margin;
            transition: background-color 200ms linear;
            &:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
        }
        & > hr {
            margin: @global-small-margin 0;
        }
    }
</style>
<style scoped>
    h3 {
        text-align: center;
    }
</style>
