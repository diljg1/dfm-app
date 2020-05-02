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
                <option v-for="option in field.options" :key="option"
                        :value="option" v-bind="optionAttribrutes(option)">{{ option | trans }}</option>
            </select>
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

        name: 'Select',

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
                if (!disabled) {
                    this.$emit('input', this.field.options.find(option => option !== params.DISABLED_FIELD_VALUE));
                }
            },
        },

        methods: {
            optionAttribrutes(option) {
                const attrs = {};
                if (option === params.DISABLED_FIELD_VALUE) {
                    attrs.hidden = 'hidden';
                    attrs.disabled = 'disabled';
                }
                return attrs;
            },
        },
    }

</script>
