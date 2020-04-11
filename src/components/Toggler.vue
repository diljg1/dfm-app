<template>

    <div :class="{'dfm-disabled': !enabled,}" class="dfm-field">
        <label v-if="field.toggle" class="uk-display-block">
            <input type="checkbox" v-model="enabled" class="uk-checkbox"/>
            {{ 'Optie inschakelen' | trans }}
        </label>
        <component class="dfm-fieldcard"
                   :is="field.type"
                   :value="params[name]"
                   :disabled="!enabled"
                   :name="name"
                   :field="field"
                   @input="setParameter(name, $event)"></component>
        <hr />
    </div>

</template>
<script>

    import {mapState,} from 'vuex';
    import {SET_PARAM,} from '@/store/mutation-types';
    import params from '@/store/modules/params';

    import Select from '@/components/Field/Select.vue';
    import BooleanOption from '@/components/Field/BooleanOption.vue';

    export default {

        name: 'Toggler',

        components: {
            Select,
            BooleanOption,
        },

        props: {
            name: String,
            field: Object,
        },

        data() {
            return ({
                enabled: this.field.default !== params.DISABLED_FIELD_VALUE,
            });
        },

        computed: {
            ...mapState({params: state => state.params.params,}),
        },

        watch: {
            'enabled'(enabled) {
                if (!enabled) {
                    this.setParameter(this.name, params.DISABLED_FIELD_VALUE);
                }
            },
        },

        methods: {
            setParameter(name, value) {
                this.$store.commit(SET_PARAM, {name, value,});
            },
        },
    }

</script>
<style lang="less" scoped>
    @import '~uikit/src/less/components/variables';

    .dfm-field.dfm-disabled .dfm-fieldcard {
        opacity: 0.5;
    }
</style>
