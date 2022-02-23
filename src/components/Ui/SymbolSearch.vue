<template>
    <div>
        <div class="uk-search uk-search-default">
            <input ref="input"
                   :value="value"
                   :placeholder="placeholderText"
                   class="uk-input"
                   type="text"
                   @input="input($event.target.value)"
            />
        </div>
    </div>
</template>
<script>

export default {

    name: 'SymbolSearch',

    props: {
        value: {type: String, default: '',},
        placeholder: {type: String, default: '',},
    },

    computed: {
        placeholderText() {
            return this.placeholder || this.$trans('Symbols...');
        },
    },

    methods: {
        focus() {
            this.$refs.input.focus();
        },
        input(value) {
            this.$emit('input', value);
        },
    },

};

</script>
<style lang="less" scoped>
    .uk-nav li > a {
        display: flex;
    }
</style>
