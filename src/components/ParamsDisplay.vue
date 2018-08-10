<template>

    <div class="">
       <div class="uk-flex uk-flex-middle">
           <label class="uk-flex-1">Inleg (in $1000)</label>
           <div class="uk-text-bold">${{ params.Investment }}</div>
       </div>
       <div class="uk-flex uk-flex-middle">
           <label class="uk-flex-1">Inleg (in $1000)</label>
           <div class="uk-text-bold">${{ params.Investment }}</div>
       </div>
    </div>

</template>
<script>
import {mapState,} from 'vuex';
import {SET_PARAM,} from '../store/mutation-types';

export default {

    name: 'ParamsDisplay',

    computed: {
        ...mapState(['params',]),
    },
}

</script>
