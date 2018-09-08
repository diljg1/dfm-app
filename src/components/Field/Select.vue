<template>

    <div>
        <label class="uk-form-label" :for="name">
            {{ field.label | trans }}<br>
            <small v-if="field.tip">{{ field.tip | trans }}</small><br>
        </label>
        <div class="uk-form-controls">
            <select :name="name" :id="name"
                    class="uk-select uk-form-width-small"
                    v-model.number="inputValue">
                <option v-for="(text, value) in field.options" :value="value">{{ text | trans }}</option>
            </select>
            <Dropdown v-if="field.info" class="uk-margin-small-left">
                <small>{{ field.info | trans }}</small>
            </Dropdown>
        </div>
        <hr/>
    </div>

</template>
<script>

    import Dropdown from './Dropdown.vue';

    export default {

        name: 'Select',

        components: {
            Dropdown,
        },

        props: {
            value: Number,
            name: String,
            field: Object,
        },

        computed: {
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