<template>

    <div class="dfm-params-display">
        <div @click="openAccordion(0)" :class="{'dfm-mouse-pointer': linkTitles,}">
            <h4 class="uk-margin-small-bottom">{{ 'group.data.label' | trans }}</h4>
            <div v-for="(field, name) in fieldsByGroup('group1')" class="uk-flex uk-flex-middle uk-flex-wrap">
                <label class="uk-flex-1">{{ field.label | trans }}</label>
                <div class="uk-text-bold">{{ formattedValue(field, params[name]) }}</div>
            </div>
        </div>
        <hr/>
        <div class="uk-margin-small-top" @click="openAccordion(1)" :class="{'dfm-mouse-pointer': linkTitles,}">
            <h4 class="uk-margin-small-bottom">{{ 'group.screening.label' | trans }}</h4>
            <div v-for="(field, name) in fieldsByGroup('group2')" class="uk-flex uk-flex-middle uk-flex-wrap">
                <label class="uk-flex-1">{{ field.label | trans }}</label>
                <div class="uk-text-bold">{{ formattedValue(field, params[name]) }}</div>
            </div>
        </div>
        <hr/>
        <div class="uk-margin-small-top" @click="openAccordion(2)" :class="{'dfm-mouse-pointer': linkTitles,}">
            <h4 class="uk-margin-small-bottom">{{ 'group.ranking.label' | trans }}</h4>
            <div v-for="(field, name) in fieldsByGroup('group3')" class="uk-flex uk-flex-middle uk-flex-wrap">
                <label class="uk-flex-1">{{ field.label | trans }}</label>
                <div class="uk-text-bold">{{ formattedValue(field, params[name]) }}</div>
            </div>
        </div>
        <hr/>
        <div class="uk-margin-small-top" @click="openAccordion(3)" :class="{'dfm-mouse-pointer': linkTitles,}">
            <h4 class="uk-margin-small-bottom">{{ 'group.sizing.label' | trans }}</h4>
            <div v-for="(field, name) in fieldsByGroup('group4')" class="uk-flex uk-flex-middle uk-flex-wrap">
                <label class="uk-flex-1">{{ field.label | trans }}</label>
                <div class="uk-text-bold">{{ formattedValue(field, params[name]) }}</div>
            </div>
        </div>
        <hr/>
        <div class="uk-margin-small-top" @click="openAccordion(4)" :class="{'dfm-mouse-pointer': linkTitles,}">
            <h4 class="uk-margin-small-bottom">{{ 'group.weighting.label' | trans }}</h4>
            <div v-for="(field, name) in fieldsByGroup('group5')" class="uk-flex uk-flex-middle uk-flex-wrap">
                <label class="uk-flex-1">{{ field.label | trans }}</label>
                <div class="uk-text-bold">{{ formattedValue(field, params[name]) }}</div>
            </div>
        </div>
        <hr/>
        <div class="uk-margin-small-top" @click="openAccordion(5)" :class="{'dfm-mouse-pointer': linkTitles,}">
            <h4 class="uk-margin-small-bottom">{{ 'group.costs.label' | trans }}</h4>
            <div v-for="(field, name) in fieldsByGroup('group6')" class="uk-flex uk-flex-middle uk-flex-wrap">
                <label class="uk-flex-1">{{ field.label | trans }}</label>
                <div class="uk-text-bold">{{ formattedValue(field, params[name]) }}</div>
            </div>
        </div>
    </div>

</template>
<script>
import {mapState, mapGetters,} from 'vuex';
import MinMax from '@/lib/MinMax';

export default {

    name: 'ParamsDisplay',

    computed: {
        ...mapState({params: state => state.params.params,}),
        ...mapGetters(['fieldsByGroup',]),
    },

    props: {
        linkTitles: {type: Boolean, default: false,},
    },

    methods: {
        openAccordion(index) {
            this.$emit('accordion:show', index);
        },
        formattedValue(field, value) {
            let formatted = value;
            if (field.type === 'BooleanOption') {
                formatted = value === '1' ? 'Ja' : 'Nee';
            } else if (field.type === 'MinMax') {
                if (value === 'N/A') {
                    formatted = value;
                } else {
                    formatted = MinMax.fromString(value).formattedValue();
                }
            } else {
                let option = field.options.find(o => o === value);
                if(option) {
                    formatted = option;
                }
            }
            return this.$trans(formatted);
        }
    },
}

</script>
<style scoped>
    label {
        cursor: inherit;
    }
</style>
