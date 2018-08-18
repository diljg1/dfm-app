<template>

    <div>
        <label class="uk-form-label" :for="name">
            {{ field.label | trans }}<br>
            <small v-if="field.tip">{{ field.tip | trans }}</small>
        </label>
        <div class="uk-form-controls">
            <select :name="name" :id="name"
                    class="uk-select uk-form-width-small"
                    v-model.number="inputValue">
                <option v-for="(text, value) in field.options" :value="value">{{ text | trans }}</option>
            </select>
            <div>
                <em v-if="field.info" class="uk-text-small">{{ field.info | trans }}</em>
            </div>
        </div>
    </div>

</template>
<script>

    export default {

        name: 'Select',

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
<style scoped>

    .uk-select:not([multiple]):not([size]) option {color: #fff;}

</style>