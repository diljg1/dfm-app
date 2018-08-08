<template>

    <div>
        <div class="uk-position-relative uk-visible-toggle uk-light" uk-slideshow="autoplay: 1000">

            <ul class="uk-slideshow-items">
                <li v-for="message in messages" v-html="message"></li>
            </ul>

        </div>
    </div>

</template>
<script>
    import {mapState,} from 'vuex';

    import {SCROLL_MESSAGES,} from '../../config';

    export default {

        name: 'MessageScroll',

        data: () => ({
            messages: SCROLL_MESSAGES,
        }),

        computed: {
            ...mapState(['spinning',]),
        },

    }

</script>