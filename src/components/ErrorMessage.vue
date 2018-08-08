<template>

    <div>
        <p v-if="error" class="uk-alert-warning" uk-alert>{{ error }}</p>
    </div>

</template>
<script>
    import {mapState, mapMutations,} from 'vuex';

    import {RESET_ERROR,} from '../store/mutation-types';

    export default {

        name: 'ErrorMessage',

        computed: mapState(['error',]),

        methods: {
            ...mapMutations({resetError: RESET_ERROR,}),
        },

    }

</script>