<template>

    <div class="">
        <div>
            <div v-for="(field, name) in fieldsByGroup('group1')" class="uk-flex uk-flex-middle uk-flex-wrap">
                <label class="uk-flex-1">{{ field.label | trans }}</label>
                <div class="uk-text-bold">{{ formattedValue(field, params[name]) }}</div>
            </div>
        </div>
        <hr/>
        <div class="uk-margin-small-top">
            <div v-for="(field, name) in fieldsByGroup('group2')" class="uk-flex uk-flex-middle uk-flex-wrap">
                <label class="uk-flex-1">{{ field.label | trans }}</label>
                <div class="uk-text-bold">{{ formattedValue(field, params[name]) }}</div>
            </div>
        </div>
        <hr/>
        <div class="uk-margin-small-top">
            <div v-for="(field, name) in fieldsByGroup('group3')" class="uk-flex uk-flex-middle uk-flex-wrap">
                <label class="uk-flex-1">{{ field.label | trans }}</label>
                <div class="uk-text-bold">{{ formattedValue(field, params[name]) }}</div>
            </div>
        </div>
    </div>

</template>
<script>
import {mapState, mapGetters,} from 'vuex';

export default {

    name: 'ParamsDisplay',

    computed: {
        ...mapState({params: state => state.params.params,}),
        ...mapGetters(['fieldsByGroup',]),
    },

    methods: {
        formattedValue(field, value) {
            let formatted = value;
            if (field.type === 'BooleanOption') {
                formatted = value ? 'Ja' : 'Nee';
            } else if(field.options[value]) {
                formatted = field.options[value];
            }
            return this.$trans(formatted);
        }
    },
}

</script>
