<template>

    <div class="uk-form-horizontal">
       <div class="uk-margin">
           <label class="uk-form-label" for="field_Investment">Inleg (in $1000)</label>
           <div class="uk-form-controls">
               <select name="field_Investment" id="field_Investment"
                       class="uk-select uk-form-width-small"
                       v-model="Investment">
                   <option v-for="option in investmentOptions" :value="option.value">{{ option.text }}</option>
               </select>
           </div>
       </div>
    </div>

</template>
<script>
import {mapState,} from 'vuex';
import {SET_PARAM,} from '../store/mutation-types';

export default {

    name: 'ParamsForm',

    computed: {
        Investment: {
            get() {
                return this.params.Investment;
            },
            set(value) {
                this.$store.commit(SET_PARAM, {key: 'Investment', value,})
            },
        },
        investmentOptions() {
            return [
                {value: '1', text: '$1',},
                {value: '6', text: '$6',},
                {value: '12', text: '$12',},
                {value: '24', text: '$24',},
                {value: '48', text: '$48',},
                {value: '100', text: '$100',},
                {value: '250', text: '$250',},
                {value: '500', text: '$500',},
                {value: '1000', text: '$1000',},
                {value: '5000', text: '$5000',},
                {value: '10000', text: '$10000',},
                {value: '25000', text: '$25000',},
                {value: '50000', text: '$50000',},
                {value: '100000', text: '$100000',},
                {value: '250000', text: '$250000',},
            ];
        },
        ...mapState(['params',]),
    },
}

</script>