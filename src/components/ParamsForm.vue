<template>

    <div class="uk-child-width-1-3@s uk-form-stacked" uk-grid>
        <div>
            <component class="uk-margin"
                       v-for="(field, name) in fieldsByGroup('group1')"
                       :is="field.type"
                       :value="params[name]"
                       :name="name"
                       :field="field" @input="setParameter(name, $event)"></component>
        </div>
        <div>
            <component class="uk-margin"
                       v-for="(field, name) in fieldsByGroup('group2')"
                       :is="field.type"
                       :value="params[name]"
                       :name="name"
                       :field="field" @input="setParameter(name, $event)"></component>
        </div>
        <div>
            <component class="uk-margin"
                       v-for="(field, name) in fieldsByGroup('group3')"
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
