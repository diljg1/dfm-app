<template>

    <div>
        <label class="uk-form-label" :for="name">
            {{ field.label | trans }}<br>
            <small v-if="fieldTip">{{ fieldTip }}</small><br>
        </label>
        <div class="uk-form-controls uk-flex uk-flex-between uk-flex-middle">
            <select :name="name" :id="name"
                    class="uk-select uk-form-width-medium"
                    v-model="inputValue" :disabled="disabled">
                <option v-for="option in filteredOptions" :key="option"
                        :value="option" v-bind="optionAttribrutes(option)">{{ option | trans }}</option>
            </select>
            <Dropdown v-if="fieldInfo" class="uk-margin-small-left">
                <small>{{ fieldInfo }}</small>
            </Dropdown>
        </div>
        <div v-if="!userFields.csiActive">
            <small class="uk-flex uk-flex-middle uk-margin-small-top">
                <span uk-icon="icon:warning;ratio:0.7" class="uk-margin-small-right"></span>
                {{ 'CSI abonnement niet actief' | trans }}
            </small>
        </div>
        <small v-else class="uk-flex uk-flex-middle uk-margin-small-top">
            <span uk-icon="icon:check;ratio:0.7" class="uk-margin-small-right"></span>
            {{ 'CSI abonnement actief' | trans }}
        </small>
    </div>

</template>
<script>
    import {mapState,} from 'vuex';

    import Select from '@/components/Field/Select';
    import params from '@/store/modules/params';

    const CSI_VALUE = 'CSI';

    export default {

        name: 'Dataprovider',

        extends: Select,

        computed: {
            filteredOptions() {
                return this.field.options.filter(option => option !== CSI_VALUE || this.userFields.csiActive);
            },
            ...mapState({
                userFields: state => state.userFields,
            }),
        },

        watch: {
            'value': {
                handler(value) {
                    if (value === CSI_VALUE && !this.userFields.csiActive) {
                        this.$emit('input', this.field.options
                            .find(option => ![params.DISABLED_FIELD_VALUE, CSI_VALUE].includes(option)))
                    }
                },
                immediate: true,
            }
        },

        methods: {
        },
    }

</script>
<style lang="less" scoped>
</style>
