<template>

    <div>
        <label class="uk-form-label" :for="name">
            {{ field.label }}<br>
            <small v-if="field.tip">{{ field.tip }}</small>
        </label>
        <div class="uk-form-controls">
            <select :name="name" :id="name"
                    class="uk-select uk-form-width-small"
                    v-model="inputValue">
                <option v-for="(text, value) in field.options" :value="value">{{ text }}</option>
            </select>
        </div>
    </div>

</template>
<script>

    export default {

        name: 'Select',

        props: {
            value: String,
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