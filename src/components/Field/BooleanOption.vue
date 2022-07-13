<template>

    <div>
        <label class="uk-form-label">
            {{ field.label | trans }}<br>
            <small v-if="field.tip">{{ field.tip | trans }}</small><br>
        </label>
        <div class="uk-form-controls uk-form-controls-text uk-flex uk-flex-between uk-flex-middle">
            <div class="dfm-dropdownholder">
                <label>
                    <input type="radio" v-model="inputValue" :disabled="disabled"
                           value="1"
                           class="uk-radio uk-margin-small-right"/>
                    {{ 'Ja' | trans }}
                </label>
                <label class="uk-margin-small-left">
                    <input type="radio" v-model="inputValue" :disabled="disabled"
                           value="0"
                           class="uk-radio uk-margin-small-right"/>
                    {{ 'Nee' | trans }}
                </label>
            </div>
            <Dropdown v-if="fieldInfo" class="uk-margin-small-left">
                <small v-text="fieldInfo"></small>
            </Dropdown>
        </div>
    </div>

</template>
<script>

    import Dropdown from '@/components/Ui/Dropdown.vue';

    export default {

        name: 'BooleanOption',

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
                    this.$emit('input', '1');
                }
            },
        },
    }

</script>
<style lang="less" scoped>
    @import '~uikit/src/less/components/variables';
    .dfm-dropdownholder {
        display: inline-block;
        height: @global-control-height;
    }
    .uk-radio:not(:checked):not(:focus) {
        background: rgba(230,230,230,.2);
    }
</style>
