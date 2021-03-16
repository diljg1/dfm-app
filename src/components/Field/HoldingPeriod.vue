<template>

    <div>
        <label class="uk-form-label" :for="name">
            {{ field.label | trans }}<br>
            <small v-if="fieldTip">{{ fieldTip }}</small><br>
        </label>
        <div class="uk-form-controls uk-flex uk-flex-between uk-flex-middle" style="height:40px">
            <div>
                <label class="uk-margin-small-right">
                    <input v-model="hold" type="checkbox" class="uk-checkbox uk-margin-small-right" />
                    {{ 'Hold' | trans }}
                </label>
                <input v-if="!hold" :id="name" :name="name" v-model="inputValue"
                       :disabled="fieldDisabled"
                       :min="min" :max="max"
                       type="number" class="uk-input uk-form-width-small uk-text-right" />
            </div>
            <Dropdown v-if="fieldInfo" class="uk-margin-small-left">
                <small>{{ fieldInfo }}</small>
            </Dropdown>
        </div>
    </div>

</template>
<script>
    import params from '@/store/modules/params';

    import Dropdown from '@/components/Ui/Dropdown.vue';

    export default {

        name: 'Number',

        components: {
            Dropdown,
        },

        props: {
            value: String,
            name: String,
            field: Object,
            disabled: Boolean,
        },

        data: () => ({
        }),

        computed: {
            min() {
                return this.field.min || 0;
            },
            max() {
                return this.field.max || null;
            },
            fieldTip() {
                return this.$trans(this.field.tip);
            },
            fieldInfo() {
                return this.$trans(this.field.info);
            },
            fieldDisabled() {
                return this.disabled || this.hold;
            },
            hold: {
                get() {
                    return this.value === 'hold';
                },
                set(val) {
                    this.$emit('input', val ? 'hold' : this.field.default);
                },
            },
            inputValue: {
                get() {
                    return this.value;
                },
                set(val) {
                    this.$emit('input', val);
                },
            },
        },

        watch: {
            'disabled'(disabled) {
                if (!disabled && this.value === params.DISABLED_FIELD_VALUE) {
                    this.$emit('input', this.field.default);
                }
            },
        },
    }

</script>
