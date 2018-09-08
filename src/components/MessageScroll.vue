<template>

    <div>
        <div class="uk-position-relative uk-visible-toggle uk-light" :uk-slideshow="slideshowProps">

            <ul class="uk-slideshow-items">
                <li v-for="message in messages" v-html="message" class="uk-text-center"></li>
            </ul>

        </div>
    </div>

</template>
<script>
    import {mapState,} from 'vuex';

    import {SCROLL_MESSAGES,} from '../../config';

    export default {

        name: 'MessageScroll',

        props: {
            autoplay: {type: Number, default: 1000,},
            maxHeight: {type: Number, default: 150,},
        },
        data: () => ({
            messages: SCROLL_MESSAGES,
        }),

        computed: {
            slideshowProps() {
                return `autoplay: ${this.autoplay}; max-height: ${this.maxHeight}`;
            },
            ...mapState(['spinning',]),
        },

    }

</script>