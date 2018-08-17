<template>

    <div>
        <label class="uk-form-label">
            {{ field.label | trans }}<br>
            <small v-if="field.tip">{{ field.tip | trans }}</small>
        </label>
        <div class="uk-form-controls uk-form-controls-text">
            <label>
                <input type="radio" v-model.number="inputValue" :value="1"
                       class="uk-radio uk-margin-small-right"/>
                Ja
            </label>
            <label>
                <input type="radio" v-model.number="inputValue" :value="2"
                       class="uk-radio uk-margin-small-right"/>
                Nee
            </label>
            <div>
                <em v-if="field.info" class="uk-text-small">{{ field.info | trans }}</em>
            </div>
        </div>
    </div>

</template>
<script>

    export default {

        name: 'BooleanOption',

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
