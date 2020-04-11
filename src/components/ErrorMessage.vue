<template>

    <div ref="errorMessage">
        <div v-if="error" class="uk-alert-warning" uk-alert>
            <button class="uk-alert-close" type="button" uk-close></button>
            <p>{{ error }}</p>
        </div>
    </div>

</template>
<script>
    import {mapState, mapMutations,} from 'vuex';

    import {RESET_ERROR,} from '@/store/mutation-types';

    export default {

        name: 'ErrorMessage',

        computed: mapState(['error',]),

        mounted() {
            this.$refs.errorMessage.addEventListener('hide', this.resetError);
        },

        methods: {
            ...mapMutations({resetError: RESET_ERROR,}),
        },

    }

</script>
