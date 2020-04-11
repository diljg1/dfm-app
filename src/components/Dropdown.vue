<template>

    <div class="uk-inline">
        <a uk-icon="info"></a>
        <div :uk-dropdown="dropdownProps"><slot></slot></div>
    </div>

</template>
<script>

    export default {

        name: 'Dropdown',

        props: {
            delay: {type: Number, default: 50,}
        },

        computed: {
            dropdownProps() {
                return `mode: hover; delay-show: ${this.delay}; pos: bottom-right`;
            },
        },
    }

</script>