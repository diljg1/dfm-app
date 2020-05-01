<template>
    <div class="dfm-slider">
        <v-slider :value="value"
                  :data="options"
                  :adsorb="true"
                  :included="false"
                  :marks="marks"
                  :use-keyboard="true"
                  :disabled="disabled"
                  tooltip="always"
                  @change="$emit('input', $event)"></v-slider>
    </div>
</template>
<script>
    import first from 'lodash/first';
    import last from 'lodash/last';
    import VueSlider from 'vue-slider-component';

    export default {
        name: 'Slider',

        components: {
            'v-slider': VueSlider,
        },

        props: {
            value: Array,
            options: Array,
            stops: {type: Array, default: () => ([]),},
            disabled: {type: Boolean, default: () => false,},
        },

        computed: {
            marks() {
                return [first(this.options), ...this.stops, last(this.options)];
            },
        },
    };
</script>
<style lang="scss">
    $themeColor: #b01513;
    @import '~vue-slider-component/lib/theme/default.scss';
    .dfm-slider {
        padding: 10px;
        margin: 25px 0 10px 0;
    }
    .vue-slider-disabled {
        cursor: default;
    }
</style>
