<template>
    <div>
        <div class="uk-child-width-1-2@m uk-flex-bottom" uk-grid>
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
                                :value="option" v-bind="optionAttribrutes(option)">{{ option | trans }}
                        </option>
                    </select>
                    <Dropdown v-if="fieldInfo" class="uk-margin-small-left">
                        <small>{{ fieldInfo }}</small>
                    </Dropdown>
                </div>
            </div>
            <div>
                <CsiEmail />
            </div>
        </div>
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
                return this.field.options.filter(option => option !== CSI_VALUE || this.csiActive);
            },
            ...mapState({
                csiActive: state => state.user.csiActive,
            }),
        },

        watch: {
            'value': {
                handler(value) {
                    if (value === CSI_VALUE && !this.csiActive) {
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
