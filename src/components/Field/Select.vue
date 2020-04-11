<template>

    <div>
        <div>
            <label class="uk-form-label" :for="name">
                {{ field.label | trans }}<br>
                <small v-if="fieldTip">{{ fieldTip }}</small><br>
            </label>
            <div class="uk-form-controls uk-flex uk-flex-between uk-flex-middle">
                <select :name="name" :id="name"
                        class="uk-select uk-form-width-medium"
                        v-model="inputValue">
                    <option v-for="(text, value) in field.options" :value="value">{{ text | trans }}</option>
                </select>
                <Dropdown v-if="fieldInfo" class="uk-margin-small-left">
                    <small>{{ fieldInfo }}</small>
                </Dropdown>
            </div>
        </div>
        <hr/>
    </div>

</template>
<script>

    import Dropdown from '@/components/Dropdown.vue';

    export default {

        name: 'Select',

        components: {
            Dropdown,
        },

        props: {
            value: String,
            name: String,
            field: Object,
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

    }

</script>
<style lang="less" scoped>
    @import '~uikit/src/less/components/variables';

    .uk-select:not([multiple]):not([size]) option {color: @global-inverse-color;}
</style>
