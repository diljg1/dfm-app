<template>

    <div>
        <label class="uk-form-label">
            {{ field.label }}<br>
            <small v-if="field.tip">{{ field.tip }}</small>
        </label>
        <div class="uk-form-controls">
            <label>
                <input type="radio" v-model="inputValue" :value="true"
                       class="uk-radio uk-margin-small-right"/>
                Ja
            </label>
            <label>
                <input type="radio" v-model="inputValue" :value="false"
                       class="uk-radio uk-margin-small-right"/>
                Nee
            </label>
        </div>
    </div>

</template>
<script>

    export default {

        name: 'Boolean',

        props: {
            value: Boolean,
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
