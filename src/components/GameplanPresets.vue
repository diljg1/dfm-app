<template>
    <div uk-margin>
        <button v-for="preset in presets" :key="preset"
                type="button" class="uk-button uk-button-default uk-margin-small-right"
                @click="setPreset(preset)">
            {{ preset | trans }}
        </button>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import {SET_PARAMS,} from '@/store/mutation-types';

    export default {

        name: 'GameplanPresets',

        computed: {
            presets() {
                return Object.keys(this.gameplans);
            },
            ...mapState({
                params: state => state.params.params,
                gameplans: state => state.gameplans,
            }),
        },

        methods: {
            setPreset(preset) {
                this.$store.commit(SET_PARAMS, {...this.params, ...this.gameplans[preset]});
            },
        },
    };
</script>

<style scoped>

</style>
