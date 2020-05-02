<template>

    <div>
        <label class="uk-form-label">
            {{ field.label | trans }}<br>
            <small v-if="fieldTip">{{ fieldTip }}</small><br>
        </label>
        <div class="uk-form-controls">
            <Slider v-model="minMaxValues"
                    :options="field.options"
                    :stops="field.stops"
                    :disabled="disabled" />
            <div class="uk-flex uk-flex-between uk-flex-middle">
                <div class="uk-child-width-1-2@l uk-grid-small uk-margin-small-top uk-form-width-medium" uk-grid>
                    <div>
                        <select :name="`${name}_sort`"
                                class="uk-select uk-form-width-medium"
                                v-model="sort" :disabled="disabled">
                            <option value="N/A">{{ 'N/A' | trans }}</option>
                            <option value="TOP#">{{ '↑ Top' | trans }}</option>
                            <option value="BOT#">{{ '↓ Bottom' | trans }}</option>
                        </select>
                    </div>
                    <div>
                        <select :name="`${name}_nr`" :id="name"
                                class="uk-select uk-form-width-medium"
                                v-model="nr" :disabled="disabled">
                            <option value="N/A">{{ 'N/A' | trans }}</option>
                            <option v-for="nr in nrOptions" :key="`nr_${nr}`" :value="nr">{{ nr }}</option>
                        </select>
                    </div>
                </div>
                <Dropdown v-if="fieldInfo" class="uk-margin-small-left">
                    <small>{{ fieldInfo }}</small>
                </Dropdown>
            </div>
        </div>
    </div>

</template>
<script>
    import first from 'lodash/first';
    import last from 'lodash/last';

    import Dropdown from '@/components/Dropdown.vue';
    import Slider from '@/components/Slider.vue';

    import MinMax from '@/lib/MinMax';

    export default {

        name: 'MinMax',

        components: {
            Dropdown,
            Slider,
        },

        props: {
            value: String,
            name: String,
            field: Object,
            disabled: Boolean,
        },

        data: () => ({
            nrOptions: [1, 2, 4, 6, 8, 10, 20, 50, 100, 200, 400, 800, 1600, 3200, 6400],
        }),

        computed: {
            fieldTip() {
                return this.$trans(this.field.tip);
            },
            fieldInfo() {
                return this.$trans(this.field.info);
            },
            minDefault() {
                return first(this.field.options);
            },
            maxDefault() {
                return last(this.field.options);
            },
            minMax: {
                get() {
                    return MinMax.fromString(this.value, this.minDefault, this.maxDefault);
                },
                set(minMax) {
                    this.$emit('input', minMax.toString());
                },
            },
            minMaxValues: {
                get() {return [this.minMax.min, this.minMax.max,];},
                set([min, max,]) {this.minMax = this.minMax.withMinMax(min, max);},
            },
            sort: {
                get() {return this.minMax.sort;},
                set(sort) {this.minMax = this.minMax.withSort(sort);},
            },
            nr: {
                get() {return this.minMax.nr;},
                set(nr) {this.minMax = this.minMax.withNr(nr);},
            },
        },

        watch: {
            'disabled'(disabled) {
                if (!disabled) {
                    this.$emit('input', this.minMax.toString());
                }
            },
        },
    }

</script>
<style lang="less" scoped>
    @import '~uikit/src/less/components/variables';

    .uk-select:not([multiple]):not([size]) option {color: @global-inverse-color;}
</style>
