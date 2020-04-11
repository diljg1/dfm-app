<template>

    <div class="uk-grid-divider uk-grid-small uk-child-width-1-3@s uk-form-stacked" uk-grid>
        <div>
            <h3>{{ 'Stap 1' | trans }}</h3>
            <hr class="uk-margin-small-bottom"/>
            <component class="dfm-fieldcard"
                       v-for="(field, name) in fieldsByGroup('group1')"
                       :key="name"
                       :is="field.type"
                       :value="params[name]"
                       :name="name"
                       :field="field" @input="setParameter(name, $event)"></component>
            <h3>{{ 'Stap 2' | trans }}</h3>
            <hr class="uk-margin-small-bottom"/>
            <component class="dfm-fieldcard"
                       v-for="(field, name) in fieldsByGroup('group2')"
                       :key="name"
                       :is="field.type"
                       :value="params[name]"
                       :name="name"
                       :field="field" @input="setParameter(name, $event)"></component>
        </div>
        <div>
            <h3>{{ 'Stap 3' | trans }}</h3>
            <hr class="uk-margin-small-bottom"/>
            <component class="dfm-fieldcard"
                       v-for="(field, name) in fieldsByGroup('group3')"
                       :key="name"
                       :is="field.type"
                       :value="params[name]"
                       :name="name"
                       :field="field" @input="setParameter(name, $event)"></component>
            <h3>{{ 'Stap 4' | trans }}</h3>
            <hr class="uk-margin-small-bottom"/>
            <component class="dfm-fieldcard"
                       v-for="(field, name) in fieldsByGroup('group4')"
                       :key="name"
                       :is="field.type"
                       :value="params[name]"
                       :name="name"
                       :field="field" @input="setParameter(name, $event)"></component>
        </div>
        <div>
            <h3>{{ 'Stap 5' | trans }}</h3>
            <hr class="uk-margin-small-bottom"/>
            <component class="dfm-fieldcard"
                       v-for="(field, name) in fieldsByGroup('group5')"
                       :key="name"
                       :is="field.type"
                       :value="params[name]"
                       :name="name"
                       :field="field" @input="setParameter(name, $event)"></component>
            <h3>{{ 'Stap 6' | trans }}</h3>
            <hr class="uk-margin-small-bottom"/>
            <component class="dfm-fieldcard"
                       v-for="(field, name) in fieldsByGroup('group6')"
                       :key="name"
                       :is="field.type"
                       :value="params[name]"
                       :name="name"
                       :field="field" @input="setParameter(name, $event)"></component>
        </div>
    </div>

</template>
<script>
import {mapState, mapGetters,} from 'vuex';
import {SET_PARAM,} from '../store/mutation-types';

import Select from './Field/Select.vue';
import BooleanOption from './Field/BooleanOption.vue';

export default {

    name: 'ParamsForm',

    components: {
        Select,
        BooleanOption,
    },

    computed: {
        ...mapState({params: state => state.params.params,}),
        ...mapGetters(['fieldsByGroup',]),
    },

    methods: {
        setParameter(name, value) {
            this.$store.commit(SET_PARAM, {name, value,});
        },
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
