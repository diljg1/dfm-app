<template>

    <div>
        <label class="uk-form-label" :for="name">
            {{ field.label | trans }}<br>
            <small v-if="fieldTip">{{ fieldTip }}</small><br>
        </label>
        <div class="uk-form-controls uk-flex uk-flex-between uk-flex-middle">
            <div class="uk-flex uk-flex-middle uk-form-width-medium">
                <div v-if="prefix" class="uk-flex-none uk-margin-small-right" v-text="prefix"></div>
                <input :id="name" :name="name" v-model="inputValue"
                       :disabled="disabled"
                       :min="min" :max="max" :step="step"
                       type="number" class="uk-input uk-flex-1 uk-text-right"/>
                <div v-if="suffix" class="uk-flex-none uk-margin-small-left" v-text="suffix"></div>
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

        computed: {
            prefix() {
                return this.field.prefix || '';
            },
            suffix() {
                return this.field.suffix || '';
            },
            min() {
                return this.field.min || 0;
            },
            max() {
                return this.field.max || null;
            },
            step() {
                return this.field.step || 1;
            },
            fieldTip() {
                return this.$trans(this.field.tip);
            },
            fieldInfo() {
                return this.$trans(this.field.info);
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
