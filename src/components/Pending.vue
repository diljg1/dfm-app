<template>

    <div>
        <p>{{ 'Wacht op uw berekening' | trans }}</p>
        <h3>{{ preview_id }}</h3>
        <p>{{ currentPreviewStatus }}</p>
    </div>

</template>
<script>
import {mapGetters, mapState,} from 'vuex';

export default {

    name: 'Pending',

    computed: {
        imageSources() {
            const sources = {};
            Object.keys(this.preview.files).forEach(filename => {
                sources[filename] = `data:image/png;base64,${this.preview.files[filename]}`;
            });
            return sources;
        },
        ...mapState(['preview_id',]),
        ...mapGetters(['currentPreviewStatus',]),
    },
}

</script>