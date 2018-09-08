<template>

    <div>
        <label class="uk-form-label">
            {{ field.label | trans }}<br>
            <small v-if="field.tip">{{ field.tip | trans }}</small><br>
        </label>
        <div class="uk-form-controls uk-form-controls-text">
            <div class="dfm-dropdownholder">
                <label>
                    <input type="radio" v-model.number="inputValue" :value="1"
                           class="uk-radio uk-margin-small-right"/>
                    {{ 'Ja' | trans }}
                </label>
                <label class="uk-margin-small-left">
                    <input type="radio" v-model.number="inputValue" :value="2"
                           class="uk-radio uk-margin-small-right"/>
                    {{ 'Nee' | trans }}
                </label>
            </div>
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

        name: 'BooleanOption',

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
    .dfm-dropdownholder {
        display: inline-block;
        height: 40px;
    }
</style>
